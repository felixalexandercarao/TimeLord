var userTimezone = "America/Los_Angeles";       // a sensible default
var allGames = {};
var allEvents = [];

// only turn this on if you really like the idea of lots and lots of console spew
const debug = false;
// it's useful to turn this off while debugging, so you don't get spew every second
const enableConstantUpdates = true;

function getUserTimezone() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz;
}

function nameForGame(game) {
  if (game in allGames) {
    return allGames[game].name;
  } else {
    if (debug) console.log("ERROR: unknown game `" + game + "'");
    return null;
  }
}

function timezoneForGame(game) {
  if (game in allGames) {
    return allGames[game].timezone;
  } else {
    if (debug) console.log("ERROR: unknown game `" + game + "'");
    return null;
  }
}

function getCurrentDate() {
  const currentDate = new Date();
  //return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
  return currentDate.getFullYear() + '-'
             + ('0' + (currentDate.getMonth()+1)).slice(-2) + '-'
             + ('0' + currentDate.getDate()).slice(-2);
}

function dayResetForGame(game) {
  if (game in allGames) {
    return allGames[game].dayReset;
  } else {
    if (debug) console.log("ERROR: unknown game `" + game + "'");
    return null;
  }
}

function updateCountdown() {
    const keys = Object.keys(allEvents);
    var big_nasty_html_string = "";
    
    if (keys.length == 0) {
      if (debug) console.log("No events found");
      // should probably put this in the html
      return;
    } else {
      if (debug) console.log("Found " + keys.length + " games");
    }

    const countdownContainer = $("#main");
    countdownContainer.empty();
    const now = moment.tz(moment(), userTimezone); // Replace with your current timezone

/*
  <!--Row with two equal columns-->
  <div class="row">
    <div class="col-md-6">Column left</div>
    <div class="col-md-6">
    Column right<br />
    And again<br />
    And again<br /></div>
  </div>
*/
    keys.forEach(function (game) {
      if (debug) console.log(game);
      const gameName = nameForGame(game);
      if (gameName == null) {
        if (debug) console.log("could not look up game");
        return;
      }

      // THIS IS DUMB AND IT DOES NOT WORK
      const gameTimezone = timezoneForGame(game);
      const dayReset = dayResetForGame(game);
      const dayResetDateString = getCurrentDate() + " " + dayReset;
      if (debug) console.log(dayResetDateString);
      
      var dayResetTime = moment.tz(dayResetDateString, gameTimezone);
      var dayResetTime2;
      if (now.isAfter(dayResetTime)) {
        if (debug) console.log("day reset is in the past, adding a day");
        // i'm not sure why we have to add 2 days here, but it works and I'm not asking questions
        dayResetTime2 = dayResetTime.clone().add(2, 'days');
      } else {
        dayResetTime2 = dayResetTime.clone();
      }
      const dayResetLocalTime = moment.tz(dayResetTime2, userTimezone);

      if (debug) console.log(dayResetTime);
      if (debug) console.log(dayResetLocalTime);
      
      const drHours = dayResetLocalTime.hours().toString().padStart(2, '0');
      const drMinutes = dayResetLocalTime.minutes().toString().padStart(2, '0');
      const drSeconds = dayResetLocalTime.seconds().toString().padStart(2, '0');
      const tillNextDay = moment.duration(dayResetLocalTime.diff(now));
      const drTillHours = tillNextDay.hours().toString().padStart(2, '0');
      const drTillMinutes = tillNextDay.minutes().toString().padStart(2, '0');
      const drTillSeconds = tillNextDay.seconds().toString().padStart(2, '0');

      // big_nasty_html_string += '<div class="row"><div class="col-md-6"><h2>' + gameName + '</h2></div><div class="col-md-6">';

      var gameHtmlString = `<div class="row"><div class="col"><h2>${gameName}</h2>Day Resets At: ${drHours}:${drMinutes}:${drSeconds}<br />In ${drTillHours}:${drTillMinutes}:${drTillSeconds}</div><div class="col">`;

      var foundEventsOfNote = false;

      allEvents[game].forEach(function (event) {
//         if (debug) console.log(event);
        if (gameTimezone == null) {
          if (debug) console.log("could not look up timezone");
          return;
        }

        if (debug) console.log("parse " + event.start + " and " + event.end + " as " + gameTimezone);
        const startDate = moment.tz(event.start, gameTimezone);
        const endDate = moment.tz(event.end, gameTimezone);

        if (debug) console.log("START");
        if (debug) console.log(startDate.format());
        if (debug) console.log("END");
        if (debug) console.log(endDate.format());

        var tag = "";
        var targetDate;
      
        if (now.isAfter(endDate)) {
          if (debug) console.log("event " + event.event + " is but a distant memory");
          return;
        } else if (now.isBefore(startDate)) {
          foundEventsOfNote = true;
          if (debug) console.log("event " + event.event + " is in THE FUTURE (zura)");
          targetDate = startDate;
          tag = "Starts";
        } else if (now.isAfter(startDate) && now.isBefore(endDate)) {
          foundEventsOfNote = true;
          if (debug) console.log("event " + event.event + " is in the here and now");
          targetDate = endDate;
          tag = "Ends";
        } else {
          // this shouldn't happen...
          if (debug) console.log("oh no, you broke time again, didn't you?");
          return;
        }
        if (debug) console.log("target");
        if (debug) console.log(targetDate);

        const duration = moment.duration(targetDate.diff(now));
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        if (days > 0) {
          gameHtmlString += `<h3>${event.event}</h3><h5>${tag} in ${days}d ${hours}h ${minutes}m ${seconds}s</h5>`;
        } else {
          gameHtmlString += `<h3>${event.event}</h3><h5>${tag} in ${hours}h ${minutes}m ${seconds}s</h5>`;
        }
      });

      gameHtmlString += '</div></div><br />';

      if (foundEventsOfNote) {
        big_nasty_html_string += gameHtmlString;
      }
    });
  if (debug) console.log(big_nasty_html_string);
  countdownContainer.html(big_nasty_html_string);
}

$(document).ready(function() {
  if (debug) console.log("document ready called"); 

  userTimezone = getUserTimezone();
  if (debug) console.log("User's timezone:", userTimezone);

  $.ajaxSetup({ cache: false });
  $.ajax({
      type: 'GET',
      url: 'events.json',
      dataType: 'json',
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error:', errorThrown);
      },
      success: function(data) {
          if (debug) console.log("Qapla!");
          if (debug) console.log(data); // I don't see this message in console
          allGames = data.games;
          allEvents = data.events;
          updateCountdown();
      }
  });
  
  if (enableConstantUpdates) {
    setInterval(updateCountdown, 1000);
  } else {
    // just one update
    updateCountdown();
  }
});

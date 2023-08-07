var userTimezone = "America/Los_Angeles";       // a sensible default
var allGames = {};
var allEvents = [];

function getUserTimezone() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz;
}

function nameForGame(game) {
  if (game in allGames) {
    return allGames[game].name;
  } else {
    console.log("ERROR: unknown game `" + game + "'")
    return null;
  }
}

function timezoneForGame(game) {
  if (game in allGames) {
    return allGames[game].timezone;
  } else {
    console.log("ERROR: unknown game `" + game + "'")
    return null;
  }
}

function updateCountdown() {
    const keys = Object.keys(allEvents);

    if (keys.length == 0) {
      console.log("No events found");
      // should probably put this in the html
      return;
    } else {
      console.log("Found " + keys.length + " games");
    }

    const countdownContainer = $("#main");
    countdownContainer.empty();
    const now = moment.tz(moment(), userTimezone); // Replace with your current timezone
    
    keys.forEach(function (game) {
      console.log(game);
      const gameName = nameForGame(game);
      if (gameName == null) {
        console.log("could not look up game");
        return;
      }

      const eventTimezone = timezoneForGame(game);
      allEvents[game].forEach(function (event) {
        console.log(event);
        if (eventTimezone == null) {
          console.log("could not look up timezone");
          return;
        }
      
        const startDate = moment.tz(event.start, eventTimezone);
        const endDate = moment.tz(event.end, eventTimezone);

        var tag = "";
        var targetDate;
      
        if (now.isBefore(startDate, 'day')) {
          console.log("event " + event.event + " is in THE FUTURE (zura)");
          targetDate = startDate;
          tag = "Starts";
        } else if (now.isBefore(endDate, 'day')) {
          console.log("event " + event.event + " is in the here and now");
          targetDate = endDate;
          tag = "Ends";
        } else if (now.isAfter(endDate, 'day')) {
          console.log("event " + event.event + " is but a distant memory");
          return;
        } else {
          // this shouldn't happen...
          console.log("oh no, you broke time again, didn't you?");
          return;
        }
      
        const duration = moment.duration(targetDate.diff(now));
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        const newDiv = $('<div>').addClass("countdown-timer");
        newDiv.html('<h3>[' + gameName + '] ' + event.event + '</h3>');
        newDiv.append(tag + " in ");
        newDiv.append(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        countdownContainer.append(newDiv);
      });
    });
}

$(document).ready(function() {
  console.log("document ready called"); 

  userTimezone = getUserTimezone();
  console.log("User's timezone:", userTimezone);

  $.ajaxSetup({ cache: false });
  $.ajax({
      type: 'GET',
      url: 'events.json',
      dataType: 'json',
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error:', errorThrown);
      },
      success: function(data) {
          console.log("Qapla!");
          console.log(data); // I don't see this message in console
          allGames = data.games;
          allEvents = data.events;
      }
  });
  
  setInterval(updateCountdown, 1000);
});


var userTimezone = "America/Los_Angeles";       // a sensible default
var events = [];

function getUserTimezone() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz;
}

function updateCountdown() {
    if (events.length == 0) {
      console.log("No events found");
      // should probably put this in the html
      return;
    } else {
      console.log("Found " + events.length + " events");
    }

    const countdownTimer = document.getElementById('countdown-timer');
    const now = moment.tz(moment(), userTimezone); // Replace with your current timezone

    events.forEach(function (event) {
      const targetDate = moment.tz(event.end, event.timezone);

      const duration = moment.duration(targetDate.diff(now));
      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      countdownTimer.textContent += `${days}d ${hours}h ${minutes}m ${seconds}s`;
    });
}

$(document).ready(function() {
  console.log("document ready called"); 

  userTimezone = getUserTimezone();
  console.log("User's timezone:", userTimezone);

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
          events = data;
      }
  });
  
  setInterval(updateCountdown, 1000);
});


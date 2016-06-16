var eventAttendance = {};

$(document).ready(function () {
  var eventTemplateSource, eventItemTemplate,
    eventURL = 'https://s3.amazonaws.com/interview-api-samples/events-results.json';

  eventTemplateSource = $('#event-template').html();
  eventItemTemplate = Handlebars.compile(eventTemplateSource);


  $.getJSON(eventURL, function(data) {
    var events, eventElements = [], chronologicalEvents;
    events = data.events;
    chronologicalEvents = _.sortBy(events, 'startDate');
    _.each(chronologicalEvents, function(event) {
      var context = event;
      context.startDatePretty =  moment(event.startDate).format('LLLL');

      // Retrieve localStorage to determine if user has RVSP'd to event.
      var storedAttendance = loadAttendance(event.id);
      if (storedAttendance) {
        context.display = 'show';
      } else {
        context.display = 'hide';
      }

      var eventItemHTML = eventItemTemplate(context);
      eventElements.push(eventItemHTML);

    });

    $( '<div/>', {
      'id': 'event-list-wrapper',
      html: eventElements.join('')
    }).appendTo( 'body' );

    // Add click listener on RSVP button.
    $('.event-rsvp').click(function(event){
      toggleRSVP(event.currentTarget.id);
    });
  });

});


/**
 * Toggles user's attendance for an event. We save this in localStorage
 * for now, but in a real-world situation this would be saved in a database.
 *
 * @param {String} eventId Unique id for event.
 */
function toggleRSVP(eventId) {
  var previousAttendance = loadAttendance(eventId);

  saveAttendance(eventId, !previousAttendance);

  $('#event-' + eventId + '-banner').toggleClass('show');
  $('#event-' + eventId + '-banner').toggleClass('hide');

  console.log(eventId, !previousAttendance);
}


/**
 * Saves user's attendance for an event by id in localStorage.
 * We save this in localStorage for now, but in a real-world situation
 * this would be saved in a database.
 *
 * @param {String} eventId Unique id for event.
 */
function saveAttendance(eventId, isAttending) {
  localStorage.setItem('event-' + eventId, isAttending ? "true" : "false");
}


/**
 * Grabs attendance by eventId from localStorage.
 *
 * @param {String} eventId Unique id for event.
 * @return {boolean} whether or not the user plans to attend the event.
 */
function loadAttendance(eventId) {
  var isAttending = localStorage.getItem('event-' + eventId) === "true";
  return isAttending;
}

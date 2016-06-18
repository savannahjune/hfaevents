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

      // Mark events with price of 0 as free.
      if (event.locations[0].tiers[0].price === 0) {
        context.price = 'Free';
      } else {
        context.price = '$' + event.locations[0].tiers[0].price;
      }

      // if (event.locations[0].numberSpacesRemaining <= 0) {
      //   console.log('no tickets remaining', event.id);
      // }

      // Retrieve localStorage to determine if voter has RVSP'd to event.
      var storedAttendance = loadAttendance(event.id);
      if (storedAttendance) {
        context.showAttending = 'show';
      } else {
        context.showAttending = 'hide';
      }

      if (!event.official) { // Hide offical event label if not official.
        context.showOfficial = 'hide';
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
      // eventId is appended to id so we slice off the string to get id's index.
      var sliceIndex = 'event-rsvp-button-'.length;
      toggleRSVP(event.currentTarget.id.slice(sliceIndex));
    });

    // Add click listener on details button.
    $('.event-details-button').click(function(event, elem){
      // eventId is appended to id so we slice off the string to get id's index.
      var sliceIndex = 'event-details-button-'.length;
      toggleDetails(event.currentTarget.id.slice(sliceIndex));
    });
  });

});


/**
 * Shows/hides details based on voter's click on details button and changes
 * label on details button.
 *
 * @param {String} eventId Unique id for event.
 */
function toggleDetails(eventId) {
  var buttonId = '#event-details-button-' + eventId,
      buttonLabel = $(buttonId).html();

  $('#event-' + eventId + '-details').toggleClass('show');
  $('#event-' + eventId + '-details').toggleClass('hide');


  if (buttonLabel === 'Details') { // Details were not previously showing.
    $(buttonId).html('Hide Details');
  } else {
    $(buttonId).html('Details');
  }
}

/**
 * Toggles voter's attendance for an event. We save this in localStorage
 * for now, but in a real-world situation this would be saved in a database.
 *
 * @param {String} eventId Unique id for event.
 */
function toggleRSVP(eventId) {
  var previousAttendance = loadAttendance(eventId),
      buttonId = '#event-rsvp-button-' + eventId;


  $('#event-' + eventId + '-banner').toggleClass('show');
  $('#event-' + eventId + '-banner').toggleClass('hide');

  if (!previousAttendance) { // Voter had not joined yet.
    $(buttonId).html('Cancel');
  } else {
    $(buttonId).html('Join');
  }

  saveAttendance(eventId, !previousAttendance);
}


/**
 * Saves voter's attendance for an event by id in localStorage.
 * We save this in localStorage for now, but in a real-world situation
 * this would be saved in a database.
 *
 * @param {String} eventId Unique id for event.
 * @param {boolean} isAttending Whether the voter wishes to attend.
 */
function saveAttendance(eventId, isAttending) {
  localStorage.setItem('event-' + eventId, isAttending ? "true" : "false");
}


/**
 * Grabs attendance by eventId from localStorage.
 *
 * @param {String} eventId Unique id for event.
 * @return {boolean} whether or not the voter plans to attend the event.
 */
function loadAttendance(eventId) {
  var isAttending = localStorage.getItem('event-' + eventId) === "true";
  return isAttending;
}


/**
 * Checks if tickets are remaining.
 *
 * @param {String} eventId Unique id for event.
 * @return {boolean} whether or not tickets remain for the event.
 */
function checkIfTicketsRemain(eventId) {

}

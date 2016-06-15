$(document).ready(function () {

  $.getJSON( "https://s3.amazonaws.com/interview-api-samples/events-results.json", function( data ) {
    var events, eventElements = [], chronologicalEvents;
    events = data.events;
    chronologicalEvents = _.sortBy(events, 'startDate');
    _.each(chronologicalEvents, function(event) {
      eventElements.push( "<div class='event-wrapper'> <div class='event-name'>" + event.name + "</div>" +
                          // "<div class='event-time'>" + new Date(event.startDate).toLocaleString() + "</div>");
                          "<div class='event-time'>" + moment(event.startDate).format('LLLL') + "</div></div>");
    });

    $( "<div/>", {
      "id": "event-list-wrapper",
      html: eventElements.join( "" )
    }).appendTo( "body" );
  });
});

$(document).ready(function () {
  var eventTemplateSource, eventItemTemplate,
  eventURL = 'https://s3.amazonaws.com/interview-api-samples/events-results.json';

  eventTemplateSource = $("#event-template").html();
  eventItemTemplate = Handlebars.compile(eventTemplateSource);

  $.getJSON(eventURL, function(data) {
    var events, eventElements = [], chronologicalEvents;
    events = data.events;
    chronologicalEvents = _.sortBy(events, 'startDate');
    _.each(chronologicalEvents, function(event) {

      var context = event;
      context.startDatePretty =  moment(event.startDate).format('LLLL');
      var eventItemHTML = eventItemTemplate(context);
      eventElements.push(eventItemHTML);

    });

    $( "<div/>", {
      "id": "event-list-wrapper",
      html: eventElements.join( "" )
    }).appendTo( "body" );
  });
});

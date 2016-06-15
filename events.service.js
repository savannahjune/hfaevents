$(document).ready(function () {

  var event_listitem_template_source   = $("#entry-template").html();
  var event_listitem_template = Handlebars.compile(event_listitem_template_source);

  $.getJSON( "https://s3.amazonaws.com/interview-api-samples/events-results.json", function( data ) {
    var events, eventElements = [], chronologicalEvents;
    events = data.events;
    chronologicalEvents = _.sortBy(events, 'startDate');
    _.each(chronologicalEvents, function(event) {

      var context = event;
      context.startDatePretty =  moment(event.startDate).format('LLLL');
      var event_item_html    = event_listitem_template(context);
      eventElements.push(event_item_html);

    });

    $( "<div/>", {
      "id": "event-list-wrapper",
      html: eventElements.join( "" )
    }).appendTo( "body" );
  });
});

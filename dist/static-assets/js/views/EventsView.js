define([
  'underscore', 
  'backbone',
  'imageScale',
  'imagesLoaded',
  'moment'
], function(_, Backbone, imageScale, imagesLoaded, moment){

  var EventsView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#eventsViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    loadFeed: function(){
      var self = this;

      var url = GAME_API_URL + '/events';
//      console.log(url);
      $.getJSON(url, function(result){
        if(!result){
          return;
        }

        self.result = result;

        // fire event
        app.dispatcher.trigger("EventsView:feedready", self);
      });
    },
    
    render: function(){
      if (!this.result) {
        return;
      }
      var self = this;
      
      var attribs = {};

      // add extra data
      $.each(this.result.events, function(index, event) {
        event.start.formatted_day = moment(event.start.local).format('dddd');
        event.start.formatted_date = moment(event.start.local).format('MMMM Do');
        // what type of activity is it?
        event.activity = 'hike';
        if (event.name.text.includes('run')) {
          event.activity = 'run';
        }
      });

      attribs = this.result;
      $(this.el).html(this.template(attribs));


      $('img.scale').imageScale({
        'rescaleOnResize': true
      });

      var elImages = $(this.el);
      var imgLoad = imagesLoaded(elImages);
      imgLoad.on('always', function(instance) {
        for ( var i = 0, len = imgLoad.images.length; i < len; i++ ) {
          if ($(imgLoad.images[i].img).hasClass('scale')) {
            $(imgLoad.images[i].img).parent().addClass('ready');
          }
        }
      });    

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }
    
  });

  return EventsView;
});

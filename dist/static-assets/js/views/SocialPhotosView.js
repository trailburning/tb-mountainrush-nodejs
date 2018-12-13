define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var SocialPhotosView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#communityPhotosViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    loadFeed: function(){
      var self = this;

      var url = 'https://www.juicer.io/api/feeds/playmountainrush?per=12';
      if (this.options.feed != '') {
        url = 'https://www.juicer.io/api/feeds/' + this.options.feed + '?per=12';
      }
//      console.log(url);
      $.getJSON(url, function(result){
        if(!result || !result.posts){
          return;
        }
        self.result = result;

        // fire event
        app.dispatcher.trigger("SocialPhotosView:feedready", self);
      });
    },
    
    render: function(){
      if (!this.result) {
        return;
      }
      var self = this;
      
      var attribs = {};
      attribs.juicer = this.result;
      $(this.el).html(this.template(attribs));

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }
    
  });

  return SocialPhotosView;
});

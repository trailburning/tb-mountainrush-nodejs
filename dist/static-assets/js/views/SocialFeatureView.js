define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var SocialFeatureView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#socialFeatureViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    loadFeed: function(){
      var self = this;

      var url = 'https://www.juicer.io/api/feeds/playmountainrush?per=1';
      if (this.options.feed != '') {
        url = 'https://www.juicer.io/api/feeds/' + this.options.feed + '?per=1';
      }
//      console.log(url);
      $.getJSON(url, function(result){
        if(!result || !result.posts){
          return;
        }
        self.result = result;

        // check post is featured
        if (self.result.posts.items[0].position) {
          // fire event
          app.dispatcher.trigger("SocialFeatureView:feedready", self);          
        }
        else {
          // fire event
          app.dispatcher.trigger("SocialFeatureView:feednotavailable", self);          
        }
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

      return this;
    }
    
  });

  return SocialFeatureView;
});

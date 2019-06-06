define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var ChallengesView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengesViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    load: function(){
      var self = this;

      var url = GAME_API_URL + "campaign/" + CAMPAIGN_ID + "/gamelevels";
//      console.log(url);
      $.getJSON(url, function(result){
        self.result = result;

        // fire event
        app.dispatcher.trigger("ChallengesView:ready", self);
      });
    },
    
    render: function(){
      if (!this.result) {
        return;
      }

      $(this.el).html(this.template({challenges: this.result}));

      $('img.scale', $(this.el)).imageScale({
        'rescaleOnResize': true
      });

      return this;
    }
    
  });

  return ChallengesView;
});

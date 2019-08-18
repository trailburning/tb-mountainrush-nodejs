define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var ChallengesView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengesContentViewTemplate').text());

      this.options = options;
      this.playerGameView = null;
    },
    
    render: function(jsonPlayerGames){
      if (!this.result) {
        return;
      }

      $(this.el).html(this.template({challenges: this.result, playerchallenges: jsonPlayerGames}));

      $('img.scale', $(this.el)).imageScale({
        'rescaleOnResize': true
      });

      return this;
    },

    load: function() {
      var self = this;

      var url = GAME_API_URL + "campaign/" + CAMPAIGN_ID + "/gamelevels";
//      console.log(url);
      $.getJSON(url, function(result){
        self.result = result;

        // fire event
        app.dispatcher.trigger("ChallengesView:ready", self);
      });
    }
    
  });

  return ChallengesView;
});

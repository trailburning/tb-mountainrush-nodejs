var LAST_SEEN_SECS = 86400;

define([
  'underscore', 
  'backbone',
  'bootstrap',
  'moment'
], function(_, Backbone, bootstrap, moment){

  var PlayerGameView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playerGameViewTemplate').text());

      this.options = options;
      this.bActiveGame = false;
      this.jsonResult = null;
    },

    getActiveGame: function(){
      return this.bActiveGame;
    },

    getPlayerGames: function(){
      if (!this.jsonResult) {
        return null;
      }
      
      return this.jsonResult.games;
    },

    getPlayerGame: function(clientID){
      var self = this;

      var url = GAME_API_URL + "client/" + clientID + "/playertoken/" + self.options.playerToken;
//      console.log(url);
      $.getJSON(url, function(result){
        self.jsonResult = result[0];
        // look for an active or pending game
        $.each(self.jsonResult.games, function(index, game){
          if (game.game_state == 'active' || game.game_state == 'pending') {
            // only show if not recentl visited
            if (game.last_seen_secs_ago > LAST_SEEN_SECS) {
              self.bActiveGame = true;
            }
          }
        });

        // fire event
        app.dispatcher.trigger("PlayerGameView:loaded");
      });
    },

    render: function(){
      var self = this;

      var attribs = this.jsonResult;
      $(this.el).html(this.template({ player: attribs }));

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return PlayerGameView;
});

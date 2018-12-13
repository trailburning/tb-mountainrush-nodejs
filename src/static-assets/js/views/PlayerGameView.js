define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var PlayerGameView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playerGameViewTemplate').text());

      this.options = options;
      this.bActiveGame = false;
    },

    getActiveGame: function(){
      return this.bActiveGame;
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
            self.bActiveGame = true;
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

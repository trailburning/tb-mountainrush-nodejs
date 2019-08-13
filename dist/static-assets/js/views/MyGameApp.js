var app = app || {};

define([
  'underscore',
  'backbone',
  'cookie'
], function(_, Backbone, cookie){
  app.dispatcher = _.clone(Backbone.Events);

  var initialize = function() {
    var self = this;

    function RedirectGame(strGameID) {
      window.location = HOST_URL + 'game/' + strGameID;
    }

    function RedirectNoGame(){
      window.location = HOST_URL;
    }

    function getGamesByState(strState){
      return self.jsonResult.games.find(function(game, index){
        return game['game_state'] === strState;
      });
    }

    function getPlayerGame(playerToken){
      var url = GAME_API_URL + "player/" + playerToken;
      $.getJSON(url, function(result){
        self.jsonResult = result[0];

        // is there a game?
        if (self.jsonResult.games.length) {
          var game = getGamesByState('active');
          if (game) {
            // found active game
            RedirectGame(game['game']);
          }
          else {
            game = getGamesByState('pending');
            if (game) {
              // found pending game
              RedirectGame(game['game']);
            }
            else {
              game = getGamesByState('complete');
              if (game) {
                // found active game
                RedirectGame(game['game']);
              }
              else {
                RedirectNoGame();
              }
            }
          }

          // look for an active or pending game
          $.each(self.jsonResult.games, function(index, game){
            if (game.game_state == 'active' || game.game_state == 'pending') {
              self.bActiveGame = true;
            }
          });

        }
        else {
          RedirectNoGame();
        }

      });
    }

    // check for player
    if (getUserCookie() != undefined) {
      var jsonUser = getUserCookies();
      getPlayerGame(jsonUser.token);
    } else {
      RedirectNoGame();
    }
  };

  return { 
    initialize: initialize
  };
});


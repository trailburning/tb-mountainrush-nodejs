define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap, moment){

  var ChallengeCancelModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengeCancelModalViewTemplate').text());

      this.options = options;
      this.jsonPlayer = null;
      this.jsonFields = {currGame: 0}
    },

    setPlayer: function(jsonPlayer) {
      this.jsonPlayer = jsonPlayer;

      // see if there's an active game
      this.jsonFields.currGame = _.where(jsonPlayer.games, {game_state:'active'})[0];
      if (!this.jsonFields.currGame) {
        this.jsonFields.currGame = _.where(jsonPlayer.games, {game_state:'pending'})[0];
      }
    },

    cancelChallenge: function(gameID) {
      var self = this;

      $('.cancel-challenge-btn', $(self.el)).button('loading');

      var url = GAME_API_URL + 'game/' + this.jsonFields.currGame.game;
//      console.log(url);
      $.ajax({
        type: 'delete',
        url: url,
        error: function(data) {
          console.log('error');
          console.log(data);
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);

          $('.modal', $(self.el)).modal('hide');
          location.reload();
        }
      });
    },

    render: function(gameID){      
      var self = this;

      $(this.el).html(this.template({ currGame: self.jsonFields.currGame }));

      $('.cancel-challenge-btn', $(this.el)).click(function(evt){
        self.cancelChallenge(gameID);
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }
  });

  return ChallengeCancelModalView;
});

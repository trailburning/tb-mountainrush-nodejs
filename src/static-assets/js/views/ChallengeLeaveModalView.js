define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap, moment){

  var ChallengeLeaveModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengeLeaveModalViewTemplate').text());

      this.options = options;
      this.modelPlayer = null;
      this.jsonFields = {currGame: 0}
    },

    setGamePlayer: function(jsonGame, playerModel) {
      this.jsonFields.currGame = jsonGame;
      this.jsonFields.currGame.gameID = this.jsonFields.currGame.id;
      if (this.jsonFields.currGame.game) {
        this.jsonFields.currGame.gameID = this.jsonFields.currGame.game;
      }

      this.modelPlayer = playerModel;
    },

    leaveChallenge: function() {
      var self = this;

      $('.leave-challenge-btn', $(self.el)).button('loading');

      var url = GAME_API_URL + 'game/' + this.jsonFields.currGame.gameID + '/player/' + this.modelPlayer.get('id');
      $.ajax({
        type: 'delete',
        url: url,
        error: function(data) {
          console.log('error');
          console.log(data);
        },
        success: function(data) {
          console.log('success');
          console.log(data);

          $('.modal', $(self.el)).modal('hide');
          // fire event
          app.dispatcher.trigger("ChallengeLeaveModalView:challengeLeft");
        }
      });
    },

    render: function(){      
      var self = this;

      $(this.el).html(this.template({ currGame: self.jsonFields.currGame }));

      $('.leave-challenge-btn', $(this.el)).click(function(evt){
        self.leaveChallenge();
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }
  });

  return ChallengeLeaveModalView;
});

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

    setGame: function(jsonGame) {
      this.jsonFields.currGame = jsonGame;
      this.jsonFields.currGame.gameID = this.jsonFields.currGame.id;
      if (this.jsonFields.currGame.game) {
        this.jsonFields.currGame.gameID = this.jsonFields.currGame.game;
      }
    },

    cancelChallenge: function() {
      var self = this;

      $('.cancel-challenge-btn', $(self.el)).button('loading');

      var url = GAME_API_URL + 'game/' + this.jsonFields.currGame.gameID;
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
          // fire event
          app.dispatcher.trigger("ChallengeCancelModalView:challengeCancelled");
        }
      });
    },

    render: function(){      
      var self = this;

      $(this.el).html(this.template({ currGame: self.jsonFields.currGame }));

      $('.cancel-challenge-btn', $(this.el)).click(function(evt){
        self.cancelChallenge();
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }
  });

  return ChallengeCancelModalView;
});

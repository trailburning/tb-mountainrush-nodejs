define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayersListView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playersListTemplate').text());

      this.options = options;
    },

    render: function(){
      var self = this;

      var activePlayer = null;
      if (this.options.activePlayer) {
        activePlayer = this.options.activePlayer.toJSON();
      }

      $(this.el).html(this.template({game: this.options.jsonGame, players: this.options.playerCollection.toJSON(), activePlayer: activePlayer}));

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }

  });

  return PlayersListView;
});

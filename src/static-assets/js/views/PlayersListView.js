define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayersListView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playersListTemplate').text());

      this.options = options;

      this.jsonFields = {totalRaisedPercentageOfFundraisingTarget: 0,
                        currencySymbol: '£',
                        totalRaisedOnline: 0,
                        fundraisingTarget: 0
                        }
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.totalRaisedPercentageOfFundraisingTarget = jsonFields.totalRaisedPercentageOfFundraisingTarget;
      this.jsonFields.currencySymbol = jsonFields.currencySymbol;;
      this.jsonFields.totalRaisedOnline = jsonFields.totalRaisedOnline;;
      this.jsonFields.fundraisingTarget = jsonFields.fundraisingTarget;;
    },

    render: function(){
      var self = this;

      var activePlayer = null;
      if (this.options.activePlayer) {
        activePlayer = this.options.activePlayer.toJSON();
      }

      var attribs = this.options.playerCollection.toJSON();
      $(this.el).html(this.template({page: this.jsonFields, game: this.options.jsonGame, players: attribs, activePlayer: activePlayer}));

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }

  });

  return PlayersListView;
});

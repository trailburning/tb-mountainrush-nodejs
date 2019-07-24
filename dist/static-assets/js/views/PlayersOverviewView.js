define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayersOverviewView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playersOverviewTemplate').text());

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

      $(this.el).html(this.template({page: this.jsonFields, game: this.options.jsonGame, players: this.options.playerCollection.toJSON(), activePlayer: activePlayer}));

      $('.player-ranking', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("PlayersOverviewView:playerClick", $(this).attr('data-id'));
      });

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      $('.link-cancel', $(this.el)).click(function(evt){        
        // fire event
        app.dispatcher.trigger("PlayersOverviewView:cancelGameClick");
      });

      $('.link-leave', $(this.el)).click(function(evt){        
        // fire event
        app.dispatcher.trigger("PlayersOverviewView:leaveGameClick");
      });

      $('.link-invite', $(this.el)).click(function(evt){        
        // fire event
        app.dispatcher.trigger("PlayersOverviewView:inviteClick");
      });

      return this;
    }

  });

  return PlayersOverviewView;
});

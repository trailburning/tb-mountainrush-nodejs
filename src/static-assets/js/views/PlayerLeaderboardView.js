define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayerLeaderboardView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#leaderboardViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    loadFeed: function(){
      var self = this;

      var url = GAME_API_URL + 'fundraiser/campaign/' + this.options.campaignID + '/leaderboard/7';
//      console.log(url);
      $.getJSON(url, function(result){
        self.result = result;

        var nMaxPlayers = 7;
        var nNumPlayers = self.result.length; 

        // pad out players until we have enough
        if (nNumPlayers < nMaxPlayers) {
          var blankPlayer = new Object();
          blankPlayer.firstname = 'no';
          blankPlayer.lastname = 'body';
          blankPlayer.ascent = 0;
          blankPlayer.fundraising_raised = 0;

          for (var nPlayer=0; nPlayer < (nMaxPlayers - nNumPlayers); nPlayer++) {
            self.result.push(blankPlayer);
          }
        }

        // fire event
        app.dispatcher.trigger('PlayerLeaderboardView:feedready', self);
      });
    },
    
    render: function(){      
      $(this.el).html(this.template({ players: this.result }));

      return this;
    }
  });

  return PlayerLeaderboardView;
});

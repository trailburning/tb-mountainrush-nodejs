define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var ChallengesMonitorView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengesMonitorViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    load: function(){
      var self = this;

      var url = GAME_API_URL + "campaign/" + CAMPAIGN_ID + "/monitorgames";
//      console.log(url);
      $.getJSON(url, function(result){
        self.result = result;

        // fire event
        app.dispatcher.trigger("ChallengesMonitorView:ready", self);
      });
    },
    
    render: function(){
      if (!this.result) {
        return;
      }

      $.each(this.result, function(nChallenge, challenge){
        $.each(challenge.players, function(nPlayer, player){
          player.mediaCaptured = (player.bMediaCaptured == '1' ? true : false);

          // calc progress
          var fAscentPercent = (player.ascent / challenge.ascent) * 100;
          player.elevationGainPercent = fAscentPercent;

          var fElevationToSummit = 0;
          if (Number(player.ascent) < Number(challenge.ascent)) {
            fElevationToSummit = Number(challenge.ascent) - Number(player.ascent);
          }

          player.elevationToSummit = fElevationToSummit;

          // modify avatar to use image proxy with campaign fallback
          player.avatar = GAME_API_URL + 'imageproxy.php?url=' + player.avatar + '&urlfallback=https://www.mountainrush.co.uk/static-assets/images/' + CAMPAIGN_TEMPLATE + '/avatar_unknown.jpg';
        });
      });

      $(this.el).html(this.template({challenges: this.result}));

      $('.player-ranking', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("ChallengesMonitorView:playerClick", $(this).attr('data-game-id'), $(this).attr('data-id'));
      });

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }
    
  });

  return ChallengesMonitorView;
});

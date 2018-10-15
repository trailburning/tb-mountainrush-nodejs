define([
  'underscore', 
  'backbone',
  'bootstrap',
  'raisenow'
], function(_, Backbone, bootstrap, raisenow){

  var GameDonationView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#gameDonationViewTemplate').text());

      this.options = options;
    },

    loadPlayerProgress: function(){
      var self = this;

      var url = GAME_API_URL + "game/" + this.options.gameID + "/player/" + this.options.playerID + '/progress';
//      console.log(url);
      $.getJSON(url, function(result){
        self.jsonResult = result[0];

        // modify avatar to use image proxy with campaign fallback
        self.jsonResult.avatar = GAME_API_URL + 'imageproxy.php?url=' + self.jsonResult.avatar + '&urlfallback=http://mountainrush.co.uk/static-assets/images/' + CAMPAIGN_TEMPLATE + '/avatar_unknown.jpg';

        // fire event
        app.dispatcher.trigger("GameDonationView:playerProgressLoaded");
      });

    },

    render: function(){
      var self = this;

      $(this.el).html(this.template({ player: self.jsonResult }));

      // 181015mla - render step here until we can seperate the form (currently form renders when js loaded!)
      var template = _.template($('#gameDonationStepViewTemplate').text());
      $('#game-donation-step-view').html(template({ player: self.jsonResult }));

      return this;
    }

  });

  return GameDonationView;
});

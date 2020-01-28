define([
  'underscore', 
  'backbone',
  'numeral'
], function(_, Backbone, numeral){

  var CampaignSummaryStickerView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#campaignSummaryStickerViewTemplate').text());

      this.options = options;
      this.result = null;
    },

    loadFeed: function(){
      var self = this;

      var url = GAME_API_URL + 'campaign/' + this.options.campaignID + '/summary';
//      console.log(url);
      $.getJSON(url, function(result){
        self.result = result;

        // fire event
        app.dispatcher.trigger("CampaignSummaryStickerView:feedready", self);
      });
    },
    
    render: function(){
      if (!this.result) {
        return;
      }

      var jsonContent = this.result;
      if (jsonContent.campaign_challenges.length) {
        jsonContent.total_ascent_formatted = numeral(Math.round(jsonContent.campaign_challenges[0].total_ascent)).format('0,0');
      }

      $(this.el).html(this.template(jsonContent));

      return this;
    }

  });

  return CampaignSummaryStickerView;
});

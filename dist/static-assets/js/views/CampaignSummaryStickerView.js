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

      var fTotalRaised = 0;
      var strCurrency = '';

      var jsonContent = this.result;

      if (jsonContent.campaign_players_paywall.length) {
        strCurrency = jsonContent.campaign_players_paywall[0].fundraising_currency_symbol;
        fTotalRaised += Number(jsonContent.campaign_players_paywall[0].total_paywall_amount);
      }

      if (jsonContent.campaign_donations.length) {
        strCurrency = jsonContent.campaign_donations[0].fundraising_currency_symbol;
        fTotalRaised += Number(jsonContent.campaign_donations[0].total_donations);
      }

      if (jsonContent.campaign_challenges.length) {
        strCurrency = jsonContent.campaign_challenges[0].fundraising_currency_symbol;
        fTotalRaised += Number(jsonContent.campaign_challenges[0].total_fundraising_raised);
        jsonContent.total_ascent_formatted = numeral(Math.round(jsonContent.campaign_challenges[0].total_ascent)).format('0,0');
      }

      jsonContent.fundraising_currency_symbol = strCurrency;
      jsonContent.total_raised = fTotalRaised;

      $(this.el).html(this.template(jsonContent));

      return this;
    }

  });

  return CampaignSummaryStickerView;
});

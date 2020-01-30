define([
  'underscore', 
  'backbone',
  'numeral'
], function(_, Backbone, numeral){

  var CampaignSummaryView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#campaignSummaryViewTemplate').text());

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
        app.dispatcher.trigger("CampaignSummaryView:feedready", self);
      });
    },
    
    render: function(){
      if (!this.result) {
        return;
      }

      var fTotalRaised = 0, strCurrency = '', total_ascent_formatted = 0, total_players = 0;
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
        total_ascent_formatted = numeral(Math.round(jsonContent.campaign_challenges[0].total_ascent)).format('0,0');
        total_players = Number(jsonContent.campaign_challenges[0].total_players);
      }

      jsonContent.fundraising_currency_symbol = strCurrency;
      jsonContent.total_raised = fTotalRaised;
      jsonContent.total_ascent_formatted = total_ascent_formatted;
      jsonContent.total_players = total_players;

      $(this.el).html(this.template(jsonContent));

      return this;
    }

  });

  return CampaignSummaryView;
});

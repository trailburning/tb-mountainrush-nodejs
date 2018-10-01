define([
  'underscore', 
  'backbone'
], function(_, Backbone){

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

      $(this.el).html(this.template(this.result[0]));

      return this;
    }

  });

  return CampaignSummaryView;
});

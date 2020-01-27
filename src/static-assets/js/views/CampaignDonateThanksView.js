define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var CampaignDonateThanksView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#campaignDonateThanksViewTemplate').text());

      this.options = options;
      this.jsonFields = {jsonCampaign: null}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.jsonCampaign = jsonFields.jsonCampaign;
    },

    render: function(){
      $(this.el).html(this.template({ campaign: this.jsonFields.jsonCampaign }));

      return this;
    }

  });

  return CampaignDonateThanksView;
});

define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterFundraisingCreatedView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerFundraisingCreatedViewTemplate').text());

      this.options = options;

      this.jsonFields = {campaignID: 0,
                         gameID: 0,
                         playerID: 0,
                         targetAmount: 0}
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
      this.jsonFields.gameID = jsonFields.gameID;
      this.jsonFields.playerID = jsonFields.playerID;
      this.jsonFields.targetAmount = jsonFields.targetAmount;
    },

    render: function(options){
      var self = this;

      $(this.el).html(this.template({ campaign: options.jsonCampaign, fields: this.jsonFields }));

      return this;
    }

  });

  return RegisterFundraisingCreatedView;
});

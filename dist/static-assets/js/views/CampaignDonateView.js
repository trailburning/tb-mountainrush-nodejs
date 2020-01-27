define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var CampaignDonateView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#campaignDonateViewTemplate').text());

      this.options = options;
      this.jsonPlayer = null;
      this.jsonFields = {clientID: 0,
                         playerID: 0}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.jsonCampaign = jsonFields.jsonCampaign;
      this.jsonFields.jsonPlayer = jsonFields.jsonPlayer;
    },

    render: function(){
      var self = this;

      $(this.el).html(this.template({ campaign: this.jsonFields.jsonCampaign, player: this.jsonFields.jsonPlayer }));

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.update-btn', $(self.el)).button('loading');

          var strEmail = $('#email-address', elForm).val();

          // fire event
          app.dispatcher.trigger("CampaignDonateView:success");
        }
      });

      return this;
    }

  });

  return CampaignDonateView;
});

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
                         playerID: 0,
                         amount: 0}
    },

    getFields: function() {
//      console.log(this.jsonFields);
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.jsonCampaign = jsonFields.jsonCampaign;
      this.jsonFields.jsonPlayer = jsonFields.jsonPlayer;
    },

    render: function(){
      var self = this;

      function pillSelected(elPill) {
        var elParent = elPill.closest('.pills');
        if (!elPill.hasClass('active')) {
          $('.pill', elParent).removeClass('active');
          elPill.addClass('active');
        }

        self.jsonFields.amount = elPill.attr('data-id');
      }

      $(this.el).html(this.template({ campaign: this.jsonFields.jsonCampaign, player: this.jsonFields.jsonPlayer }));

      // get defaults
      $('.pill.active').each(function(index){
        pillSelected($(this));
      });

      $('.pill', $(self.el)).click(function(evt){
        pillSelected($(this));
      });

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        // check custom pill value
        $('.pill.active input').each(function(index) {
          // override
          self.jsonFields.amount = $(this).val();
        });

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

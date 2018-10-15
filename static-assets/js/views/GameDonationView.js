define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

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

      function setupDonationForm() {
        window.rnwWidget = window.rnwWidget || {};
        window.rnwWidget.configureWidget = [];

        window.rnwWidget.configureWidget.push(function(options) {
          if (FUNDRAISING_DONATION_AMOUNT) {
            options.defaults['ui_onetime_amount_default'] = FUNDRAISING_DONATION_AMOUNT;
          } 

          options.defaults['stored_TBGameID'] = GAME_ID;
          options.defaults['stored_TBPlayerID'] = PLAYER_ID;

          options.extend({
            custom_fields : {
              stored_anonymous_donation : {
                type : 'checkbox',
                location : 'after',
                reference : 'empty-step',          
                label : 'Make my donation anonymous',
                value : 'true'
              },
              stored_customer_nickname : {
                type : 'text',
                location : 'after',
                reference : 'empty-step',          
                placeholder : 'Your name'
              },
              stored_customer_additional_message : {
                type : 'textarea',
                location : 'after',
                reference : 'empty-step',          
                placeholder : 'Your message of support',
                initial : '',
                rows: 8
              }
            }
          });

          options.widget.on(window.rnwWidget.constants.events.WIDGET_LOADED, function(event) {
  /*        
            event.widget.hideStep("donation-target");
            event.widget.hideStep("customer-address");

            event.widget.hideBlock("customer_salutation");
            event.widget.hideBlock("customer_permission");
            event.widget.hideBlock("customer_email");
            event.widget.hideBlock("customer_message");
            event.widget.hideBlock("customer_receipt");
  */
          });
        });        
      }

      $(this.el).html(this.template({ player: self.jsonResult }));

      setupDonationForm();

      return this;
    }

  });

  return GameDonationView;
});

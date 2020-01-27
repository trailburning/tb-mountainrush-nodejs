define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var CampaignDonatePaymentView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#campaignDonatePaymentViewTemplate').text());

      this.options = options;
      this.jsonFields = {jsonCampaign: null,
                          jsonPlayer: null,
                          amount: 0}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.jsonCampaign = jsonFields.jsonCampaign;
      this.jsonFields.jsonPlayer = jsonFields.jsonPlayer;
      this.jsonFields.amount = jsonFields.amount;
    },

    render: function(){
      var self = this;

      // Submit the form with the token ID.
      function stripeTokenHandler(token) {
        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);

        console.log(self.jsonFields);
        var jsonData = {token: token.id,
          amount: self.jsonFields.amount,
          email: self.jsonFields.jsonPlayer.email};
        console.log(jsonData);

        var url = GAME_API_URL + 'campaign/' + CAMPAIGN_ID + '/payment';;
        console.log(url);

        $.ajax({
          type: 'post',
          dataType: 'json',
          url: url,
          data: JSON.stringify(jsonData),
          error: function(data) {
            console.log('error');
            console.log(data);  
          },
          success: function(data) {
            console.log('success');
            console.log(data);

            $('.update-btn', $(self.el)).button('reset');

            if (data) {
              if (data.error) {
                console.log(data.error);
                console.log(data.error.stripeCode);
                switch (data.error.stripeCode) {
                  case 'incorrect_cvc':
                    $('.msg[data-msg=incorrect-cvc]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;

                  case 'card_declined':
                    $('.msg[data-msg=card-declined]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;

                  case 'expired_card':
                    $('.msg[data-msg=expired-card]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;

                  case 'incorrect_number':
                    $('.msg[data-msg=incorrect-number]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;

                  case 'processing_error':
                    $('.msg[data-msg=processing-error]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;

                  default:
                    $('.msg[data-msg=unknown-err]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;
                }
              }
              else {
                // fire event
                app.dispatcher.trigger("CampaignDonatePaymentView:success");
              }
            }
          }
        });
      }

      function setupStripe() {
        var stripe = Stripe(STRIPE_API_KEY);
        var elements = stripe.elements();

        // Custom styling can be passed to options when creating an Element.
        // (Note that this demo uses a wider set of styles than the guide below.)
        var style = {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        };

        // Create an instance of the card Element.
        var card = elements.create('card', {style: style});

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount('#card-element');

        // Handle form submission.
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', function(event) {
          event.preventDefault();

          $('.err', $(self.el)).hide();
          $('.err .msg', $(self.el)).hide();

          stripe.createToken(card).then(function(result) {
            if (result.error) {
              // Inform the user if there was an error.
              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            } else {
              $('.update-btn', $(self.el)).button('loading');

              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = '';

              // Send the token to your server.
              stripeTokenHandler(result.token);
            }
          });
        });
      }

      $(this.el).html(this.template({ campaign: this.jsonFields.jsonCampaign, player: this.jsonFields.jsonPlayer, amount: this.jsonFields.amount }));

      setupStripe();

      return this;
    }

  });

  return CampaignDonatePaymentView;
});

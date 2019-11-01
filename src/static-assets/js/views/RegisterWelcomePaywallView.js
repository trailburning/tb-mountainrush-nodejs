define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterWelcomePaywallView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerWelcomePaywallViewTemplate').text());

      this.options = options;
      this.jsonPlayer = null;
      this.jsonFields = {clientID: 0,
                         playerID: 0}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setPlayer: function(clientID, jsonPlayer) {
      this.jsonFields.clientID = clientID;
      this.jsonPlayer = jsonPlayer;
      this.jsonFields.playerID = jsonPlayer.id;
    },

    updatePreferences: function(fPaywallAmount) {
      var self = this;

      $('.err', $(this.el)).hide();
      $('.err .msg', $(this.el)).hide();

      var jsonData = {paywallPayment: fPaywallAmount};
      console.log(jsonData);

      var url = GAME_API_URL + "player/" + this.jsonFields.playerID + '/paywall';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          $('.update-btn', $(self.el)).button('reset');

          console.log('error');
          console.log(data);  
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);

          $('.update-btn', $(self.el)).button('reset');

          // fire event
          app.dispatcher.trigger("RegisterWelcomePaywallView:userUpdated");
        }
      });
    },

    render: function(options){
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

        // Submit the form
//        form.submit();

        var jsonData = {token: token.id, amount: 10, name: 'Hello World'};
        console.log(jsonData);

        var url = GAME_API_URL + "player/" + self.jsonFields.playerID + '/paywall/payment';
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

          }
        });
      }

      function setupStripe() {
        var stripe = Stripe('pk_test_wBccDPYUjxKXgvanR0EaSgsC');
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

          stripe.createToken(card).then(function(result) {
            if (result.error) {
              // Inform the user if there was an error.
              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            } else {
              // Send the token to your server.
              stripeTokenHandler(result.token);
            }
          });
        });
      }

      $(this.el).html(this.template({ campaign: options.jsonCampaign, player: this.jsonPlayer }));

      setupStripe();
/*
      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.update-btn', $(self.el)).button('loading');

          var fPaywallAmount = $('#paywall-payment', elForm).val();
          self.updatePreferences(fPaywallAmount);
        }
      });
*/
      return this;
    }

  });

  return RegisterWelcomePaywallView;
});

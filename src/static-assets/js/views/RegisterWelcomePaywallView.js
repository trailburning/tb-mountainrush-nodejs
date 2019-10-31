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

      $(this.el).html(this.template({ campaign: options.jsonCampaign, player: this.jsonPlayer }));

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

      return this;
    }

  });

  return RegisterWelcomePaywallView;
});

define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterWelcomePreferencesView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerWelcomePreferencesViewTemplate').text());

      this.options = options;
      this.jsonPlayer = null;
      this.jsonFields = {clientID: 0,
                         playerID: 0,
                         games: {}}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setPlayer: function(clientID, jsonPlayer) {
      this.jsonFields.clientID = clientID;
      this.jsonPlayer = jsonPlayer;
      this.jsonFields.playerID = jsonPlayer.id;
      this.jsonFields.games = jsonPlayer.games;
    },

    updatePreferences: function(bGameEmail, strEmail) {
      var self = this;

      $('.err', $(this.el)).hide();
      $('.err .msg', $(this.el)).hide();

      var jsonData = {receiveEmail: bGameEmail, email: strEmail};
//      console.log(jsonData);

      var url = GAME_API_URL + "player/" + this.jsonFields.playerID;
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

          if (data) {
            if (data.error) {
              switch (data.error.id) {
                case 'UserEmailAlreadyExists':
                  $('.msg[data-msg=already-exists]', $(self.el)).show();
                  $('.err', $(self.el)).show();
                  break;
              }
            }
          }
          else {
            self.jsonPlayer.game_notifications = jsonData.receiveEmail;
            self.jsonPlayer.email = jsonData.email;

            // fire event
            app.dispatcher.trigger("RegisterWelcomePreferencesView:prefsUpdated");
          }
        }
      });
    },

    render: function(){
      var self = this;

      $(this.el).html(this.template({ player: this.jsonPlayer }));

      $('.link-back', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterWelcomePreferencesView:backClick");
      });

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.update-btn', $(self.el)).button('loading');

          var bGameEmail = $('#preferences-game-email').hasClass('active') ? 1 : 0;
          var strEmail = $('#email-address', elForm).val();
          self.updatePreferences(bGameEmail, strEmail);
        }
      });

      return this;
    }

  });

  return RegisterWelcomePreferencesView;
});

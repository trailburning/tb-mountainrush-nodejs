define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterFundraisingSigninView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerFundraisingSigninViewTemplate').text());

      this.options = options;

      this.jsonFields = {playerID: 0,
                        email: '',
                        password: ''}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.playerID = jsonFields.playerID;
    },

    getFundraiserRegister: function(strEmail, strPassword) {
      var self = this;

      $('.err, .err .msg, .warning, .warning .msg', $(this.el)).hide();

      var url = GAME_API_URL + 'fundraiser/player/' + this.jsonFields.playerID + '/user/' + strEmail + '/' + strPassword;
//      console.log(url);
      $.getJSON(url, function(result){
//        console.log(result);
        $('.signin-btn', $(self.el)).button('reset');

        if (result.exists) {
          // fire event
          app.dispatcher.trigger("RegisterFundraisingSigninView:validUser");
        }
        else {
          // fire event
          app.dispatcher.trigger("RegisterFundraisingSigninView:invalidUser");
        }
      });
    },

    render: function(options){
      var self = this;

      $(this.el).html(this.template({ campaign: options.jsonCampaign }));

      $('.register-link', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterFundraisingSigninView:registerClick");
      });

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.signin-btn', $(self.el)).button('loading');

          self.jsonFields.email = $('#fundraising-signin-email').val();
          self.jsonFields.password = $('#fundraising-signin-password').val();

          self.getFundraiserRegister($('#fundraising-signin-email').val(), $('#fundraising-signin-password').val());
        }
      });

      return this;
    }

  });

  return RegisterFundraisingSigninView;
});

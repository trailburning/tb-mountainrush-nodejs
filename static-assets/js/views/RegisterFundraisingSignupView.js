define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterFundraisingSignupView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerFundraisingSignupViewTemplate').text());

      this.options = options;

      this.jsonFields = {email: '',
                        password: '',
                        firstname: '',
                        lastname: ''}

      this.warning = null;
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.email = jsonFields.email;
      this.jsonFields.password = jsonFields.password;
    },

    setWarning: function(warning) {
      this.warning = warning;
    },

    createFundraiserRegister: function(strEmail, strPassword, strFirstname, strLastname) {
      var self = this;

      $('.err, .err .msg, .warning, .warning .msg', $(this.el)).hide();

      var jsonData = {email: strEmail,
                      password: strPassword,
                      firstname: strFirstname,
                      lastname: strLastname,
//                      title: 'Mr',
//                      addressline1: 'A secret street',
//                      addressline2: '',
//                      town: 'Biggar',
//                      state: '',
//                      postcode: 'M130EJ',
//                      country: 'United Kingdom',
                      acceptTerms: true};

      var url = GAME_API_URL + 'fundraiser/user/lite';
      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          $('.register-btn', $(self.el)).button('reset');

          console.log('error');
          console.log(data);
        },
        success: function(data) {
          $('.register-btn', $(self.el)).button('reset');

          if (data) {
            if (data.errorMessage === undefined) {
              // fire event
              app.dispatcher.trigger("RegisterFundraisingSignupView:userCreated");
            }
            else {
              switch (data.errorMessage) {
                case 'That email address is already in use':
                  $('.msg[data-msg=already-registered]', $(self.el)).show();
                  $('.err', $(self.el)).show();
                  break;
              }
            }
          }
          else {
              $('.msg[data-msg=jg-internal-err]', $(self.el)).show();
              $('.err', $(self.el)).show();
          }
          console.log('success');
          console.log(data);
        }
      });
    },

    render: function(options){
      var self = this;
      
      $(this.el).html(this.template({ campaign: options.jsonCampaign }));

      var self = this;

      // render warning
      switch (this.warning) {
        case 'not-registered':
          $('.warning .msg[data-msg=not-registered]', $(this.el)).show();
          $('.warning', $(this.el)).show();
          break;
      }
      this.setWarning(null);

      $('.signin-link', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterFundraisingSignupView:signinClick");
      });

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.register-btn', $(self.el)).button('loading');

          self.createFundraiserRegister($('#fundraising-register-email').val(), $('#fundraising-register-password').val(), $('#fundraising-register-firstname').val(), $('#fundraising-register-lastname').val());
        }
      });

      $('#fundraising-register-email').val(this.jsonFields.email)
      $('#fundraising-register-password').val(this.jsonFields.password)

      return this;
    }

  });

  return RegisterFundraisingSignupView;
});

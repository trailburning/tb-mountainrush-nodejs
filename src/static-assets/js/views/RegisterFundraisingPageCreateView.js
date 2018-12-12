define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterFundraisingPageCreateView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerFundraisingPageCreateViewTemplate').text());

      this.options = options;

      this.jsonFields = {campaignID: '',
                        gameID: '',
                        playerID: '',
                        email: '',
                        password: '',
                        supporterMsg: '',
                        targetAmount: 0,
                        justGivingOptIn: false,
                        charityOptIn: false,
                        fundraising_page: ''}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
      this.jsonFields.gameID = jsonFields.gameID;
      this.jsonFields.playerID = jsonFields.playerID;
      this.jsonFields.email = jsonFields.email;
      this.jsonFields.password = jsonFields.password;
    },

    createFundraiserPage: function(strEmail, strPassword, fTargetAmount, strSupporterMsg, bJustGivingOptIn, bCharityOptIn) {
      var self = this;

      $('.err', $(this.el)).hide();
      $('.err .msg', $(this.el)).hide();

      var jsonData = {email: strEmail,
                      password: strPassword,
                      supporterMsg: strSupporterMsg,
                      targetAmount: fTargetAmount,
                      justGivingOptIn: bJustGivingOptIn,
                      charityOptIn: bCharityOptIn};
//      console.log(jsonData);

      var url = GAME_API_URL + 'fundraiser/campaign/' + this.jsonFields.campaignID + '/game/' + this.jsonFields.gameID + '/player/' + this.jsonFields.playerID + '/page';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          $('.create-btn', $(self.el)).button('reset');

          console.log('error');
          console.log(data);  
        },
        success: function(data) {
          $('.create-btn', $(self.el)).button('reset');

//          console.log('success');
//          console.log(data);

          if (data) {
            if (data.error === undefined) {
              self.jsonFields.fundraising_page = data.fundraising_page;
              // fire event
              app.dispatcher.trigger("RegisterFundraisingPageCreateView:pageCreated");
            }
            else {
              if (data.error) {
                switch (data.error.id) {
                  case 'UserDoesNotExist':
                    $('.msg[data-msg=no-user]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;

                  case 'PageShortNameAlreadyExists':
                    $('.msg[data-msg=already-exists]', $(self.el)).show();
                    $('.err', $(self.el)).show();
                    break;
                }
              }
              else {
                self.jsonFields.fundraising_page = data.fundraising_page;
                // fire event
                app.dispatcher.trigger("RegisterFundraisingPageCreateView:pageCreated");
              }
            }
          }
        }
      });
    },

    render: function(options){
      var self = this;
      var fTargetAmount = 0;
      
      $(this.el).html(this.template({ campaign: options.jsonCampaign }));

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.create-btn', $(self.el)).button('loading');
          self.jsonFields.targetAmount = $('#fundraising-page-create-targetamount').val();
          self.jsonFields.supporterMsg = $('[name="fundraising-supporter-msg"]', elForm).val();
          self.jsonFields.justGivingOptIn = $('#fundraising-receive-partner-email').is(':checked') ? true : false;
          if ($('[name="fundraising-receive-charity-email"]:checked', elForm).val() == '1') {
            self.jsonFields.charityOptIn = true;
          }

          self.createFundraiserPage(self.jsonFields.email, self.jsonFields.password, self.jsonFields.targetAmount, self.jsonFields.supporterMsg, self.jsonFields.justGivingOptIn, self.jsonFields.charityOptIn);
        }
      });

      return this;
    }

  });

  return RegisterFundraisingPageCreateView;
});

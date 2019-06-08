define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterFundraisingCreateView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerFundraisingCreateViewTemplate').text());

      this.options = options;

      this.jsonFields = {campaignID: '',
                        gameID: '',
                        playerID: '',
                        supporterMsg: '',
                        targetAmount: 0,
                        currencyCode: 'CHF',
                        charityOptIn: false}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
      this.jsonFields.gameID = jsonFields.gameID;
      this.jsonFields.playerID = jsonFields.playerID;
      this.jsonFields.currencyCode = jsonFields.currencyCode;
    },

    createFundraiserDetails: function(fTargetAmount, strSupporterMsg, currencyCode, bCharityOptIn) {
      var self = this;

      $('.err', $(this.el)).hide();
      $('.err .msg', $(this.el)).hide();

      var jsonData = {targetAmount: fTargetAmount,
                      supporterMsg: strSupporterMsg,
                      currencyCode: currencyCode,
                      charityOptIn: bCharityOptIn};

      var url = GAME_API_URL + 'fundraiser/campaign/' + this.jsonFields.campaignID + '/game/' + this.jsonFields.gameID + '/player/' + this.jsonFields.playerID + '/details';
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

          console.log('success');
          console.log(data);

          // fire event
          app.dispatcher.trigger("RegisterFundraisingCreateView:fundraisingCreated");
        }
      });
    },

    postrender: function(self){
      var self = this;

      var elForm = $('form', $(self.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.create-btn', $(self.el)).button('loading');
          self.jsonFields.targetAmount = $('#fundraising-page-create-targetamount', elForm).val();
          self.jsonFields.supporterMsg = $('[name="fundraising-supporter-msg"]', elForm).val();
          self.jsonFields.charityOptIn = $('[name="fundraising-receive-charity-email"]:checked', elForm).val();

          self.createFundraiserDetails(self.jsonFields.targetAmount, self.jsonFields.supporterMsg, self.jsonFields.currencyCode, self.jsonFields.charityOptIn);
        }
      });
    },

    render: function(options){
      var self = this;
      
      var url = GAME_API_URL + 'game/' + this.jsonFields.gameID + '/player/' + this.jsonFields.playerID + '/cause';
//      console.log(url);
      $.getJSON(url, function(result){
        $(self.el).html(self.template({ campaign: options.jsonCampaign, cause: result[0] }));
        self.postrender(self);
      });

      return this;
    }
  });

  return RegisterFundraisingCreateView;
});

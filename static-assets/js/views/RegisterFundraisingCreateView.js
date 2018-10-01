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
    },

    createFundraiserDetails: function(fTargetAmount, currencyCode, bCharityOptIn) {
      var self = this;

      $('.err', $(this.el)).hide();
      $('.err .msg', $(this.el)).hide();

      var jsonData = {targetAmount: fTargetAmount,
                      currencyCode: currencyCode,
                      charityOptIn: bCharityOptIn};
      console.log(jsonData);

      var url = GAME_API_URL + 'fundraiser/campaign/' + this.jsonFields.campaignID + '/game/' + this.jsonFields.gameID + '/player/' + this.jsonFields.playerID + '/details';
      console.log(url);
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
          self.jsonFields.targetAmount = $('#fundraising-page-create-targetamount', elForm).val();
          self.jsonFields.charityOptIn = $('[name="fundraising-receive-charity-email"]:checked', elForm).val();

          self.createFundraiserDetails(self.jsonFields.targetAmount, self.jsonFields.currencyCode, self.jsonFields.charityOptIn);
        }
      });

      return this;
    }
  });

  return RegisterFundraisingCreateView;
});

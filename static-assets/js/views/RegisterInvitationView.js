define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterInvitationView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerInvitationViewTemplate').text());

      this.options = options;
      this.jsonFields = {campaignID: 0}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
    },

    checkCode: function(strCode) {
      var self = this;

      $('.err, .err .msg, .warning, .warning .msg, .info, .info .msg', $(this.el)).hide();

      var jsonData = {code: strCode};

      var url = GAME_API_URL + 'campaign/' + this.jsonFields.campaignID + '/checkinvite';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          $('.invite-btn', $(self.el)).button('reset');

          console.log('error');
          console.log(data);
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);

          $('.invite-btn', $(self.el)).button('reset');

          if (data.length) {
            self.inviteSuccess();
          }
          else {
            self.inviteFail(); 
          }
        }
      });    
    },

    inviteSuccess: function() {
      var self = this;

      $('.err, .err .msg, .warning, .warning .msg, .info, .info .msg', $(this.el)).hide();

      // fire event
      app.dispatcher.trigger("RegisterInvitationView:inviteSuccess");      
    },

    inviteFail: function() {
      var self = this;

      $('.err, .err .msg, .warning, .warning .msg, .info, .info .msg', $(this.el)).hide();
      
      $('.msg[data-msg=invalid-code]', $(self.el)).show();
      $('.err', $(self.el)).show();
    },

    render: function(options){
      var self = this;
      
      $(this.el).html(this.template({ campaign: options.jsonCampaign }));

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.invite-btn', $(self.el)).button('loading');

          self.checkCode($('#invitation-code', $(self.el)).val());
        }
      });

      return this;
    }

  });

  return RegisterInvitationView;
});

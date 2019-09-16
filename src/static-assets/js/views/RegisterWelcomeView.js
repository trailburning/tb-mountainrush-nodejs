define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterWelcomeView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerWelcomeViewTemplate').text());

      this.options = options;
      this.jsonFields = {clientID: 0,
                         playerToken: '',
                         playerID: 0,
                         firstname: '',
                         avatar: '',
                         games: {}}
    },

    getFields: function() {
      return this.jsonFields;
    },

    render: function(options){
      var self = this;

      $(this.el).html(this.template({ campaign: options.jsonCampaign }));

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.get-btn', $(self.el)).button('loading');

          self.jsonFields.clientID = $('#fundraising-clientID').val();
          self.jsonFields.playerToken = $('#fundraising-player').val();

          self.getPlayer(self.jsonFields.clientID);
        }
      });

      return this;
    }

  });

  return RegisterWelcomeView;
});

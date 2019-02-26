define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var GameInviteView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#gameInviteViewTemplate').text());

      this.options = options;

      this.jsonFields = {gameID: 0,
                         name: '',
                         email: ''}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.gameID = jsonFields.gameID;
    },

    sendInvite: function() {
      var self = this;

      $('.err, .err .msg, .warning, .warning .msg, .info, .info .msg', $(this.el)).hide();

      var jsonData = {name: this.jsonFields.name,
                      email: this.jsonFields.email};

      var url = GAME_API_URL + 'game/' + this.jsonFields.gameID + '/invite';
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
          $('.info .msg[data-msg=invite-sent]', $(self.el)).show();
          $('.info', $(self.el)).show();

          $('.invite-btn', $(self.el)).button('reset');
          $('#invite-name', $(self.el)).val('');
          $('#invite-email', $(self.el)).val('');

//          console.log('success');
//          console.log(data);
        }
      });
    },

    render: function(options){
      var self = this;
      
      $(this.el).html(this.template());

      $('.link-back', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("GameInviteView:backClick");
      });

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.invite-btn', $(self.el)).button('loading');

          self.jsonFields.name = $('#invite-name', $(self.el)).val();
          self.jsonFields.email = $('#invite-email', $(self.el)).val();

          self.sendInvite();
        }
      });

      return this;
    }

  });

  return GameInviteView;
});

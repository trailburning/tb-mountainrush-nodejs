define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var GameInviteView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#gameInviteViewTemplate').text());

      this.options = options;
      this.strUnknownLocation = '';

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

      this.strUnknownLocation = $('.search-panel', this.el).attr('data-unknown-location');
      console.log(this.strUnknownLocation);

      // setup autosuggest
      $('.search-field', $(this.el)).autocomplete({
        minLength: 1,
        delay: 0,
        autoFocus: false,
        source: function(request, response ) {
          var term = request.term.toLowerCase();
          var arrResults = new Array;

          var url = GAME_API_URL + 'client/' + self.options.clientID + '/players/' + term;
//          console.log(url);
          $.getJSON(url, request, function( data, status, xhr ) {
            if (data) {
              var suggestions = data;

              suggestions.forEach(function(item){
                arrResults.push(item);
              });
              response(arrResults);
            }
          });
        },
        select: function(event, ui) {
          $(this).val(ui.item.firstname + ' ' + ui.item.lastname);

          return false;
        }
      });

      $('.search-field', $(this.el)).data('ui-autocomplete')._renderItem = function(ul, item) {
        var strLocation = self.strUnknownLocation;

        if (item.city != '' && item.country != '') {
          strLocation = item.city + ', ' + item.country;
        }
        else if (item.country != '') {
          strLocation = item.country;
        }

        var strItem = '<span class="match-name">' + item.firstname + ' ' + item.lastname + '</span><span class="match-detail">' + strLocation + '</span>';

        return $('<li>')
          .append(strItem)
          .appendTo(ul);
      };

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

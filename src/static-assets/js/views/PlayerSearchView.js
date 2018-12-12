define([
  'underscore', 
  'backbone',
  'jqueryUI'
], function(_, Backbone, jqueryUI){

  var PlayerSearchView = Backbone.View.extend({
    initialize: function(options){
      this.options = options;
    },

    render: function(){
      var self = this;

      // setup autosuggest
      $('.search-field', $(this.el)).autocomplete({
        minLength: 1,
        delay: 0,
        autoFocus: false,
        source: function(request, response ) {
          var term = request.term.toLowerCase();
          var arrResults = new Array;

          var url = GAME_API_URL + 'campaign/' + self.options.campaignID + '/players/' + term;
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

          window.location.href = self.options.hostURL + '/game/' + ui.item.gameID;

          return false;
        }
      });

      $('.search-field', $(this.el)).data('ui-autocomplete')._renderItem = function(ul, item) {
        var strItem = '<span class="match-name">' + item.firstname + ' ' + item.lastname + '</span><span class="match-game">' + item.level_name + ' ' + item.game_type + '</span>';

        return $('<li>')
          .append(strItem)
          .appendTo(ul);
      };

      return this;
    }

  });

  return PlayerSearchView;
});

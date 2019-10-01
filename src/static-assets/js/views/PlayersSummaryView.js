define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayersSummaryView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playersSummaryTemplate').text());

      this.options = options;
    },

    render: function(){
      var self = this;

      $(this.el).html(this.template({game: this.options.jsonGame, players: this.options.playerCollection.toJSON()}));

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }

  });

  return PlayersSummaryView;
});

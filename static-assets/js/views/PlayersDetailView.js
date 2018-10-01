define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayersDetailView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playersDetailTemplate').text());

      this.options = options;
    },

    render: function(){
      var self = this;

      $(this.el).html(this.template({game: this.options.jsonGame, players: this.options.playerCollection.toJSON(), fundraising: this.options.jsonFundraising}));

      $('img', $(this.el)).imagesLoaded().progress( function( instance, image ) {
        if ($(image.img).hasClass('fade_on_load')) {
          $(image.img).css('opacity', 1);
        }
      });

      return this;
    }

  });

  return PlayersDetailView;
});

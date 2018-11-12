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

      // format msg
      this.options.playerCollection.each(function(model){
        model.set('fundraising_msg_formatted', '<p>' + model.get('fundraising_msg').replace(/(?:\r\n|\r|\n)/g, '<p></p>') + '</p>');
      });

      $(this.el).html(this.template({game: this.options.jsonGame, players: this.options.playerCollection.toJSON(), fundraising: this.options.jsonFundraising}));

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

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

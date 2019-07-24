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
        if (model.get('fundraising_msg')) {
          model.set('fundraising_msg_formatted', '<p>' + model.get('fundraising_msg').replace(/(?:\r\n|\r|\n)/g, '<p></p>') + '</p>');
        }
      });

      var activePlayer = null;
      if (this.options.activePlayer) {
        activePlayer = this.options.activePlayer.toJSON();
      }

      $(this.el).html(this.template({game: this.options.jsonGame, players: this.options.playerCollection.toJSON(), activePlayer: activePlayer, fundraising: this.options.jsonGame.jsonFundraising}));

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      $('.link-cancel', $(this.el)).click(function(evt){        
        // fire event
        app.dispatcher.trigger("PlayersDetailView:cancelGameClick");
      });

      $('.link-leave', $(this.el)).click(function(evt){        
        // fire event
        app.dispatcher.trigger("PlayersDetailView:leaveGameClick");
      });

      $('.link-invite', $(this.el)).click(function(evt){        
        // fire event
        app.dispatcher.trigger("PlayersDetailView:inviteClick");
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

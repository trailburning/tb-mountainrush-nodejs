define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var MountainStoryModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#mountainStoryModalViewTemplate').text());

      this.options = options;
      this.objVideo = null;
    },

    render: function(jsonCurrGame, playerModel, storyModel){
      var self = this;
      
      $(this.el).html(this.template({game: jsonCurrGame, player: playerModel.toJSON(), story: storyModel.toJSON()}));

      $('.big-close-btn', $(this.el)).click(function(evt){
        $('.modal', $(self.el)).modal('hide');
      });

      $('img', $(this.el)).imagesLoaded().progress( function( instance, image ) {
        if ($(image.img).hasClass('fade_on_load')) {
          $(image.img).css('opacity', 1);
        }
      });

      $('.modal', $(this.el)).on('hide.bs.modal', function (e) {
        if (self.objVideo) {
          self.objVideo.dispose();
          self.objVideo = null;
        }
      });

      var elVideo = $('.media-player:eq(0)', $(this.el));
      if (elVideo.length) {
        self.objVideo = videojs(elVideo.attr('id'));
        self.objVideo.src(elVideo.attr('url'));
        self.objVideo.load();

        self.objVideo.on('play', function() {
          self.objVideo.posterImage.hide();
          self.objVideo.controlBar.show();
          self.objVideo.bigPlayButton.hide();
        });

        self.objVideo.on('ended', function() {
          self.objVideo.posterImage.show();
          $(this.posterImage.contentEl()).show();
          $(this.bigPlayButton.contentEl()).show();
          self.objVideo.currentTime(0);
          self.objVideo.controlBar.hide();
          self.objVideo.bigPlayButton.show();
          self.objVideo.exitFullscreen();
        });
      }

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return MountainStoryModalView;
});

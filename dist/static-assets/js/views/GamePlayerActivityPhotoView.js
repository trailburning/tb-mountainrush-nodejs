define([
  'underscore', 
  'backbone',
  'moment',
  'photoswipe',
  'photoswipeui'
], function(_, Backbone, moment, PhotoSwipe, PhotoSwipeUI_Default){

  var GamePlayerActivityPhotoView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#photoViewTemplate').text());
      
      this.options = options;
      this.nWidth = 0;
      this.nHeight = 0;

      $.fn.getBgImage = function (callback) {
          var path = $(this).css('background-image').match(/^url\("?(.+?)"?\)$/)[1];
          var tempImg = $('<img />').hide().bind('load', function () {
              callback($(this).width(), $(this).height());
              $(this).remove();
          }).appendTo('body').attr('src', path);
      };
    },

    buildPlayerMediaGallery: function() {
      // make sure we know the dimensions
      if (!this.nWidth || !this.nHeight) {
        return;
      }

      var pswpElement = $('.pswp')[0];
      var strExternalURL = '';
      var bIGMedia = false;

      switch (this.options.model.get('type')) {
        case 'InstagramPhoto':
          bIGMedia = true;
          strExternalURL = this.options.model.get('ref');
          break;
      }

      // build items array
      var items = [
        {
          src: this.options.model.get('urls')['640'],
          w: this.nWidth,
          h: this.nHeight,
          title: this.options.model.get('caption'),
          igLink: strExternalURL
        }
      ];

      // define options (if needed)
      var options = {
          index: 0,
          history: false,
          shareEl: false,
          igEl: bIGMedia
      };

      // Initializes and opens PhotoSwipe
      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    },

    render: function(){
      var self = this;

      var dtUploadedDate = new Date(this.options.model.get('uploaded_at'));
      this.options.model.set('uploaded_at_ago', moment(dtUploadedDate).fromNow());

      var attribs = this.options.model.attributes;
      this.el = $(this.template(attribs)).appendTo(this.options.elParent);

      // wait for image to load so we get dimensions
      $('.image', this.el).getBgImage(function (imgW, imgH) {
          self.nWidth = imgW;
          self.nHeight = imgH;
      });

      // handle media requesting viewer
      $('.media', this.el).click(function(evt){
        // fire event
        app.dispatcher.trigger("GamePlayerActivityPhotoView:click");

        self.buildPlayerMediaGallery();
      });

      return this;
    }

  });

  return GamePlayerActivityPhotoView;
});

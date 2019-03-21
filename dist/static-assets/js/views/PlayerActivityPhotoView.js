define([
  'underscore', 
  'backbone',
  'moment',
  'photoswipe',
  'photoswipeui'
], function(_, Backbone, moment, PhotoSwipe, PhotoSwipeUI_Default){

  var PlayerActivityPhotoView = Backbone.View.extend({
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
      this.options.model.set('uploaded_at_time', dtUploadedDate.getTime());

      var attribs = this.options.model.attributes;

      // where to position?
      console.log('uploaded:'+this.options.model.get('uploaded_at_time'));

      var elFoundNextPost = null;

      $('.post', this.options.elParent).each(function(index){
        console.log('check:'+$(this).attr('data-uploaded-time'));
        // is post older?
        if (Number($(this).attr('uploaded_at_time')) > Number(self.options.model.get('uploaded_at_time'))) {
          console.log('INSERT HERE');
          elFoundNextPost = $(this);
          break;
        }

      });

      if (elFoundNextPost) {
        console.log('FOUND PLACE');
        this.el = $(this.template(attribs)).appendTo(this.options.elParent);
      }
      else {
        this.el = $(this.template(attribs)).appendTo(this.options.elParent);
      }


      // wait for image to load so we get dimensions
      $('.image', this.el).getBgImage(function (imgW, imgH) {
          self.nWidth = imgW;
          self.nHeight = imgH;
      });

      // handle media requesting viewer
      $('.media', this.el).click(function(evt){
        // fire event
        app.dispatcher.trigger("PlayerActivityPhotoView:click");

        switch (self.options.model.get('type')) {
          default:
            self.buildPlayerMediaGallery();
            break;
        }
      });

      return this;
    }

  });

  return PlayerActivityPhotoView;
});

define([
  'underscore', 
  'backbone',
  'views/PlayerActivityPhotoView'
], function(_, Backbone, PlayerActivityPhotoView){

  var GamePhotosView = Backbone.View.extend({
    initialize: function(options){
      this.options = options;

      this.jsonPhotos = null;
    },

    render: function(){
      var self = this;

      $.each(this.jsonPhotos, function(index, photo){
        var photoView = new PlayerActivityPhotoView({ elParent: self.el, model: new Backbone.Model(photo) });
        photoView.render();

        // fire event
        app.dispatcher.trigger("PlayerActivityPhotosView:photoRendered", {PlayerActivityPhotosView: self, PlayerActivityPhotoView: photoView});
      });

      // truncate
      $('.truncate', $(this.el)).each(function(index){
        $(this).html($.truncate($(this).html(), {length: $(this).attr('data-truncate')}));
      });

      return this;
    }

  });

  return GamePhotosView;
});

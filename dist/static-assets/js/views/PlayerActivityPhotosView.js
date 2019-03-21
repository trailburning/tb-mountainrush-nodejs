define([
  'underscore', 
  'backbone',
  'views/PlayerActivityPhotoView'
], function(_, Backbone, PlayerActivityPhotoView){

  var PlayerActivityPhotosView = Backbone.View.extend({
    initialize: function(options){
      this.options = options;

      this.jsonPhotos = null;
    },

    load: function(){
      var self = this;

      var url = GAME_API_URL + "game/" + self.options.gameID + "/player/" + self.options.playerID + "/activity/" + self.options.activityID + "/photos";
//      console.log(url);
      $.getJSON(url, function(result){
        self.activityID = self.options.activityID;
        self.jsonPhotos = result;

        // fire event
        app.dispatcher.trigger("PlayerActivityPhotosView:loaded", self);
      });
    },

    render: function(){
      var self = this;

      $.each(this.jsonPhotos, function(index, photo){
        console.log(photo);
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

  return PlayerActivityPhotosView;
});

define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var GamePhotoView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#gamePhotoViewTemplate').text());

      this.options = options;
    },

    render: function(jsonGame){
      var self = this;

      $(this.el).html(this.template({game: jsonGame}));

      return this;
    }

  });

  return GamePhotoView;
});

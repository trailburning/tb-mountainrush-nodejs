define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var MountainLockedStoryModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#mountainLockedStoryModalViewTemplate').text());

      this.options = options;
      this.objVideo = null;
    },

    render: function(playerModel, storyModel){
      var self = this;
      
      $(this.el).html(this.template({player: playerModel.toJSON(), story: storyModel.toJSON()}));

      $('.big-close-btn', $(this.el)).click(function(evt){
        $('.modal', $(self.el)).modal('hide');
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return MountainLockedStoryModalView;
});

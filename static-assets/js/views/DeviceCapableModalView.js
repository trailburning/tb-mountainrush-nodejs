define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var DeviceCapableModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#deviceCapableModalViewTemplate').text());

      this.options = options;
    },

    render: function(playerModel, storyModel){
      var self = this;
      
      $(this.el).html(this.template({player: playerModel.toJSON()}));

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return DeviceCapableModalView;
});

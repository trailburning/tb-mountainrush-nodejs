define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var ActivePlayerView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#activePlayerViewTemplate').text());

      this.options = options;
    },

    render: function(){
      var self = this;

      $(this.el).html(this.template({ player: this.options.player }));

      return this;
    }

  });

  return ActivePlayerView;
});

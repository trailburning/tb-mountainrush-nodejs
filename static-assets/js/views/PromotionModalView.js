define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var PromotionModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#promotionModalViewTemplate').text());

      this.options = options;
    },

    render: function(jsonPlayer){
      var self = this;
      
      $(this.el).html(this.template({player: jsonPlayer}));

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return PromotionModalView;
});

define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var ChallengeCompleteModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengeCompleteModalViewTemplate').text());

      this.options = options;
    },

    render: function(){
      $(this.el).html(this.template());

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return ChallengeCompleteModalView;
});

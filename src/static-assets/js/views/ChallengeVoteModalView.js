define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var ChallengeVoteModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengeVoteModalViewTemplate').text());

      this.options = options;
    },

    render: function(playerModel){
      var self = this;
      
      $(this.el).html(this.template());

      $('.big-close-btn', $(this.el)).click(function(evt){
        $('.modal', $(self.el)).modal('hide');
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return ChallengeVoteModalView;
});

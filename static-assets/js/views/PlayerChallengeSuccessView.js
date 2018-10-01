define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var PlayerChallengeSuccessView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playerChallengeSuccessViewTemplate').text());

      this.options = options;
    },

    render: function(playerModel){
      var attribs = playerModel.toJSON();
      $(this.el).html(this.template(attribs));

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return PlayerChallengeSuccessView;
});

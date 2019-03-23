define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var PlayerDetailView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#playerDetailViewTemplate').text());
    },

    render: function(jsonPlayer){
      var self = this;

      $(this.el).html(this.template({player: jsonPlayer}));

      return this;
    }

  });

  return PlayerDetailView;
});

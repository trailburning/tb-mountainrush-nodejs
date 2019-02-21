define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var SponsorView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#sponsorBigViewTemplate').text());

      this.options = options;
    },
    
    render: function(jsonCurrGame){
      $(this.el).html(this.template({game: jsonCurrGame}));

      return this;
    }

  });

  return SponsorView;
});

define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterGamesView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerGamesViewTemplate').text());

      this.options = options;

      this.jsonFields = {}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields = jsonFields;
    },

    render: function(){
      var self = this;
      
      $(this.el).html(this.template({games: this.jsonFields}));

      return this;
    }

  });

  return RegisterGamesView;
});

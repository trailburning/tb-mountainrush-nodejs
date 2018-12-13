define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var LanguageSelectorView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#languageSelectorViewTemplate').text());

      this.options = options;
    },

    render: function(){
      var self = this;

      $(this.el).html(this.template());

      $('.change-lang', $(this.el)).click(function(evt){
        // change language
        setLangCookie($(this).attr('data-id'));
        window.location.reload(true);

        return false;
      });

      return this;
    }

  });

  return LanguageSelectorView;
});

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

      var strLangSel = 'en';

      if (getLangCookie()) {
        strLangSel = getLangCookie();
      }

      this.jsonLang = { langs: [{name: 'English', value: 'en'}, {name: 'Deutsch', value: 'de'}] };

      var found = this.jsonLang.langs.find(function(lang){
        return lang.value == strLangSel;
      });

      if (found) {
        this.jsonLang.sel = found;
      }

      $(this.el).html(this.template({ lang: this.jsonLang }));

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

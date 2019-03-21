define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var FundraisingShoppingModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#fundraisingShoppingModalViewTemplate').text());

      this.options = options;
    },

    render: function(playerModel){
      var self = this;
      
      $(this.el).html(this.template({player: playerModel.toJSON(), fundraising: this.options.jsonFundraising}));

      $('.big-close-btn', $(this.el)).click(function(evt){
        $('.modal', $(self.el)).modal('hide');
      });

      $('img', $(this.el)).imagesLoaded().progress( function( instance, image ) {
        if ($(image.img).hasClass('fade_on_load')) {
          $(image.img).css('opacity', 1);
        }
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return FundraisingShoppingModalView;
});

define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap, moment){

  var ChallengeCancelModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengeCancelModalViewTemplate').text());

      this.options = options;
    },

    render: function(jsonCurrGame){      
      var self = this;

      $(this.el).html(this.template());

      $('.btn-cancel-challenge', $(this.el)).click(function(evt){
        $('.modal', $(self.el)).modal('hide');

        location.reload();
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }
  });

  return ChallengeCancelModalView;
});

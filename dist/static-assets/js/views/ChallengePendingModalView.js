define([
  'underscore', 
  'backbone',
  'bootstrap',
  'moment'
], function(_, Backbone, bootstrap, moment){

  var ChallengePendingModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#challengePendingModalViewTemplate').text());

      this.options = options;
    },

    render: function(jsonCurrGame){      
      $(this.el).html(this.template({ currGame: jsonCurrGame }));

      var dLocalGameStart = new Date(jsonCurrGame.game_start);

      var strDate = moment(dLocalGameStart).format('dddd MMMM Do');
      $('.date', $(this.el)).html(strDate);

      var strTime = moment(dLocalGameStart).format('h:mm a');
      $('.time', $(this.el)).html(strTime);

//      $('.type', $(this.el)).html(jsonCurrGame.type);

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return ChallengePendingModalView;
});

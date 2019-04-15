define([
  'underscore', 
  'backbone',
  'bootstrap',
  'moment'
], function(_, Backbone, bootstrap, moment){

  var RegisterGameCreatedView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerGameCreatedViewTemplate').text());

      this.options = options;

      this.jsonFields = {campaignID: 0,
                         gameID: 0,
                         playerID: 0,
                         type: '',
                         multiplayer: 0,
                         gameStart: '',
                         gameStartFormatted: {
                          day: '',
                          date: '',
                          month: ''
                         }}
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
      this.jsonFields.gameID = jsonFields.gameID;
      this.jsonFields.playerID = jsonFields.playerID;
      this.jsonFields.type = jsonFields.type;
      this.jsonFields.multiplayer = jsonFields.multiplayer;
      this.jsonFields.gameStart = jsonFields.gameStart;
    },

    render: function(options){
      var self = this;
      
      var jsonFundraising = getFundraisingShoppingList();

      var dLocalGameStart = new Date(this.jsonFields.gameStart);
      // format date
      this.jsonFields.gameStartFormatted.day = moment(dLocalGameStart).format('dddd');
      this.jsonFields.gameStartFormatted.date = moment(dLocalGameStart).format('DD');
      this.jsonFields.gameStartFormatted.month = moment(dLocalGameStart).format('MMMM');

      $(this.el).html(this.template({ campaign: options.jsonCampaign, fields: this.jsonFields, fundraising: jsonFundraising }));

      $('img', $(this.el)).imagesLoaded().progress( function( instance, image ) {
        if ($(image.img).hasClass('fade_on_load')) {
          $(image.img).css('opacity', 1);
        }
      });

      $('.btn-fundraise', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterGameCreatedView:fundraiseClick");
      });

      return this;
    }

  });

  return RegisterGameCreatedView;
});

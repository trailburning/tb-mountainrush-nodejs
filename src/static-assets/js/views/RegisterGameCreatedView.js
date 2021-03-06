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
                         content: 0,
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
      this.jsonFields.content = jsonFields.content;
      this.jsonFields.gameStart = jsonFields.gameStart;
    },

    postrender: function(self){
      $('img', $(self.el)).imagesLoaded().progress( function( instance, image ) {
        if ($(image.img).hasClass('fade_on_load')) {
          $(image.img).css('opacity', 1);
        }
      });

      $('.link-invite', $(self.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterGameCreatedView:inviteClick");
      });

      $('.btn-fundraise', $(self.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterGameCreatedView:fundraiseClick", $(this).attr('data-cause-id'));
      });
    },

    render: function(options){
      var self = this;
      
      var dLocalGameStart = new Date(this.jsonFields.gameStart);
      // format date
      this.jsonFields.gameStartFormatted.day = moment(dLocalGameStart).format('dddd');
      this.jsonFields.gameStartFormatted.date = moment(dLocalGameStart).format('DD');
      this.jsonFields.gameStartFormatted.month = moment(dLocalGameStart).format('MMMM');

      var self = this;

      var url = GAME_API_URL + 'campaign/' + CAMPAIGN_ID + '/fundraising/causes';
//      console.log(url);
      $.getJSON(url, function(result){
        $(self.el).html(self.template({ campaign: options.jsonCampaign, fields: self.jsonFields, causes: result }));
        self.postrender(self);
      });

      return this;
    }

  });

  return RegisterGameCreatedView;
});

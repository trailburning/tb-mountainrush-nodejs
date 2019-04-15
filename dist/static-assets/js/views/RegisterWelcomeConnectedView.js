define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterWelcomeConnectedView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerWelcomeConnectedViewTemplate').text());

      this.options = options;
      this.jsonPlayer = null;
      this.jsonFields = {clientID: 0,
                         playerID: 0,
                         games: {},
                         currGame: 0}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setPlayer: function(clientID, jsonPlayer) {
      this.jsonFields.clientID = clientID;
      this.jsonPlayer = jsonPlayer;
      this.jsonFields.playerID = jsonPlayer.id;
      this.jsonFields.games = jsonPlayer.games;

      // see if there's an active game
      this.jsonFields.currGame = _.where(this.jsonFields.games, {game_state:'active'})[0];
      if (!this.jsonFields.currGame) {
        this.jsonFields.currGame = _.where(this.jsonFields.games, {game_state:'pending'})[0];
      }
    },

    acceptGameInvite: function(gameID, inviteID) {
      var self = this;

      var jsonData = {};

      var url = GAME_API_URL + 'game/' + gameID + '/player/' + this.jsonFields.playerID + '/invite/' + inviteID + '/accept';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          console.log('error');
          console.log(data);
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);
        }
      });
    },

    rejectGameInvite: function(gameID, inviteID) {
      var self = this;

      var jsonData = {};

      var url = GAME_API_URL + 'game/' + gameID + '/player/' + this.jsonFields.playerID + '/invite/' + inviteID + '/reject';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          console.log('error');
          console.log(data);
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);
        }
      });
    },

    render: function(options){
      var self = this;

      var jsonFundraising = getFundraisingShoppingList();

      $(this.el).html(this.template({ campaign: options.jsonCampaign, player: this.jsonPlayer, currGame: self.jsonFields.currGame, fundraising: jsonFundraising }));

      $('img', $(this.el)).imagesLoaded().progress( function( instance, image ) {
        if ($(image.img).hasClass('fade_on_load')) {
          $(image.img).css('opacity', 1);
        }
      });

      $('.btn-create', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterWelcomeConnectedView:createGameClick");
      });

      $('.btn-accept-invite', $(this.el)).click(function(evt){
        var elParent = $(this).closest('.invitation');
        if (elParent.length) {
          $('.invite', elParent).hide();
          $('.invitation-accepted', elParent).show();
        }

        self.acceptGameInvite($(this).attr('data-game-id'), $(this).attr('data-id'));
      });

      $('.btn-reject-invite', $(this.el)).click(function(evt){
        var elParent = $(this).closest('.invitation');
        if (elParent.length) {
          $('.invite', elParent).hide();
          $('.invitation-rejected', elParent).show();
        }

        self.rejectGameInvite($(this).attr('data-game-id'), $(this).attr('data-id'));
      });

      $('.btn-fundraise', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterWelcomeConnectedView:fundraiseClick");
      });

      $('.link-invite', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterWelcomeConnectedView:inviteClick");
      });

      $('.link-cancel', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterWelcomeConnectedView:cancelGameClick");
      });

      $('.btn-prefs', $(this.el)).click(function(evt){
        // fire event
        app.dispatcher.trigger("RegisterWelcomeConnectedView:prefsClick");
      });

      return this;
    }

  });

  return RegisterWelcomeConnectedView;
});

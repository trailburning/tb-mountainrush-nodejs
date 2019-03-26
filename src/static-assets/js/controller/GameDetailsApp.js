var app = app || {};

var MAX_PLAYER_PHOTOS = 3;

define([
  'underscore',
  'backbone',
  'bootstrap', 
  'jqueryUI',
  'jqueryForm',
  'cookie',
  'truncate',
  'modernizr',
  'imageScale',
  'moment',
  'countdown',  
  'imagesLoaded',
  'videojs',
  'views/GamePhotoView',
  'views/SponsorView',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/Player',
  'views/ChallengeView',
  'views/PlayersOverviewView',
  'views/PlayerActivityPhotosView',
  'views/ChallengeCancelModalView',
  'views/GameInviteView',  
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, jqueryUI, jqueryForm, cookie, truncate, modernizr, imageScale, moment, countdown, imagesLoaded, videojs, GamePhotoView, SponsorView, LanguageSelectorView, ActivePlayerView, Player, ChallengeView, PlayersOverviewView, PlayerActivityPhotosView, ChallengeCancelModalView, GameInviteView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    app.dispatcher.on("PlayersOverviewView:inviteClick", onPlayerInviteClick);
    app.dispatcher.on("PlayersOverviewView:cancelGameClick", onCancelGameClick);
    app.dispatcher.on("ChallengeCancelModalView:challengeCancelled", onChallengeCancelled);
    app.dispatcher.on("PlayersOverviewView:playerClick", onPlayerClicked);
    app.dispatcher.on("PlayerActivityPhotosView:loaded", onPlayerActivityPhotosLoaded);
    app.dispatcher.on("PlayerActivityPhotosView:photoRendered", onPlayerActivityPhotosPhotoRendered);

    var challengeView = null;
    var mountainModel = new Backbone.Model();
    var nPlayersLoaded = 0;
    var playerCollection = null;
    var activePlayer = null;
    var jsonCurrGame = null;
    var fundraisingTarget = 0, totalRaisedOnline = 0;

    var geojsonFeature = {
      "type": "LineString",
      "properties": {
        "fill": "#ed1c24",
        "fill-opacity": 1,
        "stroke": "#ed1c24",
        "stroke-width": 4,
        "stroke-opacity": 1        
      },
      "coordinates": []
    };
  
    // are we fundraising?
    if (GAME_FUNDRAISING) {
      $('body').addClass('fundraising');
    }

    $('#loader-view').show();
  
    function getActivePlayerByToken(playerToken) {
      var url = GAME_API_URL + "client/" + CLIENT_ID + "/playertoken/" + playerToken;
//      console.log(url);
      $.getJSON(url, function(result){
        onActivePlayerLoaded(result[0].id);
      });
    }

    function getPlayers() {
      app.dispatcher.on("Player:loaded", onPlayerLoaded);

      // get player activity data
      playerCollection.each(function(model){
        var player = new Player({ model: model, gameID: GAME_ID, journeyLength: mountainModel.get('distance'), journeyAscent: jsonCurrGame.ascent });

        player.getProgress();
        model.set('playerObj', player);
      });
    }

    function getGame() {
      app.dispatcher.on("ChallengeView:ready", onGameLoaded);

      challengeView = new ChallengeView({ gameID: GAME_ID });
      challengeView.load();
    }

    function buildGame() {
      playersOverviewView = new PlayersOverviewView({ el: '#players-overview-view', jsonGame: jsonCurrGame, playerCollection: playerCollection, activePlayer: activePlayer });
      // set team fundraising
      var jsonFields = playersOverviewView.getFields();
      jsonFields.currencySymbol = jsonCurrGame.fundraising_currency_symbol;
      jsonFields.totalRaisedPercentageOfFundraisingTarget = Math.round(Number((totalRaisedOnline / fundraisingTarget) * 100));
      jsonFields.totalRaisedOnline = Math.round(totalRaisedOnline);
      jsonFields.fundraisingTarget = Math.round(fundraisingTarget);
      playersOverviewView.setFields(jsonFields);
      playersOverviewView.render();

      // set team fundraising
      var jsonFields = sponsorView.getFields();
      jsonFields.currencySymbol = jsonCurrGame.fundraising_currency_symbol;
      jsonFields.totalRaisedPercentageOfFundraisingTarget = Math.round(Number((totalRaisedOnline / fundraisingTarget) * 100));
      jsonFields.totalRaisedOnline = Math.round(totalRaisedOnline);
      jsonFields.fundraisingTarget = Math.round(fundraisingTarget);
      sponsorView.setFields(jsonFields);      
      sponsorView.render(jsonCurrGame);

      // convert UTC dates to local
      var dLocalGameNow = new Date(jsonCurrGame.game_now);
      var dLocalGameStart = new Date(jsonCurrGame.game_start);
      var dLocalGameEnd = new Date(jsonCurrGame.game_end);

      // is game active?
      if ((dLocalGameStart < dLocalGameNow) || Demo) {
        var elCountdownContainer = $('.countdown-container');
        var strDay = elCountdownContainer.attr('data-value-day');
        var strDays = elCountdownContainer.attr('data-value-days');

        // finished?
        if (dLocalGameEnd < dLocalGameNow) {
          elCountdownContainer.show();
        }

        $('.countdown .end').countdown(dLocalGameEnd).on('update.countdown', function(event) {
          var $this = $(this).html(event.strftime(''
            + '<span class="days">'
              + '<span class="time">%-D</span>'
              + '<span class="days-marker"> ' + ((Number(event.strftime('%-D')) == 1) ? strDay : strDays) + '</span>'
            + '</span>'
            + '<span class="hours">'
              + '<span class="time"><span>%H</span><span class="marker">:</span><span>%M</span><span class="marker">:</span><span>%S</span></span>'
            + '</span>'));
          elCountdownContainer.show();
        });
      }

      var elPhotos = $('#players-overview-view .posts .photos');

      // get players
      playerCollection.each(function(model){
        model.set('activityPhotosRendered', 0);
        // get activities
        $.each(model.get('activities'), function(index, activity){
          var playerActivityPhotosView = new PlayerActivityPhotosView({ el: elPhotos, gameID: GAME_ID, playerID: model.get('id'), activityID: activity.activity, player: model });
          playerActivityPhotosView.load();
        });
      });

      $('img.scale').imageScale({
        'rescaleOnResize': true
      });

      var elImages = $('body');
      var imgLoad = imagesLoaded(elImages);
      imgLoad.on('always', function(instance) {
        for ( var i = 0, len = imgLoad.images.length; i < len; i++ ) {
          if ($(imgLoad.images[i].img).hasClass('scale')) {
            $(imgLoad.images[i].img).parent().addClass('ready');
          }
        }
      });    

      $('#player-view').show();
      // ready for action
      $('body').addClass('ready');
    }

    function onPlayerInviteClick() {
      var jsonCreateFields = gameInviteView.getFields();
      jsonCreateFields.gameID = GAME_ID;
      gameInviteView.setFields(jsonCreateFields);
      gameInviteView.render();

      $('#invite-friend-modal-view .modal').modal();
    }

    function onGameLoaded(jsonGame) {
      jsonCurrGame = jsonGame;

      if (jsonGame.description) {
        jsonGame.description_formatted = formatText(jsonGame.description);
      }

      playerCollection = new Backbone.Collection(jsonGame.players);

      // are we a single player game?
      if (jsonGame.players.length == 1) {
        $('body').addClass('single-player');
      }

      // are we a sponsored game?
      if (jsonGame.sponsored) {
        $('body').addClass('sponsored');
      }

      challengeCancelModalView.setGame(jsonCurrGame);

      gamePhotoView.render(jsonCurrGame);

      getJourney(jsonGame.journeyID, jsonGame.mountain3DName);
    }

    function getJourney(journeyID, mountain3DName) {
      var self = this;

      var url = TB_API_URL + '/journeys/' + journeyID + TB_API_EXT;
//      console.log(url);
      $.getJSON(url, function(result){
        var jsonJourney = result.body.journeys[0];
        mountainModel = new Backbone.Model(jsonJourney);

        // build geoJSON route
        $.each(mountainModel.get('route_points'), function(index) {
          geojsonFeature.coordinates.push(this.coords);
        });

        getPlayers();
      });
    }

    function onActivePlayerLoaded(playerID) {
      var player = playerCollection.get(playerID);
      if (player) {
        activePlayer = player;
      }
      buildGame();

      //190326 mla - temp show upload for testing
      if (playerID == 'b31r7RZ7Xo') {
        $('#asset-upload').show();
      }
    }

    function onPlayerLoaded(model) {
      // update fundraising
      fundraisingTarget += Number(model.get('fundraising_goal'));
      totalRaisedOnline += Number(model.get('fundraising_raised'));

      // default to complete
      var fProgress = mountainModel.get('distance');
      // if not complete then calc how far
      if (model.get('elevationGainPercent') < 100) {
        fProgress = (model.get('elevationGainPercent') * mountainModel.get('distance')) / 100;
      }

      model.set('progress', fProgress);
      // modify avatar to use image proxy with campaign fallback
      model.set('avatar', GAME_API_URL + 'imageproxy.php?url=' + model.get('avatar') + '&urlfallback=http://mountainrush.co.uk/static-assets/images/' + CAMPAIGN_TEMPLATE + '/avatar_unknown.jpg');

      nPlayersLoaded++;

      // we now have all player data!
      if (nPlayersLoaded == playerCollection.length) {
        onPlayersLoaded();
      }
    }

    function onPlayersLoaded() {
      // sort by progress
      playerCollection.comparator = function(model) {
        return -model.get('progress');
      }
      playerCollection.sort();

      // sub sort by when ascent completed
      playerCollection.comparator = function(model) {
        if (model.get('ascentCompleted')) {
          return Date.parse(model.get('ascentCompleted'));
        }
      }
      playerCollection.sort();

      // fill in extra player data
      var nPos = 1;
      playerCollection.each(function(model){
        model.set('imagePath', model.get('avatar'));
        model.set('step', nPos);

        nPos++;
      });

      // check for active player
      if (getUserCookie(CLIENT_ID) != undefined) {
        getActivePlayerByToken(getUserCookie(CLIENT_ID));
      }
      else {
        buildGame();
      }
    }

    function onCancelGameClick() {
      challengeCancelModalView.render();
      challengeCancelModalView.show();
    }

    function onChallengeCancelled() {
      // visit profile
      window.location.href = HOST_URL+'/campaign/' + CAMPAIGN_ID + '/profile';
    }

    function onPlayerClicked(playerID) {
      // visit profile
      window.location.href = HOST_URL+'/game/' + GAME_ID + '/player/' + playerID;
    }

    function onPlayerActivityPhotosLoaded(playerActivityPhotosView) {
      if (playerActivityPhotosView.jsonPhotos.length) {
        $('#players-overview-view .with-photos').show();
        $('#players-overview-view .without-photos').hide();

        var playerModel = playerActivityPhotosView.getPlayer();
        var nPhotoRendered = Number(playerModel.get('activityPhotosRendered'));
        // have we reached the player render limit?
        if (nPhotoRendered < MAX_PLAYER_PHOTOS) {
          playerModel.set('activityPhotosRendered', nPhotoRendered+1);
          // render
          playerActivityPhotosView.render(1).el;
        }
      }
    }

    function onPlayerActivityPhotosPhotoRendered(params) {
    }

    $('#loader-view').show();

    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      var jsonUser = getUserCookies(CLIENT_ID);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }

    $('.signout').click(function(evt){
      removeUserCookie(CLIENT_ID);
    });

    $('.demo-video').click(function(evt){
      demoVideoView.render();
      demoVideoView.show();
    });

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();

    enableUserActions(CLIENT_ID);

    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var gamePhotoView = new GamePhotoView({ el: '#photo-view' }); 
    var challengeCancelModalView = new ChallengeCancelModalView({ el: '#challenge-cancel-modal-view' });
    var gameInviteView = new GameInviteView({ el: '#game-invite-view', clientID: CLIENT_ID });
    var sponsorView = new SponsorView({ el: '#sponsor-big-container-view' });

    getGame();
  };

  return { 
    initialize: initialize
  };
});
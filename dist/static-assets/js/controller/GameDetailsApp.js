var app = app || {};

define([
  'underscore',
  'backbone',
  'bootstrap', 
  'jqueryUI',
  'cookie',
  'truncate',
  'modernizr',
  'imageScale',
  'turf',
  'moment',
  'countdown',  
  'imagesLoaded',
  'videojs',
  'mapbox',
  'views/SponsorView',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/Player',
  'views/ChallengeView',
  'views/PlayersListView',
  'views/ChallengeCancelModalView',
  'views/GameInviteView',  
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, jqueryUI, cookie, truncate, modernizr, imageScale, turf, moment, countdown, imagesLoaded, videojs, mapbox, SponsorView, LanguageSelectorView, ActivePlayerView, Player, ChallengeView, PlayersListView, ChallengeCancelModalView, GameInviteView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    app.dispatcher.on("ChallengeCancelModalView:challengeCancelled", onChallengeCancelled);

    var challengeView = null;
    var mountainModel = new Backbone.Model();
    var nPlayersLoaded = 0;
    var playerCollection = null;
    var activePlayer = null;
    var jsonCurrGame = null;
    var map = null;

    var geojsonFeature = {
      "type": "LineString",
      "coordinates": []
    };
  
    var myStyle = {
      "color": "#ed1c24",
      "weight": 4,
      "opacity": 1
    };

    function getActivePlayerByToken(playerToken) {
      var url = GAME_API_URL + "client/" + CLIENT_ID + "/playertoken/" + playerToken;
//      console.log(url);
      $.getJSON(url, function(result){
        onActivePlayerLoaded(result[0].id);
      });
    }

    function setupMap() {
      L.mapbox.accessToken = 'pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A';
/*
https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/13.38886,52.517037.json?&access_token=pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A
https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/13.432159,52.526385.json?&access_token=pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A
*/
      var point = geojsonFeature.coordinates[Math.round(geojsonFeature.coordinates.length / 2)];
      map = L.mapbox.map('mapbox-view', 'mallbeury.8d4ad8ec', {dragging: true, touchZoom: false, scrollWheelZoom: false, doubleClickZoom:false, boxZoom:false, tap:false, zoomControl:false, zoomAnimation:false, attributionControl:false})
      .setView([point[1], point[0]], 13);
      var polyline = L.geoJson(geojsonFeature, {style: myStyle}).addTo(map);

      // now allow player to click map
      $('#loader-view').hide();
      $('#map-view .overlay-loader-view').hide();
      $('#map-view .map-overlay').hide();
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
      playersListView = new PlayersListView({ el: '#players-list-view', jsonGame: jsonCurrGame, playerCollection: playerCollection, activePlayer: activePlayer });
      playersListView.render();

      $('#player-view').show();
      // ready for action
      $('body').addClass('ready');
    }

    function onGameLoaded(jsonGame) {
      jsonCurrGame = jsonGame;

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

      sponsorView.render(jsonCurrGame);

      // convert UTC dates to local
      var dLocalGameNow = new Date(jsonGame.game_now);
      var dLocalGameStart = new Date(jsonGame.game_start);
      var dLocalGameEnd = new Date(jsonGame.game_end);

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

        setupMap();
        getPlayers();
      });
    }

    function onActivePlayerLoaded(playerID) {
      var player = playerCollection.get(playerID);
      if (player) {
        activePlayer = player;
      }
      buildGame();
    }

    function onPlayerLoaded(model) {
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

    var challengeCancelModalView = new ChallengeCancelModalView({ el: '#challenge-cancel-modal-view' });
    var gameInviteView = new GameInviteView({ el: '#game-invite-view', clientID: CLIENT_ID });
    var sponsorView = new SponsorView({ el: '#sponsor-big-container-view' });

    $('img.scale').imageScale({
      'rescaleOnResize': true,
      'align': 'top'
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

    getGame();
  };

  return { 
    initialize: initialize
  };
});
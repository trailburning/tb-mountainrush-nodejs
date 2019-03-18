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
  'imagesLoaded',
  'videojs',
  'mapbox',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/ChallengeView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, jqueryUI, cookie, truncate, modernizr, imageScale, turf, imagesLoaded, videojs, mapbox, LanguageSelectorView, ActivePlayerView, ChallengeView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var jsonCurrGame = null;
    var playerCollection = null;
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

    function setupMap() {
      var self = this;

      L.mapbox.accessToken = 'pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A';
/*
https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/13.38886,52.517037.json?&access_token=pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A
https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/13.432159,52.526385.json?&access_token=pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A
*/
      var point = geojsonFeature.coordinates[Math.round(geojsonFeature.coordinates.length / 2)];
      map = L.mapbox.map('mapbox-view', 'mallbeury.8d4ad8ec', {dragging: true, touchZoom: false, scrollWheelZoom: false, doubleClickZoom:false, boxZoom:false, tap:false, zoomControl:false, zoomAnimation:false, attributionControl:false})
      .setView([point[1], point[0]], 14);
      var polyline = L.geoJson(geojsonFeature, {style: myStyle}).addTo(map);

      // now allow player to click map
      $('#loader-view').hide();
      $('#map-view .overlay-loader-view').hide();
      $('#map-view .map-overlay').hide();
    }

    function getGame() {
      app.dispatcher.on("ChallengeView:ready", onGameLoaded);

      challengeView = new ChallengeView({ gameID: GAME_ID });
      challengeView.load();
    }

    function onGameLoaded(jsonGame) {
      jsonCurrGame = jsonGame;

      playerCollection = new Backbone.Collection(jsonGame.players);

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

        // ready for action
        $('body').addClass('ready');        
      });
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
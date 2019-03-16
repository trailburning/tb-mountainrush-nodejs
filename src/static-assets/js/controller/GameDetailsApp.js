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
  'mapboxgl',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/ChallengeView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, jqueryUI, cookie, truncate, modernizr, imageScale, turf, imagesLoaded, videojs, mapboxgl, LanguageSelectorView, ActivePlayerView, ChallengeView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;
    var jsonCurrGame = null;
    var playerCollection = null;

    function setupMap(jsonRoute) {
/*
https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/13.38886,52.517037.json?&access_token=pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A

https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/13.432159,52.526385.json?&access_token=pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A
*/

      var nMidPoint = Math.round(jsonRoute.source.data.geometry.coordinates.length / 2);
      var point = jsonRoute.source.data.geometry.coordinates[nMidPoint];

      mapboxgl.accessToken = 'pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A';
      var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g', // the outdoors-v10 style but without Hillshade layers
      center: [point[0], point[1]],
      zoom: 11
      });
       
      map.on('load', function () {
        map.addSource('dem', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.terrain-rgb"
        });
        map.addLayer({
        "id": "hillshading",
        "source": "dem",
        "type": "hillshade"
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
        }, 'waterway-river-canal-shadow');

        map.addLayer(jsonRoute);
      });
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
      var url = TB_API_URL + '/journeys/' + journeyID + TB_API_EXT;
//      console.log(url);
      $.getJSON(url, function(result){
        var jsonJourney = result.body.journeys[0];
        mountainModel = new Backbone.Model(jsonJourney);

        jsonRoute = {
          "id": "route",
          "type": "line",
          "source": {
            "type": "geojson",
            "data": {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": []
              }
            }
          },
          "layout": {
          "line-join": "round",
          "line-cap": "round"
          },
          "paint": {
          "line-color": "#f75f36",
          "line-width": 2
          }
        };

        // build geoJSON route
        $.each(mountainModel.get('route_points'), function(index) {
          jsonRoute.source.data.geometry.coordinates.push(this.coords);
        });
        // set distance
        mountainModel.set('distance', turf.length(jsonRoute.source.data, {units: 'kilometers'}));
        console.log(mountainModel.get('distance'));
        setupMap(jsonRoute);
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
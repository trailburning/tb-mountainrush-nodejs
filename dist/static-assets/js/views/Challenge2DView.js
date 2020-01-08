var SEASON_SUMMER_EUROPE  = 0;
var SEASON_WINTER_EUROPE  = 1;
var SEASON_SUMMER_EQUATOR  = 2;

var ROUTE_ID = 3000;
var FLAG_ID = 4000;

var STATE_INIT = 0;
var STATE_READY = 1;
var STATE_SELECT_PLAYER = 2;
var STATE_SELECT_PLAYER_NO_SELECT = 3;
var STATE_SELECT_PLAYER_AND_ORBIT = 4;

var MOUNTAIN_TYPE_GULLYS = 0;
var MOUNTAIN_TYPE_SMOOTH = 1;

var MARKER_FADE_DISTANCE = 10000;

define([
  'underscore', 
  'backbone',
  'turf',
  'mapboxgl'
], function(_, Backbone, turf, mapboxgl){

  var Challenge3DView = Backbone.View.extend({
    initialize: function(options){
      this.options = options;

      this.nState = STATE_INIT;
      this.timeoutID = null;
      this.playerCollection = null;
      this.arrMarkers = new Array;
      this.jsonRoute = null;
      this.jsonFlag = null;
      this.bFlagVisible = false;
      this.currPlayerID = null;
      this.arrRouteCoords = null;

      mapboxgl.accessToken = 'pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A';
    },

    hide: function(){
      $(this.el).hide();
    },

    show: function(){
      $(this.el).show();
    },

    changeState: function(){
      var self = this;

      switch (this.nState) {
        case STATE_INIT:
          this.nState = STATE_READY;

          // fire event
          app.dispatcher.trigger("Challenge2DView:onFeaturesLoaded");
          break;

        case STATE_SELECT_PLAYER:
          this.nState = STATE_READY;

          var coords = this.playerCollection.get(this.currPlayerID).get('jsonPlayer').features[0].geometry.coordinates;
//          Procedural.focusOnLocation( {latitude: coords[1], longitude: coords[0], distance: 6000} );
          break;

        case STATE_SELECT_PLAYER_NO_SELECT:
          break;

        case STATE_SELECT_PLAYER_AND_ORBIT:
          var coords = this.playerCollection.get(this.currPlayerID).get('jsonPlayer').features[0].geometry.coordinates;
//          Procedural.focusOnLocation( {latitude: coords[1], longitude: coords[0], distance: 2000, angle: 20, animationDuration: 3} );
          break;

        default:
          break;
      }
    },

    showBaseData: function(){
      var mapPoints = new Array;
      $.each(this.arrRouteCoords, function(index, point){
        mapPoints.push(new Array([point.coords[0]], [point.coords[1]]));
      });

      this.map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": mapPoints
            }
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#f75f36",
          "line-width": 3
        }
      });

      this.showFlag();

      this.changeState();
    },

    addRouteData: function(arrRouteCoords){
      this.arrRouteCoords = arrRouteCoords;

      this.jsonRoute = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      };

      var self = this;
      $.each(arrRouteCoords, function(index) {
        self.jsonRoute.geometry.coordinates.push(this.coords);
      });
    },

    selectPlayer: function(id, bOrbitPlayer){
      var player = null;

      if (this.timeoutID) {
        window.clearTimeout(this.timeoutID);
      }

      this.nState = STATE_SELECT_PLAYER;

      if (bOrbitPlayer) {
        this.nState = STATE_SELECT_PLAYER_AND_ORBIT;
        this.hideFlag();
      }
      else {
        this.showFlag();
      }

      // remove current player
      if (this.currPlayerID) {
        player = this.playerCollection.get(this.currPlayerID);
        this.hidePlayer(this.currPlayerID);
      }

      this.currPlayerID = id;

      this.showPlayer(this.currPlayerID);
    },

    selectPlayerNoSelect: function(id){
      var player = null;

      if (this.timeoutID) {
        window.clearTimeout(this.timeoutID);
      }

      this.nState = STATE_SELECT_PLAYER_NO_SELECT;

      this.showFlag();

      // remove current player
      if (this.currPlayerID) {
        player = this.playerCollection.get(this.currPlayerID);
        this.hidePlayer(this.currPlayerID);
      }

      this.currPlayerID = id;

      this.showPlayer(this.currPlayerID);
    },

    selectMarker: function(nID){
//      Procedural.focusOnFeature(MARKER_BASE_ID + nID);
    },

    hideMarkers: function(){
      $.each(this.arrMarkers, function(index, jsonMarker){
        jsonMarker.eventMarker.remove();
      });
    },

    showMarkers: function(){
      var self = this;

      $.each(this.arrMarkers, function(index, jsonMarker){
        // mla
        jsonMarker.eventMarker.addTo(self.map);
      });
    },

    buildMarkerOff: function(id, fLat, fLong, strMarkerImageOff, nFadeDistance){
      var jsonMarker = {
        "name": id,
        "features": [
          {
            "geometry": {
              "type": "Point",
              "coordinates": [ fLong, fLat ]
            },
            "type": "Feature",
            "id": id,
            "properties": {
              "image": strMarkerImageOff,
              "height": 24,
              "width": 24,
            }
          }
        ]
      }
      return jsonMarker;
    },

    buildMarkerOn: function(id, fLat, fLong, strMarkerImage, strMarkerImageOn, nFadeDistance){
      var jsonMarker = {
        "name": id,
        "features": [
          {
            "geometry": {
              "type": "Point",
              "coordinates": [ fLong, fLat ]
            },
            "type": "Feature",
            "id": id,
            "properties": {
              "image": strMarkerImageOn,
              "height": 24,
              "width": 24,
            }
          },
          {
            "geometry": {
              "type": "Point",
              "coordinates": [ fLong, fLat ]
            },
            "type": "Feature",
            "id": id,
            "properties": {
              "image": strMarkerImage,
              "height": 48,
              "width": 48,
            }
          }
        ]
      }

      return jsonMarker;
    },

    addMarker: function(id, coord, fProgressKM, strMarkerImage, strMarkerImageOn, strMarkerImageOff){
      var pt = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": []
        }
      }

      // look for point on line
      pt.geometry.coordinates[0] = coord[0];
      pt.geometry.coordinates[1] = coord[1];

      var snapped = turf.pointOnLine(this.jsonRoute, pt);

      fLat = snapped.geometry.coordinates[1];
      fLong = snapped.geometry.coordinates[0];

      // slice route at point
      var ptStart = turf.point([this.jsonRoute.geometry.coordinates[0][0], this.jsonRoute.geometry.coordinates[0][1]]);
      var ptMarker = turf.point([fLong, fLat]);
      var sliced = turf.lineSlice(ptStart, ptMarker, this.jsonRoute.geometry);

      var fMarkerKM = turf.length(sliced, {units: 'kilometers'});
      var bEnable = false;

      if (Number(fProgressKM) >= Number(fMarkerKM)) {
        bEnable = true;
      }

      if (bEnable) {
        jsonMarker = this.buildMarkerOn(id, fLat, fLong, strMarkerImage, strMarkerImageOn, MARKER_FADE_DISTANCE);
      }
      else {
        jsonMarker = this.buildMarkerOff(id, fLat, fLong, strMarkerImageOff, MARKER_FADE_DISTANCE);
      }
      this.arrMarkers.push(jsonMarker);

      var el = document.createElement('div');
      el.className = 'marker-event';
      el.innerHTML = '<div class="marker-image"><img src="' + jsonMarker.features[0].properties.image + '"></div>';
      var nYOffset = 0;

      // enabled so add event marker
      if (bEnable) {
        el.innerHTML = '<div class="avatar-container"><div class="avatar"><img src="' + jsonMarker.features[1].properties.image + '"></div></div>' + el.innerHTML;
        nYOffset = -50;
      }

      var point = jsonMarker.features[0].geometry.coordinates;

      jsonMarker.eventMarker = new mapboxgl.Marker(el)
          .setLngLat(point)
          .setOffset([0, nYOffset]);

      // store id
      jsonMarker.eventMarker.getElement().setAttribute('data-id', id);
      // handle click
      jsonMarker.eventMarker.getElement().addEventListener('click', function(evt) {
        // fire event
        app.dispatcher.trigger("Challenge2DView:onFeatureClicked", $(this).attr('data-id'));
      });

      return bEnable;
    },

    showFlag: function() {
      if (!this.bFlagVisible) {
        this.bFlagVisible = true;

        this.jsonFlag.flagMarker.addTo(this.map);
      }
    },

    hideFlag: function() {
      if (this.bFlagVisible) {
        this.bFlagVisible = false;

        this.jsonFlag.flagMarker.remove();
      }
    },

    addFlag: function(strImage, bRender) {
      var fLat = this.jsonRoute.geometry.coordinates[this.jsonRoute.geometry.coordinates.length-1][1];
      var fLong = this.jsonRoute.geometry.coordinates[this.jsonRoute.geometry.coordinates.length-1][0];

      var jsonFlag = {
        "name": FLAG_ID,
        "features": [ {
          "geometry": {
            "type": "Point",
            "coordinates": [ fLong, fLat ]
          },
          "type": "Feature",
          "id": FLAG_ID,
          "properties": {
            "image": strImage,
            "height": 39,
            "width": 32,
          }
        }
        ]
      }

      var el = document.createElement('div');
      el.className = 'marker-flag';
      el.innerHTML = '<img src="' + jsonFlag.features[0].properties.image + '">';

      var point = jsonFlag.features[0].geometry.coordinates;

      jsonFlag.flagMarker = new mapboxgl.Marker(el)
          .setLngLat(point)
          .setOffset([0, -19]);

      this.jsonFlag = jsonFlag;
    },

    showPlayer: function(id){
      var player = this.playerCollection.get(id);
      var jsonPlayer = player.get('jsonPlayer');

      jsonPlayer.playerMarker.addTo(this.map);

      var point = jsonPlayer.features[0].geometry.coordinates;
      this.map.flyTo({ center: point, zoom: 14, speed: 0.5 });
    },

    hidePlayer: function(id){
      var player = this.playerCollection.get( id );
      var jsonPlayer = player.get('jsonPlayer');

      jsonPlayer.playerMarker.remove();
    },

    addPlayers: function(playerCollection, activePlayer){
      this.activePlayer = activePlayer;
      var self = this;
      var jsonPlayer = null;
      var bMultiPlayer = false;

      if (playerCollection.length > 1) {
        bMultiPlayer = true;
      }

      this.playerCollection = playerCollection;

      this.playerCollection.each(function(model, index){
        var bAllowPlayerSelect = true;
        jsonPlayer = self.buildPlayerJSON(model.get('id'), model.get('progress'), model.get('imagePath'), index+1, bMultiPlayer, bAllowPlayerSelect, MARKER_FADE_DISTANCE);

        model.set('jsonPlayer', jsonPlayer);
      });
    },

    buildPlayerJSON: function(id, fProgressKM, strAvatar, nPosLabel, bShowPosLabel, bAllowPlayerSelect, nFadeDistance) {
      var along = turf.along(this.jsonRoute, fProgressKM, {units: 'kilometers'});
      var fLat = along.geometry.coordinates[1];
      var fLong = along.geometry.coordinates[0];
      var bPlayerOverlapsMarker = false;

      // see if the active player overlaps a marker
      var nOverlapYAdjust = 0, nOverlapCaretYAdjust = 0, nOverlapPosYAdjust = 0, nDecimalPlaces = 3;
      if (this.activePlayer) {
        if (id == this.activePlayer.get('id')) {
          $.each(this.arrMarkers, function(index, jsonMarker){
            if (fLat == jsonMarker.features[0].geometry.coordinates[1] && (fLong = jsonMarker.features[0].geometry.coordinates[0])) {
              bPlayerOverlapsMarker = true;
            }
          });
        }
      }

      var jsonPlayer = {
        "name": id,
        "features": [
          {
            "geometry": {
              "type": "Point",
              "coordinates": [fLong, fLat]
            },
            "type": "Feature",
            "id": id,
            "properties": {
              "image": strAvatar,
              "height": 64,
              "width": 64,
            }
          },
          {
            "geometry": {
              "type": "Point",
              "coordinates": [ fLong, fLat ]
            },
            "type": "Feature",
            "id": id,
            "properties": {
              "name": String(nPosLabel),
              "background": "#44b6f7"
            }
          }
        ]
      }

      if (!bShowPosLabel) {
        jsonPlayer = {
          "name": id,
          "features": [
            {
              "geometry": {
                "type": "Point",
                "coordinates": [ fLong, fLat ]
              },
              "type": "Feature",
              "id": id,
              "properties": {
                "image": strAvatar,
                "height": 64,
                "width": 64,
              }
            }
          ]
        }
      }

      var jsonPlayerAvatar = jsonPlayer.features[0];

      var el = document.createElement('div');
      el.className = 'marker-player';
      el.innerHTML = '<div class="avatar-container"><div class="avatar"><img src="' + jsonPlayerAvatar.properties.image + '"></div></div>';

      // more than one feature means we want to render the position
      if (jsonPlayer.features.length > 1) {
        var jsonPlayerPos = jsonPlayer.features[1];

        el.innerHTML += '<div class="pos" style="background: ' + jsonPlayerPos.properties.background + '">' + jsonPlayerPos.properties.name + '</div>';
      }

      var point = jsonPlayerAvatar.geometry.coordinates;

      jsonPlayer.playerMarker = new mapboxgl.Marker(el)
          .setLngLat(point)
          .setOffset([0, -30]);

      return jsonPlayer;
    },

    focusLocation: function(fLat, fLong) {
      this.map.flyTo({ center: [fLong, fLat], zoom: 14, speed: 0.5 });
    },

    render: function(){
      var self = this;

      this.map = new mapboxgl.Map({
        container: this.el, // container id
        style: 'mapbox://styles/mallbeury/ck4i4tr9q0gir1co28gaq1fmo',
        center: [self.options.arrMapPoint[0], self.options.arrMapPoint[1]],
        zoom: 12,
        interactive: true,
        attributionControl: false
      });

      this.map.on('load', function () {
        // fire event
        app.dispatcher.trigger("Challenge2DView:onLocationLoaded");
      });

      return this;
    }

  });

  return Challenge3DView;
});

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
      this.changeState();

      this.showFlag();
    },

    addRouteData: function(arrRouteCoords){
      this.arrRouteCoords = arrRouteCoords;
    },

    selectPlayer: function(id, bOrbitPlayer){
    },

    showMarkers: function() {
    },

    showFlag: function() {
    },

    addFlag: function(strImage, bRender) {
    },

    hideFlag: function() {
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
    },

    render: function(){
      var self = this;

      this.map = new mapboxgl.Map({
        container: this.el, // container id
        style: 'mapbox://styles/mallbeury/cju5ji8pi0tay1fqixz92aqy8', // outdoors custom
        center: [self.options.arrMapPoint[0], self.options.arrMapPoint[1]], // starting position
        zoom: 12,
        pitch: 50,
        interactive: true,
        attributionControl: false
      });

      // fire event
      app.dispatcher.trigger("Challenge2DView:onLocationLoaded");

      return this;
    }

  });

  return Challenge3DView;
});

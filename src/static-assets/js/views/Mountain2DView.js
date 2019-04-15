var STATE_INIT = 0;
var STATE_READY = 1;

define([
  'underscore', 
  'backbone',
  'turf',
  'mapboxgl'
], function(_, Backbone, turf, mapboxgl){

  var Mountain2DView = Backbone.View.extend({
    initialize: function(options){
      this.options = options;

      this.nState = STATE_INIT;
      this.timeoutID = null;
      this.map = null;
      this.playerCollection = null;
      this.arrMarkers = new Array;
      this.jsonRoute = null;
      this.jsonFlag = null;
      this.bFlagVisible = false;
      this.currPlayerID = null;
      this.arrRoutePoints = null;

      // fire event
      app.dispatcher.trigger("Mountain2DView:onLocationLoaded");
    },

    hide: function(){
      $(this.el).hide();
    },

    show: function(){
      $(this.el).show();
    },

    addRouteData: function(arrRoutePoints){
      this.arrRoutePoints = arrRoutePoints;

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
              "coordinates": this.arrRoutePoints
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
    },

    addFlag: function(strImage, bRender) {
    },

    showBaseData: function() {
    },

    addPlayers: function(playerCollection, activePlayer){
      var self = this;

      function addMarker(strMarkerImage, positionPercent, bEnabled) {
        var nPos = Math.floor(((self.arrRoutePoints.length-1) * positionPercent) / 100);
        var point = self.arrRoutePoints[nPos];

        var strImage = 'http://mountainrush.trailburning.com/static-assets/images/markers/marker-event-locked.png';
        if (bEnabled) {
          strImage = 'http://mountainrush.trailburning.com/static-assets/images/markers/marker-event-unlocked.png';
        }

        var strMarkerImage = GAME_API_URL + '/imageproxy.php?url=' + strMarkerImage + '&amp;urlfallback=https://mountainrush.co.uk/static-assets/images/wwf-uk/avatar_unknown.jpg';

        var el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = '<img src="' + strImage + '">';

        new mapboxgl.Marker(el)
          .setLngLat(point)
          .setOffset([0, -12])
          .addTo(self.map);

        if (bEnabled) {
          var el = document.createElement('div');
          el.className = 'marker-story';
          el.innerHTML = '<div class="avatar"><img src="' + strMarkerImage + '"></div>';

          new mapboxgl.Marker(el)
            .setLngLat(point)
            .setOffset([0, -60])
            .addTo(self.map);
        }
      }

      function addPlayer(strImage, positionPercent) {
        var nPos = Math.floor(((self.arrRoutePoints.length-1) * positionPercent) / 100);
        var point = self.arrRoutePoints[nPos];

        var strImage = GAME_API_URL + '/imageproxy.php?url=' + strImage + '&amp;urlfallback=https://mountainrush.co.uk/static-assets/images/wwf-uk/avatar_unknown.jpg';

        var el = document.createElement('div');
        el.className = 'marker-player';
        el.innerHTML = '<div class="avatar"><img src="' + strImage + '"></div>';

        new mapboxgl.Marker(el)
          .setLngLat(point)
          .setOffset([0, -30])
          .addTo(self.map);
      }

      this.activePlayer = activePlayer;
      var self = this;
      var jsonPlayer = null;
      var bMultiPlayer = false;

      if (playerCollection.length > 1) {
        bMultiPlayer = true;
      }

      this.playerCollection = playerCollection;

      addMarker('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28laqGQ5AOFxlOs-4i_gLcL64FehVaAd2hQSYhmhydR8vLEHs', 100, false);
      addMarker('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28laqGQ5AOFxlOs-4i_gLcL64FehVaAd2hQSYhmhydR8vLEHs', 75, false);
      addMarker('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28laqGQ5AOFxlOs-4i_gLcL64FehVaAd2hQSYhmhydR8vLEHs', 50, false);

      addPlayer('https://dgalywyr863hv.cloudfront.net/pictures/athletes/270394/7302003/9/large.jpg', 35);

      addMarker('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28laqGQ5AOFxlOs-4i_gLcL64FehVaAd2hQSYhmhydR8vLEHs', 25, true);
      addMarker('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28laqGQ5AOFxlOs-4i_gLcL64FehVaAd2hQSYhmhydR8vLEHs', 0, true);
    },

    selectPlayer: function(id, bOrbitPlayer) {
      this.nState = STATE_SELECT_PLAYER;

      this.currPlayerID = id;

      var player = this.playerCollection.get(this.currPlayerID);

      var nPos = Math.floor(((this.arrRoutePoints.length-1) * 35) / 100);
      var point = this.arrRoutePoints[nPos];

      this.map.flyTo({ center: point, zoom: 15, bearing: 90, speed: 0.2 });
    },

    render: function(){
      var self = this;

      mapboxgl.accessToken = 'pk.eyJ1IjoibWFsbGJldXJ5IiwiYSI6IjJfV1MzaE0ifQ.scrjDE31p7wBx7-GemqV3A';
      this.map = new mapboxgl.Map({
        container: 'mapbox-view', // container id
        style: 'mapbox://styles/mallbeury/cju5ji8pi0tay1fqixz92aqy8', // outdoors custom
        center: [self.options.arrMapPoint[0], self.options.arrMapPoint[1]], // starting position
        zoom: 12,
        pitch: 50,
        interactive: true,
        attributionControl: false
      });

      this.map.on('load', function () {
        self.nState = STATE_READY;

        // fire event
        app.dispatcher.trigger("Mountain2DView:onFeaturesLoaded");      
      });

      return this;
    }

  });

  return Mountain2DView;
});

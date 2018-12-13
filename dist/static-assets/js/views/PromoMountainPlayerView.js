define([
  'underscore', 
  'backbone',
  'turf',
  'piste',
  'views/Mountain3DView'
], function(_, Backbone, turf, piste, Mountain3DView){

  var PromoMountainPlayerView = Backbone.View.extend({
    initialize: function(options){
      this.options = options;
      var self = this;

      app.dispatcher.on("Mountain3DView:onLocationLoaded", this.onLocationLoaded, this);
      app.dispatcher.on("Mountain3DView:onFeaturesLoaded", this.onFeaturesLoaded, this);

      this.mountain3DView = null;

      this.jsonRoute = {
        "type": "Feature",
        "properties": {
        "name": this.model.get('name'),
        "color": "#000000",
        },
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      };

      // build geoJSON route
      $.each(this.model.get('route_points'), function(index) {
        self.jsonRoute.geometry.coordinates.push(this.coords);
      });

      var jsonPlayers = new Array;

      // modify avatar to use image proxy
      var strAvatarHost = GAME_API_URL + 'imageproxy.php?url=';

      var objPlayer1 = new Object();
      objPlayer1.id = 'player1';
      objPlayer1.step = 3;
      objPlayer1.progress = 0;
      objPlayer1.imagePath = strAvatarHost + 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/270394/7302003/9/large.jpg';
      jsonPlayers.push(objPlayer1);

      var objPlayer2 = new Object();
      objPlayer2.id = 'player2';
      objPlayer2.step = 2;
      objPlayer2.progress = 4.5;
      objPlayer2.imagePath = strAvatarHost + 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/1295432/324231/1/large.jpg';
      jsonPlayers.push(objPlayer2);

      var objPlayer3 = new Object();
      objPlayer3.id = 'player3';
      objPlayer3.step = 1;
      objPlayer3.progress = 8;
      objPlayer3.imagePath = strAvatarHost + 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/29260149/8784380/3/large.jpg';
      jsonPlayers.push(objPlayer3);
      
      this.playerCollection = new Backbone.Collection(jsonPlayers);
    },

    playRoute: function(){
      this.mountain3DView.playRoute();
    },

    cameraOrbit: function(){
      this.mountain3DView.spin();
    },

    focusLocation: function(strID){
      var jsonPlayer = this.playerCollection.get(strID);

      var coords = jsonPlayer.get('jsonPlayer').features[0].geometry.coordinates;
      this.mountain3DView.focusLocation(coords[1], coords[0]);
    },

    focusFlag: function(){
      var coords = this.jsonRoute.geometry.coordinates[this.jsonRoute.geometry.coordinates.length-1];
      this.mountain3DView.focusLocation(coords[1], coords[0]);
    },

    showPlayer: function(strID){
      this.mountain3DView.showPlayer(strID);
    },

    hidePlayer: function(strID){
      this.mountain3DView.hidePlayer(strID);
    },

    focusPlayer: function(strID){
      this.mountain3DView.focusPlayer(strID);
    },

    render: function(){
      var self = this;

      var arrMapPoint = this.model.get('route_points')[Math.round(this.model.get('route_points').length / 2)].coords;

      this.mountain3DView = new Mountain3DView({ el: '#piste-view', arrMapPoint: arrMapPoint, geography: 0 });
      this.mountain3DView.show();
      this.mountain3DView.render();

      function setupKeyHandler() {
        // keyboard control
        $(document).keydown(function(e){
//            console.log(e.keyCode);
          switch (e.keyCode) {
            case 49: // 1
              self.mountain3DView.setSeason(SEASON_SUMMER_EUROPE);
              break;

            case 50: // 2
              self.mountain3DView.setSeason(SEASON_WINTER_EUROPE);
              break;
          }
        });

        setupKeyHandler();
      }

      return this;
    },

    onLocationLoaded: function(){
      // modify images to use image proxy
      var strImageHost = GAME_API_URL + 'imageproxy.php?url=';

      this.mountain3DView.addRouteData(this.model.get('route_points'));
      this.mountain3DView.addFlag(strImageHost + "http://mountainrush.trailburning.com/static-assets/images/markers/marker-location.png", true);
      this.mountain3DView.showBaseData();

      this.mountain3DView.addPlayers(this.playerCollection);

      this.mountain3DView.showPlayer('player1');
      this.mountain3DView.showPlayer('player2');
      this.mountain3DView.showPlayer('player3');
    },

    onFeaturesLoaded: function(){
    }

  });

  return PromoMountainPlayerView;
});

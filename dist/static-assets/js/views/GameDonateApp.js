var app = app || {};

define([
  'underscore',
  'backbone',
  'bootstrap',
  'cookie',
  'truncate',
  'modernizr',
  'imageScale',
  'imagesLoaded',
  'videojs',
  'raisenow',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/DemoVideoView',
  'views/PlayerDetailView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, raisenow, LanguageSelectorView, ActivePlayerView, DemoVideoView, PlayerDetailView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    $('body').addClass('web');

    function showActivePlayer() {
      var jsonUser = getUserCookies(CLIENT_ID);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }

    function getPlayerProgress() {
      var url = GAME_API_URL + 'game/' + GAME_ID + '/player/' + PLAYER_ID + '/progress';
//      console.log(url);
      $.getJSON(url, function(result){
        playerDetailView.render(result[0]);
      });
    }

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();
    
    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });
    var playerDetailView = new PlayerDetailView({ el: '#player-detail-view' });

    getPlayerProgress();

    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      showActivePlayer();
    }

    $('.signout').click(function(evt){
      removeUserCookie(CLIENT_ID);
    });

    $('.demo-video').click(function(evt){
      demoVideoView.render();
      demoVideoView.show();
    });

    $('img.scale').imageScale({
      'rescaleOnResize': true
    });

    enableUserActions(CLIENT_ID);

    var elImages = $('body');
    var imgLoad = imagesLoaded(elImages);
    imgLoad.on('always', function(instance) {
      for ( var i = 0, len = imgLoad.images.length; i < len; i++ ) {
        if ($(imgLoad.images[i].img).hasClass('scale')) {
          $(imgLoad.images[i].img).parent().addClass('ready');
        }
      }
    });
  };

  return { 
    initialize: initialize
  };
});

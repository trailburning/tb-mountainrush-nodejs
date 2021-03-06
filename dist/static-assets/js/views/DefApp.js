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
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, LanguageSelectorView, ActivePlayerView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    $('body').addClass('web');

    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    function showActivePlayer() {
      var jsonUser = getUserCookies(CLIENT_ID);
      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }
    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      showActivePlayer();

      $('.visible-player-active').show();
    }
    else {
      $('.visible-player-inactive').show();      
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

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();

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


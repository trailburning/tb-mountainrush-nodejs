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
  'views/DemoVideoView',
  'views/ChallengesMonitorView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, LanguageSelectorView, ActivePlayerView, DemoVideoView, ChallengesMonitorView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    $('#loader-view').show();

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
  
    app.dispatcher.on("ChallengesMonitorView:ready", onChallengesMonitorReady);
    app.dispatcher.on("ChallengesMonitorView:playerClick", onPlayerClicked);

    var challengesMonitorView = new ChallengesMonitorView({ el: '#challenges-monitor-view' });
    challengesMonitorView.load();

    function onChallengesMonitorReady() {
      challengesMonitorView.render();      
      $('#loader-view').hide();
    }

    function onPlayerClicked(gameID, playerID) {
      // visit profile
      window.location.href = HOST_URL+'/game/' + gameID + '/player/' + playerID;
    }    
  };

  return { 
    initialize: initialize
  };
});


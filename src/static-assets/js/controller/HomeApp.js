var app = app || {};

var SEASON_SUMMER  = 0;
var SEASON_WINTER  = 1;

define([
  'underscore',
  'backbone',
  'jqueryUI',
  'cookie',
  'truncate',
  'imageScale',
  'imagesLoaded',
  'animateNumber',
  'videojs',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/PlayerGameView',
  'views/DeviceCapableModalView',
  'views/PromotionModalView',
  'views/DemoVideoView',
  'views/SocialPhotosView'
], function(_, Backbone, jqueryUI, cookie, truncate, imageScale, imagesLoaded, animateNumber, videojs, LanguageSelectorView, ActivePlayerView, PlayerGameView, DeviceCapableModalView, PromotionModalView, DemoVideoView, SocialPhotosView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    app.dispatcher.on("Mountain3DView:deviceNotCapable", onDeviceNotCapable);
    app.dispatcher.on("Mountain3DView:onLocationLoaded", onMountain3DViewReady);
    app.dispatcher.on("SocialPhotosView:feedready", onSocialPhotosFeedReady);

    var bLoaderComplete = false, bMapReady = false, bAttractor = false, nAttractorState = 0;
    var arrScenes = new Array;

    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var deviceCapableModalView = new DeviceCapableModalView({ el: '#device-capable-modal-view' });
    var promotionModalView = new PromotionModalView({ el: '#promotion-modal-view' });

    $('img.scale').imageScale({
      'rescaleOnResize': true
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

    function checkReady() {
      if (bLoaderComplete && bMapReady) {
        $('#player-view #hero-view #titles-view').removeClass('overlay');
        $('#loader-view').hide();
        $('#player-view #hero-view .play-btn').show();
      }
    }

    function handleResize() {
      var nWindowHeight = $(window).height();
    }

    $(window).resize(function() {
      handleResize();
    });
    handleResize();

    // tween loader
    $('#loader-view').show();
    $('.percent')
      .prop('number', 0)
      .animateNumber(
        {
          number: 100,
          numberStep: function(now, tween) {
            var target = $(tween.elem);
            target.text(Math.round(now));
          }
        },
        5000,
        'easeInOutQuad',
        function() {
//          console.log('LoaderComplete');
          bLoaderComplete = true;
          checkReady();
        }
      );

    var mountainModel = new Backbone.Model();
    var mountainPlayerView = null;

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();
    var socialPhotosView = new SocialPhotosView({ el: '#community-photos-view', feed: '' });
    socialPhotosView.loadFeed();

    getJourney();

    enableUserActions(DEF_CLIENT_ID);

    // check for player
    if (getUserCookie(DEF_CLIENT_ID) != undefined) {
      var jsonUser = getUserCookies(DEF_CLIENT_ID);

      $('.visible-player-active').show();      
//      console.log(jsonUser);

      // send user info to Drift
      if (drift) {
        drift.identify(jsonUser.user, { player: jsonUser.user, firstname: jsonUser.firstname });
      }

      app.dispatcher.on("PlayerGameView:loaded", onPlayerGameViewReady);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });

      var playerGameView = new PlayerGameView({ el: '#player-game-view', playerToken: jsonUser.token });
      playerGameView.getPlayerGame(DEF_CLIENT_ID);
    }
    else {
      $('.visible-player-inactive').show();

      // fire up promotion

        // 190114 MLA removed until it can be automatic
//      promotionModalView.render(null);
//      promotionModalView.show();      
    }

    $('.signout').click(function(evt){
      removeUserCookie(DEF_CLIENT_ID);
    });

    $('.demo-video').click(function(evt){
      demoVideoView.render();
      demoVideoView.show();
    });

    function getJourney() {
      var url = TB_API_URL + '/journeys/' + TB_JOURNEY_ID + TB_API_EXT;
//      console.log(url);
      $.getJSON(url, function(result){
        var jsonJourney = result.body.journeys[0];

        mountainModel = new Backbone.Model(jsonJourney);
      });
    }

    function onDeviceNotCapable() {
      // there was a problem
      deviceCapableModalView.render(null);
      deviceCapableModalView.show();
    }

    function onPlayerGameViewReady() {
      // show game view if we have an active game
      if (playerGameView.getActiveGame()) {
        playerGameView.render();
        playerGameView.show();
      }
      else {
        // no active game so fire up promotion

        // 190114 MLA removed until it can be automatic
//        promotionModalView.render(jsonUser);
//        promotionModalView.show();      
      }
    }

    function onMountain3DViewReady() {
      bMapReady = true;

      checkReady();
    }

    function onSocialPhotosFeedReady() {
      $('#community-photos-loader-view').hide();
      socialPhotosView.render();
    }

  };

  return { 
    initialize: initialize
  };
});


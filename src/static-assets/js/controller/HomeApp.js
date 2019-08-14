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
  'views/PlayerSearchView',
  'views/DemoVideoView',
  'views/ChallengesView',
  'views/EventsView',
  'views/SocialPhotosView'
], function(_, Backbone, jqueryUI, cookie, truncate, imageScale, imagesLoaded, animateNumber, videojs, LanguageSelectorView, ActivePlayerView, PlayerGameView, DeviceCapableModalView, PromotionModalView, PlayerSearchView, DemoVideoView, ChallengesView, EventsView, SocialPhotosView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    // mla test
//    removeDeviceCookies();
    if (!getDeviceCookies()) {
//      storeDeviceCookies(DEF_DEVICE_TYPE);
      storeDeviceCookies('app');
    }
    var jsonDevice = getDeviceCookies();
    $('body').addClass(jsonDevice.devicetype);

    app.dispatcher.on("ChallengesView:ready", onChallengesReady);
    app.dispatcher.on("EventsView:feedready", onEventsFeedReady);
    app.dispatcher.on("SocialPhotosView:feedready", onSocialPhotosFeedReady);

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

    function handleResize() {
      var nWindowHeight = $(window).height();
    }

    $(window).resize(function() {
      handleResize();
    });
    handleResize();

    var mountainModel = new Backbone.Model();
    var mountainPlayerView = null;

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();
    var playerSearchView = new PlayerSearchView({ el: '#supporter-search-view', campaignID: CAMPAIGN_ID, hostURL: HOST_URL });
    playerSearchView.render();    
    var challengesView = new ChallengesView({ el: '#challenges-available-view' });

    var eventsView = new EventsView({ el: '#events-view' });
    eventsView.loadFeed();

    var socialPhotosView = new SocialPhotosView({ el: '#community-photos-view', feed: '' });
    socialPhotosView.loadFeed();

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

      var playerGameView = new PlayerGameView({ el: '#player-game-view', playerID: jsonUser.user });
      playerGameView.getPlayerGame(DEF_CLIENT_ID);
    }
    else {
      $('.visible-player-inactive').show();

      // now load challenges
      challengesView.load();

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

    function onDeviceNotCapable() {
      // there was a problem
      deviceCapableModalView.render(null);
      deviceCapableModalView.show();
    }

    function onPlayerGameViewReady() {
      // now load challenges
      challengesView.load();

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

    function onChallengesReady() {
      $('#challenges-loader-view').hide();

      var jsonPlayerGames = null;
      if (playerGameView) {
        jsonPlayerGames = playerGameView.getPlayerGames()
      }

      challengesView.render(jsonPlayerGames);
    }

    function onEventsFeedReady() {
      $('#events-loader-view').hide();
      eventsView.render();
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


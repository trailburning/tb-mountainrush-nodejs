var app = app || {};

var SEASON_SUMMER  = 0;
var SEASON_WINTER  = 1;

define([
  'underscore',
  'backbone',
  'jqueryUI',
  'cookie',
  'truncate',
  'animateNumber',
  'videojs',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/PlayerGameView',
  'views/PromoMountainPlayerView',
  'views/DeviceCapableModalView',
  'views/PromotionModalView',
  'views/DemoVideoView',
  'views/SocialPhotosView'
], function(_, Backbone, jqueryUI, cookie, truncate, animateNumber, videojs, LanguageSelectorView, ActivePlayerView, PlayerGameView, PromoMountainPlayerView, DeviceCapableModalView, PromotionModalView, DemoVideoView, SocialPhotosView){
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

    buildAttractor();

    getJourney();

    enableUserActions(DEF_CLIENT_ID);

    // check for player game
    if (getUserCookie(DEF_CLIENT_ID) != undefined) {
      var jsonUser = getUserCookies(DEF_CLIENT_ID);
//      console.log(jsonUser);

      app.dispatcher.on("PlayerGameView:loaded", onPlayerGameViewReady);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });

      var playerGameView = new PlayerGameView({ el: '#player-game-view', playerToken: jsonUser.token });
      playerGameView.getPlayerGame(DEF_CLIENT_ID);
    }
    else {
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

    function renderText(arrScenes, nScene) {
      arrScenes[nScene].show();
      setTimeout(function(){ 
        $('h1', arrScenes[nScene]).css('left', 0);
        $('h1', arrScenes[nScene]).css('opacity', 1);
        $('h2', arrScenes[nScene]).css('left', 0);
        $('h2', arrScenes[nScene]).css('opacity', 1);

        setTimeout(function(){ 
          $('h1', arrScenes[nScene]).css('left', -100);
          $('h1', arrScenes[nScene]).css('opacity', 0);
          $('h2', arrScenes[nScene]).css('left', 100);
          $('h2', arrScenes[nScene]).css('opacity', 0);

          setTimeout(function(){ 
            arrScenes[nScene].hide();
            // reset pos
            $('h1', arrScenes[nScene]).css('left', 100);
            $('h2', arrScenes[nScene]).css('left', -100);
          }, 1000);
        }, 5000);
      }, 100);
    }

    function changeScene(nTimeout) {
//      console.log('changeScene:'+nAttractorState+' : '+nTimeout);
      setTimeout(function(){ 
        switch (nAttractorState) {
          case 0:
            mountainPlayerView.cameraOrbit();

            nAttractorState++;
            changeScene(2000);
            break;

          case 1:
            renderText(arrScenes, 0);

            nAttractorState++;
            changeScene(6000);
            break;

          case 2:
            renderText(arrScenes, 1);

            nAttractorState++;
            changeScene(6000);
            break;

          case 3:
            renderText(arrScenes, 2);
            mountainPlayerView.focusLocation('player1');

            nAttractorState++;
            changeScene(5000);
            break;

          case 4:
            mountainPlayerView.focusLocation('player2');

            nAttractorState++;
            changeScene(3000);
            break;

          case 5:
            renderText(arrScenes, 3);

            nAttractorState++;
            changeScene(3000);
            break;

          case 6:
            mountainPlayerView.focusFlag();

            nAttractorState++;
            changeScene(3000);
            break;

          case 7:
            mountainPlayerView.cameraOrbit();

            nAttractorState++;
            changeScene(2000);
            break;

          case 8:
            renderText(arrScenes, 4);

            nAttractorState++;
            changeScene(10000);
            break;

          case 9:
            mountainPlayerView.focusFlag();

            nAttractorState = 0;
            $('.play-btn').show();
            bAttractor = false;
            break;
        }
      }, nTimeout);
    }

    function buildAttractor() {
      var elScenes = $('#player-view #hero-view #titles-view .scene');

      elScenes.each(function(){
        arrScenes.push($(this));
      });
    }

    function playAttractor() {
      if (bAttractor) {
        return;
      }
      bAttractor = true;

      nAttractorState = 0;
      changeScene(0);
    }

    function getJourney() {
      var url = TB_API_URL + '/journeys/' + TB_JOURNEY_ID + TB_API_EXT;
//      console.log(url);
      $.getJSON(url, function(result){
        var jsonJourney = result.body.journeys[0];

        mountainModel = new Backbone.Model(jsonJourney);

        mountainPlayerView = new PromoMountainPlayerView({ el: '#challenge-view', model: mountainModel });
        mountainPlayerView.render();

        $('#titles-view').click(function(evt){
          if (bLoaderComplete && bMapReady) {
            $('.play-btn').hide();
            playAttractor();
          }
        });

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


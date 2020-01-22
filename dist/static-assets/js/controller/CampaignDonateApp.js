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
  'views/CampaignDonateView',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, CampaignDonateView, LanguageSelectorView, ActivePlayerView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    if (!getDeviceCookies()) {
      storeDeviceCookies(DEF_DEVICE_TYPE);
    }
    var jsonDevice = getDeviceCookies();
    $('body').addClass(jsonDevice.devicetype);

    function showActivePlayer() {
      var jsonUser = getUserCookies(CLIENT_ID);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }

    function getCampaign(callbackFunction) {
      var url = GAME_API_URL + "campaign/" + CAMPAIGN_ID;
//      console.log(url);
      $.getJSON(url, function (result) {
        callbackFunction(result[0]);
      });
    }

    function getPlayer(clientID, playerID, callbackFunction) {
      var self = this;

      var url = GAME_API_URL + "campaign/" + CAMPAIGN_ID + "/player/" + playerID;
//      console.log(url);
      $.getJSON(url, function(result){
        storeUserCookies(clientID, result[0]);
        callbackFunction(result[0]);
      })
      .fail(function() {
        callbackFunction();
      });
    }

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();
    
    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var campaignDonateView = new CampaignDonateView({ el: '#campaign-donate-view' });
    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      showActivePlayer();
    }

    getCampaign(function(jsonCampaign) {
      // check for player
      if (getUserCookie(CLIENT_ID) != undefined) {
        var jsonPlayer = getUserCookies(jsonCampaign.clientID);
        getPlayer(jsonCampaign.clientID, jsonPlayer.user, function(jsonPlayer) {
          campaignDonateView.setPlayer(CLIENT_ID, jsonPlayer);

          campaignDonateView.render({ jsonCampaign: jsonCampaign });
        });
      }
      else {
        campaignDonateView.render({ jsonCampaign: jsonCampaign });
      }
    });

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

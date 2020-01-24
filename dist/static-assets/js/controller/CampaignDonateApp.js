var app = app || {};

var STATE_INIT = 0;
var STATE_DONATE = 1;
var STATE_DONATE_PAYMENT = 2;
var STATE_DONATE_THANKS = 3;

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
  'views/CampaignDonatePaymentView',
  'views/CampaignDonateThanksView',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, CampaignDonateView, CampaignDonatePaymentView, CampaignDonateThanksView, LanguageSelectorView, ActivePlayerView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    app.dispatcher.on("CampaignDonateView:success", onCampaignDonateSuccess);
    app.dispatcher.on("CampaignDonatePaymentView:success", onCampaignDonatePaymentSuccess);

    var jsonCurrCampaign = null;
    var jsonCurrUser = null;
    var nState = STATE_INIT;
    var nPrevState = STATE_INIT;

    function changeState(nNewState) {
      var jsonFields;

      hideView();

      switch (nNewState) {
        case STATE_DONATE:
          var jsonFields = campaignDonateView.getFields();

          jsonFields.jsonCampaign = jsonCurrCampaign;
          jsonFields.jsonPlayer = jsonCurrUser;
          campaignDonateView.setFields(jsonFields);

          campaignDonateView.render();
          showView('#campaign-donate-view');
          break;

        case STATE_DONATE_PAYMENT:
          var jsonFields = campaignDonateView.getFields();

          campaignDonatePaymentView.setFields(jsonFields);

          campaignDonatePaymentView.render();
          showView('#campaign-donate-payment-view');
          break;

        case STATE_DONATE_THANKS:
          var jsonFields = campaignDonateView.getFields();

          campaignDonateThanksView.setFields(jsonFields);

          campaignDonateThanksView.render();
          showView('#campaign-donate-thanks-view');
          break;
      }
      nPrevState = nState;
      nState = nNewState;
    }

    function hideView() {
      $('#page-loader-view').show();
      $('.donate-view').hide();
    }

    function showView(viewID) {
      $('#page-loader-view').hide();

      $(viewID).show();
    }

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

    function onCampaignDonateSuccess() {
      changeState(STATE_DONATE_PAYMENT);
    }

    function onCampaignDonatePaymentSuccess() {
      changeState(STATE_DONATE_THANKS);
    }

    if (!getDeviceCookies()) {
      storeDeviceCookies(DEF_DEVICE_TYPE);
    }
    var jsonDevice = getDeviceCookies();
    $('body').addClass(jsonDevice.devicetype);

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();
    
    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var campaignDonateView = new CampaignDonateView({ el: '#campaign-donate-view' });
    var campaignDonatePaymentView = new CampaignDonatePaymentView({ el: '#campaign-donate-payment-view' });
    var campaignDonateThanksView = new CampaignDonateThanksView({ el: '#campaign-donate-thanks-view' });

    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      showActivePlayer();
    }

    getCampaign(function(jsonCampaign) {
      jsonCurrCampaign = jsonCampaign;

      // check for player
      if (getUserCookie(CLIENT_ID) != undefined) {
        var jsonPlayer = getUserCookies(jsonCampaign.clientID);
        getPlayer(jsonCampaign.clientID, jsonPlayer.user, function(jsonPlayer) {
          jsonCurrUser = jsonPlayer;
          changeState(STATE_DONATE);
        });
      }
      else {
        changeState(STATE_DONATE);
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

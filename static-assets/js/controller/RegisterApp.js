var app = app || {};

var STATE_INIT = 0;
var STATE_PLAYER_INVITATION = 1;
var STATE_PLAYER_SIGNUP = 2;
var STATE_PLAYER_SIGNUP_VERIFY = 3;
var STATE_PLAYER_SIGNEDUP = 4;
var STATE_PLAYER_PREFERENCES = 5;
var STATE_GAME_CREATE = 6;
var STATE_GAME_CREATED = 7;
var STATE_GAME_INVITE = 8;

// RaiseNow  doesn't require anything!
var STATE_FUNDRAISING_CREATE = 10;
var STATE_FUNDRAISING_CREATED = 11;

// JustGiving requires user signup and fundraising page creation!
var STATE_FUNDRAISING_SIGNIN = 20;
var STATE_FUNDRAISING_SIGNUP = 21;
var STATE_FUNDRAISING_PAGE_CREATE = 22;
var STATE_FUNDRAISING_PAGE_CREATED = 23;

define([
  'underscore',
  'backbone',
  'bootstrap',
  'cookie',
  'truncate',
  'modernizr',
  'dateFormat',
  'datepicker',
  'imageScale',
  'imagesLoaded',
  'videojs',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/RegisterInvitationView',
  'views/RegisterWelcomeView',
  'views/RegisterWelcomeVerifyView',
  'views/RegisterWelcomeConnectedView',
  'views/RegisterWelcomePreferencesView',
  'views/RegisterGameCreateView',
  'views/RegisterGameCreatedView',
  'views/RegisterGameInviteView',
  'views/RegisterGamesView',
  'views/RegisterFundraisingCreateView',
  'views/RegisterFundraisingCreatedView',
  'views/RegisterFundraisingSigninView',
  'views/RegisterFundraisingSignupView',
  'views/RegisterFundraisingPageCreateView',
  'views/RegisterFundraisingPageCreatedView',
  'views/ChallengeCancelModalView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, dateFormat, datepicker, imageScale, imagesLoaded, videojs, LanguageSelectorView, ActivePlayerView, RegisterInvitationView, RegisterWelcomeView, RegisterWelcomeVerifyView, RegisterWelcomeConnectedView, RegisterWelcomePreferencesView, RegisterGameCreateView, RegisterGameCreatedView, RegisterGameInviteView, RegisterGamesView, RegisterFundraisingCreateView, RegisterFundraisingCreatedView, RegisterFundraisingSigninView, RegisterFundraisingSignupView, RegisterFundraisingPageCreateView, RegisterFundraisingPageCreatedView, ChallengeCancelModalView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    app.dispatcher.on("RegisterInvitationView:inviteSuccess", onInvitationSuccess);
    app.dispatcher.on("RegisterWelcomeVerifyView:userUpdated", onVerifySuccess);
    app.dispatcher.on("RegisterWelcomeConnectedView:createGameClick", onCreateGameClick);
    app.dispatcher.on("RegisterWelcomeConnectedView:fundraiseClick", onRegisterFundraiseClick);
    app.dispatcher.on("RegisterWelcomeConnectedView:inviteClick", onInviteClick);
    app.dispatcher.on("RegisterWelcomeConnectedView:cancelGameClick", onCancelGameClick);
    app.dispatcher.on("RegisterWelcomeConnectedView:prefsClick", onPrefsClick);
    app.dispatcher.on("RegisterWelcomePreferencesView:prefsUpdated", onRegisterPreferencesPrefsUpdated);
    app.dispatcher.on("RegisterWelcomePreferencesView:backClick", onRegisterBackClick);
    app.dispatcher.on("RegisterGameCreateView:gameCreated", onRegisterGameCreated);
    app.dispatcher.on("RegisterGameCreatedView:inviteClick", onInviteClick);
    app.dispatcher.on("RegisterGameCreatedView:fundraiseClick", onRegisterFundraiseClick);
    app.dispatcher.on("RegisterGameInviteView:backClick", onRegisterBackClick);
    app.dispatcher.on("RegisterFundraisingCreateView:fundraisingCreated", onRegisterFundraisingCreated);
    app.dispatcher.on("RegisterFundraisingSigninView:validUser", onRegisterFundraisingSigninValidUser);
    app.dispatcher.on("RegisterFundraisingSigninView:invalidUser", onRegisterFundraisingSigninInvalidUser);
    app.dispatcher.on("RegisterFundraisingSigninView:registerClick", onRegisterFundraisingSigninRegisterClick);
    app.dispatcher.on("RegisterFundraisingSignupView:userCreated", onRegisterFundraisingSignupUserCreated);
    app.dispatcher.on("RegisterFundraisingSignupView:signinClick", onRegisterFundraisingSignupSigninClick);
    app.dispatcher.on("RegisterFundraisingPageCreateView:pageCreated", onRegisterFundraisingPageCreated);

    var jsonCampaign = null;
    var jsonCurrPlayer = null;
    var jsonFundraising = getFundraisingShoppingList();

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();
    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var challengeCancelModalView = new ChallengeCancelModalView({ el: '#challenge-cancel-modal-view' });

    var registerInvitationView = new RegisterInvitationView({ el: '#register-invitation-view', code: CAMPAIGN_INVITATION_CODE });
    var registerWelcomeView = new RegisterWelcomeView({ el: '#register-welcome-view' });
    var registerWelcomeVerifyView = new RegisterWelcomeVerifyView({ el: '#register-welcome-verify-view' });
    var registerWelcomeConnectedView = new RegisterWelcomeConnectedView({ el: '#register-welcome-connected-view', jsonFundraising: jsonFundraising });
    var registerWelcomePreferencesView = new RegisterWelcomePreferencesView({ el: '#register-welcome-preferences-view' });
    var registerGameCreateView = new RegisterGameCreateView({ el: '#register-game-create-view' });
    var registerGameCreatedView = new RegisterGameCreatedView({ el: '#register-game-created-view', jsonFundraising: jsonFundraising });
    var registerGameInviteView = new RegisterGameInviteView({ el: '#register-game-invite-view' });
    var registerGamesView = new RegisterGamesView({ el: '#register-games-view' });

    var registerFundraisingCreateView = new RegisterFundraisingCreateView({ el: '#register-fundraising-create-view' });
    var registerFundraisingCreatedView = new RegisterFundraisingCreatedView({ el: '#register-fundraising-created-view' });

    var registerFundraisingSigninView = new RegisterFundraisingSigninView({ el: '#register-fundraising-signin-view' });
    var registerFundraisingSignupView = new RegisterFundraisingSignupView({ el: '#register-fundraising-signup-view' });
    var registerFundraisingPageCreateView = new RegisterFundraisingPageCreateView({ el: '#register-fundraising-page-create-view' });
    var registerFundraisingPageCreatedView = new RegisterFundraisingPageCreatedView({ el: '#register-fundraising-page-created-view' });

    function getCampaign() {
      var url = GAME_API_URL + "campaign/" + CAMPAIGN_ID;
//      console.log(url);
      $.getJSON(url, function(result){
        jsonCampaign = result[0];

        nState = STATE_INIT;
        nPrevState = STATE_INIT;

//        if (TEST) {
//          removeUserCookie(CLIENT_ID);
//          PLAYER_TOKEN = '9b69f66ee9a7d20702a5b9771322388df8cb886a'; // MR - Matt
//        PLAYER_TOKEN = 'b8a1bc6ca786c95f1e639c42615320782d8a9d22'; // MR - Trailburning
//          PLAYER_TOKEN = '3e43a998394b56e0616e3ccd4085ba762f83e861'; // CFYW - Amelia
//        } 
//        changeState(STATE_GAME_CREATE);
//        return;

        if (PLAYER_TOKEN != '') { // do we have a passed player?
          changeState(STATE_PLAYER_SIGNEDUP);
        }
        else if (getUserCookie(CLIENT_ID) != undefined) { // do we have a player in the cookie?
          switch (REGISTER_STATE) {
            case 'prefs':
              // we want to show player prefs, first get player deats
              var token = PLAYER_TOKEN;
              if (getUserCookie(jsonCampaign.clientID) != undefined) {
                var jsonPlayer = getUserCookies(jsonCampaign.clientID);
                token = jsonPlayer.token;
              }

              getPlayer(jsonCampaign.clientID, token, function(jsonPlayer) {
                jsonCurrPlayer = jsonPlayer;
                changeState(STATE_PLAYER_PREFERENCES);
                showActivePlayer();
                enableUserActions(CLIENT_ID);
              });
              break;

            case 'fundraise':
              // we want to enable fundraising, first get player deats
              var jsonPlayer = getUserCookies(jsonCampaign.clientID);
              getPlayer(jsonCampaign.clientID, jsonPlayer.token, function(jsonPlayer) {
                jsonCurrPlayer = jsonPlayer;
                changeState(STATE_FUNDRAISING_SIGNIN);
                showActivePlayer();
                enableUserActions(CLIENT_ID);
              });
              break;

            default:
              changeState(STATE_PLAYER_SIGNEDUP);
              break;
          }
        }
        else {
          // is an invitation code required?
          if (CAMPAIGN_INVITATION_CODE != '') {
            changeState(STATE_PLAYER_INVITATION);
          }
          else {
            changeState(STATE_PLAYER_SIGNUP);
          }
          enableUserActions(CLIENT_ID);
        }
      });
    }

    function getPlayer(clientID, playerToken, callbackFunction) {
      var self = this;

      var url = GAME_API_URL + "client/" + clientID + "/player/" + playerToken;
//      console.log(url);
      $.getJSON(url, function(result){
        storeUserCookies(clientID, playerToken, result[0]);
        callbackFunction(result[0]);
      });
    }

    function showActivePlayer() {
      var jsonUser = getUserCookies(CLIENT_ID);
      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }

    function hideView() {
      $('#register-loader-view').show();
      $('.register-view').hide();
    }

    function showView(viewID) {
      $('#register-loader-view').hide();

      var strStep = '';
      switch (viewID) {
        case '#register-welcome-view':
        case '#register-welcome-connected-view':
          strStep = 'player';
          break;

        case '#register-game-create-view':
        case '#register-game-created-view':
        case '#register-game-invite-view':
          strStep = 'challenge';
          break;

        case '#register-fundraising-create-view':
        case '#register-fundraising-created-view':
        case '#register-fundraising-signin-view':
        case '#register-fundraising-signup-view':
        case '#register-fundraising-page-create-view':
        case '#register-fundraising-page-created-view':
          strStep = 'fundraising';
          break;
      }

      if (strStep != '') {
        $('.step-image img').hide();
        $('.step-image img.step-' + strStep).show();
      }
      $(viewID).show();
    }

    function updateURLState(nState) {
      var query = window.location.href;
      var vars = query.split("/");
      var nPagePos = vars.length - 1;

      switch (nState) {
        case STATE_PLAYER_SIGNUP:
          vars[nPagePos] = 'register';
          break;

        case STATE_PLAYER_SIGNUP_VERIFY:
          vars[nPagePos] = 'register';
          break;

        case STATE_PLAYER_SIGNEDUP:
          vars[nPagePos] = 'profile';
          break;

        case STATE_PLAYER_PREFERENCES:
          vars[nPagePos] = 'preferences';
          break;

        case STATE_GAME_CREATE:
          vars[nPagePos] = 'gamecreate';
          break;

        case STATE_GAME_CREATED:
          vars[nPagePos] = 'gamecreated';
          break;

        case STATE_FUNDRAISING_SIGNIN:
          vars[nPagePos] = 'fundraise';
          break;

        case STATE_FUNDRAISING_PAGE_CREATED:
          vars[nPagePos] = 'fundraisecreated';
          break;
      }

      var strURL = vars.join('/');

      history.replaceState(null, null, strURL);

      return strURL;
    }

    function changeState(nNewState) {
      var jsonFields;

      hideView();

      updateURLState(nNewState);

      switch (nNewState) {
        case STATE_PLAYER_INVITATION:
          var jsonFields = registerInvitationView.getFields();
          jsonFields.campaignID = CAMPAIGN_ID;
          registerInvitationView.setFields(jsonFields);

          registerInvitationView.render({ jsonCampaign: jsonCampaign });
          showView('#register-invitation-view');
          break;

        case STATE_PLAYER_SIGNUP:
          registerWelcomeView.render({ jsonCampaign: jsonCampaign });
          showView('#register-welcome-view');
          break;

        case STATE_PLAYER_SIGNUP_VERIFY:
          var token = PLAYER_TOKEN;
          if (getUserCookie(jsonCampaign.clientID) != undefined) {
            var jsonPlayer = getUserCookies(jsonCampaign.clientID);
            token = jsonPlayer.token;
          }

          getPlayer(jsonCampaign.clientID, token, function(jsonPlayer) {
            jsonCurrPlayer = jsonPlayer;

            registerWelcomeVerifyView.setPlayer(jsonCampaign.clientID, jsonCurrPlayer);
            registerWelcomeVerifyView.render({ jsonCampaign: jsonCampaign });

            showActivePlayer();
            enableUserActions(CLIENT_ID);
          });

          showView('#register-welcome-verify-view');
          break;

        case STATE_PLAYER_SIGNEDUP:
          var token = PLAYER_TOKEN;
          if (getUserCookie(jsonCampaign.clientID) != undefined) {
            var jsonPlayer = getUserCookies(jsonCampaign.clientID);
            token = jsonPlayer.token;
          }

          getPlayer(jsonCampaign.clientID, token, function(jsonPlayer) {
            jsonCurrPlayer = jsonPlayer;

            challengeCancelModalView.setPlayer(jsonCurrPlayer);

            // do we have an email address?
            if (jsonCurrPlayer.email != '') {
              registerWelcomeConnectedView.setPlayer(jsonCampaign.clientID, jsonCurrPlayer);
              registerWelcomeConnectedView.render({ jsonCampaign: jsonCampaign });

              showActivePlayer();
              enableUserActions(CLIENT_ID);              
            }
            else {
              // no email so we need to verify
              changeState(STATE_PLAYER_SIGNUP_VERIFY);
            }
          });

          showView('#register-welcome-connected-view');
          break;

        case STATE_PLAYER_PREFERENCES:
          registerWelcomePreferencesView.setPlayer(jsonCampaign.clientID, jsonCurrPlayer);
          registerWelcomePreferencesView.render();
          showView('#register-welcome-preferences-view');
          break;

        case STATE_GAME_CREATE:
          var jsonWelcomeFields = registerWelcomeConnectedView.getFields();

          jsonFields = registerGameCreateView.getFields();
          jsonFields.campaignID = CAMPAIGN_ID;
          jsonFields.playerID = jsonWelcomeFields.playerID;

          // get campaign game levels
          var url = GAME_API_URL + 'campaign/' + jsonFields.campaignID + '/gamelevels';
//          console.log(url);
          $.getJSON(url, function(result){
            var gameLevels = result;

            var url = GAME_API_URL + 'campaign/' + jsonFields.campaignID + '/gameoptions';
//            console.log(url);
            $.getJSON(url, function(result){
              var gameOptions = result;

              registerGameCreateView.setFields(jsonFields);
              registerGameCreateView.render({ gameLevels: gameLevels, gameOptions: gameOptions });
              showView('#register-game-create-view');
            });
          });
          break;

        case STATE_GAME_CREATED:
          var jsonFields = registerGameCreateView.getFields();

          registerGameCreatedView.setFields(jsonFields);
          registerGameCreatedView.render({ jsonCampaign: jsonCampaign});
          showView('#register-game-created-view');
          break;

        case STATE_GAME_INVITE:
          var jsonWelcomeFields = registerWelcomeConnectedView.getFields();

          var gameID = registerGameCreateView.getFields().gameID;
          // if we have a current game then use that!
          if (jsonWelcomeFields.currGame) {
            gameID = jsonWelcomeFields.currGame.game;
          }

          var jsonCreateFields = registerGameInviteView.getFields();
          jsonCreateFields.gameID = gameID;
          registerGameInviteView.setFields(jsonCreateFields);

          registerGameInviteView.render({ jsonCampaign: jsonCampaign });
          showView('#register-game-invite-view');
          break;

        case STATE_FUNDRAISING_CREATE:
          var jsonWelcomeFields = registerWelcomeConnectedView.getFields();

          var gameID = registerGameCreateView.getFields().gameID;
          var playerID = jsonWelcomeFields.playerID;

          if (GAME_ID != '') {
            // do we have a passed game id?
            gameID = GAME_ID;
            if (jsonCurrPlayer) {
              playerID = jsonCurrPlayer.id;
            }
          }
          else if (jsonWelcomeFields.currGame) {
            // if we have a current game then use that!
            gameID = jsonWelcomeFields.currGame.game;
          }

          var jsonCreateFields = registerFundraisingCreateView.getFields();
          jsonCreateFields.campaignID = CAMPAIGN_ID;
          jsonCreateFields.currencyCode = CAMPAIGN_FUNDRAISING_CURRENCY;
          jsonCreateFields.gameID = gameID;
          jsonCreateFields.playerID = playerID;
          registerFundraisingCreateView.setFields(jsonCreateFields);

          registerFundraisingCreateView.render({ jsonCampaign: jsonCampaign });
          showView('#register-fundraising-create-view');
          break;

        case STATE_FUNDRAISING_CREATED:
          jsonFields = registerFundraisingCreateView.getFields();
          registerFundraisingCreatedView.setFields(jsonFields);

          registerFundraisingCreatedView.render({ jsonCampaign: jsonCampaign });
          showView('#register-fundraising-created-view');
          break;

        case STATE_FUNDRAISING_SIGNIN:
          // check fundraising provider
          if (jsonCampaign.fundraising_provider == FUNDRAISING_PROVIDER_RAISENOW) {
            // change step
            changeState(STATE_FUNDRAISING_CREATE);
          }
          else {
            var jsonWelcomeFields = registerWelcomeConnectedView.getFields();

            var playerID = jsonWelcomeFields.playerID;
            if (jsonCurrPlayer) {
              playerID = jsonCurrPlayer.id;
            }

            var jsonFields = registerFundraisingSigninView.getFields();
            jsonFields.playerID = playerID;
            registerFundraisingSigninView.setFields(jsonFields);

            registerFundraisingSigninView.render({ jsonCampaign: jsonCampaign });
            showView('#register-fundraising-signin-view');
          }

          break;

        case STATE_FUNDRAISING_SIGNUP:
          registerFundraisingSignupView.render({ jsonCampaign: jsonCampaign });
          showView('#register-fundraising-signup-view');
          break;

        case STATE_FUNDRAISING_PAGE_CREATE:
          var jsonWelcomeFields = registerWelcomeConnectedView.getFields();

          var gameID = registerGameCreateView.getFields().gameID;
          var playerID = jsonWelcomeFields.playerID;

          if (GAME_ID != '') {
            // do we have a passed game id?
            gameID = GAME_ID;
            if (jsonCurrPlayer) {
              playerID = jsonCurrPlayer.id;
            }
          }
          else if (jsonWelcomeFields.currGame) {
            // if we have a current game then use that!
            gameID = jsonWelcomeFields.currGame.game;
          }

          switch (nState) {
            case STATE_FUNDRAISING_SIGNIN:
              jsonFields = registerFundraisingSigninView.getFields();
              break;

            case STATE_FUNDRAISING_SIGNUP:
              jsonFields = registerFundraisingSignupView.getFields();
              break;

            default:
              jsonFields = registerFundraisingSigninView.getFields();
              break;
          }

          var jsonCreateFields = registerFundraisingPageCreateView.getFields();
          jsonCreateFields.campaignID = CAMPAIGN_ID;
          jsonCreateFields.gameID = gameID;
          jsonCreateFields.playerID = playerID;
          jsonCreateFields.email = jsonFields.email;
          jsonCreateFields.password = jsonFields.password;
          registerFundraisingPageCreateView.setFields(jsonCreateFields);

          registerFundraisingPageCreateView.render({ jsonCampaign: jsonCampaign });
          showView('#register-fundraising-page-create-view');
          break;

        case STATE_FUNDRAISING_PAGE_CREATED:
          jsonFields = registerFundraisingPageCreateView.getFields();
          registerFundraisingPageCreatedView.setFields(jsonFields);

          registerFundraisingPageCreatedView.render({ jsonCampaign: jsonCampaign });
          showView('#register-fundraising-page-created-view');
          break;
      }
      nPrevState = nState;
      nState = nNewState;
    }

    function onRegisterPreferencesPrefsUpdated() {
      changeState(STATE_PLAYER_SIGNEDUP);
    }

    function onInvitationSuccess() {
      changeState(STATE_PLAYER_SIGNUP);
    }

    function onCancelGameClick() {
      challengeCancelModalView.render();
      challengeCancelModalView.show();
    }

    function onVerifySuccess() {
      changeState(STATE_PLAYER_SIGNEDUP);
    }

    function onCreateGameClick() {
      changeState(STATE_GAME_CREATE);
    }

    function onRegisterBackClick() {
      changeState(nPrevState);
    }

    function onInviteClick() {
      changeState(STATE_GAME_INVITE);
    }

    function onPrefsClick() {
      changeState(STATE_PLAYER_PREFERENCES);
    }

    function onRegisterGameCreated() {
      changeState(STATE_GAME_CREATED);
    }

    function onRegisterFundraiseClick() {
      changeState(STATE_FUNDRAISING_SIGNIN);
    }

    function onRegisterFundraisingSigninValidUser() {
      changeState(STATE_FUNDRAISING_PAGE_CREATE);
    }

    function onRegisterFundraisingSigninInvalidUser() {
      // seed signup with signin fields
      var jsonFields = registerFundraisingSigninView.getFields();
      registerFundraisingSignupView.setFields(jsonFields);
      registerFundraisingSignupView.setWarning('not-registered');

      changeState(STATE_FUNDRAISING_SIGNUP);
    }

    function onRegisterFundraisingSigninRegisterClick() {
      changeState(STATE_FUNDRAISING_SIGNUP);
    }

    function onRegisterFundraisingSignupUserCreated() {
      changeState(STATE_FUNDRAISING_PAGE_CREATE);
    }

    function onRegisterFundraisingSignupSigninClick() {
      changeState(STATE_FUNDRAISING_SIGNIN);
    }

    function onRegisterFundraisingPageCreated() {
      changeState(STATE_FUNDRAISING_PAGE_CREATED);
    }

    function onRegisterFundraisingCreated() {
      changeState(STATE_FUNDRAISING_CREATED);
    }

    // turn on active icon
    $('#register-process-view .step-image img').hide();
    $('#register-process-view .step-image img.active').show();

    // first load campaign details
    getCampaign();

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


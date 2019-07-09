var app = app || {};

var SHOP_TIMER_DELAY = 8000;
var STORY_TIMER_DELAY = 1000;

define([
  'underscore',
  'backbone',
  'bootstrap', 
  'jqueryUI',
  'cookie',
  'truncate',
  'modernizr',
  'photoswipe',
  'photoswipeui',
  'animateNumber',
  'moment',
  'countdown',
  'touchswipe',
  'turf',
  'imagesLoaded',
  'videojs',
/* player.js */
  'views/FundraisingDonationSummaryView',
  'views/FundraisingDonationsView',
  'views/PlayerActivityCommentView',
  'views/PlayerActivityMorePhotosView',
  'views/PlayerActivityPhotosView',
  'views/PlayerActivityPhotoView',
/* player.js */
  'views/SponsorView',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/Player',
  'views/PlayerChallengeSuccessView',
  'views/ChallengeView',
  'views/PlayersSummaryView',
  'views/PlayersListView',
  'views/PlayersDetailView',
  'views/Mountain3DView',
  'views/DeviceCapableModalView',
  'views/ChallengePendingModalView',
  'views/ChallengeCompleteModalView',
  'views/MountainLockedStoryModalView',
  'views/MountainStoryModalView',
  'views/ChallengeCancelModalView',
  'views/GameInviteView',
  'views/FundraisingShoppingModalView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, jqueryUI, cookie, truncate, modernizr, PhotoSwipe, PhotoSwipeUI_Default, animateNumber, moment, countdown, touchswipe, turf, imagesLoaded, videojs, 
/* player.js */
FundraisingDonationSummaryView, FundraisingDonationsView, PlayerActivityCommentView, PlayerActivityMorePhotosView, PlayerActivityPhotosView, PlayerActivityPhotoView,
/* player.js */
  SponsorView, LanguageSelectorView, ActivePlayerView, Player, PlayerChallengeSuccessView, ChallengeView, PlayersSummaryView, PlayersListView, PlayersDetailView, Mountain3DView, DeviceCapableModalView, ChallengePendingModalView, ChallengeCompleteModalView, MountainLockedStoryModalView, MountainStoryModalView, ChallengeCancelModalView, GameInviteView, FundraisingShoppingModalView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    app.dispatcher.on("Mountain3DView:deviceNotCapable", onDeviceNotCapable);
    app.dispatcher.on("Mountain3DView:onLocationLoaded", onLocationLoaded);
    app.dispatcher.on("Mountain3DView:onFeaturesLoaded", onFeaturesLoaded);
    app.dispatcher.on("Mountain3DView:onFeatureClicked", onFeatureClicked);
    app.dispatcher.on("PlayerActivityPhotoView:click", onPlayerActivityPhotoClicked);
    app.dispatcher.on("PlayersDetailView:inviteClick", onPlayerInviteClick);
    app.dispatcher.on("PlayersDetailView:cancelGameClick", onCancelGameClick);
    app.dispatcher.on("ChallengeCancelModalView:challengeCancelled", onChallengeCancelled);

    var challengeView = null;
    var mountainModel = new Backbone.Model();
    var mountainEventsCollection = null;
    var nPlayersLoaded = 0;
    var playerCollection = null;
    var mountain3DView = null;
    var nCurrPlayer = -1;
    var currPlayerModel = null;
    var activePlayer = null;
    var showLatestEnabledMarkerID = null;
    var jsonRoute = null;
    var jsonCurrGame = null;
    var timeoutShopID = null, timeoutStoryID = null;
    var FundraisingShoppingModelShown = false;

    // are we fundraising?
    if (GAME_FUNDRAISING) {
      $('body').addClass('fundraising-campaign');
    }

    $('#loader-view').show();

    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      var jsonUser = getUserCookies(CLIENT_ID);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();

    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var challengeCancelModalView = new ChallengeCancelModalView({ el: '#challenge-cancel-modal-view' });
    var deviceCapableModalView = new DeviceCapableModalView({ el: '#device-capable-modal-view' });
    var challengePendingModalView = new ChallengePendingModalView({ el: '#challenge-pending-modal-view' });
    var challengeCompleteModalView = new ChallengeCompleteModalView({ el: '#challenge-complete-modal-view' });
    var fundraisingShoppingModalView = new FundraisingShoppingModalView({ el: '#fundraising-shopping-modal-view' });
    var mountainLockedStoryModalView = new MountainLockedStoryModalView({ el: '#mountain-locked-story-modal-view' });
    var mountainStoryModalView = new MountainStoryModalView({ el: '#mountain-story-modal-view' });
    var gameInviteView = new GameInviteView({ el: '#game-invite-view', clientID: CLIENT_ID });
    var sponsorView = new SponsorView({ el: '#sponsor-big-container-view' });

    $('.signout').click(function(evt){
      removeUserCookie(CLIENT_ID);
    });

    $('.demo-video').click(function(evt){
      stopShopTimer();
      demoVideoView.render();
      demoVideoView.show();
    });

    enableUserActions(CLIENT_ID);

    function stopShopTimer() {
      if (timeoutShopID) {
        window.clearTimeout(timeoutShopID);
      }
    }

    function startShopTimer() {
      stopShopTimer();

      timeoutShopID = window.setTimeout(function(){
        fundraisingShoppingModalView.show();
      }, SHOP_TIMER_DELAY);
    }

    function updateURLPlayer(strPlayerID) {
      var bValidURL = true;
      var query = window.location.href;
      var vars = query.split("/");
      var strURL = vars.join('/');

      // find player param for offset
      var nPlayerPos = 0;
      $.each(vars, function(key, value){
        // don't update when in demo mode
        if (value == 'demo') {
          bValidURL = false;
        }
        if (value == 'player') {
          nPlayerPos = key;
        }
      });

      if (bValidURL) {
        if (nPlayerPos) {
          // update
          vars[nPlayerPos + 1] = strPlayerID;
          strURL = vars.join('/');
        }
        else {
          // add
          strURL += '/player/' + strPlayerID;
        }
        history.replaceState(null, null, strURL);
      }
      return strURL;
    }

    function playerDetailExpand() {
      if (!$('#mobileTest').is(':hidden')) {
        // reset scroll
        $('#player-view .detail .scroll').animate({scrollTop: 0}, 0);

        $('#player-view').addClass('transition');

        $('#player-view .summary').addClass('min');
        $('#player-view .summary .arrow').removeClass('active');

        // hide player
        var elPlayerSummary = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
        elPlayerSummary.addClass('transition');
        elPlayerSummary.css('top', -(elPlayerSummary.height() + 20));

        $('#player-view .summary-max').addClass('expanded');

        $('#player-view').addClass('expand')
        $('#player-view').css('top', 0);
      }
    }

    function playerDetailCollapse() {
      if (!$('#mobileTest').is(':hidden')) {
        var nWindowHeight = $(window).height();

        $('#player-view').addClass('transition');

        $('#player-view .summary').removeClass('min');
        $('#player-view .summary .arrow').addClass('active');

        // show player
        var elPlayerSummary = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
        elPlayerSummary.addClass('transition');
        elPlayerSummary.css('top', 0);

        $('#player-view .summary-max').removeClass('expanded');

        $('#player-view').removeClass('expand');
        $('#player-view').css('top', nWindowHeight - $('#player-view .summary').height());
      }
    }

    function togglePlayerDetail() {
      if ($('#player-view').hasClass('expand')) {
        playerDetailCollapse();
      }
      else {
        playerDetailExpand();
      }
    }

    function setupMap(mountain3DName) {
      var arrMapPoint = mountainModel.get('route_points')[Math.round(mountainModel.get('route_points').length / 2)].coords;

      mountain3DView = new Mountain3DView({ el: '#piste-view', arrMapPoint: arrMapPoint, mountainType: Number(jsonCurrGame.mountainType), geography: Number(jsonCurrGame.season) });
      mountain3DView.show();
      mountain3DView.render();
    }

    function focusPlayer(nPlayer) {
      var self = this;

      // now allow player to click map
      $('#loader-view').hide();
      $('#map-view .overlay-loader-view').hide();
      $('#map-view .map-overlay').hide();

      $('#player-view .player-ranking').removeClass('active');
      $('#player-view .player-ranking:eq(' + nPlayer + ')').addClass('active');

      $('#player-view .player:eq(' + nPlayer + ')').show();

      this.currPlayerModel = playerCollection.at(nPlayer);

      if (activePlayer) {
        if (activePlayer.get('id') == this.currPlayerModel.get('id')) {
          mountain3DView.showMarkers();
        } else {
          mountain3DView.hideMarkers();
        }
      }

      // update url
      updateURLPlayer(this.currPlayerModel.get('id'));

      var bOrbitPlayer = this.currPlayerModel.get('elevationToSummit') ? false : true;

      if (mountain3DView) {
        // do we have a marker to show?
        if (showLatestEnabledMarkerID) {          
          mountain3DView.selectPlayerNoSelect(this.currPlayerModel.get('playerObj').model.get('id'));
          focusStory(showLatestEnabledMarkerID);  

          showLatestEnabledMarkerID = null;
        }
        else {
          // just select player
          mountain3DView.selectPlayer(this.currPlayerModel.get('playerObj').model.get('id'), bOrbitPlayer);
        }
      }

      this.currPlayerModel.get('playerObj').render();
      if (GAME_FUNDRAISING) {
        // get fundraising
        this.currPlayerModel.get('playerObj').getFundraising();
        // get donations
        this.currPlayerModel.get('playerObj').getDonations();

        $('.donate-btn').hide();
        // does player have a fundraising goal?
        if (Number(this.currPlayerModel.get('fundraising_goal'))) {
          // look for url attr
          $('.donate-btn .mr-btn').each(function(index) {
            // use to build real url
            if ($(this).attr('data-href')) {
              var strHREF = $(this).attr('data-href').replace('[PLAYER_ID]', self.currPlayerModel.get('id'));
              $(this).attr('href', strHREF);
            }
          });

          $('.donate-btn').show();
          // show if player not already signed in, not already shown and a donation id is not present (passed when a donation has been made) and we have a shopping list item
          if (!FundraisingShoppingModelShown && getUserCookie(CLIENT_ID) == undefined && (FUNDRAISING_DONATION_ID == '') && jsonCurrGame.jsonFundraising[0].items.length) {
            FundraisingShoppingModelShown = true;
            fundraisingShoppingModalView.render(this.currPlayerModel, jsonCurrGame);
            // delay before showing
            startShopTimer();
          }
        }
      }
      // get comments
      // 20180611 mla - design not yet done so hold off on this!
//      this.currPlayerModel.get('playerObj').getActivityComments();
      // get photos
      this.currPlayerModel.get('playerObj').getActivityPhotos();
    }

    function nextPlayer() {
      // do we have more than 1 player?
      if (playerCollection.length < 2) {
        return;
      }

      // are we mobile and summary min?  then don't change player
      if (!$('#mobileTest').is(':hidden') && $('#player-view .summary').hasClass('min')) {
        return;
      }

      var nWindowWidth = $(window).width();
      var nPlayer = 0;
      var nPlayers = $('#player-view .player').length;

      $('#player-view .player').hide();
      var elPlayerSummaryOff = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
      elPlayerSummaryOff.addClass('transition');
      elPlayerSummaryOff.css('left', -elPlayerSummaryOff.width());
      elPlayerSummaryOff.css('opacity', 0);

      if (nCurrPlayer-1 < 0) {
        nPlayer = nPlayers-1;
      }
      else {
        nPlayer = nCurrPlayer-1;
      }
      nCurrPlayer = nPlayer;

      var elPlayerSummaryOn = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
      elPlayerSummaryOn.hide();
      elPlayerSummaryOn.removeClass('transition');
      elPlayerSummaryOn.css('opacity', 0);
      elPlayerSummaryOn.css('left', nWindowWidth);
      elPlayerSummaryOn.show();
      setTimeout(function(){
        elPlayerSummaryOn.addClass('transition');
        elPlayerSummaryOn.css('opacity', 1);
        elPlayerSummaryOn.css('left', (nWindowWidth - elPlayerSummaryOn.width()) / 2);
      }, 50);

      focusPlayer(nCurrPlayer);
    }

    function prevPlayer() {
      // do we have more than 1 player?
      if (playerCollection.length < 2) {
        return;
      }

      // are we mobile and summary min?  then don't change player
      if (!$('#mobileTest').is(':hidden') && $('#player-view .summary').hasClass('min')) {
        return;
      }

      var nWindowWidth = $(window).width();
      var nPlayer = 0;
      var nPlayers = $('#player-view .player').length;

      $('#player-view .player').hide();
      if (!$('#player-view').hasClass('expand')) {
        var elPlayerSummaryOff = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
        elPlayerSummaryOff.addClass('transition');
        elPlayerSummaryOff.css('left', nWindowWidth);
        elPlayerSummaryOff.css('opacity', 0);
      }

      if (nCurrPlayer+1 >= nPlayers) {
        nPlayer = 0;
      }
      else {
        nPlayer = nCurrPlayer+1;
      }
      nCurrPlayer = nPlayer;

      var elPlayerSummaryOn = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
      elPlayerSummaryOn.hide();
      elPlayerSummaryOn.removeClass('transition');
      elPlayerSummaryOn.css('opacity', 0);
      elPlayerSummaryOn.css('left', -elPlayerSummaryOn.width());
      elPlayerSummaryOn.show();
      setTimeout(function(){
        elPlayerSummaryOn.addClass('transition');
        elPlayerSummaryOn.css('opacity', 1);
        elPlayerSummaryOn.css('left', (nWindowWidth - elPlayerSummaryOn.width()) / 2);
      }, 50);

      focusPlayer(nCurrPlayer);
    }

    function selectPlayer(nPlayer) {
      if (nPlayer != nCurrPlayer) {
        var nWindowWidth = $(window).width();

        $('#player-view .player').hide();
        var elPlayerSummaryOff = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
        elPlayerSummaryOff.addClass('transition');
        elPlayerSummaryOff.css('left', -elPlayerSummaryOff.width());
        elPlayerSummaryOff.css('opacity', 0);

        var elPlayerSummaryOn = $('#player-view .player-summary:eq(' + nPlayer + ')');
        elPlayerSummaryOn.removeClass('transition');
        elPlayerSummaryOn.css('left', nWindowWidth);
        elPlayerSummaryOn.show();
        setTimeout(function(){
          elPlayerSummaryOn.addClass('transition');
          elPlayerSummaryOn.css('opacity', 1);
          elPlayerSummaryOn.css('left', (nWindowWidth - elPlayerSummaryOn.width()) / 2);
        }, 50);
      }
      nCurrPlayer = nPlayer;
      focusPlayer(nCurrPlayer);
    }

    function getJourneyEvents(journeyID) {
      var url = TB_API_URL + '/journeys/' + journeyID + '/events' + TB_API_EXT;
//      console.log(url);
      $.getJSON(url, function(result){
        mountainEventsCollection = new Backbone.Collection(result.body.events);
        setupMap();
      });
    }

    function getJourney(journeyID, mountain3DName) {
      var url = TB_API_URL + '/journeys/' + journeyID + TB_API_EXT;
//      console.log(url);
      $.getJSON(url, function(result){
        var jsonJourney = result.body.journeys[0];
        mountainModel = new Backbone.Model(jsonJourney);

        jsonRoute = {
          "type": "Feature",
          "properties": {
          "name": mountainModel.get('name'),
          "color": "#000000",
          },
          "geometry": {
            "type": "LineString",
            "coordinates": []
          }
        };
        // build geoJSON route
        $.each(mountainModel.get('route_points'), function(index) {
          jsonRoute.geometry.coordinates.push(this.coords);
        });
        // set distance
        mountainModel.set('distance', turf.length(jsonRoute, {units: 'kilometers'}));
//        setupMap(mountain3DName);
        getJourneyEvents(journeyID);
      });
    }

    function getPlayers() {
      app.dispatcher.on("Player:loaded", onPlayerLoaded);

      // get player activity data
      playerCollection.each(function(model){
        var player = new Player({ model: model, gameID: GAME_ID, journeyLength: mountainModel.get('distance'), journeyAscent: jsonCurrGame.ascent });

//        player.create();
        player.getProgress();
        model.set('playerObj', player);
      });

      // has the game finished?
      if (jsonCurrGame.game_now > jsonCurrGame.game_end && !Demo) {
// 180527 MLA - hide for now
//        challengeCompleteModalView.render(jsonCurrGame);
//        challengeCompleteModalView.show();
      }
      else if (jsonCurrGame.game_now < jsonCurrGame.game_start) {
        // is the game pending?
        challengePendingModalView.render(jsonCurrGame);
        challengePendingModalView.show();
      }
    }

    function getGame() {
      app.dispatcher.on("ChallengeView:ready", onGameLoaded);

      challengeView = new ChallengeView({ gameID: GAME_ID });

//      challengeView.create();
      challengeView.load();
    }

    function setLatestEnabledMarker(markerID) {
      var jsonData = {markerID: markerID};

      var url = GAME_API_URL + 'game/' + GAME_ID + '/player/' + activePlayer.id + '/marker';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          console.log('error');
          console.log(data);
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);
        }
      });
    }

    function handleResize(bReset) {
      var nWindowWidth = $(window).width();
      var nWindowHeight = $(window).height();

      if (bReset) {
        $('#player-view .summary').removeClass('min');
        $('#player-view').removeClass('transition');
      }

      // are we mobile?
      if (!$('#mobileTest').is(':hidden')) {
        // centre player
        var elPlayerSummary = $('#player-view .player-summary:eq(' + nCurrPlayer + ')');
        elPlayerSummary.removeClass('transition');
        elPlayerSummary.css('top', 0);
        elPlayerSummary.css('left', (nWindowWidth - elPlayerSummary.width()) / 2);

        $('#player-view .summary-max').removeClass('expanded');

        var nMapHeight = nWindowHeight - $('#header-view').height();

        $('#map-view').addClass('full-height');
        $('#map-view.full-height .map').css('height', nMapHeight);

        $('#player-view').css('top', nWindowHeight - $('#player-view .summary').height());
        $('#player-view .detail').css('height', nWindowHeight - 50); // summary.min
      }
      else {
        $('#map-view').removeClass('full-height');
        $('#player-view').css('top', 0);
        $('#player-view .detail').css('height', 'auto');
      }
    }

    var playerChallengeSuccessView = new PlayerChallengeSuccessView({ el: '#player-challenge-success-view' });

    $(window).resize(function() {
      handleResize(true);
    });
    handleResize(true);

    getGame();

    function getActivePlayerByToken(playerToken) {
      var self = this;
      var nPlayer = 0;

      var url = GAME_API_URL + "client/" + CLIENT_ID + "/playertoken/" + playerToken;
//      console.log(url);
      $.getJSON(url, function(result){
        onActivePlayerLoaded(result[0].id);
      });
    }

    function selectPlayerByID(playerID) {
      var self = this;
      var nPlayer = 0;

      // see if player is in game
      var player = playerCollection.get(playerID);
      if (player) {
        // found player
        nPlayer = playerCollection.indexOf(player);
      }
      selectPlayer(nPlayer);
    }

    function addMapMarkers(activePlayer) {
      // modify images to use image proxy
      var strImageHost = GAME_API_URL + 'imageproxy.php?url=';

      var fProgressKM = activePlayer.get('progress');
      var bEnabled = false;
      var latestMarker = null;

      mountainEventsCollection.each(function(event, index) {
        var strImage = '';

        if (event.get('assets').length) {
          // select 1st image asset
          $.each(event.get('assets')[0].media, function(index, media){
            if (media.mime_type == 'image/jpeg') {
              strImage = media.path + escape('?fm=jpg&w=64&h=64&fit=crop&q=80');
            }
          });
        }
        strImage = strImageHost + strImage;

        bEnabled = mountain3DView.addMarker(event.get('id'), event.get('coords'), fProgressKM, strImage, strImageHost + 'https://www.mountainrush.trailburning.com/static-assets/images/markers/marker-event-unlocked.png', strImageHost + 'https://www.mountainrush.trailburning.com/static-assets/images/markers/marker-event-locked.png');

        if (bEnabled) {
          latestMarker = event;
        }
      });

      return latestMarker;
    }

    function focusStory(id) {      
      var mountainStoryModel = mountainEventsCollection.get(id);
      if (mountainStoryModel != undefined) {
        if (timeoutStoryID) {
          window.clearTimeout(timeoutStoryID);
        }

        // focus on feature
        var coords = mountainStoryModel.get('coords');
        mountain3DView.focusLocation(coords[0], coords[1]);
        timeoutStoryID = window.setTimeout(function(){
          var nMarkerPos = mountainEventsCollection.indexOf(mountainStoryModel);

          // is the player fundraising, or is the first 'free' marker?
          // or is the player not in a fundraising game or is the game sponsored?
          var fFundRaisingGoal = this.currPlayerModel.get('fundraising_goal');

          if (((fFundRaisingGoal && fFundRaisingGoal > 0) || (nMarkerPos == 0)) || (!GAME_FUNDRAISING) || jsonCurrGame.sponsored)  {
            // bring up feature overlay
            mountainStoryModalView.render(jsonCurrGame, this.currPlayerModel, mountainStoryModel);
            mountainStoryModalView.show();
          }
          else {
            mountainLockedStoryModalView.render(this.currPlayerModel, mountainStoryModel);
            mountainLockedStoryModalView.show();
          }
        }, STORY_TIMER_DELAY);
      }
    }

    function buildGame() {
      var strCampaignFolder = '';
      switch (CAMPAIGN_TEMPLATE) {
        case 'default':
          break;

        default:
          strCampaignFolder = CAMPAIGN_TEMPLATE + '/';
          break;
      }

      playersSummaryView = new PlayersSummaryView({ el: '#players-summary-view', jsonGame: jsonCurrGame, playerCollection: playerCollection, activePlayer: activePlayer });
      playersSummaryView.render();

      playersListView = new PlayersListView({ el: '#players-list-view', jsonGame: jsonCurrGame, playerCollection: playerCollection, activePlayer: activePlayer });
      playersListView.render();

      playersDetailView = new PlayersDetailView({ el: '#players-detail-view', jsonGame: jsonCurrGame, playerCollection: playerCollection, activePlayer: activePlayer });
      playersDetailView.render();

      // modify images to use image proxy
      var strImageHost = GAME_API_URL + 'imageproxy.php?url=';

      mountain3DView.addRouteData(mountainModel.get('route_points'));

      var bRenderFlag = true;

      // hide flag when event points (because we expect an event point at the summit!) and player is active
      if (mountainEventsCollection.length && activePlayer) {
        bRenderFlag = false;
      }
      mountain3DView.addFlag(strImageHost + 'https://www.mountainrush.co.uk/static-assets/images/' + strCampaignFolder + 'markers/marker-location.png', bRenderFlag);
      mountain3DView.showBaseData();

      $('#players-summary-view .player-summary, #player-view .player-ranking, #players-detail-view .player-name').click(function(evt){
        selectPlayer(Number($(this).attr('data-pos')));
      });

      $('#player-view .summary-max, #player-view .back-to-mountain').click(function(evt){
        playerDetailCollapse();
      });

      $('.summary').swipe( {
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          if (direction == 'up') {
            playerDetailExpand();
          }
          if (direction == 'down') {
            playerDetailCollapse();
          }
          if (direction == 'left') {
            nextPlayer();
          }
          if (direction == 'right') {
            prevPlayer();
          }
        }, threshold: 10
      });

      // ready for action
      $('body').addClass('ready');

      setupKeyHandler();
    }

    function onDeviceNotCapable() {
      // there was a problem
      // pull the 1st player as the default
      var playerModel = playerCollection.at(0);
      deviceCapableModalView.render(playerModel);
      deviceCapableModalView.show();
    }

    function onLocationLoaded() {
      getPlayers();
    }

    function onFeaturesLoaded() {
      // is player active?
      if (activePlayer) {
        var latestEnabledMarker = addMapMarkers(activePlayer);
        // do we have an enabled marker?
        if (latestEnabledMarker) {
          latestEnabledMarkerID = latestEnabledMarker.get('id');
          // is it different from what the player has already seen?
          if (latestEnabledMarkerID != activePlayer.get('latestMarkerID')) {
            var nMarkerPos = mountainEventsCollection.indexOf(latestEnabledMarker);

            // is the player fundraising, or is the first 'free' marker?
            // or is the player not in a fundraising game or is the game sponsored?
            var fFundRaisingGoal = activePlayer.get('fundraising_goal');

            if (((fFundRaisingGoal && fFundRaisingGoal > 0) || (nMarkerPos == 0)) || (!GAME_FUNDRAISING) || jsonCurrGame.sponsored)  {
              // yes so update marker
              setLatestEnabledMarker(latestEnabledMarkerID);
            }
            showLatestEnabledMarkerID = latestEnabledMarkerID;
          }
        }
      }

      mountain3DView.addPlayers(playerCollection, activePlayer);
      mapReady();
    }

    function mapReady() {
      $('#player-view').show();

      // if we have a player id then use it
      if (PLAYER_ID) {
        selectPlayerByID(PLAYER_ID);
      }
      else {
        var nPlayer = 0;
        // do we have an active player?
        if (activePlayer) {
          var player = playerCollection.get(activePlayer.id);
          if (player) {
            // found player
            nPlayer = playerCollection.indexOf(player);
          }
        }
        selectPlayer(nPlayer);
      }

      $('#map-view #piste-view .powered-by').show();
      $('#map-view #piste-view .credits').show();

      $('#player-view .summary .arrow').addClass('active');
      
      $('body').addClass('map-ready');      
    }

    function onFeatureClicked(id) {
      stopShopTimer();

      switch (id) {
        case FLAG_ID:
          mountain3DView.playRoute();
          break;

        default:
          // is it a story?
          var mountainStoryModel = mountainEventsCollection.get(id);
          if (mountainStoryModel != undefined) {
            focusStory(id);
          }
          else {
            // is it a player?
            var playerModel = playerCollection.get(id);
            if (playerModel != undefined) {
              mountain3DView.playRoute();
              // force player update to get latest player details from provider
              playerModel.get('playerObj').getLatestDetails();
            }
          }
          break;
      }
    }

    function onPlayerActivityPhotoClicked() {
      stopShopTimer();
    }

    function onPlayerInviteClick() {
      var jsonCreateFields = gameInviteView.getFields();
      jsonCreateFields.gameID = GAME_ID;
      gameInviteView.setFields(jsonCreateFields);
      gameInviteView.render();

      $('#invite-friend-modal-view .modal').modal();
    }

    function onGameLoaded(jsonGame) {
      jsonCurrGame = jsonGame;

      playerCollection = new Backbone.Collection(jsonGame.players);

      // are we a single player game?
      if (jsonGame.players.length == 1) {
        $('body').addClass('single-player');
      }

      var ownerHasACause = false;
      // see if owner has a cause?
      var ownerPlayer = _.where(jsonGame.players, {id: jsonGame.ownerPlayerID})[0];
      if (ownerPlayer) {
        if (ownerPlayer.cause.length) {
          ownerHasACause = true;
        }
      }

      // are we a sponsored game, or a default template with a cause?
      if (jsonGame.sponsored || (CAMPAIGN_TEMPLATE == 'default' && ownerHasACause)) {
        $('body').addClass('sponsored');
      }
      // do we have a cause?
      if (ownerHasACause) {
        $('body').addClass('fundraising');
      }

      challengeCancelModalView.setGame(jsonCurrGame);

      sponsorView.render(jsonCurrGame);

      // convert UTC dates to local
      var dLocalGameNow = new Date(jsonGame.game_now);
      var dLocalGameStart = new Date(jsonGame.game_start);
      var dLocalGameEnd = new Date(jsonGame.game_end);

      // is game active?
      if ((dLocalGameStart < dLocalGameNow) || Demo) {
        //Always make game appear to be active
        if (Demo) {
          dLocalGameEnd.setTime(dLocalGameNow.getTime());
          dLocalGameEnd.setDate(dLocalGameEnd.getDate() + 5);
        }

        var elCountdownContainer = $('.countdown-container');
        var strDay = elCountdownContainer.attr('data-value-day');
        var strDays = elCountdownContainer.attr('data-value-days');

        // finished?
        if (dLocalGameEnd < dLocalGameNow) {
          elCountdownContainer.show();
        }

        $('.countdown .end').countdown(dLocalGameEnd).on('update.countdown', function(event) {
          var $this = $(this).html(event.strftime(''
            + '<span class="days">'
              + '<span class="time">%-D</span>'
              + '<span class="days-marker"> ' + ((Number(event.strftime('%-D')) == 1) ? strDay : strDays) + '</span>'
            + '</span>'
            + '<span class="hours">'
              + '<span class="time"><span>%H</span><span class="marker">:</span><span>%M</span><span class="marker">:</span><span>%S</span></span>'
            + '</span>'));
          elCountdownContainer.show();
        });
      }
      getJourney(jsonGame.journeyID, jsonGame.mountain3DName);
    }

    function onActivePlayerLoaded(playerID) {
      var player = playerCollection.get(playerID);
      if (player) {
        activePlayer = player;
      }
      buildGame();
    }

    function onPlayerLoaded(model) {
      if (TEST_PROGRESS) {
        if (TEST_PROGRESS >= 0) {
          model.set('elevationGainPercent', TEST_PROGRESS)
        }
      }

      // default to complete
      var fProgress = mountainModel.get('distance');
      // if not complete then calc how far
      if (model.get('elevationGainPercent') < 100) {
        fProgress = (model.get('elevationGainPercent') * mountainModel.get('distance')) / 100;
      }

      model.set('progress', fProgress);
      // modify avatar to use image proxy with campaign fallback
      model.set('avatar', GAME_API_URL + 'imageproxy.php?url=' + model.get('avatar') + '&urlfallback=https://www.mountainrush.co.uk/static-assets/images/' + CAMPAIGN_TEMPLATE + '/avatar_unknown.jpg');

      nPlayersLoaded++;

      // we now have all player data!
      if (nPlayersLoaded == playerCollection.length) {
        onPlayersLoaded();
      }
    }

    function onPlayersLoaded() {
      // sort by progress
      playerCollection.comparator = function(model) {
        return -model.get('progress');
      }
      playerCollection.sort();

      // sub sort by when ascent completed
      playerCollection.comparator = function(model) {
        if (model.get('ascentCompleted')) {
          return Date.parse(model.get('ascentCompleted'));
        }
      }
      playerCollection.sort();

      // fill in extra player data
      var nPos = 1;
      playerCollection.each(function(model){
        model.set('imagePath', model.get('avatar'));
        model.set('step', nPos);

        nPos++;
      });

      // check for active player
      if (getUserCookie(CLIENT_ID) != undefined) {
        getActivePlayerByToken(getUserCookie(CLIENT_ID));
      }
      else {
        buildGame();
      }
    }

    function onCancelGameClick() {
      challengeCancelModalView.render();
      challengeCancelModalView.show();
    }

    function onChallengeCancelled() {
      // visit profile
      window.location.href = HOST_URL+'/campaign/' + CAMPAIGN_ID + '/profile';
    }

    function setupKeyHandler() {
      // keyboard control
      $(document).keydown(function(e){
//        console.log(e.keyCode);
        switch (e.keyCode) {
          case 37: // previous
            prevPlayer();
            break;

          case 39: // next
            nextPlayer();
            break;

          case 38: // collapse
            playerDetailCollapse();
            break;

          case 40: // expand
            playerDetailExpand();
            break;

          case 48: // 0
            mountain3DView.playRoute();
            break;

          case 49: // 1
            mountain3DView.setSeason(SEASON_SUMMER_EUROPE);
            break;

          case 50: // 2
            mountain3DView.setSeason(SEASON_WINTER_EUROPE);
            break;
        }
      });
    }
  };

  return { 
    initialize: initialize
  };
});
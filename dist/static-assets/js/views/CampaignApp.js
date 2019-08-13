var app = app || {};

define([
  'underscore',
  'backbone',
  'bootstrap', 
  'jqueryUI',
  'cookie',
  'truncate',
  'modernizr',
  'imageScale',
  'imagesLoaded',
  'videojs',
  'views/LanguageSelectorView',
  'views/ActivePlayerView',
  'views/PlayerGameView',
  'views/ChallengeVoteModalView',
  'views/CampaignSummaryStickerView',
  'views/CampaignSummaryView',
  'views/PlayerLeaderboardView',
  'views/PlayerSearchView',
  'views/DemoVideoView',
  'views/SocialFeatureView',
  'views/SocialPhotosView'
], function(_, Backbone, bootstrap, jqueryUI, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, LanguageSelectorView, ActivePlayerView, PlayerGameView, ChallengeVoteModalView, CampaignSummaryStickerView, CampaignSummaryView, PlayerLeaderboardView, PlayerSearchView, DemoVideoView, SocialFeatureView, SocialPhotosView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    $('body').addClass('web');

    app.dispatcher.on("CampaignSummaryStickerView:feedready", onCampaignSummaryStickerFeedReady);
    app.dispatcher.on("CampaignSummaryView:feedready", onCampaignSummaryFeedReady);
    app.dispatcher.on("PlayerLeaderboardView:feedready", onPlayerLeaderboardFeedReady);
    app.dispatcher.on("SocialFeatureView:feedready", onSocialFeatureFeedReady);
    app.dispatcher.on("SocialFeatureView:feednotavailable", onSocialFeatureFeedNotAvailable);
    app.dispatcher.on("SocialPhotosView:feedready", onSocialPhotosFeedReady);

    function setupVideo() {
      var elVideo = $('#intro-view .media-player:eq(0)');
      if (elVideo.length) {
        $('#intro-view .video-container').show();

        self.objVideo = videojs(elVideo.attr('id'));
        self.objVideo.src(elVideo.attr('url'));
        self.objVideo.load();

        self.objVideo.on('play', function() {
          self.objVideo.posterImage.hide();
          self.objVideo.controlBar.show();
          self.objVideo.bigPlayButton.hide();
        });

        self.objVideo.on('ended', function() {
          self.objVideo.posterImage.show();
          $(this.posterImage.contentEl()).show();
          $(this.bigPlayButton.contentEl()).show();
          self.objVideo.currentTime(0);
          self.objVideo.controlBar.hide();
          self.objVideo.bigPlayButton.show();
          self.objVideo.exitFullscreen();
        });
      }
    }

    function onCampaignSummaryStickerFeedReady() {
      campaignSummaryStickerView.render();
    }

    function onCampaignSummaryFeedReady() {
      $('#summary-loader-view').hide();
      campaignSummaryView.render();
    }

    function onPlayerLeaderboardFeedReady() {
      $('#leader-loader-view').hide();
      playerLeaderboardView.render();
    }

    function onSocialFeatureFeedReady() {
      $('#community-feature-loader-view').hide();
      socialFeatureView.render();
    }

    function onSocialFeatureFeedNotAvailable() {
      // no feature so hide
      $('#community-feature-loader-view').hide();
      $('#community-climber-feature-view').hide();
    }

    function onSocialPhotosFeedReady() {
      $('#community-photos-loader-view').hide();
      socialPhotosView.render();
    }

    function onPlayerGameViewReady() {
      // show game view if we have an active game
      if (playerGameView.getActiveGame()) {
        playerGameView.render();
        playerGameView.show();
      }
    }

    $('#loader-view').show();

    // check for player
    if (getUserCookie(CLIENT_ID) != undefined) {
      var jsonUser = getUserCookies(CLIENT_ID);

      $('.visible-player-active').show();

      app.dispatcher.on("PlayerGameView:loaded", onPlayerGameViewReady);

      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });

      var playerGameView = new PlayerGameView({ el: '#player-game-view', playerID: jsonUser.user });
      playerGameView.getPlayerGame(CLIENT_ID);
    }
    else {
      $('.visible-player-inactive').show();
    }

    $('.vote-btn').click(function(evt){
      var radioValue = $("input[name='vote-species']:checked").val();
      if(radioValue){
        var jsonData = {name: $(this).attr('data-id'),
                        vote: radioValue};

        var url = GAME_API_URL + 'vote';
//        console.log(url);
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
//            console.log('success');
//            console.log(data);
          }
        });

        challengeVoteModalView.render();
        challengeVoteModalView.show();
      }
    });

    $('.signout').click(function(evt){
      removeUserCookie(CLIENT_ID);
    });

    $('.demo-video').click(function(evt){
      demoVideoView.render();
      demoVideoView.show();
    });

    var languageSelectorView = new LanguageSelectorView({ el: '#language-selector-view' });
    languageSelectorView.render();

    enableUserActions(CLIENT_ID);

    setupVideo();

    var challengeVoteModalView = new ChallengeVoteModalView({ el: '#challenge-vote-modal-view' });

    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

    var campaignSummaryStickerView = new CampaignSummaryStickerView({ el: '#campaign-summary-sticker-view', campaignID: CAMPAIGN_ID });
    campaignSummaryStickerView.loadFeed();

    var campaignSummaryView = new CampaignSummaryView({ el: '#campaign-summary-view', campaignID: CAMPAIGN_ID });
    campaignSummaryView.loadFeed();

    var playerLeaderboardView = new PlayerLeaderboardView({ el: '#leaderboard-view', campaignID: CAMPAIGN_ID });
    playerLeaderboardView.loadFeed();

    var playerSearchView = new PlayerSearchView({ el: '#supporter-search-view', campaignID: CAMPAIGN_ID, hostURL: HOST_URL });
    playerSearchView.render();

    var socialFeatureView = new SocialFeatureView({ el: '#community-feature-view', feed: CAMPAIGN_JUICER_FEED });
    socialFeatureView.loadFeed();

    var socialPhotosView = new SocialPhotosView({ el: '#community-photos-view', feed: CAMPAIGN_JUICER_FEED });
    socialPhotosView.loadFeed();

    $('img.scale').imageScale({
      'rescaleOnResize': true,
      'align': 'top'
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
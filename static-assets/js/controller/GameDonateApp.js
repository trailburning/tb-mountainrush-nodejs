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
  'raisenow',
  'views/ActivePlayerView',
  'views/DemoVideoView'
], function(_, Backbone, bootstrap, cookie, truncate, modernizr, imageScale, imagesLoaded, videojs, raisenow, ActivePlayerView, DemoVideoView){
  app.dispatcher = _.clone(Backbone.Events);

  _.templateSettings = {
      evaluate:    /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape:      /\{\{-(.+?)\}\}/g
  };

  var initialize = function() {
    var self = this;

    function setupDonationForm() {
      window.rnwWidget = window.rnwWidget || {};
      window.rnwWidget.configureWidget = [];

      window.rnwWidget.configureWidget.push(function(options) {
        if (FUNDRAISING_DONATION_AMOUNT) {
          options.defaults['ui_onetime_amount_default'] = FUNDRAISING_DONATION_AMOUNT;
        } 

        options.defaults['stored_TBGameID'] = '6x4wxw8YBD';
        options.defaults['stored_TBPlayerID'] = 'l6x4wV0rBD';

        options.extend({
          custom_fields : {
            stored_anonymous_donation : {
              type : 'checkbox',
              location : 'after',
              reference : 'empty-step',          
              label : 'Make my donation anonymous',
              value : 'true'
            },
            stored_customer_nickname : {
              type : 'text',
              location : 'after',
              reference : 'empty-step',          
              placeholder : 'Your name'
            },
            stored_customer_additional_message : {
              type : 'textarea',
              location : 'after',
              reference : 'empty-step',          
              placeholder : 'Your message of support',
              initial : '',
              rows: 8
            }
          }
        });

        options.widget.on(window.rnwWidget.constants.events.WIDGET_LOADED, function(event) {
/*        
          event.widget.hideStep("donation-target");
          event.widget.hideStep("customer-address");

          event.widget.hideBlock("customer_salutation");
          event.widget.hideBlock("customer_permission");
          event.widget.hideBlock("customer_email");
          event.widget.hideBlock("customer_message");
          event.widget.hideBlock("customer_receipt");
*/
        });
      });        
    }

    function showActivePlayer() {
      var jsonUser = getUserCookies(CLIENT_ID);
      $('.active-player-view').each(function(index){
        var activePlayerView = new ActivePlayerView({ el: $(this), player: jsonUser });
        activePlayerView.render();
      });
    }

    setupDonationForm();

    var demoVideoView = new DemoVideoView({ el: '#demo-video-view' });

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


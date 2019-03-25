var COOKIE_PREFIX = 'mountainrush';
var COOKIE_DELIM = '_';
var DEF_CLIENT_ID = 'djJrblYlXV'; // Mountain Rush
var TB_API_EXT = '';
var TB_API_URL = 'https://api.trailburning.com/v2';

//var TB_API_EXT = '.json';
//var TB_API_URL = 'http://localhost:8000/projects/Trailburning/tb-game-api/offline';
//var TB_API_URL = 'http://mountainrush.co.uk/tb-game-api/offline';

var FUNDRAISING_PROVIDER_RAISENOW = 'RaiseNow';
var FUNDRAISING_PROVIDER_JUSTGIVING = 'JustGiving';

require.config({
  waitSeconds: 20,
  paths: {
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min',
    jqueryUI: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
    jqueryForm: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min',
    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
    backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min',
    bootstrap: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min',
    imageScale: 'libs/image-scale.min',
    imagesLoaded: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.1.2/imagesloaded.pkgd.min',
    turf: 'https://npmcdn.com/@turf/turf@5.1.6/turf.min',
    piste: 'https://planet.procedural.eu/procedural-js/0.3.2/procedural',
    detector: 'https://planet.procedural.eu/procedural.detector',
    numeral: 'https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min',
    animateNumber: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-animateNumber/0.0.14/jquery.animateNumber.min',
    moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min',
    touch: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min',
    touchswipe: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.18/jquery.touchSwipe.min',
    photoswipe: 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min',
    photoswipeui: 'libs/photoswipe-ui-default-with-ig.min',
    countdown: 'libs/jquery.countdown.min',
    dateFormat: 'libs/jquery-dateFormat.min',
    datepicker: 'libs/bootstrap-datepicker',
    truncate: 'libs/jquery.truncate',
    cookie: 'libs/js.cookie',
    videojs: '//vjs.zencdn.net/4.12/video',
    modernizr: 'libs/modernizr-custom',
    mapbox: 'https://api.mapbox.com/mapbox.js/v2.4.0/mapbox',
    raisenow: 'https://widget.raisenow.com/widgets/lema/amp-test/js/dds-init-widget-en'
  },
  shim: {
    'jqueryUI' : {
      deps: ['jquery']
    },
    'bootstrap' : {
      deps: ['jquery'],
      deps: ['jqueryUI']
    },
    'imageScale': {
      deps: ['jquery'],
      exports: 'imageScale'
    },
    'touch' : {
      deps: ['jquery']
    },
    'animateNumber': {
      deps: ['jquery']
    },
    'touchswipe': {
      deps: ['jquery']
    },
    'dateFormat': {
      deps: ['jquery'],
      exports: 'dateFormat'
    },
    'datepicker' : {
      deps: ['bootstrap'],
      exports: '$.fn.datepicker'
    },
    'truncate' : {
      deps: ['jquery']
    },
    'countdown' : {
      deps: ['jquery']
    },
    'cookie' : {
      deps: ['jquery']
    },
    'raisenow' : {
      deps: ['jquery']
    },
    'imagesLoaded': {
      deps: ['jquery'],
      exports: 'imagesLoaded'
    },
    'controller/GameDonateApp': {
      deps: ['jquery'],
      deps: ['truncate'],
      deps: ['cookie']
    },
    'controller/GameApp': {
      deps: ['truncate'],
      deps: ['countdown'],
      deps: ['cookie']
    }
  }
});

function upload_image() {
  console.log('upload_image');

  var bar = $('#bar');
  var percent = $('#percent');
  $('#myForm').ajaxForm({
    beforeSubmit: function() {
      document.getElementById("progress_div").style.display="block";
      var percentVal = '0%';
      bar.width(percentVal)
      percent.html(percentVal);
    },

    uploadProgress: function(event, position, total, percentComplete) {
      console.log('uploadProgress');
      var percentVal = percentComplete + '%';
      bar.width(percentVal)
      percent.html(percentVal);
    },
    
    success: function() {
      console.log('success');
      var percentVal = '100%';
      bar.width(percentVal)
      percent.html(percentVal);
    },

    complete: function(xhr) {
      if (xhr.responseText) {
        console.log(xhr.responseText);
      }
    }
  }); 
}

function getFundraisingShoppingList(){
/*  
  var jsonFundraising = {items: [
    {amount: 4, buy: 'Could pay one day of', title: 'Ranger Rations', description: 'for an anti-poaching patrol', image: 'https://tbassets2.imgix.net/images/brands/mountainrush/clients/wwf-uk/shopping-list/WW11469.jpg'},
    {amount: 20, buy: 'Could pay for 5-day', title: 'Ranger Rations', description: 'for an anti-poaching patrol', image: 'https://tbassets2.imgix.net/images/brands/mountainrush/clients/wwf-uk/shopping-list/WW11469.jpg'},
    {amount: 120, buy: 'Could pay for one', title: 'GPS device', description: 'to help monitor mountain gorillas', image: 'https://tbassets2.imgix.net/images/brands/mountainrush/clients/wwf-uk/shopping-list/WW11469.jpg'}
    ]};
*/
  var jsonFundraising = {items: [
    {amount: 5, buy: 'Could pay for one', title: 'first aid kit', description: 'for an anti-poaching ranger', image: 'https://tbassets2.imgix.net/images/brands/mountainrush/clients/wwf-uk/shopping-list/WW1113632.jpg'}
    ]};

  var nRndItem = Math.floor(Math.random() * Math.floor(jsonFundraising.items.length));
  jsonFundraising.random_item_pos = nRndItem;

  return jsonFundraising;
}

function formatText(strText){
  return '<p>' + strText.replace(/(?:\r\n|\r|\n)/g, '<p></p>') + '</p>';
}

function validateForm(elForm){
  var bValidForm = true;

  $('.form-group', elForm).removeClass('has-error');
  $('.help-block', elForm).hide();

  // manage errs
  $('.required', elForm).each(function(){
    var bValidField = true;

    switch ($(this).attr('type')) {
      case 'checkbox':
        if (!$(this).is(':checked')) {
          bValidField = false;
        }
        break;

      case 'radio':
        // ensure something is selected
        if (!$('*[name="' + $(this).attr('name') + '"]').is(':checked')) {
          bValidField = false;
        }
        break;

      default:
        if ($(this).val() == '') {
          bValidField = false;
        }
        else {
          // check for min val
          if ($(this).attr('data-min-required')) {
            if (Number($(this).val()) < Number($(this).attr('data-min-required'))) {
              bValidField = false;
            }
          }
        }
        break;
    }

    if (!bValidField) {
      bValidForm = false;
      
      // first look for container
      var elParent = $(this).closest('.form-container');
      if (!elParent.length) {
        // not found so just use parent
        elParent = $(this).closest('div');
      }

      elParent.addClass('has-error');
      $('.help-block', elParent).show();
      // highlight that there is at least 1 error
      var elFormErr = $('.form-error', elForm);
      if (elFormErr.length) {
        elFormErr.addClass('has-error');
        $('.help-block', elFormErr).show();
      }
    }
  });
  return bValidForm;
}

function enableUserActions(clientID){
  // check for player
  if (getUserCookie(clientID) == undefined) {
    $('.action-signup').show();
  }
  else {
    $('.show-when-signed-in').show();
    $('.action-profile').show();
    $('.action-signout').show();
    $('.action-signup').hide();
  }
}

function updateUserCookies(clientID, strUser, strFirstname, strAvatar){
  var cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM + clientID + COOKIE_DELIM;
  if (clientID == DEF_CLIENT_ID) {
    cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM;
  }

  // store in cookies
  $.removeCookie(cookiePrefix + 'user', { path: '/' });
  $.cookie(cookiePrefix + 'user', strUser, { expires: 365, path: '/' });

  $.removeCookie(cookiePrefix + 'firstname', { path: '/' });
  $.cookie(cookiePrefix + 'firstname', strFirstname, { expires: 365, path: '/' });

  if (strAvatar) {
    $.removeCookie(cookiePrefix + 'avatar', { path: '/' });
    $.cookie(cookiePrefix + 'avatar', strAvatar, { expires: 365, path: '/' });
  }
}

function storeUserCookies(clientID, token, objUser){
  var cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM + clientID + COOKIE_DELIM;
  if (clientID == DEF_CLIENT_ID) {
    cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM;
  }

  // store in cookies
  $.removeCookie(cookiePrefix + 'usertoken', { path: '/' });
  $.removeCookie(cookiePrefix + 'user', { path: '/' });
  $.removeCookie(cookiePrefix + 'firstname', { path: '/' });
  $.removeCookie(cookiePrefix + 'avatar', { path: '/' });
  
  $.cookie(cookiePrefix + 'usertoken', token, { expires: 365, path: '/' });

  updateUserCookies(clientID, objUser.id, objUser.firstname, objUser.avatar);
}

function removeUserCookie(clientID){
  var cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM + clientID + COOKIE_DELIM;
  if (clientID == DEF_CLIENT_ID) {
    cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM;
  }

  $.removeCookie(cookiePrefix + 'usertoken', { path: '/' });
  $.removeCookie(cookiePrefix + 'user', { path: '/' });
  $.removeCookie(cookiePrefix + 'firstname', { path: '/' });
  $.removeCookie(cookiePrefix + 'avatar', { path: '/' });
}

function getUserCookie(clientID){
  var cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM + clientID + COOKIE_DELIM;
  if (clientID == DEF_CLIENT_ID) {
    cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM;
  }

  return $.cookie(cookiePrefix + 'usertoken');
}

function getUserIDCookie(clientID){
  var cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM + clientID + COOKIE_DELIM;
  if (clientID == DEF_CLIENT_ID) {
    cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM;
  }

  return $.cookie(cookiePrefix + 'user');
}

function getUserCookies(clientID){
  var cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM + clientID + COOKIE_DELIM;
  if (clientID == DEF_CLIENT_ID) {
    cookiePrefix = COOKIE_PREFIX + COOKIE_DELIM;
  }

  if ($.cookie(cookiePrefix + 'usertoken') == undefined) {
    return false;
  }
  return { user: $.cookie(cookiePrefix +'user'), token: $.cookie(cookiePrefix +'usertoken'), firstname: $.cookie(cookiePrefix + 'firstname'), avatar: $.cookie(cookiePrefix + 'avatar') };
}

function getLangCookie(){
  return $.cookie(COOKIE_PREFIX + COOKIE_DELIM + 'lang');
}

function setLangCookie(strLang){
  $.cookie(COOKIE_PREFIX + COOKIE_DELIM + 'lang', strLang, { path: '/' });
}

// Load our app module and pass it to our definition function
require(['controller/' + APP], function(App){
  App.initialize();
})

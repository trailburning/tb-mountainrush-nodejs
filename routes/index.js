'use strict';

const DATABASE_URL = process.env.CLEARDB_DATABASE_URL || 'empty';
const MRAPIURL = 'https://tb-game-api.herokuapp.com/';

const DEF_CAMPAIGN = 'djJrblYlXV';
const DEF_GAME = 'l6x4weZBDV';

function BaseHTTPURL(req) {
  var url = require('url');

  var completeURL = url.format({
    protocol: req.protocol.replace('https', 'http'),
    host: req.get('host')
  });

  return completeURL;
}

function BaseHTTPSURL(req) {
  var url = require('url');

  var completeURL = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });

  // only change if not localhost
  if (!req.get('host').includes('localhost')) {
    completeURL = url.format({
      protocol: req.protocol.replace('http', 'https'),
      host: req.get('host')
    });
  }

  return completeURL;
}

function getDefs(req) {
  var defs = new Object();
  defs.MRAPIURL = MRAPIURL;
  defs.BaseHTTPURL = BaseHTTPURL(req);
  defs.BaseHTTPSURL = BaseHTTPSURL(req);

  return defs;
}

function fillCampaignData(data) {
  var campaignData = null;

  if (data) {
    campaignData = data[0];

    var campaignFundraising = 0;
    if (campaignData.fundraising_provider) {
      campaignFundraising = 1;
    }

    var campaign = new Object();
    campaign.ClientID = campaignData.clientID;
    campaign.ClientShortName = campaignData.client_shortname;
    campaign.CampaignID = campaignData.id;
    campaign.CampaignName = campaignData.name;
    campaign.CampaignTemplate = campaignData.template;
    campaign.CampaignShortName = campaignData.shortname;
    campaign.CampaignDescription = campaignData.description;
    campaign.CampaignTemplate = campaignData.template;
    campaign.CampaignJuicerFeed = campaignData.juicer_feed;
    campaign.CampaignInvitationCode = campaignData.invitation_code;
    campaign.CampaignFundraisingMinimum = campaignData.fundraising_minimum;
    campaign.CampaignFundraisingProvider = campaignData.fundraising_provider;
    campaign.CampaignFundraisingPage = campaignData.fundraising_page;
    campaign.CampaignFundraisingDonation = campaignData.fundraising_donation;
    campaign.CampaignFundraising = campaignFundraising;    
  }

  return campaign;
}

function getCampaignDataByCampaign(campaignID, callback) {
  var request = require('request');

  var url = MRAPIURL + 'campaign/' + campaignID;
//  console.log(url);
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
        return callback(err, null);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        return callback(err, null);
      } else {
        // data is already parsed as JSON:
        return callback(err, fillCampaignData(data));
      }
  });
}

function getCampaignDataByGame(gameID, callback) {
  var request = require('request');

  var url = MRAPIURL + 'game/' + gameID + '/campaign';
//  console.log(url);
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
        return callback(err, null);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        return callback(err, null);
      } else {
        // data is already parsed as JSON:
        return callback(err, fillCampaignData(data));
      }
  });
}

function getCampaignProviderConnectData(campaignID, callback) {
  var request = require('request');

  var url = MRAPIURL + 'campaign/' + campaignID + '/strava/oauth';
//  console.log(url);
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
        return callback(err, null);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        return callback(err, null);
      } else {
        // data is already parsed as JSON:
        return callback(err, data);
      }
  });
}

function getCampaignProviderConnectDataAndToken(campaignID, activityProviderCode, callback) {
  var request = require('request');

  var url = MRAPIURL + 'campaign/' + campaignID + '/strava/code/' + activityProviderCode + '/token';
//  console.log(url);
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
        return callback(err, null);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        return callback(err, null);
      } else {
        // data is already parsed as JSON:
        return callback(err, data);
      }
  });
}

function getSocialImage(gameID, callback) {
  var request = require('request');

  var url = MRAPIURL + 'game/' + gameID +'/socialimage';
//  console.log(url);
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
        return callback(err, null);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        return callback(err, null);
      } else {
        // data is already parsed as JSON:
        return callback(err, data);
      }
  });
}

function handlePageRegister(req, res, strPageState) {
  var defs = getDefs(req);
  defs.PageRegisterState = strPageState;
  defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

  getCampaignDataByCampaign(req.params.campaignID, function(err, campaign){ 
    getCampaignProviderConnectData(req.params.campaignID, function(err, data){ 
      if (data) {
        defs.StravaOauthConnectURL = data.oauthConnectURL;
      
        res.render('pages/register', {Defs: defs, Campaign: campaign});
      }
      else {
        // something went wrong getting data
        if (req.params.campaignID == DEF_CAMPAIGN) {
          res.render('pages/index', {Defs: defs, Campaign: campaign});
        }
        else {
          defs.ImageCopyright = '© naturepl.com / Andy Rouse / WWF';

          res.render('pages/campaign', {Defs: defs, Campaign: campaign});
        }
      }
    });
  });
}

module.exports = function(app) {
  app.get('/', function(req, res) {
    var defs = getDefs(req);

    getCampaignDataByCampaign('djJrblYlXV', function(err, campaign){ 
      res.render('pages/index', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID/game/:gameID/fundraise', function(req, res) {
    var defs = getDefs(req);
    defs.GameID = req.params.gameID;
    defs.PageRegisterState = 'fundraise';
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req.params.campaignID, function(err, campaign){ 
      res.render('pages/register', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID', function(req, res) {
    var defs = getDefs(req);
    defs.ImageCopyright = '© naturepl.com / Andy Rouse / WWF';

    getCampaignDataByCampaign(req.params.campaignID, function(err, campaign){ 
      res.render('pages/campaign', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/demo', function(req, res) {
    var defs = getDefs(req);
    defs.Demo = 1;
    defs.PlayerID = null;
    defs.GameID = DEF_GAME;
    defs.FundraisingDonationID = '';

    getCampaignDataByGame(defs.GameID, function(err, campaign){ 
      // get social image
      getSocialImage(defs.GameID, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });

  app.get('/game/:gameID', function(req, res) {
    var defs = getDefs(req);
    defs.Demo = 0;
    defs.PlayerID = null;
    defs.GameID = req.params.gameID;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
    if (req.query.jgDonationId) {
      defs.FundraisingDonationID = req.query.jgDonationId;
    }

    getCampaignDataByGame(defs.GameID, function(err, campaign){ 
      // get social image
      getSocialImage(defs.GameID, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });

  app.get('/game/:gameID/player/:playerID', function(req, res) {
    var defs = getDefs(req);
    defs.Demo = 0;
    defs.PlayerID = req.params.playerID;
    defs.GameID = req.params.gameID;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
    if (req.query.jgDonationId) {
      defs.FundraisingDonationID = req.query.jgDonationId;
    }

    getCampaignDataByGame(defs.GameID, function(err, campaign){ 
      // get social image
      getSocialImage(defs.GameID, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });

  app.get('/campaign/:campaignID/register', function(req, res) {
    var defs = getDefs(req);
    defs.PageRegisterState = 'register';
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req.params.campaignID, function(err, campaign){ 
      // do we have a connect code from Strava?
      if (req.query.code) {
        // Use code to get token
        getCampaignProviderConnectDataAndToken(req.params.campaignID, req.query.code, function(err, data){ 
          defs.StravaOauthConnectURL = data.oauthConnectURL;
          defs.StravaToken = data.token;
          
          res.render('pages/register', {Defs: defs, Campaign: campaign});
        });
      } else {
        getCampaignProviderConnectData(req.params.campaignID, function(err, data){ 
          defs.StravaOauthConnectURL = data.oauthConnectURL;
          
          res.render('pages/register', {Defs: defs, Campaign: campaign});
        });        
      }
    });
  });

  app.get('/campaign/:campaignID/profile', function(req, res) {
    handlePageRegister(req, res, 'register');
  });

  app.get('/campaign/:campaignID/preferences', function(req, res) {
    handlePageRegister(req, res, 'prefs');
  });

  app.get('/campaign/:campaignID/invite', function(req, res) {
    handlePageRegister(req, res, 'invite');
  });

  app.get('/campaign/:campaignID/gamecreate', function(req, res) {
    handlePageRegister(req, res, 'gamecreate');
  });

  app.get('/campaign/:campaignID/gamecreated', function(req, res) {
    handlePageRegister(req, res, 'gamecreated');
  });

  app.get('/campaign/:campaignID/fundraise', function(req, res) {
    handlePageRegister(req, res, 'fundraise');
  });

  app.get('/campaign/:campaignID/fundraisecreated', function(req, res) {
    handlePageRegister(req, res, 'fundraisecreated');
  });

};
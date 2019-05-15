'use strict';

var helper = require('./helper.js');

function fillCampaignData(req, data) {
  var campaignData = null;

  if (data) {
    campaignData = data[0];
    if (campaignData) {
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
      campaign.CampaignFundraisingCurrency = campaignData.fundraising_currency;
      campaign.CampaignFundraisingMinimum = campaignData.fundraising_minimum;
      campaign.CampaignFundraisingProvider = campaignData.fundraising_provider;
      campaign.CampaignFundraisingPage = campaignData.fundraising_page;
      campaign.CampaignFundraisingDonation = campaignData.fundraising_donation;
      campaign.CampaignFundraising = campaignFundraising;    
      campaign.CampaignLanguages = campaignData.languages;

      // only accept selected locale if it's available
      var selLang = campaign.CampaignLanguages[0]; // def to 1st lang

      for (var i = 0; i < campaign.CampaignLanguages.length; i++){
        var obj = campaign.CampaignLanguages[i];
        // selected locale is available
        if (obj['name'] == req.getLocale()) {
          selLang = obj;
        }
      }
      req.setLocale(selLang['name']);
      campaign.SelLanguage = selLang;
    }
  }

  return campaign;
}

function getCampaignDataByCampaign(req, campaignID, callback) {
  var request = require('request');

  var url = process.env.MR_API_URL + 'campaign/' + campaignID;
  console.log(url);
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
        return callback(err, fillCampaignData(req, data));
      }
  });
}

function getCampaignDataByGame(req, gameID, callback) {
  var request = require('request');

  var url = process.env.MR_API_URL + 'game/' + gameID + '/campaign';
  console.log(url);
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
        return callback(err, fillCampaignData(req, data));
      }
  });
}

function getCampaignProviderConnectData(campaignID, callback) {
  var request = require('request');

  var url = process.env.MR_API_URL + 'campaign/' + campaignID + '/strava/oauth';
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

  var url = process.env.MR_API_URL + 'campaign/' + campaignID + '/strava/code/' + activityProviderCode + '/token';
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

  var url = process.env.MR_API_URL + 'game/' + gameID + '/socialimage';
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

function getSocialImageGoal(gameID, goal, callback) {
  var request = require('request');

  var url = process.env.MR_API_URL + 'game/' + gameID + '/socialimage/goal/' + goal;
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

function getSocialImageProgress(gameID, progress, callback) {
  var request = require('request');

  var url = process.env.MR_API_URL + 'game/' + gameID + '/socialimage/progress/' + progress;
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
  var defs = helper.getDefs(req);
  defs.PageRegisterState = strPageState;
  defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

  getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
    getCampaignProviderConnectData(req.params.campaignID, function(err, data){ 
      if (data) {
        defs.StravaOauthConnectURL = data.oauthConnectURL;
      
        res.render('pages/register', {Defs: defs, Campaign: campaign});
      }
      else {
        // something went wrong getting data
        if (req.params.campaignID == process.env.MR_DEF_CAMPAIGN) {
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
    var defs = helper.getDefs(req);

    getCampaignDataByCampaign(req, 'djJrblYlXV', function(err, campaign){ 
      res.render('pages/index', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID/game/:gameID/fundraise', function(req, res) {
    var defs = helper.getDefs(req);
    defs.GameID = req.params.gameID;
    defs.PageRegisterState = 'fundraise';
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      res.render('pages/register', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID/game/:gameID/fundraisecreated', function(req, res) {
    var defs = helper.getDefs(req);
    defs.GameID = req.params.gameID;
    defs.PageRegisterState = 'fundraise';
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      res.render('pages/register', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID', function(req, res) {
    var defs = helper.getDefs(req);
    defs.ImageCopyright = 'Photo by Galen Crout on Unsplash';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      if (campaign) {
        res.render('pages/campaign', {Defs: defs, Campaign: campaign});
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });
      }
    });
  });

  app.get('/campaign/:campaignID/privacy', function(req, res) {
    var defs = helper.getDefs(req);
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      if (campaign) {
        res.render('pages/privacy', {Defs: defs, Campaign: campaign});
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });
      }
    });
  });

  app.get('/campaign/:campaignID/about', function(req, res) {
    var defs = helper.getDefs(req);
    defs.ImageCopyright = '© Martin Harvey / WWF';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      if (campaign) {
        res.render('pages/about', {Defs: defs, Campaign: campaign});
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });
      }
    });
  });

  app.get('/campaign/:campaignID/faq', function(req, res) {
    var defs = helper.getDefs(req);
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      if (campaign) {
        res.render('pages/faq', {Defs: defs, Campaign: campaign});
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });
      }
    });
  });

  app.get('/campaign/:campaignID/support', function(req, res) {
    var defs = helper.getDefs(req);
    defs.ImageCopyright = '© Martin Harvey / WWF';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
      if (campaign) {
        res.render('pages/support', {Defs: defs, Campaign: campaign});
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });
      }
    });
  });

  app.get('/demo', function(req, res) {
    var defs = helper.getDefs(req);
    defs.Demo = 1;
    defs.PlayerID = null;
    defs.GameID = process.env.MR_DEF_GAME;
    defs.FundraisingDonationID = '';

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      // get social image
      getSocialImage(defs.GameID, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });

  app.get('/game/:gameID/details', function(req, res) {
    var defs = helper.getDefs(req);
    defs.GameID = req.params.gameID;

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      if (campaign) {
        // get social image
        getSocialImage(defs.GameID, function(err, strImage){ 
          defs.SocialImage = strImage;

          res.render('pages/gamedetails', {Defs: defs, Campaign: campaign});
        });        
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });        
      }
    });
  });

  app.get('/game/:gameID', function(req, res) {
    var defs = helper.getDefs(req);
    defs.Demo = 0;
    defs.PlayerID = null;
    defs.GameID = req.params.gameID;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
    if (req.query.jgDonationId) {
      defs.FundraisingDonationID = req.query.jgDonationId;
    }

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      if (campaign) {
        // get social image
        getSocialImage(defs.GameID, function(err, strImage){ 
          defs.SocialImage = strImage;

          res.render('pages/game', {Defs: defs, Campaign: campaign});
        });        
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });        
      }
    });
  });

  app.get('/game/:gameID/player/:playerID', function(req, res) {
    var defs = helper.getDefs(req);
    defs.Demo = 0;
    defs.GameID = req.params.gameID;
    defs.PlayerID = req.params.playerID;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
    if (req.query.jgDonationId) {
      defs.FundraisingDonationID = req.query.jgDonationId;
    }

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      if (campaign) {
        // get social image
        getSocialImage(defs.GameID, function(err, strImage){ 
          defs.SocialImage = strImage;

          res.render('pages/game', {Defs: defs, Campaign: campaign});
        });
      }
      else {
        getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
          res.render('pages/page-error', {Defs: defs, Campaign: campaign});
        });        
      }
    });
  });

  app.get('/game/:gameID/player/:playerID/test/:testProgress', function(req, res) {
    var defs = helper.getDefs(req);
    defs.Demo = 0;
    defs.GameID = req.params.gameID;
    defs.PlayerID = req.params.playerID;
    defs.TestProgress = req.params.testProgress;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
    if (req.query.jgDonationId) {
      defs.FundraisingDonationID = req.query.jgDonationId;
    }

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      // get social image
      getSocialImage(defs.GameID, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });

  app.get('/game/:gameID/player/:playerID/goal/:goal', function(req, res) {
    var defs = helper.getDefs(req);
    defs.Demo = 0;
    defs.GameID = req.params.gameID;
    defs.PlayerID = req.params.playerID;
    defs.PlayerGoal = req.params.goal;
    defs.FundraisingDonationID = '';

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      // get social goal image
      getSocialImageGoal(defs.GameID, defs.PlayerGoal, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });

  app.get('/game/:gameID/player/:playerID/progress/:progress', function(req, res) {
    var defs = helper.getDefs(req);
    defs.Demo = 0;
    defs.GameID = req.params.gameID;
    defs.PlayerID = req.params.playerID;
    defs.PlayerProgress = req.params.progress;
    defs.FundraisingDonationID = '';

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      // get social goal image
      getSocialImageProgress(defs.GameID, defs.PlayerProgress, function(err, strImage){ 
        defs.SocialImage = strImage;

        res.render('pages/game', {Defs: defs, Campaign: campaign});
      });
    });
  });
  app.get('/game/:gameID/player/:playerID/donate', function(req, res) {
    var defs = helper.getDefs(req);
    defs.PlayerID = req.params.playerID;
    defs.GameID = req.params.gameID;

    // is there a passed amount?
    if (req.query.amount) {
      defs.FundraisingDonationAmount = req.query.amount;
    }

    getCampaignDataByGame(req, defs.GameID, function(err, campaign){ 
      res.render('pages/gamedonate', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID/register', function(req, res) {
    var defs = helper.getDefs(req);
    defs.PageRegisterState = 'register';
    defs.ImageCopyright = '© Sabrina Schumann / WWF-US';

    getCampaignDataByCampaign(req, req.params.campaignID, function(err, campaign){ 
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
    handlePageRegister(req, res, 'register');
  });

  app.get('/campaign/:campaignID/fundraisecreated', function(req, res) {
    handlePageRegister(req, res, 'fundraisecreated');
  });

  app.use(function(req, res){
//    console.log('FALLBACK');

    var defs = helper.getDefs(req);

    getCampaignDataByCampaign(req, process.env.MR_DEF_CAMPAIGN, function(err, campaign){ 
      res.render('pages/page-not-found', {Defs: defs, Campaign: campaign});
    });
  });

};
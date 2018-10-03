'use strict';

const DATABASE_URL = process.env.CLEARDB_DATABASE_URL || 'empty';
const MRAPIURL = 'https://tb-game-api.herokuapp.com/';

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
        return callback(err, fillCampaignData(data));
      }
  });
}

function getCampaignDataByGame(gameID, callback) {
  var request = require('request');

  var url = MRAPIURL + 'game/' + gameID + '/campaign';
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
        return callback(err, fillCampaignData(data));
      }
  });
}

module.exports = function(app) {
  app.get('/', function(req, res) {
    var defs = getDefs(req);

    getCampaignDataByCampaign('djJrblYlXV', function(err, campaign){ 
      res.render('pages/index', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID', function(req, res) {
    var defs = getDefs(req);

    getCampaignDataByCampaign(req.params.campaignID, function(err, campaign){ 
      defs.ImageCopyright = '© naturepl.com / Andy Rouse / WWF';

      res.render('pages/campaign', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/game/:gameID', function(req, res) {
    var defs = getDefs(req);
    defs.Demo = 0;
    defs.PlayerID = null;
    defs.GameID = req.params.gameID;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
/*    
    if ($this->getRequest()->getVar('jgDonationId')) {
      $this->FundraisingDonationID = $this->getRequest()->getVar('jgDonationId');
    }
*/
    getCampaignDataByGame(defs.GameID, function(err, campaign){ 
      res.render('pages/game', {Defs: defs, Campaign: campaign});
    });
/*
    $url = $this->HomePage->MRAPIURL . 'game/' . $this->GameID . '/socialimage';
    $this->SocialImage = file_get_contents($url);
*/
  });

  app.get('/game/:gameID/player/:playerID', function(req, res) {
    var defs = getDefs(req);
    defs.Demo = 0;
    defs.PlayerID = req.params.playerID;
    defs.GameID = req.params.gameID;
    defs.FundraisingDonationID = '';

    // is there a passed donation id?
/*    
    if ($this->getRequest()->getVar('jgDonationId')) {
      $this->FundraisingDonationID = $this->getRequest()->getVar('jgDonationId');
    }
*/
    getCampaignDataByGame(defs.GameID, function(err, campaign){ 
      res.render('pages/game', {Defs: defs, Campaign: campaign});
    });
/*
    $url = $this->HomePage->MRAPIURL . 'game/' . $this->GameID . '/socialimage';
    $this->SocialImage = file_get_contents($url);
*/
  });

};
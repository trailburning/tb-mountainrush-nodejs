'use strict';

const DATABASE_URL = process.env.CLEARDB_DATABASE_URL || 'empty';
const MRAPIURL = 'https://tb-game-api.herokuapp.com/';

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
        console.log(data);

        return callback(err, fillCampaignData(data));
      }
  });
}

module.exports = function(app) {
  app.get('/', function(req, res) {
    getCampaignDataByCampaign('djJrblYlXV', function(err, campaign){ 
      var defs = new Object();
      defs.MRAPIURL = MRAPIURL;

      console.log(campaign);
      res.render('pages/index', {Defs: defs, Campaign: campaign});
    });
  });

  app.get('/campaign/:campaignID', function(req, res) {
    getCampaignDataByCampaign(req.params.campaignID, function(err, campaign){ 
      var defs = new Object();
      defs.MRAPIURL = MRAPIURL;
      defs.imageCopyright = '© naturepl.com / Andy Rouse / WWF';

      console.log(campaign);
      res.render('pages/campaign', {Defs: defs, Campaign: campaign});
    });
  });
};
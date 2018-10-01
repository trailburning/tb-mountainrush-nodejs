'use strict';

module.exports = function(app) {
  app.get('/', function(req, res) {

    var defs = new Object();
    defs.MRAPIURL = 'https://tb-game-api.herokuapp.com/';

    var campaign = new Object();
    campaign.CampaignName = 'Mountain Rush';
    campaign.CampaignID = 'djJrblYlXV';
    campaign.CampaignTemplate = 'default';

    res.render('pages/index', {Defs: defs, Campaign: campaign});
 });
};
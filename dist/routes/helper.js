'use strict';

module.exports = {
  BaseHTTPURL:function(req) {
    var url = require('url');

    var completeURL = url.format({
      protocol: req.protocol.replace('https', 'http'),
      host: req.get('host')
    });

    return completeURL;
  },

  BaseHTTPSURL:function(req) {
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
  },

  getDefs:function(req) {    
    var defs = new Object();
    defs.MRAPIURL = process.env.MR_API_URL;
    defs.BaseHTTPURL = this.BaseHTTPURL(req);
    defs.BaseHTTPSURL = this.BaseHTTPSURL(req);
    defs.CurrentYear = new Date().getFullYear();
    defs.DeviceSource = '';
    if (req.query.source != undefined) {
      defs.DeviceSource = req.query.source;
    }

    return defs;
  }

};


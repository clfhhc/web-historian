var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

exports.serveAssets = function(res, asset, callback, headers, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, 'utf8', (err, data) => {
    if (err) {
      let headers = {'Content-Type': 'text/plain'};
      exports.sendResponse(res, 404, headers, 'Not Found');
    } else {
      exports.sendResponse(res, statusCode, headers, data, callback);
    }
    
  });
  
};



// As you progress, keep thinking about what helper functions you can put here!
// 1. sendResponse - David
exports.sendResponse = function(res, statusCode, headers, data, callback) {
  statusCode = statusCode || 200;
  headers = headers || {};
  res.writeHead(statusCode, headers);
  callback && res.on('end', callback);
  if (data) {
    res.end(data.toString('utf8'));
  } else {
    res.end();    
  }
};
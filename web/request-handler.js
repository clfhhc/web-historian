var url = require('url');
var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  
  console.log(pathname);
  if (req.method === 'GET') {
    if (pathname === '/') {
      //look up index.html in our server;
      //send response to the client with the html;
      var assetAddress = path.join(archive.paths.siteAssets, 'index.html');
      httpHelpers.serveAssets(res, assetAddress);
    } else {
      var testingAddress = path.join(archive.paths.siteAssets, pathname);
      fs.access(testingAddress, fs.constants.F_OK, (err) => {
        err && (testingAddress = path.join(archive.paths.archivedSites, pathname));
        httpHelpers.serveAssets(res, testingAddress);
      });
      
      
    }
  }
  
  if (req.method === 'POST') {
    if (pathname === '/') {
      //look up index.html in our server;
      //send response to the client with the html;
      var requestedUrl;
      var body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        requestedUrl = body.slice(body.indexOf('url=') + 'url='.length);
        archive.addUrlToList(requestedUrl, function() {
          httpHelpers.sendResponse(res, 302);
        });
      });
    } else {
      var assetAddress = path.join(archive.paths.siteAssets, pathname);
      httpHelpers.serveAssets(res, assetAddress);
    }
  }
  
  console.log(req.url); 
  console.log(req.method);
  console.log(req.form);                           
  // res.end(archive.paths.list);
};

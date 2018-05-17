var url = require('url');
var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  
  if (req.method === 'GET') {
    if (pathname === '/') {
      //look up index.html in our server;
      //send response to the client with the html;
      let headers = httpHelpers.headers;
      headers['Content-Type'] = 'text/html';
      let assetAddress = path.join(archive.paths.siteAssets, 'index.html');
      httpHelpers.serveAssets(res, assetAddress, undefined, headers);
    } else {
      var testingAddress = path.join(archive.paths.siteAssets, pathname);
      fs.access(testingAddress, fs.constants.F_OK, (err) => {
        let headers = {'Content-Type': (err ? 'text/plain' : 'text/css')}; //need to fix
        err && (testingAddress = path.join(archive.paths.archivedSites, pathname));
        httpHelpers.serveAssets(res, testingAddress, undefined, headers);
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
        archive.addUrlToList(requestedUrl, function(url) {
          archive.isUrlArchived(url, function(isArchived, url, testingAddress) {
            if (isArchived) {
              let headers = 'text/html';
              let statusCode = 302;
              httpHelpers.serveAssets(res, testingAddress, undefined, headers);
            } else {
              let loadingAddress = path.join(archive.paths.siteAssets, 'loading.html');
              let headers = 'text/html';
              let statusCode = 302;
              httpHelpers.serveAssets(res, loadingAddress, undefined, headers);
            }

          });
          
        });
      });// need to add the archived html
    } else {
      var testingAddress = path.join(archive.paths.siteAssets, pathname);
      fs.access(testingAddress, fs.constants.F_OK, (err) => {
        if (err) {
          httpHelpers.sendResponse(res, 500);
        } else {
          let headers = 'text/css';
          httpHelpers.serveAssets(res, testingAddress, undefined, headers);
        }
      });
    }
  }
  
  if (req.method === 'OPTIONS') {
    if (pathname === '/') {
      //look up index.html in our server;
      //send response to the client with the html;
      var headers = httpHelpers.headers;
      httpHelpers.sendResponse(res, 200, headers);
    } 
  }
  
                            
  // res.end(archive.paths.list);
};

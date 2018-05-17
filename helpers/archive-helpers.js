var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var https = require('https');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.access(exports.paths.list, fs.constants.F_OK, (err)=> { err && console.log('error'); });
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    let list = data.split('\n');
    return callback(list);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    let list = data.split('\n');
    if (list.includes(url)) {
      if (callback) {
        return callback(true, url, list);
      }
      return true;
    }
    if (callback) {
      return callback(false, url, list);
    }
    return false;
    
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(isInList, url, list) {
    if (isInList) {
      console.log(`The ${url} already existed in sites.txt.`);
      if (callback) {
        return callback(url, list);
      }
      
    }
    fs.appendFile(exports.paths.list, url + '\n', (err) => {
      if (err) { throw err; } 
      console.log(`The ${url} was appended to sites.txt.`);
      list.push(url);
      if (callback) {
        return callback(url, list);
      }
    });
    
  });
};

exports.isUrlArchived = function(url, callback) {
  let testingAddress = path.join(exports.paths.archivedSites, url);
  fs.access(testingAddress, fs.constants.F_OK, (err) => {
    if (callback) {
      return err ? callback(false, url, testingAddress) : callback(true, url, testingAddress);
    }
    return !!err;
  });
};

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i ++) {
    exports.isUrlArchived(urls[i], function(isArchived, url, testingAddress) {
      if (!isArchived) {
        https.get('https://' + (url), function(res) { 
          var body = '';
          res.on('data', function(chunk) {
            body += chunk;
          }).on('end', function() {
            fs.writeFile(testingAddress, body);
          }).on('error', function(err) {
            console.log('err: ' + err);
          });
        });
      }
          
    });
  }

  
  
};

var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
  fs.readfile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    let list = data.split('\n').slice(0, -1);
    return callback(list);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    let list = data.split('\n').slice(0, -1);
    if (list.includes(url)) {
      return callback(url, list, true);
    }
    return callback(url, list, false);
    
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(url, list, isIn) {
    if (isIn) {
      console.log(`The ${url} already existed in sites.txt.`);
      if (callback) {
        return callback(url, list, true);
      }
      
    }
    fs.appendFile(exports.paths.list, url + '\n', (err) => {
      if (err) { throw err; }
      console.log(`The ${url} was appended to sites.txt.`);
      list.push(url);
      if (callback) {
        return callback(url, list, false);
      }
    });
    
  });
};

exports.isUrlArchived = function(url, callback) {
};

exports.downloadUrls = function(urls) {
};

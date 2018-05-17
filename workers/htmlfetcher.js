// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

let htmlFetcher = function() {
  archive.readListOfUrls((urls) =>{
    archive.downloadUrls(urls);
  });
};

htmlFetcher();
console.log('done');
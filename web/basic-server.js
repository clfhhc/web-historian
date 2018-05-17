var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
// It's because we might invoke the server in any folder and we will dynamically create an archive folder to keep the sites and urls - David
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(handler.handleRequest);

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}


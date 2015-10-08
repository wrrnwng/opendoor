var http = require('http');
var handleRequest = require('./handleRequest');

var port = process.env.PORT || 8080;

var server = http.createServer(handleRequest);

server.listen(port, function() {
  console.log('Server listening on port:', port);
});
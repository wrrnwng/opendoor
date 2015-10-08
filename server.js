var http = require('http');
var handleRequest = require('./handleRequest');

var PORT = 8080;

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
  console.log('Server listening on port:', PORT);
});
/**
 * Server-related tasks
 * 
 */


// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// Instanciate the server module object
var server = {};

// @TODO GET RID OF THIS
// helpers.sendTwilioSms('9773151813', 'Hello', function(err){
//     console.log('this was the error', err);
// });

// Instantiate the HTTP 
server.httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});


server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

// Instanciate the HTTPS server
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
    server.unifiedServer(req, res);
});


// All the server logic for both http and https server
server.unifiedServer = function(req, res){
    
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the headers as an object 
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;


    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();

        
        // Choose the handler this request should go to. If one is not found, use the notFound 
        var choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;


        // Construct the data object to send to the handler
         var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };


        choosenHandler(data, function(statusCode, payload){
       

        statusCode = typeof(statusCode) == 'number' ? statusCode: 200;

        // Use the payload called back by the handler, or default
        payload = typeof(payload) == 'object' ? payload : {} ;

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the responce
        res.setHeader('Content-type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        console.log('Returning this responce : ', statusCode, payloadString);
        });
    });
};



server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks
};


// Init script
server.init = function(){
    // Start the HTTP server
  server.httpServer.listen(config.httpPort, function(){
    console.log("The server is listening on port "+config.httpPort);
  });
    // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function(){
    console.log("The server is listening on port "+config.httpsPort);
  });
};

// Export the module
module.exports = server;

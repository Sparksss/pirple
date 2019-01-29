var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res){

    var parsedUrl = url.parse(req.url, true);

    
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    var method = req.method.toLowerCase();

     // Construct the data object to send to the handler
     var data = {
        'trimmedPath': trimmedPath,
        'method': method,
    };

    var method = req.method.toLowerCase();

    var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    choosenHandler(data, function(statusCode, payload){
        

        statusCode = typeof(statusCode) == 'number' ? statusCode: 200;

        // Use the payload called baack  by the handler, or default
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


server.listen(3000, function(){
    console.log("The server is listening on port 3000 on localhost");
});

var handlers = {};


handlers.hello = function(data, callback) {
    callback(200, {message: 'Hello world! Have a nice day!'});
};


handlers.notFound = function(data, callback) {
    callback(404);
};

var router = {
    'route/hello': handlers.hello
};
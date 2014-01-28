var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response){
	console.log("sending 404...");
	response.writeHead(404, {'Content-Type':'text/plain'});
	response.write('Error 404: Resource not found.');
	response.end();
	console.log("sent 404...");
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{
			"content-type":mime.loopup(path.basename(filePath))
		});
	response.end(fileContents);	
}

function serveStatic(response, cache, absPath) {
	if(cache[absPath]) {
		sendFile(response,absPath,cache[absPath]);
	} else{
		fs.exists(absPath,function(exists) {
			if(exists) {
				fs.readFile(absPath,function(err,data){
					if(err) {
						send404(response);
					} else{
						cache[absPath] = data;
						sendFile(response,absPath,data);
					}
				});
			}else {
				send404(response);
			}
		});
	}
}

var server = http.createServer(function(request,response){
	var filePath = false;
	if(request.url == '/') {
		console.log("getting root path");
		filePath = 'public/index.html';
	} else {
		console.log("getting path");
		filePath = 'public' + request.url
	}
	var absPath = './' + filePath;
	serveStatic(response,cache,absPath)
}) ;

server.listen(3000,function(){
	console.log("server listening on port 3000.");
});
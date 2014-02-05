var formidable = require('formidable');
var httpServer = require('http');
var fs = require('fs');
var path = require('path'); 
httpServer.createServer(function(req, resp) {
    if(req.url == "/upload" && req.method.toString() == 'POST') {
        var form = new formidable.IncomingForm();
        var uploaded_file;
        form.uploadDir = "./tmp/"; 
        form.on('file', function(field, file) {
            uploaded_file = file.name;
            fs.rename(file.path, path.dirname(file.path) + '/' + file.name, function(err){
                if (err) {
                    console.error('rename failed' + err);
                }            
            });        });
        form.on('progress', function(byteReceived, byteExpected) {
            console.log('Uploaded: ' + Math.round(byteReceived/byteExpected * 100) + '%');
        });
        form.on('end', function() {
            resp.writeHead(200, {'content-type': 'text/plain'});
            resp.write("Uploaded file: " + uploaded_file);
            resp.write("\n");
            resp.end("Done");
        });    
        form.parse(req); 
        return;
    }
    else {
        resp.writeHead(200, {'content-type':'text/plain'});
        resp.end('Welcome to NodeJS\nplease say what you want to do');    
    }
}).listen(3000) 
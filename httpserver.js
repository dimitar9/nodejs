var http = require('http');
var url = require('url');
var items = [];
var server = http.createServer(function(req, res) {
  switch (req.method) {
  	case 'GET':
		items.forEach(function(item, i){
  			res.write(i + ') ' + item + '\n');
		});
		res.end();
		break;

  	case 'POST':
  		var item = ''

  		req.setEncoding('utf8')
  		req.on('data',function(chunk) {
    		console.log(chunk);
    		item += chunk;
    	});
  		req.on('end',function(){
    		console.log('done parsin');
    		items.push(item);
    		res.end('OK\n');
    	});
    	break;
    }
});




server.listen(3000);
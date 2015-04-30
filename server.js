var http = require('http'),
	util = require('util'),
	config = require('./lib/config.json'),
	cacheManager = require('./lib/cacheManager');

cacheManager.init();

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
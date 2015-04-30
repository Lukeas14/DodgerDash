var http = require('http'),
	util = require('util'),
	config = require('./lib/config.json'),
	cacheManager = require('./lib/cacheManager'),
	test = require('./test');
//console.log(config);
//
//console.log(util.format(config.apis.team_schedule, 119, 2015));

cacheManager.init();

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
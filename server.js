var http = require('http'),
	util = require('util'),
	config = require('./lib/config.json'),
	cacheManager = require('./lib/cacheManager');
	cache = require('./lib/cache');

cacheManager.initCache();

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	console.log(cache.teams[119]);
	res.end(JSON.stringify(cache.teams[119]));
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
var http = require('http'),
	util = require('util'),
	express = require('express'),
	config = require('./lib/config.json'),
	cacheManager = require('./lib/cacheManager');
	cache = require('./lib/cache');

setInterval(function() {
	cacheManager.initCache();
}, 600000);

var app = express();

app.get('/test', function(req, res){
	res.send(JSON.stringify(cache.teams[119]));
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(1337, function(){
	var host = server.address().address,
		port = server.address().port;

	console.log('Server running on port %s.', port);
});

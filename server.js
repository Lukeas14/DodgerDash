var http = require('http'),
	util = require('util'),
	express = require('express'),
	config = require('./lib/config.json'),
	cacheManager = require('./lib/cacheManager'),
	cache = require('./lib/cache'),
	log = require('./lib/log');

cacheManager.initCache();
setInterval(function() {
	cacheManager.initCache();
}, 600000);

var app = express();

app.get('/getTeam/*', function(req, res){
	var teamId = parseInt(req.params[0]);
	res.json(cache.teams[teamId]);
});

app.get("/cache", function(req, res){
	res.json(cache);
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(1337, function(){
	var host = server.address().address,
		port = server.address().port;

	log.info("Server running on port %s", port);
});

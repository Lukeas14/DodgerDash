var util = require('util'),
	_ = require('lodash'),
	csv = require('csv'),
	request = require('request'),
	moment = require('moment'),
	config = require('./config.json'),
	cache = require('./cache');

var teams = [119];
	getTeamSchedule = function(teamId){
		var currentYear = parseInt(moment.utc().format('YYYY')),
			uri = util.format(config.apis.team_schedule, teamId, currentYear),
			schedule = [];

		request(uri, function(err, res, body){
			if(!err && res.statusCode === 200){
				csv.parse(res.body, {}, function(err, output){
					cache.teams[teamId].schedule = _.rest(output);
					_.forEach(cache.teams[teamId].schedule, function(game){
						//startTime = moment("", "")
					});
					console.dir(cache.teams[teamId].schedule);
				});
			}
		});
	};

module.exports = {
	init: function(){
		_.forEach(teams, function(team){
			cache.teams[team] = {};

			getTeamSchedule(119);
		});
	}
};

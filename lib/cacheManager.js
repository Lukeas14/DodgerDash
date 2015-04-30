var util = require('util'),
	_ = require('lodash'),
	csv = require('csv'),
	request = require('request'),
	moment = require('moment-timezone'),
	config = require('./config.json'),
	cache = require('./cache');

var teams = [119];
	getTeamSchedule = function(teamId){
		var currentYear = parseInt(moment.utc().format('YYYY')),
			uri = util.format(config.apis.team_schedule, teamId, currentYear),
			now = moment.utc(),
			schedule = [],
			nextGame = null;

		request(uri, function(err, res, body){
			if(!err && res.statusCode === 200){
				csv.parse(res.body, {}, function(err, output){
					cache.teams[teamId].schedule = _.rest(output);
					_.forEach(cache.teams[teamId].schedule, function(game){
						startTime = moment.tz(game[0] + ' ' + game[2], "MM/DD/YY hh:mm A", "America/New_York").utc();
						if(startTime.isAfter(now)){
							if(nextGame === null){
								nextGame = game;
							}
						}
					});

					cache.teams[teamId].nextGame = nextGame;
					//console.log(nextGame);
				});
			}
		});
	},
	getTeamTweets = function(teamId) {
		var teamName = config.teams_by_id[teamId.toString()].name.toLowerCase(),
			uri = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.twitter, teamName);

		request(uri, function(err, res, body){
			if(!err && res.statusCode === 200){
				var tweets = JSON.parse(res.body);
			}
		});
	};


module.exports = {
	init: function(){
		_.forEach(teams, function(team){
			cache.teams[team] = {};

			getTeamSchedule(119);
			getTeamTweets(119)
		});
	}
};

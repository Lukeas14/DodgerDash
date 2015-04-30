var util = require('util'),
	_ = require('lodash'),
	csv = require('csv'),
	xml2js = require('xml2js'),
	request = require('request'),
	moment = require('moment-timezone'),
	config = require('./config.json'),
	cache = require('./cache');

var teams = [119],
	currentYear = parseInt(moment.utc().format('YYYY')),
	getTeams = function(leagu){
		var leagueIds = [
				config.leagues.national.id,
				config.leagues.american.id
			];

		_.forEach(leagueIds, function(leagueId){
			var uri = util.format(config.apis.lookup.base_uri + config.apis.lookup.uris.teams, leagueId, currentYear);
			request(uri, function(err, res, body){
				if(!err && res.statusCode === 200){
					xml2js.parseString(res.body, function(err, result){
						_.forEach(result.team_all_season.queryResults[0].row, function(team){
							var team = team.$;
							cache.teams[team.team_id] = _.assign(cache.teams[team.team_id], team);
						});
					});
				}
			});
		});
	},
	getTeamSchedule = function(teamId){
		var uri = util.format(config.apis.team_schedule, teamId, currentYear),
			now = moment.utc(),
			nextGame = null;

		request(uri, function(err, res, body){
			if(!err && res.statusCode === 200){
				csv.parse(res.body, {}, function(err, output){
					cache.teams[teamId].schedule = [];

					_.forEach(_.rest(output), function(game){
						var scheduledGame = {
							startTime: moment.tz(game[0] + ' ' + game[2], "MM/DD/YY hh:mm A", "America/New_York").utc(),
							name: game[3]
						};

						cache.teams[teamId].schedule.push(scheduledGame);

						if(scheduledGame.startTime.isAfter(now)){
							if(nextGame === null){
								cache.teams[teamId].nextGame = scheduledGame;
							}
						}
					});
				});
			}
		});
	},
	getTeamTweets = function(teamId) {
		var teamName = config.teams[teamId.toString()].twitterName,
			uri = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.twitter, teamName);

		request(uri, function(err, res, body){
			if(!err && res.statusCode === 200){
				var tweets = JSON.parse(res.body);
				cache.teams[teamId].tweets = tweets;
			}
		});
	};


module.exports = {
	initCache: function(){
		_.forEach(teams, function(team){
			cache.teams[team] = {};

			getTeams(config.leagues.national.id);
			getTeams(config.leagues.american.id);
			getTeamSchedule(119);
			getTeamTweets(119)
		});
	}
};

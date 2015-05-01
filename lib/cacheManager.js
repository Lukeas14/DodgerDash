var util = require('util'),
	_ = require('lodash'),
	csv = require('csv'),
	xml2js = require('xml2js'),
	Q = require('q'),
	request = Q.denodeify(require('request')),
	moment = require('moment-timezone'),
	config = require('./config.json'),
	cache = require('./cache');

var test = null;
var teams = [119],
	currentYear = parseInt(moment.utc().format('YYYY')),
	getPlayerStats = function(teamId, playerId){
		var batterURI = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.batter_stats, currentYear, playerId),
			pitcherURI = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.pitcher_stats, currentYear, playerId);

		//Get batting stats
		request(batterURI).then(function(res){
			xml2js.parseString(res[0].body, function(err, result){
				var battingStats = result.batting.$;
				cache.teams[teamId].players[playerId].battingStats = battingStats;
			});
		});

		//Get pitching stats
		request(pitcherURI).then(function(res){
			xml2js.parseString(res[0].body, function(err, result){
				var pitchingStats = result.pitching.$;
				cache.teams[teamId].players[playerId].pitchingStats = pitchingStats;
			});
		});
	},
	getTeamPlayers = function(teamId){
		var uri = util.format(config.apis.lookup.base_uri + config.apis.lookup.uris.players_by_team, teamId);

		return request(uri).then(function(res){
			var parser = new xml2js.Parser();
			xml2js.parseString(res[0].body, function(err, result){
				cache.teams[teamId].players = {};
				_.forEach(result.roster_all.queryResults[0].row, function(player){
					var player = player.$;
					cache.teams[teamId].players[player.player_id] = player;
				});
			});

			return;
		}, function(err){
			console.log('err', err);
		});
	},
	getTeams = function(){
		var leagueIds = [
				config.leagues.national.id,
				config.leagues.american.id
			];

		_.forEach(leagueIds, function(leagueId){
			var uri = util.format(config.apis.lookup.base_uri + config.apis.lookup.uris.teams, leagueId, currentYear);
			request(uri).then(function(res){
				xml2js.parseString(res[0].body, function(err, result){
					_.forEach(result.team_all_season.queryResults[0].row, function(team){
						var team = team.$;
						cache.teams[team.team_id] = _.assign(cache.teams[team.team_id], team);
					});
				});
			});
		});
	},
	getTeamSchedule = function(teamId){
		var uri = util.format(config.apis.team_schedule, teamId, currentYear),
			now = moment.utc();

		request(uri).then(function(res){
			csv.parse(res[0].body, {}, function(err, output){
				cache.teams[teamId].schedule = [];
				cache.teams[teamId].nextGame = null;

				_.forEach(_.rest(output), function(game){
					var scheduledGame = {
						startTime: moment.tz(game[0] + ' ' + game[2], "MM/DD/YY hh:mm A", "America/New_York").utc(),
						name: game[3]
					};

					cache.teams[teamId].schedule.push(scheduledGame);

					if(scheduledGame.startTime.isAfter(now)){
						if(cache.teams[teamId].nextGame === null){
							cache.teams[teamId].nextGame = scheduledGame;
							//Get game from gameday
						}
					}
				});
			});
		});
	},
	getTeamTweets = function(teamId) {
		var teamName = config.teams[teamId.toString()].twitterName,
			uri = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.twitter, teamName);

		request(uri).then(function(res){
			var tweets = JSON.parse(res[0].body);
			cache.teams[teamId].tweets = tweets;
		});
	};

module.exports = {
	initCache: function(){
		_.forEach(teams, function(team){
			cache.teams[team] = {};

			getTeams(config.leagues.national.id);
			getTeams(config.leagues.american.id);
			getTeamSchedule(team);
			getTeamTweets(team);
			getTeamPlayers(team).then(function(res){
				_.forEach(cache.teams[team].players, function(player, playerId){
					getPlayerStats(team, playerId);
				});
			});
		});
	}
};

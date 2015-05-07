var util = require('util'),
	_ = require('lodash'),
	csv = require('csv'),
	xml2js = require('xml2js'),
	Q = require('q'),
	request = Q.denodeify(require('request')),
	moment = require('moment-timezone'),
	config = require('./config.json'),
	cache = require('./cache');

var teams = [119],
	teamIdsByName = {},
	teamIdsByAbbrv = {},
	parser = new xml2js.Parser(),
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
		var requestPromises = [];

		_.forEach(config.leagues, function(league, leagueId){
			var uri = util.format(config.apis.lookup.base_uri + config.apis.lookup.uris.teams, leagueId, currentYear);
			var promise = request(uri).then(function(res){
				xml2js.parseString(res[0].body, function(err, result){
					_.forEach(result.team_all_season.queryResults[0].row, function(team){
						var team = team.$;
						cache.teams[team.team_id] = team;
						teamIdsByName[team.name] = team.team_id;
						teamIdsByAbbrv[team.name_abbrev] = team.team_id;
					});
				});
			});
			requestPromises.push(promise);
		});

		return requestPromises;
	},
	getTeamSchedule = function(teamId){
		var uri = util.format(config.apis.team_schedule, teamId, currentYear),
			now = moment.utc();

		return request(uri).then(function(res){
			csv.parse(res[0].body, {}, function(err, output){
				cache.teams[teamId].schedule = [];
				cache.teams[teamId].nextGame = null;
				var gamePromises = [],
					schedule = [],
					pastGames = [],
					currentGame = null,
					nextGame = null,
					futureGames = [];

				_.forEach(_.rest(output), function(game, index) {
					var startTime = moment.tz(game[0] + ' ' + game[2], "MM/DD/YY hh:mm A", "America/New_York");
					scheduledGame = {
						startTime: startTime.utc(),
						startTimeEST: startTime.format(),
						name: game[3]
					};

					if(scheduledGame.startTime.isBefore(now)){
						pastGames.push(scheduledGame);
					}
					else{
						futureGames.push(scheduledGame);
					}

				});

				pastGames = _.takeRight(pastGames, 5);
				schedule = pastGames.concat(futureGames);

				schedule = _.sortBy(schedule, function(game){
					return game.startTime;
				});

					/*
					if(scheduledGame.startTime.isAfter(now)){
						if(cache.teams[teamId].nextGame === null){
							cache.teams[teamId].nextGame = scheduledGame;
							//Get game from gameday
						}
					}
					*/
				_.forEach(schedule, function(scheduledGame){
					var linescorePromise = getLinescore(teamId, scheduledGame);
					if(linescorePromise) {
						var gamePromise = linescorePromise.then(function (linescore) {
							scheduledGame.linescore = linescore;
							scheduledGame.homeGame = (parseInt(linescore.home_team_id) === teamId);
						});
						gamePromises.push(gamePromise);
					}
				});

				Q.all(gamePromises).then(function(){
					console.log('DONE');
					cache.teams[teamId].schedule = schedule;

					_.forEach(schedule, function(scheduledGame){
						if(cache.teams[teamId].nextGame === null && scheduledGame.startTime.isAfter(now)){
							cache.teams[teamId].nextGame = scheduledGame;
						}
					});
				});
			});
		});
	},
	getLinescore = function(teamId, game){
		var gameName = game.name.split(" at "),
			homeTeamId = teamIdsByName[gameName[0]],
			awayTeamId = teamIdsByName[gameName[1]];

		//Account for all star game
		if(typeof homeTeamId === 'undefined' || typeof awayTeamId === 'undefined') return false;

		var	startTime = moment(game.startTimeEST).tz("America/New_York");
			uri = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.game,
				startTime.format("YYYY"),
				startTime.format("MM"),
				startTime.format("DD"),
				startTime.format("YYYY"),
				startTime.format("MM"),
				startTime.format("DD"),
				cache.teams[homeTeamId].team_code,
				cache.teams[awayTeamId].team_code
			);

		return request(uri).then(function(res){
			var linescore = JSON.parse(res[0].body).data.game;
			return linescore;
		});
	},
	getTeamTweets = function(teamId) {
		var teamName = config.teams[teamId.toString()].twitterName,
			uri = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.twitter, teamName);

		request(uri).then(function(res){
			var tweets = JSON.parse(res[0].body);
			cache.teams[teamId].tweets = tweets;
		});
	},
	getStandings = function(){
		var uri = config.apis.gameday.base_uri + config.apis.gameday.uris.standings;

		return request(uri).then(function(res){
			xml2js.parseString(res[0].body, function(err, result){
				var standings = _.mapValues(config.divisions, function(division){
					division.teams = [];
					return division;
				});

				_.forEach(result['sm:urlset']['sm:url'], function(team){
					var teamWrapper = team['sm:content'][0]['span'][0]['span'];

					if(!teamWrapper) return;

					var	team = cache.teams[teamIdsByAbbrv[teamWrapper[1]['_']]],
						teamRecord = {
							name: teamWrapper[0]['_'],
							abbrv: teamWrapper[1]['_'],
							wins: teamWrapper[9]['span'][2]['_'],
							losses: teamWrapper[10]['span'][2]['_']
						};

					//Add record to team cache
					cache.teams[team.team_id].record = {
						wins: teamRecord.wins,
						losses: teamRecord.losses
					};

					standings[team.division_id].teams.push(teamRecord);
				});

				//Sort standings by wins/losses
				_.forEach(standings, function(division){
					/*
					trying to figure out this sort order stuff
					division.teams = _.sortBy(division.teams, function(team){
						return -parseInt(team.wins);
					}, function(team){
						return parseInt(team.losses);
					});
					division.teams = _.sortByOrder(division.teams, ['wins'], [false]);
					console.log(_.sortByOrder(division.teams, ['wins', 'losses'], [false, false]));
					console.log(_.sortBy(division.teams, function(team){
						return -(parseInt(team.wins) - parseInt(team.losses));
					}));
					 */

					division.teams = _.sortBy(division.teams, function(team){
						return -(parseInt(team.wins) - parseInt(team.losses));
					});

					//Calculate # Games Back (http://en.wikipedia.org/wiki/Games_behind)
					_.forEach(division.teams, function(worseTeam, index){
						if(index === 0){
							worseTeam.gamesBack = 0
							return;
						}

						var betterTeam = division.teams[0],
							gamesBack = ((betterTeam.wins - worseTeam.wins) + (worseTeam.losses - betterTeam.losses)) / 2;

						worseTeam.gamesBack = gamesBack;
					});
				});

				//Add standings to team objects
				_.forEach(cache.teams, function(team, teamId){
					team.standings = standings[team.division_id];
				});

				cache.standings = standings;
			});
		});
	};

module.exports = {
	initCache: function(){
		Q.all(getTeams()).then(function() {
			getStandings();

			_.forEach(teams, function(teamId) {

				getTeamSchedule(teamId);
				getTeamTweets(teamId);
				getTeamPlayers(teamId).then(function (res) {
					_.forEach(cache.teams[teamId].players, function (player, playerId) {
						getPlayerStats(teamId, playerId);
					});
				});
			});
		});
	}
};

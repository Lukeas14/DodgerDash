var util = require('util'),
	_ = require('lodash'),
	csv = require('csv'),
	xml2js = require('xml2js'),
	Q = require('q'),
	request = Q.denodeify(require('request')),
	moment = require('moment-timezone'),
	config = require('./config.json'),
	cache = require('./cache');

var teamIdsByName = {},
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
			}, function(err){
				console.log("Couldn't getTeams()", err);
			});
			requestPromises.push(promise);
		});

		return requestPromises;
	},
	getTeamSchedule = function(teamId){
		var uri = util.format(config.apis.team_schedule, teamId, currentYear),
			openingDay = moment("2015-04-05T12:00:00Z"),
			now = moment.utc();

		return request(uri).then(function(res){
			csv.parse(res[0].body, {}, function(err, output){
				var gamePromises = [],
					schedule = [],
					pastGames = [],
					currentGame = null,
					nextGame = null,
					futureGames = [];

				_.forEach(_.rest(output), function(game, index) {
					var startTime = moment.tz(game[0] + ' ' + game[2], "MM/DD/YY hh:mm A", "America/New_York"),
						gameName = game[3];
						gameNameArray = gameName.split(" at "),
						awayTeamId = teamIdsByName[gameNameArray[0]],
						homeTeamId = teamIdsByName[gameNameArray[1]],
						homeGame = (parseInt(homeTeamId) === teamId);

					if(typeof homeTeamId === 'undefined' || typeof awayTeamId === 'undefined'){
						return;
					}

					var	scheduledGame = {
							startTime: startTime.utc(),
							startTimeEST: startTime.format(),
							startTimeUNIX: startTime.unix(),
							name: gameName,
							homeTeamId: homeTeamId,
							awayTeamId: awayTeamId,
							homeGame: homeGame
						};

					if(scheduledGame.startTime.isBefore(now) && scheduledGame.startTime.isAfter(openingDay)){
						pastGames.push(scheduledGame);
					}
					else if(scheduledGame.startTime.isAfter(now)){
						futureGames.push(scheduledGame);
					}

				});

				schedule = pastGames.concat(futureGames);

				//Sort schedule games by start time/date
				schedule = _.sortBy(schedule, function(game){
					return game.startTime;
				});

				//Add schedule to cache
				cache.teams[teamId].schedule = schedule;

				return;
			});
		});
	},
	getGameDir = function(game){
		var	startTime = moment(game.startTimeEST).tz("America/New_York"),
			uri = util.format(config.apis.gameday.base_uri + config.apis.gameday.uris.game,
				startTime.format("YYYY"),
				startTime.format("MM"),
				startTime.format("DD"),
				startTime.format("YYYY"),
				startTime.format("MM"),
				startTime.format("DD"),
				cache.teams[game.awayTeamId].team_code,
				cache.teams[game.homeTeamId].team_code
			);

		return uri;
	},
	getLinescore = function(game){
		var	linescoreURI = getGameDir(game) + "linescore.json";

		return request(linescoreURI).then(function(res){
			return JSON.parse(res[0].body).data.game;
		});
	},
	getBoxscore = function(game){
		var boxscoreURI = getGameDir(game) + "boxscore.json";

		console.log('boxscoreURI', boxscoreURI);
		return request(boxscoreURI).then(function(res){
			return JSON.parse(res[0].body).data.boxscore;
		});
	},
	getTeamTweets = function(teamId) {
		var teamName = config.teams[teamId].twitterName,
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
	},
	refreshCache = function(){
		console.log('Starting to refresh cache');

		//Get schedules for each team every hour
		setInterval(function(){
			_.forEach(config.activeTeams, function(teamId){
				getTeamSchedule(teamId);
			});
		}, config.cache.intervals.teamSchedule)

		//Refresh Cache for current game
		setInterval(function(){
			var now = moment.utc();

			_.forEach(config.activeTeams, function(teamId){
				_.forEach(cache.teams[teamId].schedule, function(game){
					var startTime = moment.utc(game.startTime);
					if(startTime.isBefore(now)){
						if(!game.linescore){
							console.log('Refreshing cache for game ' + game.name + ' at ' + game.startTime.format() + ' with status: ' + ((game.linescore) ? game.linescore.status : 'N/A'));
							
							Q.all([
								getLinescore(game),
								getBoxscore(game)
							]).then(function(res){
								game.linescore = res[0];
								game.boxscore = res[1];
							});
						}
						else if(game.linescore.status === 'Manager Challenge' || game.linescore.status === 'Warmup' || game.linescore.status === 'In Progress'){
							console.log('Refreshing cache for game ' + game.name + ' at ' + game.startTime.format() + ' with status: ' + ((game.linescore) ? game.linescore.status : 'N/A'));

							Q.all([
								getLinescore(game),
								getBoxscore(game)
							]).then(function(res){
								var linescore = res[0],
									boxscore = res[1];

								if(linescore.status === "Game Over"){
									delete cache.teams[teamId].currentGame;
									return;
								}
								
								cache.teams[teamId].currentGame = _.assign(game, {
									linescore: linescore,
									boxscore: boxscore
								});
							});
						}
					}
					else{
						getLinescore(game).then(function(linescore){
							game.linescore = linescore;
							cache.teams[teamId].nextGame = game;
						});
						return false;
					}
				});
			});
		}, config.cache.intervals.gameData);
	};

module.exports = {
	initCache: function(){
		console.log('Initiating Cache');

		Q.all(getTeams()).then(function() {
			getStandings();

			_.forEach(config.activeTeams, function(teamId) {
				getTeamSchedule(teamId).then(function(){
					refreshCache();
				});
				getTeamPlayers(teamId).then(function (res) {
					_.forEach(cache.teams[teamId].players, function (player, playerId) {
						getPlayerStats(teamId, playerId);
					});
				});
				getTeamTweets(teamId);
			});
		});
	}
};

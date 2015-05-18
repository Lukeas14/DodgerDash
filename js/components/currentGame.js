var CurrentGame = React.createClass({displayName: 'CurrentGame',
	getDefaultProps: function(){
		return {
			game: null
		}
	},
	render: function(){
		var game = this.props.game;

		if(game === null){
			return(
				<div id="current-game" className="header">wfwefurrent Game</div>
			);
		}

		var teamId = (game.homeGame) ? game.homeTeamId : game.awayTeamId,
			opponentId = (game.homeGame) ? game.awayTeamId : game.homeTeamId,
			teamLogo = "http://mlb.mlb.com/mlb/images/devices/600x600/" + teamId + ".png",
			opponentLogo = "http://mlb.mlb.com/mlb/images/devices/600x600/" + opponentId + ".png";

		//Linescore
		if(!(game.linescore.linescore instanceof Array)){
			console.log('linescore', game.linescore.linescore);
			game.linescore.linescore = [
				{
					'away_inning_runs': 0,
					'home_inning_runs': '',
					'inning': 1
				}
			]
		}
		var maxInnings = (game.linescore.inning > 9) ? game.linescore.inning : 9,
			linescoreHeader = _.range(0, maxInnings).map(function(inning){
				return(<th>{inning + 1}</th>);
			}),
			teamLinescore = _.range(0, maxInnings).map(function(inning){
				var inningField = (game.homeTeam) ? 'home_inning_runs' : 'away_inning_runs';
				var inningScore = (game.linescore.linescore[inning]) ? game.linescore.linescore[inning][inningField] : '';
				return(<td className="stats">{inningScore}</td>);
			}),
			opponentLinescore = _.range(0, maxInnings).map(function(inning){
				var inningField = (game.homeTeam) ? 'away_inning_runs' : 'home_inning_runs';
				var inningScore = (game.linescore.linescore[inning]) ? game.linescore.linescore[inning][inningField] : '';
				return(<td className="stats">{inningScore}</td>);
			}),
			teamName = (game.homeTeam) ? game.linescore.home_team_name : game.linescore.away_team_name,
			teamWins = (game.homeTeam) ? game.linescore.home_win : game.linescore.away_win,
			teamLosses = (game.homeTeam) ? game.linescore.home_loss : game.linescore.away_loss,
			teamRuns = (game.homeTeam) ? game.linescore.home_team_runs : game.linescore.away_team_runs,
			teamHits = (game.homeTeam) ? game.linescore.home_team_hits : game.linescore.away_team_hits,
			teamErrors = (game.homeTeam) ? game.linescore.home_team_errors : game.linescore.away_team_errors,
			teamCurrentPlayer = (game.homeTeam && game.linescore.inning_state === "Bottom") ? game.linescore.current_batter : game.linescore.current_pitcher,
			teamCurrentPlayerImg = "http://mlb.mlb.com/images/players/525x330/" + teamCurrentPlayer.id + ".jpg";
			opponentName = (game.homeTeam) ? game.linescore.away_team_name : game.linescore.home_team_name,
			opponentWins = (game.homeTeam) ? game.linescore.away_win : game.linescore.home_win,
			opponentLosses = (game.homeTeam) ? game.linescore.away_loss : game.linescore.home_loss,
			opponentRuns = (game.homeTeam) ? game.linescore.away_team_runs : game.linescore.home_team_runs,
			opponentHits = (game.homeTeam) ? game.linescore.away_team_hits : game.linescore.home_team_hits,
			opponentErrors = (game.homeTeam) ? game.linescore.away_team_errors : game.linescore.home_team_errors;
			opponentCurrentPlayer = (game.homeTeam && game.linescore.inning_state === "Top") ? game.linescore.current_pitcher : game.linescore.current_batter,
			opponentCurrentPlayerImg = "http://mlb.mlb.com/images/players/525x330/" + opponentCurrentPlayer.id + ".jpg";

		return(
			<div className="header row" id="current-game">
				<div className="header-align"></div>
				<div className="header-content col-md-12">
					<div className="col-md-4 text-center">
						<div className="col-md-4 text-center">
							<h1 className="team-score">{teamRuns}</h1>
						</div>
						<div className="col-md-4">
							<img id="team-logo" src={teamLogo}/>
							<br/>
							<span className="stats">({teamWins} - {teamLosses})</span>
						</div>
						<div className="col-md-4">
							<img className="player-img" src={teamCurrentPlayerImg}/>
							<br/>
							<span>{teamCurrentPlayer.first_name}<br/>{teamCurrentPlayer.last_name}</span>
						</div>
					</div>

					<div className="col-md-4">
						<table className="table table-condensed">
							<thead>
								<tr>
									<th></th>
									{linescoreHeader}
									<th>R</th>
									<th>H</th>
									<th>E</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{teamName}</td>
									{teamLinescore}
									<td>{teamRuns}</td>
									<td>{teamHits}</td>
									<td>{teamErrors}</td>
								</tr>
								<tr>
									<td>{opponentName}</td>
									{opponentLinescore}
									<td >{opponentRuns}</td>
									<td>{opponentHits}</td>
									<td>{opponentErrors}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="col-md-4 text-center">
						<div className="col-md-4">
							<img className="player-img" src={opponentCurrentPlayerImg}/>
							<br/>
							<span>{opponentCurrentPlayer.first_name} {opponentCurrentPlayer.last_name}</span>
						</div>
						<div className="col-md-4">
							<img id="team-logo" src={opponentLogo}/>
							<br/>
							<span className="stats">({opponentWins} - {opponentLosses})</span>
						</div>
						<div className="col-md-4 text-center">
							<h1 className="team-score">{opponentRuns}</h1>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
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
				var inningField = (game.homeGame) ? 'home_inning_runs' : 'away_inning_runs';
				var inningScore = (game.linescore.linescore[inning]) ? game.linescore.linescore[inning][inningField] : '';
				return(<td className="stats">{inningScore}</td>);
			}),
			opponentLinescore = _.range(0, maxInnings).map(function(inning){
				var inningField = (game.homeGame) ? 'away_inning_runs' : 'home_inning_runs';
				var inningScore = (game.linescore.linescore[inning]) ? game.linescore.linescore[inning][inningField] : '';
				return(<td className="stats">{inningScore}</td>);
			}),
			teamName = (game.homeGame) ? game.linescore.home_team_name : game.linescore.away_team_name,
			teamAbbrv = (game.homeGame) ? game.linescore.home_name_abbrev : game.linescore.away_name_abbrev,
			teamWins = (game.homeGame) ? game.linescore.home_win : game.linescore.away_win,
			teamLosses = (game.homeGame) ? game.linescore.home_loss : game.linescore.away_loss,
			teamRuns = (game.homeGame) ? game.linescore.home_team_runs : game.linescore.away_team_runs,
			teamHits = (game.homeGame) ? game.linescore.home_team_hits : game.linescore.away_team_hits,
			teamErrors = (game.homeGame) ? game.linescore.home_team_errors : game.linescore.away_team_errors;
			if(game.homeGame){
				teamCurrentPlayer = (game.linescore.inning_state === "Bottom" || game.linescore.inning_state === "End") ? game.linescore.current_batter : game.linescore.current_pitcher;
			}
			else{
				teamCurrentPlayer = (game.linescore.inning_state === "Bottom" || game.linescore.inning_state === "End") ? game.linescore.current_pitcher : game.linescore.current_batter;
			}
			teamCurrentPlayerImg = (!teamCurrentPlayer) ? teamLogo : "http://mlb.mlb.com/images/players/525x330/" + teamCurrentPlayer.id + ".jpg";

			opponentName = (game.homeGame) ? game.linescore.away_team_name : game.linescore.home_team_name,
			opponentAbbrv = (game.homeGame) ? game.linescore.away_name_abbrev : game.linescore.home_name_abbrev,
			opponentWins = (game.homeGame) ? game.linescore.away_win : game.linescore.home_win,
			opponentLosses = (game.homeGame) ? game.linescore.away_loss : game.linescore.home_loss,
			opponentRuns = (game.homeGame) ? game.linescore.away_team_runs : game.linescore.home_team_runs,
			opponentHits = (game.homeGame) ? game.linescore.away_team_hits : game.linescore.home_team_hits,
			opponentErrors = (game.homeGame) ? game.linescore.away_team_errors : game.linescore.home_team_errors
			if(game.homeGame){
				opponentCurrentPlayer = (game.linescore.inning_state === "Bottom" || game.linescore.inning_state === "End") ? game.linescore.current_pitcher : game.linescore.current_batter;
			}
			else{
				opponentCurrentPlayer = (game.linescore.inning_state === "Bottom" || game.linescore.inning_state === "End") ? game.linescore.current_batter : game.linescore.current_pitcher;
			}
			opponentCurrentPlayerImg = (!opponentCurrentPlayer) ? opponentLogo : "http://mlb.mlb.com/images/players/525x330/" + opponentCurrentPlayer.id + ".jpg";

			if(game.linescore.inning_state !== "Middle" || game.linescore.inning_state !== "End") {
				var runner1b = classNames({'active': game.linescore.runner_on_1b});
				runner2b = classNames({'active': game.linescore.runner_on_2b});
				runner3b = classNames({'active': game.linescore.runner_on_3b});
				bsoB1 = classNames({'active': game.linescore.balls > 0}),
					bsoB2 = classNames({'active': game.linescore.balls > 1}),
					bsoB3 = classNames({'active': game.linescore.balls > 2}),
					bsoS1 = classNames({'active': game.linescore.strikes > 0}),
					bsoS2 = classNames({'active': game.linescore.strikes > 1}),
					bsoO1 = classNames({'active': game.linescore.outs > 0}),
					bsoO2 = classNames({'active': game.linescore.outs > 1});
			}

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
							<strong>{teamName}</strong>
							<br/>
							<span className="stats">({teamWins} - {teamLosses})</span>
						</div>
						<div className="col-md-4">
							<img className="player-img" src={teamCurrentPlayerImg}/>
							<br/>
							<span className="stats">{teamCurrentPlayer.first_name}<br/>{teamCurrentPlayer.last_name}</span>
						</div>
					</div>

					<div className="col-md-4">
						<div className="text-center">
							<div className="col-md-3 text-left">
								<table className="bases">
									<tbody>
										<tr>
											<td className={runner2b}></td>
											<td className={runner1b}></td>
										</tr>
										<tr>
											<td className={runner3b}></td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className="text-center col-md-8">
								<table className="bso">
									<tbody>
									<tr>
										<td className="stats">B</td>
										<td className="balls">
											<span className={bsoB1}></span>
											<span className={bsoB2}></span>
											<span className={bsoB3}></span>
										</td>
										<td className="stats">S</td>
										<td className="strikes">
											<span className={bsoS1}></span>
											<span className={bsoS2}></span>
										</td>
										<td className="stats">O</td>
										<td className="outs">
											<span className={bsoO1}></span>
											<span className={bsoO2}></span>
										</td>
									</tr>
									</tbody>
								</table>
							</div>
						</div>
						<table className="linescore table table-condensed">
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
									<td>{teamAbbrv}</td>
									{teamLinescore}
									<td>{teamRuns}</td>
									<td>{teamHits}</td>
									<td>{teamErrors}</td>
								</tr>
								<tr>
									<td>{opponentAbbrv}</td>
									{opponentLinescore}
									<td >{opponentRuns}</td>
									<td>{opponentHits}</td>
									<td>{opponentErrors}</td>
								</tr>
							</tbody>
						</table>
						<div className="col-md-12 text-center stats">{game.linescore.pbp_last}</div>
					</div>
					<div className="col-md-4 text-center">
						<div className="col-md-4">
							<img className="player-img" src={opponentCurrentPlayerImg}/>
							<br/>
							<span className="stats">{opponentCurrentPlayer.first_name}<br/>{opponentCurrentPlayer.last_name}</span>
						</div>
						<div className="col-md-4">
							<img id="team-logo" src={opponentLogo}/>
							<br/>
							<strong>{opponentName}</strong>
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
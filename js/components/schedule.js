var Schedule = React.createClass({displayName: 'Schedule',
	sortSchedule: function(schedule){
		return _.sortBy(schedule, function(game){
			return game.startTime;
		});
	},
	getDefaultProps: function(){
		return {
			schedule: {},
			nextGame: {}
		};
	},
	componentDidUpdate: function(){
		var nextGameRowId = this.props.nextGame.startTimeUNIX,
			nextGameRow = document.getElementById(nextGameRowId);

		//scroll to 5 games before next game
		for(i=0; i<5; i++){
			if(!nextGameRow){
				return;
			}
			nextGameRow = nextGameRow.previousSibling;
		}
		if(nextGameRow !== null) {
			nextGameRow.scrollIntoView();
		}
	},

	render: function(){
		var schedule = this.sortSchedule(this.props.schedule),
			scheduleRows = schedule.map(function(game){
				var now = moment(),
					startTime = moment(game.startTime.toString()),
					gameName = game.name.split(" at "),
					name = (game.homeGame) ? gameName[0] : "@ " + gameName[1],
					score = "";
					status = (game.linescore) ? game.linescore.status : 'n/a';

				if(now.isAfter(startTime)){
					var dodgersScore = (game.homeGame) ? game.linescore.home_team_runs : game.linescore.away_team_runs,
						opponentScore = (game.homeGame) ? game.linescore.away_team_runs : game.linescore.home_team_runs;

					if(game.linescore.status === "In Progress"){
						score = "   " + dodgersScore + " - " + opponentScore;
					}
					else if(game.linescore.status === "Postponed"){
						score = "Postponed";
					}
					else{
						var result = (parseInt(dodgersScore) > parseInt(opponentScore)) ? 'W' : 'L';
						score = result + "  " + dodgersScore + " - " + opponentScore;
					}
				}
				else if(game.linescore != null && game.linescore.status === "Postponed") {
					score = "Postponed";
				}
				else{
					score = "\u00a0";
				}

				return(
					<tr id={game.startTimeUNIX}>
						<td className="col-md-3 col-sm-3 col-xs-3">
							{name}
						</td>
						<td className="col-md-3 col-sm-3 col-xs-3 stats">
							{score}
						</td>
						<td className="col-md-6 col-sm-6 col-xs-6 stats">
							{startTime.format("MMMM DD")},
							&nbsp;
							{startTime.format("h:mm a")}
						</td>
					</tr>
				)
			});
		return(
			<div id="schedule">
					<table className="table table-condensed table-striped table-fixed table-fixed-sched table-hover" align="center">
						<thead>
							<th className="col-md-3 col-sm-3 col-xs-3">Opponent</th>
							<th className="col-md-3 col-sm-3 col-xs-3">Result</th>
							<th className="col-md-6 col-sm-6 col-xs-6">Gametime</th>
						</thead>
						<tbody>
							{scheduleRows}
						</tbody>
					</table>
			</div>
		);
	}
});
/*
React.render(
	//React.createElement(Schedule, null),
	<Schedule/>,
	document.getElementById('schedule')
);
*/
var Schedule = React.createClass({displayName: 'Schedule',
	loadTeam: function(){
		console.log('loading team');
		$.ajax({
			url: '/test',
			dataType: 'json',
			cache: false,
			success: function(data){
				console.log('team loaded', data);
				this.setState({data: data});
			}.bind(this)
		})
	},
	getInitialState: function(){
		return {
			data: {schedule: []}
		};
	},
	sortSchedule: function(schedule){
		return _.sortBy(schedule, function(game){
			return game.startTime;
		});
	},
	getDefaultProps: function(){
		return {
			schedule: {}
		};
	},
	componentDidMount: function(){
		this.loadTeam();
		setInterval(this.loadTeam, 60000);
	},

	render: function(){
		var schedule = this.sortSchedule(this.props.schedule),
		teamLogo = "http://mlb.mlb.com/mlb/images/devices/600x600/119.png";
		console.log(this.state.data);
		var scheduleRows = schedule.map(function(game){
			var now = moment(),
				startTime = moment(game.startTime.toString()),
				gameName = game.name.split(" at "),
				name = (game.homeGame) ? gameName[0] : "@ " + gameName[1],
				score = "";

			if(now.isAfter(startTime)){
				var dodgersScore = (game.homeGame) ? game.linescore.home_team_runs : game.linescore.away_team_runs,
					opponentScore = (game.homeGame) ? game.linescore.away_team_runs : game.linescore.home_team_runs;

				if(game.linescore.status === "In Progress"){
					score = "   " + dodgersScore + " - " + opponentScore;
				}
				else if(game.linescore.status === "Postponed") {
					score = "Postponed";
				}
				else {
					var result = (parseInt(dodgersScore) > parseInt(opponentScore)) ? 'W' : 'L';
					score = result + "  " + dodgersScore + " - " + opponentScore;
				}
			}
			else if(game.linescore != null && game.linescore.status === "Postponed") {
				score = "Postponed";
			}

			return(
				<tr>
					<td className="col-md-3 col-sm-3 col-xs-3">
						<strong>{name}</strong>
					</td>
					<td className="col-md-3 col-sm-3 col-xs-3">
						{score}
					</td>
					<td className="col-md-6 col-sm-6 col-xs-6">
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
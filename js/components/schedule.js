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
		var schedule = this.sortSchedule(this.props.schedule);
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
				else {
					var result = (parseInt(dodgersScore) > parseInt(opponentScore)) ? 'W' : 'L';
					score = result + "  " + dodgersScore + " - " + opponentScore;
				}
			}

			return(
				<tr>
					<td>
						<strong>{name}</strong>
					</td>
					<td>
						{score}
					</td>
					<td>
						{startTime.format("MMMM DD")},
						&nbsp;
						{startTime.format("h:mm a")}
					</td>
				</tr>
			)
		});
		return(
			<div id="schedule">
					<table className="table table-condensed table-striped table-fixed-sched table-hover">
						<thead>
							<th width="115px">Opponent</th>
							<th width="71px">Result</th>
							<th width="175px">Gametime</th>
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
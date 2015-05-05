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
	componentDidMount: function(){
		console.log('hello');
		this.loadTeam();
		setInterval(this.loadTeam, 60000);
	},
	render: function(){
		console.log(this.state.data);
		var scheduleRows = this.state.data.schedule.map(function(game){
			var startTime = moment(game.startTime.toString());
			return(
				<tr>
					<td>
						<strong>{game.name}</strong>
					</td>
					<td>
						{startTime.format("dddd, MMMM DD")}
						<br/>
						{startTime.format("h:mm a")}
					</td>
				</tr>
			)
		});
		return(
			<div className="schedule">
				<table className="table table-condensed">
					<thead>
						<th>Name</th>
						<th>Time</th>
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
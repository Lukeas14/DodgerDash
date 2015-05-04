var schedule = [
	{
		name: 'Dodgers at Angels'
	},
	{
		name: 'Dodgers at Giants'
	},
	{
		name: 'D-Backs at Dodgers'
	}
];

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
	},
	render: function(){
		console.log(this.state.data);
		var scheduleRows = this.state.data.schedule.map(function(game){
			return(
				<tr>
					<td>
						<strong>{game.name}</strong>
					</td>
					<td>
						{moment(game.startTime.toString()).format("dddd, MMMM DD [at] h:mm:ss a") }
					</td>
				</tr>
			)
		});
		return(
			<div className="schedule">
				<table>
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

React.render(
	//React.createElement(Schedule, null),
	<Schedule/>,
	document.getElementById('schedule')
);

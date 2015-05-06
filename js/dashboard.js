//var Schedule = require('./Schedule.react');

var Dashboard = React.createClass({displayName: 'Dashboard',
	loadTeam: function(){
		$.ajax({
			url: '/test',
			dataType: 'json',
			cache: false,
			success: function(data){
				this.setState({team: data});
			}.bind(this)
		});
	},
	getInitialState: function(){
		return {
			team: {}
		};
	},
	componentDidMount: function(){
		this.loadTeam();
		setInterval(this.loadTeam, 60000);
	},
	render: function(){
		return(
			<div className="dashboard row">
				<NextGame game={this.state.team.nextGame}/>
				<div id="left-column" className="col-md-4">
					<Schedule schedule={this.state.team.schedule}/>
				</div>
				<div id="right-column" className="col-md-8">
					<Batters players={this.state.team.players}/>
					<Pitchers players={this.state.team.players}/>
				</div>
			</div>
		);
	}

});

React.render(
	//React.createElement(Schedule, null),
	<Dashboard/>,
	document.getElementById('dashboard')
);

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
				<div className="col-md-4">
					<Schedule/>
				</div>
				<div className="col-md-8">
					<Batters players={this.state.team.players} yo="wtf"/>
				</div>
			</div>
		);
	}Team Division and Win/Loss Records: http://gd2.mlb.com/components/game/mlb/google/teams.xml

});

React.render(
	//React.createElement(Schedule, null),
	<Dashboard/>,
	document.getElementById('dashboard')
);

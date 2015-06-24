var Dashboard = React.createClass({displayName: 'Dashboard',
	loadingTeam: false,
	loadTeam: function(){
		if(!loadingTeam) {
			loadingTeam = true;
			$.ajax({
				url: '/getTeam/119',
				dataType: 'json',
				cache: false
			}).done(function(data){
				this.setState({team: data});
			}).always(function(){
				loadingTeam = false;
			});
		}
	},
	getInitialState: function(){
		return {
			team: {}
		};
	},
	componentDidMount: function(){
		this.loadTeam();
		setInterval(this.loadTeam, 5000);
	},
	render: function(){
		if(_.isEmpty(this.state.team.currentGame)){
			var header = <NextGame game={this.state.team.nextGame}/>;
		}
		else{
			var header = <CurrentGame game={this.state.team.currentGame}/>;
		}
		return(
			<div className="row">
				{header}
				<div style={{height:'1vh', background:'#1A578A'}}></div>
				<div id="left-column" className="col-md-5">
					<Standings standings={this.state.team.standings}/>
					<Schedule schedule={this.state.team.schedule} nextGame={this.state.team.nextGame}/>
				</div>
				<div id="right-column" className="col-md-7">
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

var NextGame = React.createClass({displayName: 'NextGame',
	calculateCountdown: function(){
		if(this.props.game === null) return;

		var duration = moment.duration(moment(this.props.game.startTime).diff(moment()));
			countdown = this.padNumber(duration.days())
				+ ":" + this.padNumber(duration.hours())
				+ ":" + this.padNumber(duration.minutes())
				+ ":" + this.padNumber(duration.seconds());
		this.setState({
			countdown: countdown
		});
	},
	padNumber: function(num){
		return ("0" + num).slice(-2);
	},
	getDefaultProps: function(){
		return {
			game: null,
			test: 'to'
		};
	},
	getInitialState: function(){
		return {
			countdown: moment.duration(0)
		};
	},
	componentWillReceiveProps: function(nextProps){
		if(nextProps.game !== null) {
			this.props.now = moment();
			this.props.gametime = moment(nextProps.game.startTime);
		}
	},
	componentDidMount: function(){
		this.props.now = moment();
		//this.props.gametime = moment(this.props.game.startTime);
		this.countdownInterval = setInterval(this.calculateCountdown, 1000);
	},
	componentWillUnmount: function(){
		clearInterval(this.countdownInterval);
	},
	render: function(){
		var game = this.props.game;

		if(game === null){
			return(
				<div id="header"></div>
			);
		}

		var countdown = (this.state.countdown) ? this.state.countdown : "00:00:00:00";

		var	teamLogo = "http://mlb.mlb.com/mlb/images/devices/600x600/119.png",
			opponentId = (game.homeGame) ? game.linescore.away_team_id : game.linescore.home_team_id,
			opponentLogo = "http://mlb.mlb.com/mlb/images/devices/600x600/" + opponentId + ".png",
			teamPitcher = (game.homeGame) ? game.linescore.home_probable_pitcher : game.linescore.away_probable_pitcher,
			awayPitcher = (game.homeGame) ? game.linescore.away_probable_pitcher : game.linescore.home_probable_pitcher,
			teamPitcherImg = "http://mlb.mlb.com/images/players/525x330/" + teamPitcher.id + ".jpg",
			awayPitcherImg = "http://mlb.mlb.com/images/players/525x330/" + awayPitcher.id + ".jpg";

		return(
			<div id="header">
				<div className="col-md-4">
					<div className="col-xs-6">
						<img id="team-logo" src={teamLogo}/>
					</div>
					<div className="col-xs-6">
						<img id="team-logo" src={opponentLogo}/>
					</div>
				</div>
				<div id="countdown" className="col-md-4 text-center">{countdown}</div>
				<div id="next-game-pitchers" className="col-md-4 text-center">
					<div className="row">
						<div className="col-md-6">
							<img className="pitcher-img" src={teamPitcherImg}/>
							<br/>
							<strong className="pitcher-name">{teamPitcher.first_name} {teamPitcher.last_name}</strong>
							<br/>
							<span>{teamPitcher.s_wins}-{teamPitcher.s_losses} | {teamPitcher.era}</span>
						</div>
						<div className="col-md-6">
							<img className="pitcher-img" src={awayPitcherImg}/>
							<br/>
							<strong className="pitcher-name">{awayPitcher.first_name} {awayPitcher.last_name}</strong>
							<br/>
							<span>{awayPitcher.s_wins}-{awayPitcher.s_losses} | {awayPitcher.era}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
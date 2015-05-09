var NextGame = React.createClass({displayName: 'NextGame',
	calculateCountdown: function(){
		if(this.props.game === null) return;

		var duration = moment.duration(moment(this.props.game.startTime).diff(moment()));
		if(duration > 0) {
			countdown = this.padNumber(duration.days())
				+ ":" + this.padNumber(duration.hours())
				+ ":" + this.padNumber(duration.minutes())
				+ ":" + this.padNumber(duration.seconds());
		} else countdown = "ITFDB!";
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
			homeLogo = (game.homeGame) ? teamLogo : opponentLogo,
			awayLogo = (game.homeGame) ? opponentLogo : teamLogo,
			homePitcher = game.linescore.home_probable_pitcher,
			awayPitcher = game.linescore.away_probable_pitcher,
			homePitcherImg = "http://mlb.mlb.com/images/players/525x330/" + homePitcher.id + ".jpg",
			awayPitcherImg = "http://mlb.mlb.com/images/players/525x330/" + awayPitcher.id + ".jpg",
		    homeRecord = game.linescore.home_win + "-" + game.linescore.home_loss,
		    awayRecord = game.linescore.away_win + "-" + game.linescore.away_loss;

		return(
			<div id="header">
				<div className="col-md-4 text-center">
					<div className="col-xs-6">
						<img id="team-logo" src={awayLogo}/>
						<br/>
						<div>({awayRecord})</div>
					</div>
					<div className="col-xs-6">
						<img id="team-logo" src={homeLogo}/>
						<br/>
						<div>({homeRecord})</div>
					</div>
				</div>
				<div id="countdown" className="col-md-4 text-center">{countdown}</div>
				<div id="next-game-pitchers" className="col-md-4 text-center">
					<div className="row">
						<div className="col-xs-6">
							<img className="pitcher-img" src={awayPitcherImg}/>
							<br/>
							<strong className="pitcher-name">{awayPitcher.first_name} {awayPitcher.last_name}</strong>
							<br/>
							<span>{awayPitcher.s_wins}-{awayPitcher.s_losses} | {awayPitcher.era}</span>
						</div>
						<div className="col-xs-6">
							<img className="pitcher-img" src={homePitcherImg}/>
							<br/>
							<strong className="pitcher-name">{homePitcher.first_name} {homePitcher.last_name}</strong>
							<br/>
							<span>{homePitcher.s_wins}-{homePitcher.s_losses} | {homePitcher.era}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
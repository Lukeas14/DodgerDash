var Batters = React.createClass({displayName: 'Batters',
	sortBatters: function(battersObj){
		var batters = [];
		return _.values(battersObj);
		batters = _.sortBy(_.filter(_.values(battersObj), function(player){
			console.log('sorting', player.name_full);
			return player.battingStats && parseInt(player.battingStats.s_ab) !== 0;
		}), function(player){
			return -(player.battingStats.avg);
		}, function(player){
			return -(player.battingStats.s_ab);
		});
		return batters;
	},
	getDefaultProps: function(){
		return {
			players: {}
		};
	},
	render: function(){
		console.log('render batters', this.props);
		var players = this.sortBatters(this.props.players);
		var batterRows = players.map(function(batter){
			batter.battingStats = {};
			return(
				<tr>
					<td className="col-xs-3">
						{batter.name_first_last}
					</td>
					<td className="col-xs-1 stats">
						{batter.position_txt}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.avg}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_ab}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_h}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_double}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_triple}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_hr}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_rbi}
					</td>
					<td className="col-xs-1 stats">
						{batter.battingStats.s_sb}
					</td>
				</tr>
			)
		});
		return(
			<div id="batters">
				<table className="table table-condensed table-striped table-fixed table-fixed-batter table-hover">
					<thead>
						<tr>
							<th className="col-xs-3">Batter</th>
							<th className="col-xs-1">Pos</th>
							<th className="col-xs-1">BA</th>
							<th className="col-xs-1">AB</th>
							<th className="col-xs-1">H</th>
							<th className="col-xs-1">2B</th>
							<th className="col-xs-1">3B</th>
							<th className="col-xs-1">HR</th>
							<th className="col-xs-1">RBI</th>
							<th className="col-xs-1">SB</th>
						</tr>
					</thead>
					<tbody>
						{batterRows}
					</tbody>
				</table>
			</div>
		);
	}
});


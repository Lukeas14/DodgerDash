var Batters = React.createClass({displayName: 'Batters',
	sortBatters: function(battersObj){
		var batters = [];
		batters = _.sortBy(_.filter(_.values(battersObj), function(player){
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
		var players = this.sortBatters(this.props.players);
		var batterRows = players.map(function(batter){
			return(
				<tr>
					<td>
						{batter.name_first_last}
					</td>
					<td>
						{batter.position_txt}
					</td>
					<td>
						{batter.battingStats.avg}
					</td>
					<td>
						{batter.battingStats.s_ab}
					</td>
					<td>
						{batter.battingStats.s_h}
					</td>
					<td>
						{batter.battingStats.s_double}
					</td>
					<td>
						{batter.battingStats.s_triple}
					</td>
					<td>
						{batter.battingStats.s_hr}
					</td>
					<td>
						{batter.battingStats.s_rbi}
					</td>
					<td>
						{batter.battingStats.s_sb}
					</td>
				</tr>
			)
		});
		return(
			<div id="batters">
				<table className="table table-condensed table-striped">
					<thead>
						<th></th>
						<th>Position</th>
						<th>BA</th>
						<th>AB</th>
						<th>H</th>
						<th>2B</th>
						<th>3B</th>
						<th>HR</th>
						<th>RBI</th>
						<th>SB</th>
					</thead>
					<tbody>
						{batterRows}
					</tbody>
				</table>
			</div>
		);
	}
});


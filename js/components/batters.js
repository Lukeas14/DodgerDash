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
				<table className="table table-condensed table-striped table-fixed-batter table-hover">
					<thead>
						<tr>
							<th width="20%" text-align="left">Batter</th>
							<th width="10%" text-align="left">Position</th>
							<th width="5%" text-align="left">BA</th>
							<th width="5%" text-align="left">AB</th>
							<th width="10%" text-align="left">H</th>
							<th width="10%" text-align="left">2B</th>
							<th width="10%" text-align="left">3B</th>
							<th width="10%" text-align="left">HR</th>
							<th width="10%" text-align="left">RBI</th>
							<th width="10%" text-align="left">SB</th>
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


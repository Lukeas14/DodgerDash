var Batters = React.createClass({displayName: 'Batters',
	sortBatters: function(battersObj){
		var batters = [];
		batters = _.sortBy(_.filter(_.values(battersObj), function(player){
			console.log('sort', (player.battingStats.s_ab !== 0));
			return parseInt(player.battingStats.s_ab) !== 0;
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
						<strong>{batter.name_first_last}</strong>
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
						{batter.battingStats.s_hr}
					</td>
				</tr>
			)
		});
		return(
			<div className="batters">
				<table className="table table-condensedn">
					<thead>
						<th>Name</th>
						<th>Position</th>
						<th>BA</th>
						<th>AB</th>
						<th>HR</th>
					</thead>
					<tbody>
						{batterRows}
					</tbody>
				</table>
			</div>
		);
	}
});


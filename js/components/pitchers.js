var Pitchers = React.createClass({displayName: 'Pitchers',
	sortPitchers: function(pitchersObj){
		var pitchers = [];
		pitchers = _.sortBy(_.filter(_.values(pitchersObj), function(player){
			return player.pitchingStats && parseInt(player.pitchingStats.s_ip) !== 0;
		}), function(player){
			return (parseFloat(player.pitchingStats.era));
		});
		return pitchers;
	},
	getDefaultProps: function(){
		return {
			players: {}
		};
	},
	render: function(){
		var players = this.sortPitchers(this.props.players);
		var pitcherRows = players.map(function(pitcher){
			return(
				<tr>
					<td>
						{pitcher.name_first_last}
					</td>
					<td>
						{pitcher.pitchingStats.era}
					</td>
					<td>
						{pitcher.pitchingStats.whip}
					</td>
					<td>
						{pitcher.pitchingStats.w}
					</td>
					<td>
						{pitcher.pitchingStats.l}
					</td>
					<td>
						{pitcher.pitchingStats.s_ip}
					</td>
					<td>
						{pitcher.pitchingStats.s_er}
					</td>
					<td>
						{pitcher.pitchingStats.s_k}
					</td>
					<td>
						{pitcher.pitchingStats.s_bb}
					</td>
					<td>
						{pitcher.pitchingStats.s_sv}
					</td>
				</tr>
			)
		});
		return(
			<div id="pitchers">
				<table className="table table-condensed table-striped table-fixed-pitcher table-hover">
					<thead>
						<th>Pitcher</th>
						<th>ERA</th>
						<th>WHIP</th>
						<th>W</th>
						<th>L</th>
						<th>IP</th>
						<th>ER</th>
						<th>K</th>
						<th>BB</th>
						<th>SV</th>
					</thead>
					<tbody>
						{pitcherRows}
					</tbody>
				</table>
			</div>
		);
	}
});
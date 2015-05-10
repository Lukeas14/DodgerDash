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
					<td className="col-xs-3">
						{pitcher.name_first_last}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.era}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.whip}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.w}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.l}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.s_ip}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.s_er}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.s_k}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.s_bb}
					</td>
					<td className="col-xs-1">
						{pitcher.pitchingStats.s_sv}
					</td>
				</tr>
			)
		});
		return(
			<div id="pitchers">
				<table className="table table-condensed table-striped table-fixed table-fixed-pitcher table-hover">
					<thead>
						<th className="col-xs-3">Pitcher</th>
						<th className="col-xs-1">ERA</th>
						<th className="col-xs-1">WHIP</th>
						<th className="col-xs-1">W</th>
						<th className="col-xs-1">L</th>
						<th className="col-xs-1">IP</th>
						<th className="col-xs-1">ER</th>
						<th className="col-xs-1">K</th>
						<th className="col-xs-1">BB</th>
						<th className="col-xs-1">SV</th>
					</thead>
					<tbody>
						{pitcherRows}
					</tbody>
				</table>
			</div>
		);
	}
});
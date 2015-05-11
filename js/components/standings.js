var Standings = React.createClass({displayName: 'Standings',
	getDefaultProps: function(){
		return{
			standings: {}
		};
	},
	render: function(){
		var standings = this.props.standings;

		if(!standings.teams){
			return(
				<div id="standings"></div>
			);
		}

		var teams = standings.teams.map(function(team){
			return(
				<tr>
					<td className="col-md-6 col-sm-6 col-xs-6">
						{team.name}
					</td>
					<td className="col-md-2 col-sm-2 col-xs-2">
						{team.wins}
					</td>
					<td className="col-md-2 col-sm-2 col-xs-2">
						{team.losses}
					</td>
					<td className="col-md-2 col-sm-2 col-xs-2">
						{team.gamesBack}
					</td>
				</tr>
			)
		});
		return(
			<div id="standings">
				<table className="table table-condensed table-striped table-fixed table-fixed-stand">
					<thead>
						<th className="col-md-6 col-sm-6 col-xs-6">Team</th>
						<th className="col-md-2 col-sm-2 col-xs-2">W</th>
						<th className="col-md-2 col-sm-2 col-xs-2">L</th>
						<th className="col-md-2 col-sm-2 col-xs-2">GB</th>
					</thead>
					<tbody>
						{teams}
					</tbody>
				</table>
			</div>
		);
	}
});
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
				<div id="standings">standings</div>
			);
		}

		var teams = standings.teams.map(function(team){
			return(
				<tr>
					<td>
						{team.name}
					</td>
					<td>
						{team.wins}
					</td>
					<td>
						{team.losses}
					</td>
					<td>
						{team.gamesBack}
					</td>
				</tr>
			)
		});
		return(
			<div id="standings">
				<table className="table table-condensed table-striped">
					<thead>
						<th></th>
						<th>W</th>
						<th>L</th>
						<th>GB</th>
					</thead>
					<tbody>
						{teams}
					</tbody>
				</table>
			</div>
		);
	}
});
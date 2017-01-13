import "./Players.css"
import _                  from "lodash"
import React, {Component} from "react"
import {connect}          from "react-redux"

class Players extends Component {
	render() {
		return (
			<div className="Players">
					{_.map(this.props.players, (player, playerId) => {
						const score = this.props.playerScores[playerId]
						return (
							<div key={playerId} className="PlayerRow">
								<div
									className="PlayersPlayerAvatar"
									style={{
										background: player.color
									}}
								/>
								<div className="PlayerName">
									{player.name}
								</div>
								<div className="PlayerScore">
									{score}
								</div>
							</div>
						)
					})}
			</div>
		)
	}
}

export default connect(
	(state) => {
		return {
			players      : state.players,
			playerScores : state.playerScores
		}
	},
	(dispatch) => {
		return {}
	}
)(Players)

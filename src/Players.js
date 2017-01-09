import "./Players.css"
import _                  from "lodash"
import React, {Component} from "react"
import {connect}          from "react-redux"
import PlayerAvatar       from "./PlayerAvatar"

class Players extends Component {
	render() {
		console.log("this.props.playerScores: ", this.props.playerScores)
		return (
			<div className="Players">
					{_.map(this.props.players, (player, playerId) => {
						const score = this.props.playerScores[playerId]
						return (
							<div key={playerId} className="PlayerRow">
								<PlayerAvatar
									player={player}
									extraClass="PlayersPlayerAvatar"
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

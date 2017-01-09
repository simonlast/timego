import React, { Component } from "react"
import "./PlayerAvatar.css"

class PlayerAvatar extends Component {
	render() {
		if (!this.props.player) {
			return null
		}

		return (
			<div
				className={`PlayerAvatar ${this.props.extraClass}`}
				style={{
					background: this.props.player.color
				}}
			>
				<div className="PlayerAvatarInner">
					{this.props.player.avatar}
				</div>
			</div>
		)
	}
}

export default PlayerAvatar

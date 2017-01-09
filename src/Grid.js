import _                    from "lodash"
import React, { Component } from "react"
import {connect}            from "react-redux"
import * as gridHelpers     from "./gridHelpers"
import PlayerAvatar         from "./PlayerAvatar"
import * as actionTypes     from "./actionTypes"
import "./Grid.css"

class Grid extends Component {
	render() {
		return (
			<div className="Grid">
				{_.map(this.props.grid, (row, index) => {
					return (
						<div
							key={index}
							className="GridRow"
						>
							{_.map(row, (cell, cellIndex) => {
								if (cell) {
									const player = this.props.players[cell.playerId]
									if (cell.type === gridHelpers.PlayerPin) {
										return (
											<div
												key={cellIndex}
												className="GridCell pin"
											>
												<PlayerAvatar
													player={player}
													extraClass="GridPlayerAvatar"
												/>
											</div>
										)
									}
									else {
										return (
											<div
												key={cellIndex}
												className="GridCell territory"
												style={{
													background: player.color
												}}
											>
											</div>
										)
									}
								}
								else {
									return (
										<div
											key={cellIndex}
											className="GridCell empty"
											onClick={() => {
												this.props.addPlayerAction(cellIndex, index)
											}}
										>
										</div>
									)
								}
							})}
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
			grid    : state.grid,
			players : state.players,
		}
	},
	(dispatch) => {
		return {
			addPlayerAction: (x, y) => {
				dispatch({
					type : actionTypes.AddPlayerAction,
					x    : x,
					y    : y,
				})
			}
		}
	}
)(Grid)

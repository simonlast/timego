import _                    from "lodash"
import React, { Component } from "react"
import ReactDOM             from "react-dom"
import {connect}            from "react-redux"
import * as constants       from "./constants"
import * as actionTypes     from "./actionTypes"
import "./TimeSlider.css"

class TimeSlider extends Component {

	dragging  = false
	savedRect = null

	componentWillMount() {
		window.addEventListener("mousemove", this.handleWindowMouseMove)
		window.addEventListener("mouseup", this.handleWindowMouseUp)
	}

	componentWillUnmount() {
		window.removeEventListener("mousemove", this.handleWindowMouseMove)
		window.removeEventListener("mouseup", this.handleWindowMouseUp)
	}

	render() {
		return (
			<div className="TimeSlider"
				onMouseDown={this.handleMouseDown}
			>
				{_.map(this.props.playerActions, (playerAction, actionId) => {
					const foundPlayer = this.props.players[playerAction.playerId]
					if (!foundPlayer) {
						return null
					}

					return (
						<div
							key={actionId}
							className="TimeSliderPlayerAction"
							style={{
								left: this.getTimeLeftPos(playerAction.step),
								background: foundPlayer.color,
							}}
						>
						</div>
					)
				})}
				<div
					className="TimeSliderControl"
					style={{
						left: this.getTimeLeftPos(this.props.currentStep)
					}}
				/>
			</div>
		)
	}

	/*
		Events.
	*/

	handleMouseDown = (e) => {
		e.preventDefault()
		this.dragging = true
		this.savedRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
		this.handleDrag(e)
	}

	handleWindowMouseMove = (e) => {
		this.handleDrag(e)
	}

	handleWindowMouseUp = (e) => {
		if (this.dragging) {
			this.dragging = false
			this.savedRect = null
		}
	}

	/*
		Helpers.
	*/

	handleDrag = function(e) {
		if (this.dragging) {
			var newStep = Math.round(((e.clientX - this.savedRect.left) / this.savedRect.width) * constants.gameSteps)
			if (newStep < 0) {
				newStep = 0
			}
			if (newStep > constants.gameSteps) {
				newStep = constants.gameSteps
			}
			if (newStep !== this.props.currentStep) {
				this.props.setCurrentStep(newStep)
			}
		}
	}

	getTimeLeftPos = function(step) {
		return `${(step / constants.gameSteps) * 100}%`
	}

}

export default connect(
	(state) => {
		return {
			currentStep   : state.currentStep,
			playerActions : state.playerActions,
			players       : state.players,
		}
	},
	(dispatch) => {
		return {
			setCurrentStep: (newStep) => {
				dispatch({
					type        : actionTypes.SetCurrentStep,
					currentStep : newStep
				})
			}
		}
	}
)(TimeSlider)

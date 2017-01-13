import React, { Component } from "react"
import {connect}            from "react-redux"
import Players              from "./Players"
import Grid                 from "./Grid"
import TimeSlider           from "./TimeSlider"
import Countdown            from "./Countdown"
import store                from "./store"
import * as actionTypes     from "./actionTypes"
import * as constants       from "./constants"
import "./App.css"

class App extends Component {
	componentWillMount() {
		store.dispatch({type: actionTypes.Initialize})
		store.dispatch({type: actionTypes.CleanupFirebase})
		setInterval(() => {
			store.dispatch({type: actionTypes.CleanupFirebase})
		}, 1000)
	}

	render() {
		const now = Date.now()
		console.log("this.props.gameStart: ", this.props.gameStart)
		// Game start countdown.
		if (this.props.gameStart > now) {
			return (
				<div className="App">
					<div
						className = "AppMainButton card"
						onClick   = {() => {
							this.props.startNewGame()
						}}
					>
						Starting in <Countdown
							target     = {this.props.gameStart}
							onComplete = {() => {
								this.forceUpdate()
							}}
						/>
					</div>
					<div className="AppMainContainer card">
						<Grid store={store} />
					</div>
				</div>
			)
		}
		else if (this.props.gameStart + constants.gameTime > now) {
			return (
				<div className="App">
					<div
						className = "AppMainButton card"
					>
						<TimeSlider store={store} />
					</div>
					<div className="AppMainContainer card">
						<Grid store={store} />
					</div>
				</div>
			)
		}
		// Game start screen.
		else {
			return (
				<div className="App">
					<div
						className = "AppMainButton card button"
						onClick   = {() => {
							this.props.startNewGame()
						}}
					>
						Start New Game
					</div>
					<div className="AppMainContainer card">
						<Players store={store} />
					</div>
				</div>
			)
		}
	}
}

export default connect(
	(state) => {
		return {
			gameStart : state.gameStart,
		}
	},
	(dispatch) => {
		return {
			startNewGame: () => {
				dispatch({
					type : actionTypes.StartNewGame,
				})
			}
		}
	}
)(App)

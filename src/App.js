import React, { Component } from "react"
import Players              from "./Players"
import Grid                 from "./Grid"
import TimeSlider           from "./TimeSlider"
import store                from "./store"
import * as actionTypes     from "./actionTypes"
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
		return (
			<div className="App">
				<div className="AppSidebarContainer">
					<Players store={store} />
				</div>
				<div className="AppGridContainer">
					<Grid store={store} />
					<TimeSlider store={store} />
				</div>
			</div>
		)
	}
}

export default App

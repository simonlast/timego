import React, { Component } from "react"

class Countdown extends Component {

	interval = null
	onCompleteFired = false

	componentWillMount() {
		const _this = this
		const now = Date.now()
		this.setState({
			now: now
		})
		this.interval = setInterval(() => {
			const now = Date.now()
			if (now >= _this.props.target) {
				if (_this.props.onComplete && !_this.onCompleteFired) {
					_this.onCompleteFired = true
					_this.props.onComplete()
				}
			}
			else {
				_this.setState({
					now: now
				})
			}
		}, 10)
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	render() {
		return (
			<span>{Math.ceil((this.props.target - this.state.now) / 1000)}</span>
		)
	}
}

export default Countdown

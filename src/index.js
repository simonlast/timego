import "setimmediate"

import React    from "react"
import ReactDOM from "react-dom"
import App      from "./App"
import store    from "./store"
import "./index.css"
import "./firebase"

ReactDOM.render(
	<App store={store} />,
	document.getElementById("root")
)

/* global setImmediate */
/* global firebase */
import {FirebaseUpdateKey} from "./actionTypes"

export default function(store) {
	const database = firebase.database()
	const rootRef  = database.ref()

	const handleChangeCallback = function(key, value) {
		setImmediate(() => {
			store.dispatch({
				type  : FirebaseUpdateKey,
				key   : key,
				value : value
			})
		})
	}

	rootRef.on("child_changed", (childSnapshot) => {
		handleChangeCallback(childSnapshot.key, childSnapshot.val())
	})

	rootRef.on("child_added", (childSnapshot) => {
		handleChangeCallback(childSnapshot.key, childSnapshot.val())
	})

	rootRef.on("child_removed", (childSnapshot) => {
		handleChangeCallback(childSnapshot.key, null)
	})

	return rootRef
}

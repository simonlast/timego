import _                from "lodash"
import chance           from "chance"
import { createStore }  from "redux"
import * as actionTypes from "./actionTypes"
import constants        from "./constants"
import * as gridHelpers from "./gridHelpers"
import firebase         from "./firebase"

var rootRef

const playerAvatarDefaults = [
	{
		avatar : "🙃",
		color  : "#95E1D3",
	},
	{
		avatar : "🐝",
		color  : "#FCE38A",
	},
	{
		avatar : "🦋",
		color  : "#EAFFD0",
	},
	{
		avatar : "👀",
		color  : "#F38181",
	},
]

const initialState = {

	currentPlayerId: null,

	/*
		{
			[playerId: string]: {
				name     : string,
				avatar   : string // An emoji.
				color    : string
				lastSeen : number
			}
		}
	*/
	players: {},

	/*
		{
			[actionId: string]: {
				playerId : player id string
				x        : number
				y        : number
				step     : number
			}
		}
	*/
	playerActions : {},

	/*
		Array<Array<GridItem>>
		GridItem:
			null |
			{
				type: "PlayerPin"
				playerId: string
			} |
			{
				type: "PlayerTerritory"
				playerId: string
			}
	*/
	grid         : gridHelpers.createGridAtStep([], 0, constants.gridWidth, constants.gridWidth),

	playerScores : {},

	gameStart    : 0,

	currentStep  : 0,
}

const reducers = {
	[actionTypes.SetCurrentStep]: function(state, action) {
		const newState = Object.assign({}, state)
		newState.currentStep  = action.currentStep
		newState.grid         = gridHelpers.createGridAtStep(state.playerActions, action.currentStep, constants.gridWidth, constants.gridWidth)
		newState.playerScores = gridHelpers.computePlayerScores(newState.grid, state.players)
		return newState
	},

	[actionTypes.FirebaseUpdateKey]: function(state, action) {
		const defaultValue = initialState[action.key]
		const newState     = Object.assign({}, state, {
			[action.key]: action.value || defaultValue
		})
		if (action.key === "playerActions") {
			// Recompute state.
			newState.grid         = gridHelpers.createGridAtStep(newState.playerActions, newState.currentStep, constants.gridWidth, constants.gridWidth)
			newState.playerScores = gridHelpers.computePlayerScores(newState.grid, newState.players)
		}
		return newState
	},

	[actionTypes.Initialize]: function(state, action) {
		const currentPlayer = _.assign({
			name     : chance().name(),
			lastSeen : Date.now()
		}, playerAvatarDefaults[_.random(0, playerAvatarDefaults.length - 1)])

		const playersRef       = rootRef.child("players")
		const currentPlayerRef = playersRef.push(currentPlayer)
		return Object.assign({}, state, {
			currentPlayerId: currentPlayerRef.key
		})
	},

	[actionTypes.CleanupFirebase]: function(state, action) {
		const now              = Date.now()
		const playersRef       = rootRef.child("players")
		const playerActionsRef = rootRef.child("playerActions")
		// Heartbeat current player.
		playersRef.child(state.currentPlayerId).update({
			lastSeen: now
		})

		_.each(state.players, (player, playerId) => {
			if (now - player.lastSeen > 3000) {
				_.each(state.playerActions, (playerAction, actionId) => {
					if (playerAction.playerId === playerId) {
						playerActionsRef.child(actionId).remove()
					}
				})

				playersRef.child(playerId).remove()
			}
		})
		return state
	},

	[actionTypes.AddPlayerAction]: function(state, action) {
		const playerAction = {
			playerId : state.currentPlayerId,
			x        : action.x,
			y        : action.y,
			step     : state.currentStep,
		}
		const playerActionsRef = rootRef.child("playerActions")
		playerActionsRef.push(playerAction)
		return state
	},
}

const reducer = function(state = initialState, action) {
	// console.log("action: ", action)
	if (reducers[action.type]) {
		return reducers[action.type](state, action)
	}
	else {
		return state
	}
}

const store = createStore(reducer, initialState)
rootRef = firebase(store)

export default store

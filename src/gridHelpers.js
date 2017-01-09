import _ from "lodash"

export const PlayerPin       = 0
export const PlayerTerritory = 1

export const createGrid = function(width, height) {
	const grid = []
	for (var i=0; i<height; i++) {
		const row = []
		for (var j=0; j<width; j++) {
			row.push(null)
		}
		grid.push(row)
	}
	return grid;
}

export const createGridAtStep = function(playerActions, step, width, height) {
	const grid = createGrid(width, height)

	const appliedPlayerActions = {}

	_.times(step + 1, (currentStep) => {
		// Grow previous player actions.
		_.times(height, (y) => {
			_.times(width, (x) => {
				if (grid[y][x]) {
					return
				}

				const playerActionsContendingForCell = _.filter(appliedPlayerActions, (playerAction) => {
					const playerActionAge = currentStep - playerAction.step
					const xDist = Math.abs(playerAction.x - x)
					const yDist = Math.abs(playerAction.y - y)
					return (
						(xDist === playerActionAge && yDist <= playerActionAge) ||
						(yDist === playerActionAge && xDist <= playerActionAge)
					)
				})
				if (playerActionsContendingForCell.length > 0) {
					const closestPin = _.minBy(playerActionsContendingForCell, (playerAction) => {
						const dist = Math.sqrt(Math.pow(playerAction.x - x, 2) + Math.pow(playerAction.y - y, 2))
						return dist
					})
					grid[y][x] = {
						type     : PlayerTerritory,
						playerId : closestPin.playerId
					}
				}
			})
		})

		// Apply new player actions.
		_.each(playerActions, (playerAction, actionId) => {
			if (playerAction.step === currentStep) {
				appliedPlayerActions[actionId] = playerAction
				grid[playerAction.y][playerAction.x] = {
					type     : PlayerPin,
					playerId : playerAction.playerId
				}
			}
		})
	})

	return grid
}

export const computePlayerScores = function(grid, players) {
	const playerScores = {}

	_.each(players, (player, playerId) => {
		playerScores[playerId] = 0
	})

	_.each(grid, (row) => {
		_.each(row, (cell) => {
			if (cell) {
				playerScores[cell.playerId]++
			}
		})
	})
	return playerScores
}

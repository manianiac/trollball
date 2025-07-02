// run a game loop

import {
  DEFENSIVE_ACTIONS,
  GAME_DURATION,
  match,
  OFFENSIVE_ACTIONS,
  TEAM_NAMES
} from '../utils/consts'
import { generateGemma, getRandomInt, selectRandomPlayer } from '../utils/utils'
import util from 'util'

// each 20 second span: choose a player at random and give them an action.
//  Check their team: if in possession, 50% chance to have that player act instead.
// Actions
//      Fight, Heal(odds are disabled players/roster)

export const gameLoop = async (gameState: match) => {
  for (let round = 0; round < GAME_DURATION; round++) {
    const allPlayers = [
      ...gameState.activePlayers.awayTeamActive,
      ...gameState.activePlayers.homeTeamActive
    ]
    // select a player at random to be active. Might need to add weight to the losing team?
    const activePlayer = selectRandomPlayer(allPlayers)
    console.log(round, activePlayer.name)
    // if the ball is dropped, someone picks up the ball
    if (gameState.possessionTeam === TEAM_NAMES['No Team']) {
      //make abstract action for this
      gameState.possession = activePlayer
      gameState.possessionTeam = gameState.possession.team
      let fiction =
        'The Trollball is picked up by the player currently in possession\n' +
        'Game State after this turn: ' +
        util.inspect(gameState)
      const output = await generateGemma(fiction)
      if (!!output) {
        gameState.fiction.push(output)
      }
    } else {
      const randomSeed = getRandomInt(0, 100)
      let weightedSum = 0
      let chosenAction = 'No Action'
      //all other options
      if (activePlayer.team === gameState.possessionTeam) {
        //handle offense
        OFFENSIVE_ACTIONS.forEach(action => {
          weightedSum += action.chance
          if (randomSeed <= weightedSum) {
            chosenAction = action.name
          }
        })
      } else {
        //handle defense
        DEFENSIVE_ACTIONS.forEach(action => {
          weightedSum += action.chance
          if (randomSeed <= weightedSum) {
            chosenAction = action.name
          }
        })
      }
      console.log(chosenAction)
    }
  }
  //   console.log(util.inspect(gameState))
}

// run a game loop

import { ALL } from 'dns'
import {
  ALL_ACTIONS,
  ANNOUNCER_INSTRUCTIONS,
  DEFENSIVE_ACTIONS,
  GAME_DURATION,
  match,
  OFFENSIVE_ACTIONS,
  TEAM_NAMES
} from '../utils/consts'
import { generateGemma, getRandomInt, selectRandomPlayer } from '../utils/utils'
import util from 'util'

// each 20 second span: choose a player at random and give them an action.
//TODO check if team has no active players: if so, heal immediately
//TODO abstract game loop to have an actionHandler that does the logic for each round
export const gameLoop = async (gameState: match) => {
  //set up team data
  gameState.homeTeam.activePlayers = [...gameState.homeTeam.players]
  gameState.homeTeam.inactivePlayers = []
  gameState.awayTeam.activePlayers = [...gameState.awayTeam.players]
  gameState.awayTeam.activePlayers = []
  gameState.instructions = ANNOUNCER_INSTRUCTIONS
  for (let round = 0; round < GAME_DURATION; round++) {}
  //   console.log(util.inspect(gameState))
}

const handleGamePhase = async (gameState: match): Promise<match> => {
  if (
    !!gameState.awayTeam.activePlayers &&
    gameState.awayTeam.activePlayers.length === 0
  ) {
    //away team heals
  } else if (
    !!gameState.homeTeam.activePlayers &&
    gameState.homeTeam.activePlayers.length === 0
  ) {
    //home team heals
  } else if (
    !!gameState.awayTeam.activePlayers &&
    !!gameState.homeTeam.activePlayers
  ) {
    const allPlayers = [
      ...gameState.awayTeam.activePlayers,
      ...gameState.homeTeam.activePlayers
    ]
    // select a player at random to be active. Might need to add weight to the losing team?
    const activePlayer = selectRandomPlayer(allPlayers)
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
      let chosenAction = ALL_ACTIONS['No Action']
      let actionNotFound = true
      //all other options
      if (activePlayer.team === gameState.possessionTeam) {
        //handle offense
        let actionNotFound = true
        OFFENSIVE_ACTIONS.forEach(action => {
          weightedSum += action.chance
          if (actionNotFound && randomSeed <= weightedSum) {
            //Need to figure out how to determine offense/defense better

            if (action.name === ALL_ACTIONS.Heal) {
              //all this heal logic can be handled in the HEAL action, pass in the game state and either heal or process a fight
              if (gameState.awayTeam.name === activePlayer.team) {
                if (
                  !!gameState.awayTeam.inactivePlayers &&
                  gameState.awayTeam.inactivePlayers.length > 0
                ) {
                  chosenAction = action.name
                } else {
                  chosenAction = ALL_ACTIONS.Fight
                }
              } else {
                if (
                  !!gameState.homeTeam.inactivePlayers &&
                  gameState.homeTeam.inactivePlayers.length > 0
                ) {
                  chosenAction = action.name
                } else {
                  chosenAction = ALL_ACTIONS.Fight
                }
              }
            } else {
              chosenAction = action.name
            }
            actionNotFound = false
          }
        })
      } else {
        //handle defense
        DEFENSIVE_ACTIONS.forEach(action => {
          weightedSum += action.chance
          if (actionNotFound && randomSeed <= weightedSum) {
            chosenAction = action.name
            actionNotFound = true
          }
        })
      }
      console.log(ALL_ACTIONS[chosenAction])
    }
  }
  return gameState
}

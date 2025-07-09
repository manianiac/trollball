// run a game loop

import {
  ALL_ACTIONS,
  DEFENSIVE_ACTIONS,
  GAME_DURATION,
  match,
  OFFENSIVE_ACTIONS,
  player,
  TEAM_NAMES
} from '../utils/consts'
import { generateGemma, getRandomInt, selectRandomPlayer } from '../utils/utils'
import { GoogleGenAI } from '@google/genai'
import { actionHandler } from './actions'
import fs from 'fs'

// each 20 second span: choose a player at random and give them an action.
//TODO check if team has no active players: if so, heal immediately
//TODO abstract game loop to have an actionHandler that does the logic for each round
export const gameLoop = async (gameState: match) => {
  let fiction: string[] = []
  //set up team data
  gameState.homeTeam.activePlayers = [...gameState.homeTeam.players]
  gameState.homeTeam.inactivePlayers = []
  gameState.awayTeam.activePlayers = [...gameState.awayTeam.players]
  gameState.awayTeam.inactivePlayers = []
  for (
    let round = 0;
    round < GAME_DURATION ||
    gameState.awayTeam.score === gameState.homeTeam.score;
    round++
  ) {
    gameState = await handleGamePhase(gameState)
    if (round === GAME_DURATION / 2) {
      gameState.homeTeam.activePlayers = gameState.homeTeam.players
      gameState.homeTeam.inactivePlayers = []
      gameState.awayTeam.inactivePlayers = gameState.awayTeam.players
      gameState.awayTeam.inactivePlayers = []
      gameState.possession = {} as player
      gameState.possessionTeam = TEAM_NAMES['No Team']
      fiction = gameState.plays
      gameState.plays = []
      gameState.plays.push(
        'HALFTIME - Each time has a quick break, and all injured players are returned to play'
      )
    } else if (round === GAME_DURATION) {
      gameState.homeTeam.activePlayers = gameState.homeTeam.players
      gameState.homeTeam.inactivePlayers = []
      gameState.awayTeam.inactivePlayers = gameState.awayTeam.players
      gameState.awayTeam.inactivePlayers = []
      gameState.possession = {} as player
      gameState.possessionTeam = TEAM_NAMES['No Team']
      fiction = gameState.plays
      gameState.plays = []
      gameState.plays.push(
        'OVERTIME - Each time has a quick break, and all injured players are returned to play'
      )
    }
  }
  gameState.plays = [...fiction, ...gameState.plays]
  const ai = new GoogleGenAI({})

  const response = await generateGemma(
    'Attached below is a log for a game of Trollball. ' +
      'Please give a summary of the game and any narratives that happened during it, highlghting any notable moments. ' +
      'Make sure to include the final score in the summary.\n\n' +
      JSON.stringify(gameState)
  )

  console.log(response)
  fs.writeFile('testOut.json', JSON.stringify(gameState), 'utf8', err => {
    if (err) {
      console.error('Error writing to file', err)
    } else {
      console.log(`Data written to JSON.`)
    }
  })
}

const handleGamePhase = async (gameState: match): Promise<match> => {
  let chosenAction = ALL_ACTIONS['No Action']
  let activePlayer = {} as player
  if (
    !!gameState.awayTeam.activePlayers &&
    gameState.awayTeam.activePlayers.length === 0
  ) {
    activePlayer = gameState.awayTeam.healer
    chosenAction = ALL_ACTIONS.Heal
    //away team heals
  } else if (
    !!gameState.homeTeam.activePlayers &&
    gameState.homeTeam.activePlayers.length === 0
  ) {
    activePlayer = gameState.homeTeam.healer
    chosenAction = ALL_ACTIONS.Heal
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
    activePlayer = selectRandomPlayer(allPlayers)
    // if the ball is dropped, someone picks up the ball
    if (gameState.possessionTeam === TEAM_NAMES['No Team']) {
      //make abstract action for this
      gameState.possession = activePlayer
      gameState.possessionTeam = gameState.possession.team
      let fiction =
        'The Trollball is picked up by ' +
        gameState.possession.name +
        ' in zone ' +
        gameState.currentZone
      gameState.plays.push(fiction)
    } else {
      const randomSeed = getRandomInt(0, 100)
      let weightedSum = 0
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
            if (action.name === ALL_ACTIONS.Heal) {
              if (
                activePlayer.team === gameState.homeTeam.name &&
                !!gameState.homeTeam.inactivePlayers &&
                gameState.homeTeam.inactivePlayers.length > 0
              ) {
                chosenAction = action.name
              } else if (
                !!gameState.awayTeam.inactivePlayers &&
                gameState.awayTeam.inactivePlayers.length > 0
              ) {
                chosenAction = action.name
              } else {
                chosenAction = ALL_ACTIONS.Fight
              }
            } else {
              chosenAction = action.name
            }
            actionNotFound = true
          }
        })
      }
    }
  }
  gameState = actionHandler(gameState, activePlayer, chosenAction)
  if (gameState.latestAction !== '') {
    gameState.plays.push(gameState.latestAction + '')
    gameState.latestAction = ''
  }
  return gameState
}

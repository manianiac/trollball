import {
  match,
  team,
  TEAM_NAMES,
  TROLLBALL_CONTEXT,
  ZONE
} from './utils/consts'
import { generateTeam } from './utils/generateTeam'
import util from 'util'
import { join } from 'path'
import { readFileSync, writeFile } from 'fs'
import { Markov } from 'ts-markov'
import { generateGemma, generateNameGenerator } from './utils/utils'
import { gameLoop } from './gameFiles/gameRunner'

let teams = [
  JSON.parse(
    readFileSync(
      join(
        __dirname,
        'utils',
        'data',
        'teams',
        TEAM_NAMES['The Ebon Gate Corruptors'] + '.json'
      ),
      'utf-8'
    )
  ),
  JSON.parse(
    readFileSync(
      join(
        __dirname,
        'utils',
        'data',
        'teams',
        TEAM_NAMES['The New Ravenfall Commanders'] + '.json'
      ),
      'utf-8'
    )
  )
]
const nameGenerator = generateNameGenerator()

// teams.push(
//   generateTeam(TEAM_NAMES['The New Ravenfall Commanders'], nameGenerator)
// )
// teams.push(generateTeam(TEAM_NAMES['The Ebon Gate Corruptors'], nameGenerator))
// teams[0].stadium = {
//   name: 'The New Ravenfall Colliseum',
//   location: 'New Ravenfall, Eponore',
//   modifiers: []
// }
Object.values(TEAM_NAMES).forEach(teamName => {
  writeFile(
    teamName + '.json',
    JSON.stringify(generateTeam(TEAM_NAMES[teamName], nameGenerator)),
    'utf8',
    err => {
      if (err) {
        console.error('Error writing to file', err)
      } else {
        console.log(`Data written to JSON.`)
      }
    }
  )
})

let gameState: match = {} as match

gameState.awayTeam = teams[1]
gameState.homeTeam = teams[0]
gameState.arena = teams[0].stadium
gameState.currentZone = ZONE['Center Field']
gameState.possessionTeam = TEAM_NAMES['No Team']
gameState.plays = []
gameState.context = TROLLBALL_CONTEXT

const testAi = async () => {
  // let aiOut = await generateGemma(
  //   'Describe the game below that has not started: \n' +
  //     JSON.stringify(gameState) +
  //     "\n\nDon't describe each player's pregame rituals, just call out one or two"
  // )
  // if (!!aiOut) {
  //   console.log(aiOut)
  //   gameState.plays.push(aiOut)
  gameLoop(gameState)
  // }
}

testAi()

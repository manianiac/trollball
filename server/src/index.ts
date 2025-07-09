import {
  ANNOUNCER_INSTRUCTIONS,
  match,
  team,
  TEAM_NAMES,
  TROLLBALL_CONTEXT,
  ZONE
} from './utils/consts'
import { generateTeam } from './utils/generateTeam'
import util from 'util'
import { readFileSync } from 'fs'
import { Markov } from 'ts-markov'
import { join } from 'path'
import { generateGemma } from './utils/utils'
import { gameLoop } from './gameFiles/gameRunner'

const generateNameGenerator = (): Markov => {
  const filePath: string = join(__dirname, 'data', 'names.txt')
  const fileContent: string = readFileSync(filePath, 'utf-8')
  const lines: string[] = fileContent.split('\n')
  const nameGenerator = new Markov()
  lines.forEach((line: string) => {
    nameGenerator.addSentence([line])
  })
  //   nameGenerator.addSentence(['THIS IS A TEST'])
  nameGenerator.train()
  return nameGenerator
}
let players = []
const nameGenerator = generateNameGenerator()

players.push(
  generateTeam(TEAM_NAMES['The Ebon Gate Corruptors'], nameGenerator)
)
players.push(
  generateTeam(TEAM_NAMES['The New Ravenfall Commanders'], nameGenerator)
)
console.log(util.inspect(players, { depth: null }))
let gameState: match = {} as match

gameState.awayTeam = players[0]
gameState.homeTeam = players[1]
gameState.arena = players[1].stadium
gameState.currentZone = ZONE['Center Field']
gameState.possessionTeam = TEAM_NAMES['No Team']
gameState.plays = []
gameState.context = TROLLBALL_CONTEXT

const testAi = async () => {
  let aiOut = await generateGemma(
    'Describe the game below that has not started: \n' +
      JSON.stringify(gameState) +
      "\n\nDon't describe each player's pregame rituals, just call out one or two"
  )
  if (!!aiOut) {
    console.log(aiOut)
    gameState.plays.push(aiOut)
    gameLoop(gameState)
  }
}

testAi()

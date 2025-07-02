import { match, team, TEAM_NAMES, ZONE } from './utils/consts'
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

  nameGenerator.train()
  return nameGenerator
}
let players = []
let emptyTeam: team = {} as team
const nameGenerator = generateNameGenerator()

players.push(generateTeam(TEAM_NAMES['The Tortell Privateers'], nameGenerator))
players.push(
  generateTeam(TEAM_NAMES['The Confluence Pre-Corpus'], nameGenerator)
)
console.log(util.inspect(players, { depth: null }))
let gameState: match = {} as match
gameState.activePlayers = {
  awayTeamActive: players[0].players,
  awayTeamDisabled: [],
  homeTeamActive: players[1].players,
  homeTeamDisabled: []
}
gameState.awayTeam = players[0]
gameState.homeTeam = players[1]
gameState.arena = players[1].stadium
gameState.currentZone = ZONE['Center Field']
gameState.possessionTeam = TEAM_NAMES['No Team']
gameState.fiction = [
  'You are describing the play-by-play phases of a game of Trollball, a fantasy mix between rugby and Bloodbowl, played with a leather facsimile of a troll head.' +
    "\nDon't mention stats or other details, as this is an in-universe retelling." +
    '\nDo not describe any additional game actions.'
]

gameLoop(gameState)
// const testAi = async () => {
//   let aiOut = await generateGemma(
//     'Describe the following situation in prose: \n' +
//       'Teams:\nTortel Privateers: ' +
//       util.inspect(players[0]) +
//       '\nConcluence Pre-Corpus: ' +
//       util.inspect(players[1]) +
//       '\nPlayers:\n' +
//       'Active Player: ' +
//       util.inspect(players[0].players[0]) +
//       '\nSecondary Player: ' +
//       util.inspect(players[0].players[1]) +
//       '\nThe Active Player tries and fails to pass the Trollball to the Secondary Player' +
//       '\nThis is representing an action done in a game of Trollball, a fantasy mix between rugby and Bloodbowl' +
//       "\nDon't mention stats or other details, as this is an in-universe retelling." +
//       '\nDo not describe any additional game actions.'
//   )
//   console.log(aiOut)

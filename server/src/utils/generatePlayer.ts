import { player, team, stats, TEAM_NAMES } from './consts'
import { boundedNumber, generateNormalRandom, getRandomInt } from './utils'
import { Markov } from 'ts-markov'
export const generatePlayer = (team: TEAM_NAMES, nameGenerator: Markov) => {
  let newPlayer: player = {} as player
  newPlayer.name = nameGenerator.generate().toString()
  newPlayer.team = team
  newPlayer.stats = generateStats()
  return newPlayer
}

const generateStats = () => {
  let stats: stats = {} as stats
  stats.alcohol_tolerance = generateIndividualStat()
  stats.pass = generateIndividualStat()
  stats.catch = generateIndividualStat()
  stats.run = generateIndividualStat()
  stats.block = generateIndividualStat()
  stats.fight = generateIndividualStat()
  stats.throw = generateIndividualStat()
  stats.luck = generateIndividualStat()
  stats.civic_engagement = generateIndividualStat()

  stats.literate = getRandomInt(0, 10) >= 4 ? true : false
  return stats
}

const generateIndividualStat = () => {
  const mean = 50
  const stdDev = 6.5
  const upperBound = 80
  const lowerBound = 20
  return boundedNumber(generateNormalRandom(55, 6.5), 80, 20)
}

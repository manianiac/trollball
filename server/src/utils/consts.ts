interface commonProperties {
  name: string
}

interface team extends commonProperties {
  players: player[]
  stadium: stadium
  luck: number
  wins: number
  losses: number
  healer: player
}

interface player extends commonProperties {
  team: team
  stats: stats
}

interface stats {
  // stats that matter
  pass: number
  catch: number
  run: number
  block: number
  fight: number
  throw: number
  luck: number
  // silly stats
  literate: boolean
  alcohol_tolerance: number
  civic_engagement: number
  pregame_ritual: string
}

interface stadium extends commonProperties {
  location: string
  modifiers: string[]
}

interface activePlayers {
  homeTeamActive: player[]
  homeTeamDisabled: player[]
  awayTeamActive: player[]
  awayTeamDisabled: player[]
}

interface match {
  homeTeam: team
  awayTeam: team
  arena: stadium
  activePlayers: activePlayers
  possession: player | null
  currentZone: ZONE
}

enum ZONE {
  'Home Goal' = 1,
  'Home 2-Point',
  'Home Field',
  'Center Field',
  'Away Field',
  'Away 2-Point',
  'Away Goal'
}

const PREGAME_RITUAL = ['']

const STADIUM_MODIFIERS = ['']

const GAME_DURATION = 60 //rounds
export interface team {
  name: TEAM_NAMES
  players: player[]
  stadium: stadium
  luck: number
  wins: number
  losses: number
  healer: player
}

export interface player {
  name: string
  team: TEAM_NAMES
  stats: stats
}

export interface stats {
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

export interface stadium {
  name: string
  location: string
  modifiers: string[]
}

export interface activePlayers {
  homeTeamActive: player[]
  homeTeamDisabled: player[]
  awayTeamActive: player[]
  awayTeamDisabled: player[]
}

export interface match {
  homeTeam: team
  awayTeam: team
  arena: stadium
  activePlayers: activePlayers
  possession: player | null
  possessionTeam: TEAM_NAMES
  currentZone: ZONE
  fiction: string[]
}

export enum ZONE {
  'Home Goal' = 1,
  'Home 2-Point',
  'Home Field',
  'Center Field',
  'Away Field',
  'Away 2-Point',
  'Away Goal'
}

export enum TEAM_NAMES {
  'No Team' = -1,
  'The Tortell Privateers',
  'The Confluence Pre-Corpus'
}

export const PREGAME_RITUAL = ['']

export const STADIUM_MODIFIERS = ['']

export const GAME_DURATION = 60 //rounds

export const STARTING_ROSTER_SIZE = 10

export const OFFENSIVE_ACTIONS = [
  { name: 'Run', chance: 20 },
  { name: 'Pass', chance: 20 },
  { name: 'Shoot', chance: 20 },
  { name: 'Heal', chance: 20 },
  { name: 'Fight', chance: 20 }
]

export const DEFENSIVE_ACTIONS = [
  { name: 'Fight', chance: 20 },
  { name: 'Heal', chance: 20 }
]

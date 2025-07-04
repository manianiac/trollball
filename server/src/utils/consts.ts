export interface team {
  name: TEAM_NAMES
  players: player[]
  stadium: stadium
  luck: number
  wins: number
  losses: number
  healer: player
  activePlayers?: player[]
  inactivePlayers?: player[]
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
  possession: player | null
  possessionTeam: TEAM_NAMES
  currentZone: ZONE
  fiction: string[]
  instructions?: string
}

export enum ZONE {
  'Home Goal' = 'Home Goal',
  'Home 2-Point' = 'Home 2-Point',
  'Home Field' = 'Home Field',
  'Center Field' = 'Center Field',
  'Away Field' = 'Away Field',
  'Away 2-Point' = 'Away 2-Point',
  'Away Goal' = 'Away Goal'
}

export enum TEAM_NAMES {
  'No Team' = 'No Team',
  'The Tortell Privateers' = 'The Tortell Privateers',
  'The Confluence Captains' = 'The Confluence Captains'
}

export const PREGAME_RITUAL = ['']

export const STADIUM_MODIFIERS = ['']

export const GAME_DURATION = 60 //rounds

export const STARTING_ROSTER_SIZE = 10

export enum ALL_ACTIONS {
  'No Action' = -1,
  'Run',
  'Pass',
  'Shoot',
  'Heal',
  'Fight'
}

export const OFFENSIVE_ACTIONS = [
  { name: ALL_ACTIONS.Run, chance: 30 },
  { name: ALL_ACTIONS.Pass, chance: 10 },
  { name: ALL_ACTIONS.Shoot, chance: 10 },
  { name: ALL_ACTIONS.Heal, chance: 20 },
  { name: ALL_ACTIONS.Fight, chance: 30 }
]

export const DEFENSIVE_ACTIONS = [
  { name: ALL_ACTIONS.Fight, chance: 80 },
  { name: ALL_ACTIONS.Heal, chance: 20 }
]

export const ANNOUNCER_INSTRUCTIONS =
  'You are describing the play-by-play phases of a game of Trollball, a fantasy mix between rugby and Bloodbowl, played with a leather facsimile of a troll head.' +
  "\nDon't mention stats or other details, as this is an in-universe retelling." +
  '\nDo not describe any additional game actions.' +
  '\nYou will describe these play-by-plays as though you are a radio announcer, styled after Ernie Harwell'

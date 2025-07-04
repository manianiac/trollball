import { match, player, team } from '../utils/consts'
import { selectRandomPlayer } from '../utils/utils'

const run = (
  gameState: match,
  activePlayer: player
): { gameState: match; descriptiveText: string } => {
  let blockingPlayer: player = {} as player
  if (activePlayer.team === gameState.awayTeam.name) {
    blockingPlayer = selectRandomPlayer(
      !!gameState.homeTeam.activePlayers ? gameState.homeTeam.activePlayers : []
    )
  }
  let descriptiveText = ''
  return { gameState, descriptiveText }
}

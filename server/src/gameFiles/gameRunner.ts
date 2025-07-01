// run a game loop

// each 20 second span: choose a player at random and give them an action. 
//  Check their team: if in possession, 50% chance to have that player act instead.
// Actions
//      Fight, Heal(odds are disabled players/roster)

const gameLoop = (gameState:match) => {
    for(let round = 0; round < GAME_DURATION; round++) {
        if(gameState.possession === null) {
            
        }
    }
}
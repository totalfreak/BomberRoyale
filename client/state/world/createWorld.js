import { WORLD_SIZE } from './../../config'

const { width, height } = WORLD_SIZE

const worldCreator = game => {
  game.physics.startSystem(Phaser.Physics.P2JS)
  game.state.disableVisibilityChange = true
  game.world.setBounds(0, 0, width, height)
  createMap(game)
}

const createMap = game=> {
  let groundTiles = []
  for (let x = 0; x <= width / 64 + 1; x++) {
    for(let y = 0; y <= height / 64 + +1; y++) {
      const groundSprite = game.add.sprite(x * 64, y * 64, 'asphalt')
      groundTiles.push(groundSprite)
    }
  }
}

export default worldCreator

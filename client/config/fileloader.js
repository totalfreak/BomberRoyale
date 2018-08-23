import { ASSETS_URL } from '.'

const fileLoader = game => {
  game.load.crossOrigin = 'Anonymous'
  game.stage.backgroundColor = '#1E1E1E'
  game.loadimage('asphalt', `${ASSETS_URL}/sprites/asphalt/asphalt.png`);
  game.loadimage('car', `${ASSETS_URL}/sprites/car/car.png`);
}

export default fileLoader

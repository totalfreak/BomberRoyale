import createPlayer from './createPlayer'
import { isDown } from '../utils'

export default function(x, y, game, socket) {
  const player = {
    socket,
    sprite: createPlayer(x, y, game),
    playerName: null,
    speed: 0,
    speedText: null,
    drive (game) {
      const KEYS = {
        W: Phaser.Keyboard.W,
        S: Phaser.Keyboard.S,
        A: Phaser.Keyboard.A,
        D: Phaser.Keyboard.D
      }

      //Dont emit if not moving
      if (this.speed !== 0) {
        this.emitPlayerData()
      }

      //Drive forward
      if (isDown(game, KEYS.W) && this.speed <= 400) {
        this.speed += 10
      } else if(this.speed >= 10) {
        this.speed -= 10
      }

      //Drive backwards
      if (isDown(game, KEYS.S) && this.speed >= -200) {
        this.speed -= 50
      } else if(this.speed <= -5) {
        this.speed += 5
      }

      //Stearing
      if(isDown(game, KEYS.A)) {
        this.sprite.body.angularVelocity = -5 * (this.speed / 1000)
      } else if(isDown(game, KEYS.D)) {
        this.sprite.body.angularVelocity = 5 * (this.speed / 1000)
      } else {
        this.sprite.body.angularVelocity = 0;
      }

      this.sprite.body.velocity.x = this.speed * Math.cos((this.sprite.body.angle - 360) * 0.01745)
      this.sprite.body.velocity.y = this.speed * Math.sin((this.sprite.body.angle - 360) * 0.01745)

      game.world.bringToTop(this.sprite)

      this.updatePlayerName()
      this.updatePlayerStatusText('speed', this.sprite.body.x - 57, this.sprite.body.y - 39, this.speedText)
    },
    emitPlayerData() {
      socket.emit('move-player', {
        x: this.sprite.body.x,
        y: this.sprite.body.y,
        angle: this.sprite.body.rotation,
        playerName: {
          name: this.playerName.text,
          x: this.playerName.x,
          y: this.playerName.y
        },
        speed: {
          value: this.speed,
          x: this.speedText.x,
          y: this.speedText.y
        }
      })
    },
    updatePlayerName (name = this.socket.id, x = this.sprite.body.x - 57, y = this.sprite.body.y - 59) {
      this.playerName.text = String(name)
      this.playerName.x = x
      this.playerName.y = y

      game.world.bringToTop(this.playerName)
    },
    updatePlayerStatusText(status, x, y, text) {
      const capStatus = status[0].toUpperCase() + status.substring(1)
      let newText = ''

      //Set speed text to either 0 or the speed
      this[status] < 0 ? this.newText = 0 : this.newText = this[status]

      //Update text position and string
      text.x = x
      text.y = y,
      text.text = `${capStatus}: ${parseInt(this.newText)}`
      game.world.bringToTop(text)
    }
  }
  return player
}

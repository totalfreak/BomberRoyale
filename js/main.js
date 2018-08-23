//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

//var Game = this;

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let controls;
let map;
let player;
let showDebug = false;
let spawned = false;

function preload() {
  this.load.image('sprite', '../assets/sprites/sprite.png');
  this.load.image('tiles', '../assets/tilesets/tuxmon-sample-32px-extruded.png');
  this.load.tilemapTiledJSON('map', '../assets/tilemaps/tuxemon-town.json');

  Game = this;
}

var playerSprite1;

function create() {

  SOCKET_ID = Client.myOwnID();
  map = this.make.tilemap({key: "map"});

  tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', "tiles");
  //layers
  belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({collides: true});


  aboveLayer.setDepth(10);

  spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

  this.playerMap = {};

  Client.askNewPlayer(spawnPoint.x, spawnPoint.y);

}

function addNewPlayer(id, x, y) {
    //Adding own player
    if(id == SOCKET_ID) {
      Game.playerMap[id] = Game.physics.add.image(x, y, 'sprite');
      camera = Game.cameras.main;
      camera.startFollow(Game.playerMap[id]);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      Game.physics.add.collider(Game.playerMap[id], worldLayer);
      cursors = Game.input.keyboard.createCursorKeys();
      spawned = true;
    } else {
      Game.playerMap[id] = Game.add.sprite(x, y, 'sprite');
    }
};

function update(time, delta) {
    if(spawned) {
      const speed = 100;
      // Runs once per frame for the duration of the scene
      // Stop any previous movement from the last frame
      Game.playerMap[SOCKET_ID].body.setVelocity(0);

      // Horizontal movement
      if (cursors.left.isDown) {
        Game.playerMap[SOCKET_ID].body.setVelocityX(-speed);
      } else if (cursors.right.isDown) {
        Game.playerMap[SOCKET_ID].body.setVelocityX(speed);
      }

      // Vertical movement
      if (cursors.up.isDown) {
        Game.playerMap[SOCKET_ID].body.setVelocityY(-speed);
      } else if (cursors.down.isDown) {
        Game.playerMap[SOCKET_ID].body.setVelocityY(speed);
      }
      Game.playerMap[SOCKET_ID].body.velocity.normalize().scale(speed);
      Client.startMove(Game.playerMap[SOCKET_ID].body.position.x, Game.playerMap[SOCKET_ID].body.position.y, Client.socket.id);
  }

}


function movePlayer(socketID, x, y){
    console.log(Game.playerMap[socketID]);
    Game.playerMap[socketID].x = x;
    Game.playerMap[socketID].y = y;
};

function removePlayer(id){
    Game.playerMap[id].destroy();
    delete this.playerMap[id];
};

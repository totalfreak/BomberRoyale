
var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    game.load.image('sprite', 'assets/sprites/sprite.png');
};

Game.create = function(){

    SOCKET_ID = Client.myOwnID();
    Game.playerMap = {};
    var testKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

    KEYS = {
        W: game.input.keyboard.addKey(Phaser.Keyboard.W),
        S: game.input.keyboard.addKey(Phaser.Keyboard.S),
        A: game.input.keyboard.addKey(Phaser.Keyboard.A),
        D: game.input.keyboard.addKey(Phaser.Keyboard.D)
      }
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX, pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    console.log(id);
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
};


Game.update = function() {
  var direction = new Phaser.Point();
  var speed = 5;
  if(KEYS.W.isDown) {
    direction.y-=speed;
  }
  if(KEYS.A.isDown) {
    direction.x-=speed;
  }
  if(KEYS.S.isDown) {
    direction.y+=speed;
  }
  if(KEYS.D.isDown) {
    direction.x+=speed;
  }
  if(direction.x != 0 || direction.y != 0) {
    Game.playerMap[SOCKET_ID].position.x += direction.x;
    Game.playerMap[SOCKET_ID].position.y += direction.y;
    Client.startMove(Game.playerMap[SOCKET_ID].position.x, Game.playerMap[SOCKET_ID].position.y, Client.socket.id);
  }
};

Game.sendPlayerPositions = function() {
  for(let index in Game.playerMap) {
   //console.log(Game.playerMap[index]);
  }
};

Game.movePlayer = function(socketID, id, x, y){
    var otherPlayer = Game.playerMap[socketID];
    otherPlayer.position.x = x;
    otherPlayer.position.y = y;
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

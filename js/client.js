

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(x, y){
    Client.socket.emit('newplayer', {x:x, y:y});
};

Client.sendClick = function(x, y){
  Client.socket.emit('click', {x:x, y:y});
};

Client.startMove = function(x, y, id){
  Client.socket.emit('startMove', {x:x, y:y, socketID:id});
};

Client.myOwnID = function() {
    return Client.socket.id;
}


Client.socket.on('newplayer', function(data){
    addNewPlayer(data.socketID, data.x, data.y);
});


Client.socket.on('allplayers', function(data){
    for(var i = 0; i < data.length; i++){
        addNewPlayer(data[i].socketID, data[i].x, data[i].y);
    }

    Client.socket.on('move', function(data){
      if(data.socketID != Client.myOwnID()) {
        movePlayer(data.socketID, data.x, data.y);
      }
    });

    Client.socket.on('remove', function(id){
        removePlayer(id);
    });
});

// Network.js
var Network = pc.createScript('network');
var isConnect = false;
var players;
var initialized = false;
var player;

function initializeSocket() {
    try {
        socket = new WebSocket("ws://localhost:8080/");
    } catch (exception) {
        console.error(exception);
    }

    socket.onerror = function(error) {
        console.error(error);
    };

    socket.onopen = function(event) {
        console.log("Connexion établie.");
        isConnect = true;
    };

    socket.onclose = function(event) {
        console.log("Connexion terminé.");
    };
    
}

function sendData(method, data) {
    var messageToSend = {
        method: method,
        data: data
    };
    
    var messageJson = JSON.stringify(messageToSend);
    socket.send(messageJson);
}

initializeSocket();

// initialize code called once per entity
Network.prototype.initialize = function() {
    while (!isConnect) {
        
    }
    
    socket.send("initialize");
    
    this.player = this.app.root.findByName('Player');
    this.other = this.app.root.findByName('Other');
    
    var self = this;
    
    socket.onmessage = function(event) {

        var messageJson = JSON.parse(event.data);

        if (messageJson.method !== undefined) {
            switch (messageJson.method) {
                case "playerJoined":
                    self.addPlayer(messageJson.data);
		            console.log(messageJson);
                    break;
                case "playerData":
                    self.initializePlayers(messageJson.data);
		            console.log(messageJson);
                    break;
                case "playerMoved":
                    self.movePlayer(messageJson.data);
                    break;
                case "playerDisconnect":
                    self.destroyPlayer(messageJson.data)
                    break;
            }
        }
    };
};

// update code called every frame
Network.prototype.update = function(dt) {
    this.updatePosition();
};


// Self made Functions


Network.prototype.initializePlayers = function(data) {
    console.log("INIT PLAYERS");
    console.log(data);
    players = data.players;
    this.id = data.id;
    
    for (var id in players) {
        if (id != data.id) {
            players[id].entity = this.createPlayerEntity(players[id]);
        }
    }
    
    initialized = true;
};

Network.prototype.createPlayerEntity = function(data) {
    var newPlayer = this.other.clone();
    
    newPlayer.enabled = true;
    this.other.getParent().addChild(newPlayer);
    
    if (data)
        newPlayer.rigidbody.teleport (data.x, data.y, data.z);
    
    return newPlayer;
};

Network.prototype.addPlayer = function(data) {
    console.log("ADD PLAYER");
    console.log(data);
    console.log(players);
    
    if (initialized)
        players[data.id] = data;
        players[data.id].entity = this.createPlayerEntity(data);
};


Network.prototype.movePlayer = function(data) {
    if (initialized)
        players[data.id].entity.rigidbody.teleport (data.x, data.y, data.z);
};

Network.prototype.updatePosition = function() {
    if (initialized) {
        var pos = this.player.getPosition();
        sendData("positionUpdate", {id: this.id, x: pos.x, y: pos.y, z: pos.z});
    }
};

Network.prototype.destroyPlayer = function(data) {
    console.log("DESTROY")
    console.log(data)
    if (initialized) {
        players[data.id].entity.destroy();
        players.delete(data.id);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Network.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/

// movement.js
var Movement = pc.createScript('movement');

Movement.attributes.add('playerSpeed', {
    type: 'number',
    default: 30,
    title: 'Player Speed'
});

// initialize code called once per entity
Movement.prototype.initialize = function() {
    this.force = new pc.Vec3();
};

// update code called every frame
Movement.prototype.update = function(dt) {
    var forward = this.entity.forward;
    var right = this.entity.right;
    var app = this.app;

    x = 0;
    z = 0;

    if (app.keyboard.isPressed(pc.KEY_A)) {
        x -= right.x;
        z -= right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_D)) {
        x += right.x;
        z += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) {
        x += forward.x;
        z += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S)) {
        x -= forward.x;
        z -= forward.z;
    }

    if (x !== 0 || z !== 0) {
        x *= dt;
        z *= dt;

        this.force.set (x, 0, z).normalize ().scale ((this.playerSpeed));
        this.entity.rigidbody.applyForce (this.force);
    }
};


// Network.js
var Network = pc.createScript('network');
var players;
var initialized = false;
var player;

function initializeSocket() {
    try {
        socket = new WebSocket("ws://" + window.location.hostname + ":8080/game/");
    } catch (exception) {
        console.log(exception);
    }

    socket.onerror = function(error) {
        console.log(error);
        console.log(socket.readyState);
        if (socket.readyState >= 2)
            socket.close();
    };

    socket.onopen = function(event) {
        console.log("Connection established.");
    };

    socket.onclose = function(event) {
        console.log("Connection ended.");
    };

}

function sendData(method, data) {
    var messageToSend = {
        method: method,
        data: data
    };

    var messageJson = JSON.stringify(messageToSend);
    if (socket.readyState >= 2) {
        socket.close();
        return;
    }
    socket.send(messageJson);
}

function attemptServerConnection(self, attempt)   {
    console.log("Connecting to server");
    initializeSocket();
    setTimeout(function () {
        initializeFunc(self, attempt + 1);
    }, 3000);
}

function initializeFunc(self, attempt) {
    if (socket.readyState != 1) {
        if (attempt == 5) {
            console.log("Server unreachable after 5 attemps");
            return;
        }
        attemptServerConnection(self, attempt);
        return;
    }

    socket.send("initialize");
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
                    self.destroyPlayer(messageJson.data);
                    break;
            }
        }
    };
}

// initialize code called once per entity
Network.prototype.initialize = function() {
    player = this.app.root.findByName('Player');
    this.player = this.app.root.findByName('Player');
    this.other = this.app.root.findByName('Other');
    var self = this;
    
    this.name = parent.getName();
    this.entity.children[1].element.text = this.name;
    
    
    attemptServerConnection(self, 0);
};

// update code called every frame
Network.prototype.update = function(dt) {
    var newName = parent.getName();
    if (this.name != newName) {
        this.name = newName;
        this.entity.children[1].element.text = this.name;
    }    
    //this.updatePosition();
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

    if (data) {
        newPlayer.rigidbody.teleport (data.x, data.y, data.z, data.rotx, data.roty, data.rotz);
        if (newPlayer.children[0].script.animate.state != data.state) {
            newPlayer.children[0].script.animate.setState(data.state);
        }
       newPlayer.children[1].element.text = data.name;
    }

    return newPlayer;
};

Network.prototype.addPlayer = function(data) {
    if (initialized) {
        console.log(data);
        console.log(players);

        players[data.id] = data;
        players[data.id].entity = this.createPlayerEntity(data);
    }
};


Network.prototype.movePlayer = function(data) {
    if (initialized) {
        players[data.id].x = data.x;
        players[data.id].y = data.y;
        players[data.id].z = data.z;
        players[data.id].rotx = data.rotx;
        players[data.id].roty = data.roty;
        players[data.id].rotz = data.rotz;
        players[data.id].entity.rigidbody.teleport (data.x, data.y, data.z, data.rotx, data.roty, data.rotz);
        
        var playAnim = players[data.id].entity.children[0].script.animate;
        if (playAnim.state != data.state) {
            playAnim.setState(data.state);
        }
        
        if (players[data.id].name != data.name) {
            players[data.id].name = data.name;
            players[data.id].entity.children[1].element.text = data.name;
        }
    }
};

Network.prototype.updatePosition = function() {
    if (initialized) {
        var pos = this.player.getPosition();
        var rot = this.player.getEulerAngles();

        sendData("positionUpdate", {
            id: this.id,
            x: pos.x, y: pos.y, z: pos.z,
            rotx: rot.x, roty: rot.y, rotz: rot.z,
            state: this.player.children[0].script.animate.state,
            name: this.name
        });
    }
};

Network.prototype.destroyPlayer = function(data) {
    console.log("DESTROY");
    console.log(data);
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

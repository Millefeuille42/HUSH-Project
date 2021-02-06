var Network=pc.createScript("network");try{this.socket=new WebSocket("ws://localhost:8080/")}catch(t){console.error(t)}function sendData(t,e){var i={method:t,data:e},o=JSON.stringify(i);this.socket.send(o)}this.socket.onerror=function(t){console.error(t)},this.socket.onopen=function(t){console.log("Connexion établie.")},this.socket.onclose=function(t){console.log("Connexion terminé.")},Network.prototype.initialize=function(){socket=this.socket,this.socket.send("initialize"),this.player=this.app.root.findByName("Player"),this.player=this.app.root.findByName("Other");var t=this;socket.onmessage=function(e){var i=JSON.parse(message);if(void 0!==i.method)switch(i.method){case"playerJoined":t.initializePlayers(i.data);break;case"playerData":t.addPlayer(i.data);break;case"playerMoved":t.movePlayer(i.data)}}},Network.prototype.update=function(t){this.updatePosition()},Network.prototype.initializePlayers=function(t){for(var e in this.players=t.players,this.id=t.id,this.players)e!=Network.id&&(this.players[e].entity=this.createPlayerEntity(this.players[e]));this.initialized=!0},Network.prototype.createPlayerEntity=function(t){var e=this.other.clone();return e.enabled=!0,this.other.getParent().addChild(e),t&&e.rigidbody.teleport(t.x,t.y,t.z),e},Network.prototype.addPlayer=function(t){this.players[t.id]=t,this.players[t.id].entity=this.createPlayerEntity(t)},Network.prototype.movePlayer=function(t){this.initialized&&this.players[t.id].entity.rigidbody.teleport(t.x,t.y,t.z)},Network.prototype.updatePosition=function(){if(this.initialized){var t=this.player.getPosition();sendData("positionUpdate",{id:this.id,x:t.x,y:t.y,z:t.z})}};var Movement=pc.createScript("movement");Movement.attributes.add("playerSpeed",{type:"number",default:30,title:"Player Speed"}),Movement.prototype.initialize=function(){this.force=new pc.Vec3},Movement.prototype.update=function(e){var t=this.entity.forward,i=this.entity.right,r=this.app;x=0,z=0,r.keyboard.isPressed(pc.KEY_A)&&(x-=i.x,z-=i.z),r.keyboard.isPressed(pc.KEY_D)&&(x+=i.x,z+=i.z),r.keyboard.isPressed(pc.KEY_W)&&(x+=t.x,z+=t.z),r.keyboard.isPressed(pc.KEY_S)&&(x-=t.x,z-=t.z),0===x&&0===z||(x*=e,z*=e,this.force.set(x,0,z).normalize().scale(this.playerSpeed),this.entity.rigidbody.applyForce(this.force))};
var Movement = pc.createScript('movement');

Movement.attributes.add('playerSpeed', {
    type: 'number',
    default: 30,
    title: 'Player Speed'
});

var isS = false;

Movement.prototype.keyDown = function (e) {
    if (((e.key === pc.KEY_Z) || (e.key === pc.KEY_W || e.key === pc.KEY_S)) && (anim.state != 'run')) {
        anim.setState('run');
    }
    
    if (e.key === pc.KEY_S && !isS) {
        isS = true;
        var pos = this.entity.getPosition();
        var rotation = this.entity.getEulerAngles();
        
        rotation.y -= 180;
        this.entity.rigidbody.teleport(pos, rotation);
    }
};

Movement.prototype.keyUp = function (e) {
    if (((e.key === pc.KEY_Z) || (e.key === pc.KEY_W || e.key === pc.KEY_S)) && (anim.state == 'run')) {
        anim.setState('idle');
    }
    if (e.key === pc.KEY_S && isS) {
        isS = false;
        
        var pos = this.entity.getPosition();
        var rotation = this.entity.getEulerAngles();
        
        rotation.y -= 180;
        this.entity.rigidbody.teleport(pos, rotation);
    }
};

// initialize code called once per entity
Movement.prototype.initialize = function() {
    this.force = new pc.Vec3();
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.keyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.keyUp, this);
    
    anim = this.entity.children[0].script.animate;
};
// update code called every frame
Movement.prototype.update = function(dt) {
    var forward = this.entity.forward;
    var right = this.entity.right;
    var app = this.app;

    
    x = 0;
    z = 0;

    if (app.keyboard.isPressed(pc.KEY_R)) {
        this.entity.rigidbody.teleport(0, 0, 0, 0, 0, 0);
    }
    
    if (app.keyboard.isPressed(pc.KEY_W) || app.keyboard.isPressed(pc.KEY_Z)) {
        x += forward.x;
        z += forward.z;
    }
    
        
    if (app.keyboard.isPressed(pc.KEY_S)) {

        x += forward.x;
        z += forward.z;
    }

    if (x !== 0 || z !== 0) {
        x *= dt;
        z *= dt;

        this.force.set (x, 0, z).normalize ().scale ((this.playerSpeed));
        this.entity.rigidbody.applyForce (this.force);
    }
};
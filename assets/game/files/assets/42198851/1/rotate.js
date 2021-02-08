var Rotate = pc.createScript('rotate');

// initialize code called once per entity
Rotate.prototype.initialize = function() {
};

// update code called every frame
Rotate.prototype.update = function(dt) {

    var app = this.app;
    
    if (app.keyboard.isPressed(pc.KEY_D)) {
        this.entity.rigidbody.applyTorque(0, -20, 0);
    }
    
    if (app.keyboard.isPressed(pc.KEY_A) || app.keyboard.isPressed(pc.KEY_Q)) {
        this.entity.rigidbody.applyTorque(0, 20, 0);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Rotate.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
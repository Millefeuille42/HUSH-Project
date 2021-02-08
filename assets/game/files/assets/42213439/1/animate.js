var Animate = pc.createScript('animate');

Animate.states = {
    idle: {
        animation: 'Playbot_idle'
    },
    run: {
        animation: 'Playbot_run'
    }
};

Animate.prototype.setState = function (state) {
    var states = Animate.states;
    this.state = state;
    
    if (this.entity.animation == undefined) {
        return;
    }
    this.entity.animation.play(states[state].animation, this.blendTime);
};

// initialize code called once per entity
Animate.prototype.initialize = function() {
    this.blendTime = 0.2;
    this.setState('idle');

};

// update code called every frame
Animate.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Animate.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
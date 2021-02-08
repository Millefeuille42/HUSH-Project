var AnchorText = pc.createScript('anchorText');

// initialize code called once per entity
AnchorText.prototype.initialize = function() {
    
};

// update code called every frame
AnchorText.prototype.update = function(dt) {
  //  this.entity.setRotation(0, 0, 0);
    //this.entity.setLocalRotation(0, 0, 0);
    this.entity.setEulerAngles(-45, 45, 0);
   // this.entity.setRotation(0, 0, 0);

};

// swap method called for script hot-reloading
// inherit your script state here
// AnchorText.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
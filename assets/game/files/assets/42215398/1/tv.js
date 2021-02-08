var TvScreen = pc.createScript('tv');

TvScreen.attributes.add('screenMaterial', {
    title: 'Screen Material',
    description: 'The screen material of the TV that displays the video texture.',
    type: 'asset',
    assetType: 'material'
});
TvScreen.attributes.add('playEvent', {
    title: 'Play Event',
    description: 'Set the TV screen material emissive map on this event.',
    type: 'string',
    default: ''
});

// initialize code called once per entity
TvScreen.prototype.initialize = function() {
    this.app.on(this.playEvent, function (videoTexture) {
        var material = this.screenMaterial.resource;
        material.emissiveMap = videoTexture;
        material.update();
    }, this);
};

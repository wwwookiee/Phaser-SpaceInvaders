SpaceInvaders.Preloader = function(game) {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

SpaceInvaders.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
       	this.load.image('titlescreen', 'images/TitleBG.png');
        this.load.image('ship', 'images/ship.png');
        this.load.image('bullet', 'images/blaster.png');
        this.load.image('invaderBullet', 'images/invaderblaster.png');
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');       
        this.load.atlasJSONArray('invaders', 'images/spritesheets/invaders.png', 'images/spritesheets/invaders.json'); 
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
	   	this.ready = true;
        this.state.start('StartMenu');
	}
};
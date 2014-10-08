SpaceInvaders.StartMenu = function(game) {
    this.startBG;
    this.startPrompt;
}

SpaceInvaders.StartMenu.prototype = {
	
	create: function () {
		startBG = this.add.image(0, 0, 'titlescreen');
		startBG.inputEnabled = true;
		startBG.events.onInputDown.addOnce(this.startGame, this);
		
		startPrompt = this.add.bitmapText(this.world.centerX-180, this.world.centerY, 'eightbitwonder', "Invaders must die !", 24);
	},

	startGame: function (pointer) {
		this.state.start('Game');
	}
};
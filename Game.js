SpaceInvaders.Game = function(game) {
	this.invaders;
	this.totalRow;
	this.totalInvadersRow;
	this.ship;
	this.bullets;
	this.invadersBullets;
	this.bulletTime = 0;
	this.invaderBulletTime = 0;
	this.stateText;
	this.scoreText;
	this.totalRow = 1;
	this.totalInvadersRow = 7;
	this.totalInvaders= this.totalRow*this.totalInvadersRow;
	this.score = 0;
	this.gameover = false;
	this.totalLives = 3;
	this.livingEnemies = [];	
};

SpaceInvaders.Game.prototype = {
	
	create: function() {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.buildWorld();
		this.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
	},

	buildWorld: function(){
		this.buildInvaders();
		this.buildShip();
		this.buildBullets();
		this.buildInvadersBullets();
		this.buildStateText();
		this.buildUI();
		this.buildInvadersExplosions();
		this.buildShipExplosion();
	},

	buildInvaders: function() {
	    this.invaders = this.add.group();
	    this.invaders.enableBody = true;
   		this.invaders.physicsBodyType = Phaser.Physics.ARCADE;
		    for(var i=0; i<this.totalRow; i++){
		    	for (var j=0; j<this.totalInvadersRow; j++){ 

		    		var invader = this.invaders.create(25+j*70, 80+ 50*i, 'invaders', '_invader0000');
		    			invader.name = 'invader'+j;
		    			invader.anchor.setTo(0.5, 0.5);
		    			invader.body.moves = false;

		    			if (i==0) {
		    				invader.animations.add('invader01', this.game.math.numberArray(1,48));
		       				invader.animations.play('invader01', 24, true);
		    			} else if(i==1 || i==2) {
		    				invader.animations.add('invader03', this.game.math.numberArray(96,143));
		        			invader.animations.play('invader03', 24, true);
		    			}else{
		    				invader.animations.add('invader02', this.game.math.numberArray(49,95));
		        			invader.animations.play('invader02', 24, true);
		    			} 		    			
		    	} 
		    } 
		//All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
		var tween = this.add.tween(this.invaders).to( { x: 70 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		//When the tween loops it calls > flyDown
		tween.onLoop.add(this.flyDown, this);
	},

	buildInvadersExplosions: function(){
		this.invadersExplosions = this.add.group();
    	this.invadersExplosions.enableBody = true;
    	this.invadersExplosions.physicsBodyType = Phaser.Physics.ARCADE;
    	for (var i = 0; i < this.totalInvaders*2; i++)
	    {
	    		console.log('roar');
	       	var e = this.invadersExplosions.create(0,0, 'invaders', '_invader0000');
	        	e.name = 'invaderExplosion' + i;
	        	e.anchor.setTo(0.5, 0.5);
	        	e.exists = false;
	        	e.visible = false;
	       		e.animations.add('invaderExplosion', this.game.math.numberArray(144,157));
	        	// e.animations.play('invaderExplosion', 24, false);
	    }   	 	
	},

	buildShipExplosion: function(){
		this.shipExplosions = this.add.group();
    	this.shipExplosions.enableBody = true;
    	this.shipExplosions.physicsBodyType = Phaser.Physics.ARCADE;
    	for (var i = 0; i < this.totalLives; i++)
	    {
	       	var e = this.shipExplosions.create(0,0, 'invaders', '_invader0000');
	        	e.name = 'shipExplosion' + i;
	        	e.anchor.setTo(0.5, 0.5);
	        	e.exists = false;
	        	e.visible = false;
	       		e.animations.add('shipExplosion', this.game.math.numberArray(158,172));
	    }   	 	
	},



	buildShip: function() {
		this.ship = this.add.sprite(270, 900, 'ship');
		this.ship.enableBody = true;
		this.ship.anchor.setTo(0.5, 0.5);
		this.physics.enable(this.ship, Phaser.Physics.ARCADE);
	},

	buildBullets: function(){
		this.bullets = this.add.group();
    	this.bullets.enableBody = true;
    	this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    	for (var i = 0; i < 20; i++)
	    {
	        var b = this.bullets.create(0, 0, 'bullet');
	        	b.name = 'bullet' + i;
	       		b.exists = false;
	       	 	b.visible = false;
	        	b.checkWorldBounds = true;
	        	b.events.onOutOfBounds.add(this.resetBullet, this);
	    }   	 	
	},

	
	buildInvadersBullets: function(){
		this.invadersBullets = this.add.group();
    	this.invadersBullets.enableBody = true;
    	this.invadersBullets.physicsBodyType = Phaser.Physics.ARCADE;
    	for (var i = 0; i < 20; i++)
	    {
	        var b = this.invadersBullets.create(0, 0, 'invaderBullet');
	        	b.name = 'invaderBullet' + i;
	       		b.exists = false;
	       	 	b.visible = false;
	        	b.checkWorldBounds = true;
	        	b.events.onOutOfBounds.add(this.resetBullet, this);
	    }   	 	
	},



	buildStateText: function(){
		this.stateText = this.add.bitmapText(this.world.centerX, this.world.centerY, 'eightbitwonder', "MyText", 24);
        this.stateText.align = 'center';
        this.stateText.updateTransform();
        //using this method because the .anchor dont work on bitmapText atm.
		this.stateText.position.x = this.world.centerX - this.stateText.textWidth-20; 
  		//this.stateText.anchor.setTo(0.5, 0.5);
   		this.stateText.visible = false;
	},

	buildUI: function(){
		this.scoreText = this.add.bitmapText(10, 10, 'eightbitwonder','Score : ' + this.score, 16);
		this.scoreText.visible = true;
	},

	flyDown: function() {
    	this.invaders.y += 30;
	},


	fireBullet: function() {

	    if (this.time.now > this.bulletTime && this.gameover == false)
	    {
	        bullet = this.bullets.getFirstExists(false);

	        if (bullet)
	        {
	            bullet.reset(this.ship.x, this.ship.y-25);
	            bullet.body.velocity.y = -300;
	            this.bulletTime = this.time.now + 500;
	        }
	    }
	},

	fireInvaderBullet: function(invader, bullet) {

	  
	    invaderBullet = this.invadersBullets.getFirstExists(false);
	    livingEnemies = this.livingEnemies;
	    livingEnemies.length=0;


	    this.invaders.forEachAlive(function(invader){
 	        // put every living enemy in an array
	        livingEnemies.push(invader);
	    });

	    if (invaderBullet && livingEnemies.length > 0)
	    {	        
 			var random=this.game.rnd.integerInRange(0,livingEnemies.length-1);	        
	        var shooter=livingEnemies[random];// randomly select one of them
	        invaderBullet.reset(shooter.body.x, shooter.body.y);
	        this.game.physics.arcade.moveToObject(invaderBullet,this.ship,120);
	        this.invaderBulletTime = this.game.time.now + 2000;
    	}
	},

	explodeShip: function() {
		var explosion2 = this.shipExplosions.getFirstExists(false);
   		explosion2.reset(this.ship.body.x+26, this.ship.body.y+16);
   		explosion2.animations.play('shipExplosion', 48, false, true);
	},
	
	resetBullet: function(bullet) {
	 	// console.log('bullet destroyed! Motafuka');
	    bullet.kill();
	},

	collisionBulletInvader: function (bullet, invader) {
		// console.log('aie, tu m\'as cogné du con !');
    	bullet.kill();
   		invader.kill(); 
    	var explosion = this.invadersExplosions.getFirstExists(false);
   		explosion.reset(invader.body.x+32, invader.body.y+32);
   		explosion.animations.play('invaderExplosion', 24, false, true);
		this.score += 20; 
   		this.updateScore();
   		this.invadersCount();
   	},

	collisionInvadersBulletsShip: function(bullet, ship){
		bullet.kill();
	   	ship.kill();
	   	this.explodeShip();	   	
	   	this.stateText.text = " GAME OVER \n Click to restart";
        this.stateText.visible = true;
        this.gameover = true;
        this.game.input.onTap.addOnce(this.restartGame,this);
	},

	collisionShipInvader: function (ship, invader) {
	   	// console.log('GAME OVER !');
	   	invader.kill();
	   	ship.kill();
	   	this.explodeShip();
   		this.stateText.text = " GAME OVER \n Click to restart";
        this.stateText.visible = true;
        this.gameover = true;
        this.game.input.onTap.addOnce(this.restartGame,this);
	},

	updateScore: function (){
		// console.log('updateScore function');
		this.scoreText.text = 'Score : ' + this.score;
	},

	invadersCount: function(){
		this.totalInvaders--;
   		if(this.totalInvaders == 0){
   			this.score = 1337;
   			this.scoreText.text = 'Score : ' + this.score;
   			this.stateText.text = " You Win,\n Click to restart";
        	this.stateText.visible = true;
        	this.gameover = true;
      		this.game.input.onTap.addOnce(this.restartGame,this);
   		}
	},

	restartGame: function(){
		// console.log('restartGame function');
      	this.totalInvaders= this.totalRow*this.totalInvadersRow;
		this.score = 0;
		this.gameover = false;
		this.livingEnemies.length = 0;	
		this.state.start('StartMenu');
		// this.invadersExplosions.callAll('revive',this);
		// this.invaders.callAll('kill',this);
		// this.invaders.removeAll();
		// console.log(this.invaders);
		// this.ship.kill();
		// this.updateScore();
		// this.buildInvaders();
		// this.buildShip();
		// this.stateText.visible = false;
	},

	update: function() {
		console.log(this.totalInvaders);
		//Ship handler
		this.ship.body.velocity.x = 0;
	    this.ship.body.velocity.y = 0;
	    

	    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.ship.body.x > 0)
	    {
	        this.ship.body.velocity.x = -200;
	    }
	    else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.ship.body.x < 484)
	    {
	        this.ship.body.velocity.x = 200;
	    }

	    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
	    {
	        this.fireBullet();
	    }

	    if (this.game.time.now >  this.invaderBulletTime && this.gameover == false)
    	{
       		this.fireInvaderBullet();
   		}

	    // collision
   		if(this.gameover == false){
	   		this.physics.arcade.overlap(this.ship, this.invaders, this.collisionShipInvader, null, this);
	   		this.physics.arcade.overlap(this.bullets, this.invaders, this.collisionBulletInvader, null, this);
	   		this.physics.arcade.overlap(this.invadersBullets, this.ship, this.collisionInvadersBulletsShip, null, this);   			
   		}
	}

};
SpaceInvaders.Game = function(game) {
	this.bulletTime = 0.1;
	this.invaders;
	this.totalRow;
	this.totalInvadersRow;
	this.bullets;
};


SpaceInvaders.Game.prototype = {
	
	create: function() {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.totalRow = 4;
		this.totalInvadersRow = 7;
		this.buildWorld();
		this.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
	},

	buildWorld: function(){
		this.buildInvaders();
		this.buildShip();
		this.buildBullets();
	},

	buildInvaders: function() {
	    this.invaders = this.add.group();
	    this.invaders.enableBody = true;
   		this.invaders.physicsBodyType = Phaser.Physics.ARCADE;
		    for(var i=0; i<this.totalRow; i++) {
		    	for (var j=0; j<this.totalInvadersRow; j++){ 

		    		var invader = this.invaders.create(25+j*70, 50+ 50*i, 'invaders', '_invader0000');
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
		    // 		switch(i){
		    // 			case (i==0):
		    // 				invader.animations.add('invader01', this.game.math.numberArray(1,48));
		    //     			invader.animations.play('invader01', 24, true);
		    //     			break;
						// case (i==1 || i==2):
		    // 				invader.animations.add('invader03', this.game.math.numberArray(96,143));
		    //     			invader.animations.play('invader03', 24, true);
		    //     			break;
		    //     		case (i==3):
		    // 				invader.animations.add('invader02', this.game.math.numberArray(49,95));
		    //     			invader.animations.play('invader02', 24, true);
		    //     	}
		    	}
		    }     
	//  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = this.add.tween(this.invaders).to( { x: 60 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(this.descend, this);
	},

	buildInvadersExplosions: function() {

	},

	buildShip: function(){
		ship = this.add.sprite(270, 900, 'ship');
		ship.enableBody = true;
		ship.anchor.setTo(0.5, 0.5);
		this.physics.enable(ship, Phaser.Physics.ARCADE);
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

	descend: function() {

    	this.invaders.y += 30;

	},


	fireBullet: function() {

	    if (this.time.now > this.bulletTime)
	    {
	        bullet = this.bullets.getFirstExists(false);

	        if (bullet)
	        {
	            bullet.reset(ship.x, ship.y-25);
	            bullet.body.velocity.y = -300;
	            this.bulletTime = this.time.now + 250;
	        }
	    }

	},
	
	//  Called if the bullet goes out of the screen
	 resetBullet: function(bullet) {
	 	console.log('bullet destroyed! Motafuka');
	    bullet.kill();
	},



	collisionHandler: function (bullet, invader) {
		console.log('aie, tu m\'as cogné du con !')
    	bullet.kill();
   		invader.kill();
	},

	update: function() {

		//Ship handler
		ship.body.velocity.x = 0;
	    ship.body.velocity.y = 0;
	    

	    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) && ship.body.x > 0)
	    {
	        
	        ship.body.velocity.x = -200;
	    }
	    else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && ship.body.x < 484)
	    {
	        ship.body.velocity.x = 200;
	    }

	    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
	    {
	        this.fireBullet();
	    }

	    // collision
	    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
   		this.physics.arcade.overlap(this.bullets, this.invaders, this.collisionHandler, null, this);
	}

};
/*
 * ZOMBIES Asset -----------------------------------------------------------------------------
 */
function Zombie(game, spritesheet) {
	
	this.isZombie = true;	
    this.killed = false;

    this.walking = new Animation(spritesheet, 7788, 0, 450, 546, 10, 0.1, 10, true, 0.35);
    this.attack = new Animation(spritesheet, 12288, 0, 450, 546, 8, 0.1, 8, false, 0.35);
    this.dead = new Animation(spritesheet, 0, 0, 649, 546, 12, 0.1, 12, false, 0.35);

    this.speed = 200;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 1300, 430);
}

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function () {
    var rand = Math.floor(Math.random() * 3) + 1;
    
	if (this.dead.isDone()){
		this.dead.elapsedTime = 0;
		this.killed = false;      
        this.x = 1300 * rand;  
	}
	
    var speed = this.speed + this.game.speed;
    
    if (this.game.level == 1) this.x -= this.game.clockTick * speed;

    if (this.x < -700) this.x = 1300 * rand;

    Entity.prototype.update.call(this);
}

Zombie.prototype.draw = function (ctx) {
	
    if (!this.game.gameOver && this.game.level == 1) {
	    
		if (this.killed) {
			this.dead.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else {
			this.walking.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}

	}
    
    Entity.prototype.draw.call(this);
}


/*
 * Dino Asset -----------------------------------------------------------------------------
 */
function Dino(game, spritesheet) {
	
	this.isDino = true;	
    this.killed = false;
	
    this.walking = new Animation(spritesheet, 1360, 472, 680, 472, 10, 0.1, 10, true, 0.30);
    this.dead = new Animation(spritesheet, 0, 0, 680, 472, 8, 0.1, 8, false, 0.30);

    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 2600, 490);
}

Dino.prototype = new Entity();
Dino.prototype.constructor = Dino;

Dino.prototype.update = function () {
    var rand = Math.floor(Math.random() * 3) + 1;
    if (this.dead.isDone()){
        this.dead.elapsedTime = 0;
        this.killed = false;
        this.x = 2600 * rand;
    }

    var speed = this.speed + this.game.speed;

    if (this.game.level == 1) this.x -= this.game.clockTick * speed;

    if (this.x < -700) this.x = 900 * rand;
    Entity.prototype.update.call(this);
}

Dino.prototype.draw = function () {
    if (!this.game.gameOver && this.game.level == 1) {
		if (this.killed) {
			this.dead.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else {
			this.walking.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
	}
	
    Entity.prototype.draw.call(this);
}


/*
 * Platform Asset -----------------------------------------------------------------------------
 */
function Platform(game, spritesheet) {
	
	this.isPlatform = true;	
	this.size = Math.floor(Math.random() * 6) + 1;
	this.width = 64;
	this.height = 64;
	
    this.platform = new Animation(spritesheet, 0, 0, 64, 64, 64, 0.9, 3, true, 1);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    
    this.ground = 385 - 155;
    
    Entity.call(this, game, 850, 385);
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
	
	if (!this.game.stopScrolling && this.game.level == 1)
		this.x -= this.game.clockTick * this.speed;

	if (this.x < -400) {
		this.x = 1000;
		this.size = Math.floor(Math.random() * 6) + 2;
		this.width = 64 * this.size;
	}

	Entity.prototype.update.call(this);
}

Platform.prototype.draw = function () {
    if (!this.game.gameOver && this.game.level == 1) {
		this.width = 0;
		for (var i = 0; i < this.size; i++) {
			this.width += 64;
			this.platform.drawFrame(this.game.clockTick, this.ctx, this.x + (48 * i), this.y);
		}
	}
}
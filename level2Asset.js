/*
 * SKUNK Asset -----------------------------------------------------------------------------
 */
function Skunk(game, spritesheet) {
    
    this.x = 1300;
    this.y = 520;

	this.isSkunk = true;	
    this.killed = false;

    this.walking = new Animation(spritesheet, 0, 0, 336, 212, 4, 0.1, 4, true, 0.35);

    this.speed = 300;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, this.x, this.y);
}

Skunk.prototype = new Entity();
Skunk.prototype.constructor = Skunk;

Skunk.prototype.update = function () {

    var rand = Math.floor(Math.random() * 3) + 1;
	var speed = this.speed + this.game.speed;

    if (this.game.level == 2) this.x -= this.game.clockTick * speed;

    if (this.x < -700 || this.killed) {
        this.x = 1300 * rand;
        this.killed = false;
    }

    Entity.prototype.update.call(this);
}

Skunk.prototype.draw = function (ctx) {
    if (!this.game.gameOver && this.game.level == 2)
		this.walking.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*
 * SNAKE Asset -----------------------------------------------------------------------------
 */
function Snake(game, spritesheet) {
    
    this.x = 1300;
    this.y = 520;

	this.isSnake = true;	
    this.killed = false;

    this.walking = new Animation(spritesheet, 0, 0, 256, 128, 4, 0.1, 4, true, 0.50);

    this.speed = 200;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, this.x, this.y);
}

Snake.prototype = new Entity();
Snake.prototype.constructor = Snake;

Snake.prototype.update = function () {
    var rand = Math.floor(Math.random() * 3) + 1;
    var speed = this.speed + this.game.speed;

    if (this.game.level == 2) this.x -= this.game.clockTick * speed;

    if (this.x < -700 || this.killed) {
        this.x = 1300 * rand;
        this.killed = false;
    }

    Entity.prototype.update.call(this);
}

Snake.prototype.draw = function (ctx) {
    if (!this.game.gameOver && this.game.level == 2)
        this.walking.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
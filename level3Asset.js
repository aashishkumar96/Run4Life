/*
 * Fly Asset -----------------------------------------------------------------------------
 */
function Fly(game, spritesheet) {
    
    this.x = 1300;
    this.y = 400;

	this.isSkunk = true;	
    this.killed = false;

    this.direction = false;

    this.walking = new Animation(spritesheet, 0, 0, 58, 86, 2, 0.1, 2, true, 1);

    this.speed = 400;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, this.x, this.y);
}

Fly.prototype = new Entity();
Fly.prototype.constructor = Fly;

Fly.prototype.update = function () {

    var rand = Math.floor(Math.random() * 3) + 1;
	var speed = this.speed + this.game.speed;

    if (this.game.level == 3) this.x -= this.game.clockTick * speed;

    if (this.x < -700 || this.killed) {
        this.x = 1000 * rand;
        this.killed = false;
    }

    
    if (this.y == 400) this.direction = true;
    if (this.y == 500) this.direction = false;
    if (this.direction) this.y++;
    else this.y--;

    Entity.prototype.update.call(this);
}

Fly.prototype.draw = function (ctx) {
    if (!this.game.gameOver && this.game.level == 3)
		this.walking.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*
 * Monster Asset -----------------------------------------------------------------------------
 */
function Monster(game, spritesheet) {
    
    this.x = 3000;
    this.y = 530;

    this.isMonster = true;	
    this.killed = false;
	
    this.walking = new Animation(spritesheet, 0, 0, 288, 168, 3, 0.1, 3, true, 0.35);

    this.speed = 500;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, this.x, this.y);
}

Monster.prototype = new Entity();
Monster.prototype.constructor = Monster;

Monster.prototype.update = function () {

    var rand = Math.floor(Math.random() * 3) + 1;
    var speed = this.speed + this.game.speed;
    
    if (this.game.level == 3) this.x -= this.game.clockTick * speed;
    
    if (this.x < -700 || this.killed) {
        this.x = 3000 * rand;
        this.killed = false;
    }

    Entity.prototype.update.call(this);
}

Monster.prototype.draw = function () {
	if (!this.game.gameOver && this.game.level == 3) {
		this.walking.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	}
    Entity.prototype.draw.call(this);
}
var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    var scaleBy = this.scale;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}



/*
 * Background Asset -----------------------------------------------------------------------------
 */
function Background(game) {
    this.x = 0;
    this.y = 0;
    
    this.a = false;
    this.game = game;
    this.speed = 100;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
	
	var bgArray = ["./images/bg0.png", "./images/bg1.png", "./images/bg2.png"];

    this.ctx.drawImage(AM.getAsset(bgArray[this.game.level-1]), 0, 0, 2720, 700, this.x, this.y, 2720, 700);
    
};

Background.prototype.update = function () {
	if (!this.game.gameOver) {
		if(!this.game.stopScrolling)
			this.x -= this.game.clockTick * this.speed;
		if (this.x < -1920) this.x = 0;
	}
};


/*
 * TopMenu Asset -----------------------------------------------------------------------------
 */
function TopMenu(game) {

    this.levelsScores = [150, 300, 450]; 
    this.count = 0;
    this.waiting = 100;
    this.endLevel1 = false;
    this.endLevel2 = false;
    this.endLevel3 = false;
	this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 75, 8);
}

TopMenu.prototype = new Entity();
TopMenu.prototype.constructor = TopMenu;

TopMenu.prototype.update = function () {
	if (this.game.lives == 0) {
		this.game.gameOver = true;
	}

	Entity.prototype.update.call(this);
}

TopMenu.prototype.draw = function () {
    
    this.ctx.font = "18px Tahoma";
	this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText("SCORE: " + this.game.score, 350, 29);
    
    
    this.ctx.font = "18px Tahoma";
	this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText("LIVES", 20, 29); 
    this.ctx.fillText("LEVEL: " + this.game.level, 250, 29);

    
    for (var i = 0; i < 5; i++) {
    	if (i < this.game.lives) {
    		this.ctx.drawImage(AM.getAsset("./images/life.png"), 70 + (i * 30), this.y, 30, 30);
    	} else {
    		this.ctx.drawImage(AM.getAsset("./images/nolife.png"), 70 + (i * 30), this.y, 30, 30);
    	}
    }
    
    if (this.game.gameOver) {
    	this.ctx.fillStyle = "green";
    	this.ctx.globalAlpha = 0.3;
    	this.ctx.fillRect(0, 0, this.game.width, this.game.height);
    	this.ctx.globalAlpha = 1.0;
    	
        this.ctx.font = "50px Arail";
    	this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        
        if (!this.game.startGame) {
            this.ctx.fillText("R u n (4) L i f e", this.game.width / 2, (this.game.height / 2) - 50);
            this.ctx.font = "30px Arail";
            this.ctx.fillText("(S) Start  (P) Pause  (X) Attack  (SPACE) Jamp", this.game.width / 2, (this.game.height / 2) + 100);

        } else {
        	this.ctx.fillText("Game Over!", this.game.width / 2, this.game.height / 2);
        }
    }


    if (this.game.score == this.levelsScores[0] && !this.endLevel1) {
            this.endLevel1 = true;
            this.game.paused = true;
            this.killed = false;
            this.ground = this.game.ground;
            this.count = 0;
    }

    if (this.game.score == this.levelsScores[1] && !this.endLevel2) {
            this.endLevel2 = true;
            this.game.paused = true;
            this.killed = false;
            this.ground = this.game.ground;
            this.count = 0;
    }

    if (this.game.score == this.levelsScores[2] && !this.endLevel3) {
            this.endLevel3 = true;
            this.game.paused = true;
            this.killed = false;
            this.ground = this.game.ground;
            this.count = 0;
    }

    // 2st Level
    if (this.endLevel1 && this.count != this.waiting) {
        this.game.level = 2; 
        finishedLevel(this);
    }

    // 3nd Level
    if (this.endLevel2 && this.count != this.waiting) {
        this.game.level = 3; 
        finishedLevel(this);
    }

    // End of the game
    if (this.endLevel3 && this.count != this.waiting) {
        this.game.gameOver = true;
        this.ctx.font = "35px Arail";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Congratulations you finished the game :)", 800 / 2, (700 / 2) + 50);

    }

    // Showing the pause game message.
    if (this.game.paused && !this.game.gameOver && (this.count == this.waiting || !this.endLevel1)) {
        this.ctx.globalAlpha = 1.0;
        this.ctx.font = "20px Arail";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Please press (P) to resume the game.", 800 / 2, 700 / 2);
    }
    

}

function finishedLevel(that) {
    if (!that.game.gameOver) {
        that.count++;
        that.ctx.fillStyle = "green";
        that.ctx.globalAlpha = 1.0;
        that.ctx.fillRect(0, 0, that.game.width, that.game.height);
        that.ctx.globalAlpha = 1.0;
        that.ctx.font = "50px Arail";
        that.ctx.fillStyle = "white";
        that.ctx.textAlign = "center";
        that.ctx.fillText("You Finished Level " + (that.game.level - 1), that.game.width / 2, that.game.height / 2);
        if (that.count == that.waiting && that.game.paused) that.game.paused = false;
        that.game.entities[13].killed = false;
        that.game.entities[13].y = that.game.ground;
        
    }
}


/*
 * Ninja Asset -----------------------------------------------------------------------------
 */
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function collectCoins(a, b) {
    if (distance(a, b) < 40 && !a.game.gameOver) {
        a.game.score += 10;
        b.x = 1100;           
    }
}

function attack(a, b) {
    if (distance(a, b) < 100 && !a.game.gameOver) {
    	if (a.attack && !b.killed && !a.killed) {
        	b.killed = true;
        	a.game.score += 10;
    	}
    	if (!b.killed && !a.jumping) {
    		a.killed = true;
    	}
    }
}


function Ninja(game, spritesheet) {
	
    this.ctx = game.ctx;
    this.ground = game.ground;
    
    this.x = 0;
    this.y = 0;
	this.width = 40;
	this.height = 130;
	this.radius = 80;
    
    this.jumping = false;
    this.attack = false;
    this.killed = false;
    
    this.speed = 100;
    
    // this.standing = new Animation(spritesheet, 0, 0, 252, 518, 10, 0.1, 10, true, 0.35);
    this.jumpAnimation = new Animation(spritesheet, 2520, 0, 383, 518, 10, 0.1, 10, false, 0.35);
    this.running = new Animation(spritesheet, 6350, 0, 383, 518, 10, 0.1, 10, true, 0.35);
    // this.sliding = new Animation(spritesheet, 10180, 0, 393, 518, 10, 0.1, 10, false, 0.35);
    this.deadAnimation = new Animation(spritesheet, 14110, 0, 502, 518, 10, 0.1, 10, false, 0.35);
    this.attackAnimation = new Animation(spritesheet, 19130, 0, 556, 518, 10, 0.05, 10, false, 0.35);


    Entity.call(this, game, 100, this.ground);
}

Ninja.prototype = new Entity();
Ninja.prototype.constructor = Ninja;

Ninja.prototype.update = function () {
    Entity.prototype.update.call(this);

    if (this.game.jump) this.jumping = true;
    if (this.game.attacking) this.attack = true;

    var that = null;
    this.game.speed = 0;


    // Interacting with the platforms ===========================================================
    var platforms = this.game.entities[7];
    if (platforms.isPlatform && !this.game.gameOver) {
        
        var x = this.x + this.radius, y = this.y;

    	if (x < platforms.x + platforms.width && x + this.width > platforms.x) {
            this.ground = platforms.ground;
    	}

    	// The ninja can not jump if he is under the platforms.
    	if ((x < platforms.x + platforms.width && x + this.width > platforms.x) && (y > platforms.y + platforms.height)) {
    		this.jumping = false;
    	}

    	// Check if the platform passed the Ninja
    	if (x > platforms.x + platforms.width){
    		this.ground = this.game.ground;
            this.y = this.game.ground;
        }
            
    }


    // Level # 1 
    attack(this, this.game.entities[8]); // Zumbie
    attack(this, this.game.entities[9]); // Dino

    // Level # 2
    attack(this, this.game.entities[10]); // Skunk
    attack(this, this.game.entities[11]); // Snake

    // Level # 3
    attack(this, this.game.entities[12]); // Monster
    attack(this, this.game.entities[13]); // Fly

    // Interacting with the Gem (Live) ==========================================================
    var gem = this.game.entities[6];
    if (gem.isGem && !this.game.gameOver) {
        if ((x < gem.x + gem.width && x + this.width > gem.x) && 
            (y < gem.y + gem.height && y + this.height > gem.y) && !gem.earned) {
            gem.earned = true;
            this.game.lives++;
            gem.x = 2300;

        }

    }
    
    // Interacting with the COINS =============================================================
	collectCoins(this, this.game.entities[1]);
	collectCoins(this, this.game.entities[2]);
	collectCoins(this, this.game.entities[3]);
	collectCoins(this, this.game.entities[4]);
	collectCoins(this, this.game.entities[5]);	




    if (this.jumping && !this.killed) {
    	if (this.jumpAnimation.isDone()) {
    		this.jumpAnimation.elapsedTime = 0;
    		this.jumping = false;
    		this.attack = true;
            this.game.stopScrolling = false;
        }
        
    	var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
    	var totalHeight = 200;

    	if (jumpDistance > 0.5)
    		jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;

    	this.game.speed = 90;
    	this.killed = false;
        this.attack = false;
    } 

    if (this.killed) {
    	if (this.deadAnimation.isDone()) {
    		this.deadAnimation.elapsedTime = 0;
    		this.killed = false;
    		this.game.lives--;
    	}
		this.jumping = false;
		this.attack = false;
    }
    
    if (this.attack && !this.killed) {
    	this.game.stopScrolling  = true;
    	if (this.attackAnimation.isDone()) {
    		this.attackAnimation.elapsedTime = 0;
    		this.attack = false;
    		this.game.stopScrolling = false;
    	}
    }


}

Ninja.prototype.draw = function (ctx) {
	
	if (!this.game.gameOver) {
		if (this.jumping) {
			this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
		} else if (this.attack) {
			this.attackAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		} else if (this.killed) {
			this.deadAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		} else {
			this.running.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		}
	}
    
    Entity.prototype.draw.call(this);
}



/*
 * Coins Asset -----------------------------------------------------------------------------
 */
function Coin0(game, spritesheet) {
	
	this.isCoin = true;	
    // this.collected = false;
	
	this.width = 70 * this.scale;
	this.height = 70 * this.scale;
	this.radius = 35;

    this.coin = new Animation(spritesheet, 0, 0, 70, 70, 70, 0.4, 6, true, 1);
    
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 1400, 300);
}

Coin0.prototype = new Entity();
Coin0.prototype.constructor = Coin0;

Coin0.prototype.update = function () {
    if(!this.game.stopScrolling)
		this.x -= this.game.clockTick * this.speed;

    // this.collected = false;
	
    if (this.x < -200) this.x = 1500;
    Entity.prototype.update.call(this);
}

Coin0.prototype.draw = function () {
	
	if (!this.game.gameOver) {
        this.coin.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	}

}

/*
 * Coins Asset -----------------------------------------------------------------------------
 */
function Coin1(game, spritesheet) {
    
    this.isCoin = true; 
    // this.collected = false;
    
    this.width = 70 * this.scale;
    this.height = 70 * this.scale;
    this.radius = 35;

    this.coin1 = new Animation(spritesheet, 0, 0, 70, 70, 70, 0.4, 6, true, 1);
    
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 2100, 300);
}

Coin1.prototype = new Entity();
Coin1.prototype.constructor = Coin1;

Coin1.prototype.update = function () {
    if(!this.game.stopScrolling)
        this.x -= this.game.clockTick * this.speed;

    // this.collected = false;
    
     if (this.x < -200) this.x = 2100;
    Entity.prototype.update.call(this);
}

Coin1.prototype.draw = function () {
    
    if (!this.game.gameOver) {
        this.coin1.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }

}
/*
 * Coins Asset -----------------------------------------------------------------------------
 */
function Coin2(game, spritesheet) {
    
    this.isCoin = true; 
    // this.collected = false;
    
    this.width = 70 * this.scale;
    this.height = 70 * this.scale;
    this.radius = 35;

    this.coin2 = new Animation(spritesheet, 0, 0, 70, 70, 70, 0.4, 6, true, 1);
    
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 2400, 300);
}

Coin2.prototype = new Entity();
Coin2.prototype.constructor = Coin2;

Coin2.prototype.update = function () {
    if(!this.game.stopScrolling)
        this.x -= this.game.clockTick * this.speed;

    // this.collected = false;
    
    if (this.x < -200) this.x = 2400;
    Entity.prototype.update.call(this);
}

Coin2.prototype.draw = function () {
    
    if (!this.game.gameOver) {
        this.coin2.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }

}
/*
 * Coins Asset -----------------------------------------------------------------------------
 */
function Coin3(game, spritesheet) {
    
    this.isCoin = true; 
    // this.collected = false;
    
    this.width = 70 * this.scale;
    this.height = 70 * this.scale;
    this.radius = 35;

    this.coin3 = new Animation(spritesheet, 0, 0, 70, 70, 70, 0.4, 6, true, 1);
    
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 1700, 250);
}

Coin3.prototype = new Entity();
Coin3.prototype.constructor = Coin3;

Coin3.prototype.update = function () {
    if(!this.game.stopScrolling)
        this.x -= this.game.clockTick * this.speed;

    // this.collected = false;
    
    if (this.x < -200) this.x = 1700;
    Entity.prototype.update.call(this);
}

Coin3.prototype.draw = function () {
    
    if (!this.game.gameOver) {
        this.coin3.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }

}
/*
 * Coins Asset -----------------------------------------------------------------------------
 */
function Coin4(game, spritesheet) {
    
    this.isCoin = true; 
    // this.collected = false;
    
    this.width = 70 * this.scale;
    this.height = 70 * this.scale;
    this.radius = 35;

    this.coin4 = new Animation(spritesheet, 0, 0, 70, 70, 70, 0.4, 6, true, 1);
    
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 1900, 350);
}

Coin4.prototype = new Entity();
Coin4.prototype.constructor = Coin4;

Coin4.prototype.update = function () {
    if(!this.game.stopScrolling)
        this.x -= this.game.clockTick * this.speed;

    // this.collected = false;
    
    if (this.x < -200) this.x = 1900;
    Entity.prototype.update.call(this);
}

Coin4.prototype.draw = function () {
    
    if (!this.game.gameOver) {
        this.coin4.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }

}


/*
 * Gem Asset -----------------------------------------------------------------------------
 */
function Gem(game, spritesheet) {
   this.isGem = true;   
   this.gem = new Animation(spritesheet, 0, 0, 400, 400, 400, 0.4, 1, true, 0.2);
   this.x = 0;
   this.y = 0;
   this.width = 100;
   this.height = 100;
   this.speed = 100;
   this.game = game;
   this.ctx = game.ctx;
   this.radius = 100;
   this.killed = false;
   this.earned = false;
   Entity.call(this, game, 4500, 300);
}

Gem.prototype = new Entity();
Gem.prototype.constructor = Gem;

Gem.prototype.update = function () {
    if(!this.game.stopScrolling && !this.gem.earned)
        this.x -= this.game.clockTick * this.speed;
        
    if (this.x < -100) this.earned = true;
    
    // this.earned = false;
    Entity.prototype.update.call(this);
}

Gem.prototype.draw = function () {
    if (!this.game.gameOver) {
        this.gem.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
   }
}


AM.queueDownload("./images/bg0.png");
AM.queueDownload("./images/bg1.png");
AM.queueDownload("./images/bg2.png");

AM.queueDownload("./images/ninja.png");
AM.queueDownload("./images/zombie.png");
AM.queueDownload("./images/monster.png");
AM.queueDownload("./images/coin.png");
AM.queueDownload("./images/block.png");
AM.queueDownload("./images/life.png");
AM.queueDownload("./images/nolife.png");
AM.queueDownload("./images/gem.png");
AM.queueDownload("./images/dino.png");
AM.queueDownload("./images/skunk.png");
AM.queueDownload("./images/snake.png");
AM.queueDownload("./images/fly.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // All levels
    gameEngine.addEntity(new Background(gameEngine));
    gameEngine.addEntity(new Coin0(gameEngine, AM.getAsset("./images/coin.png")));
    gameEngine.addEntity(new Coin1(gameEngine, AM.getAsset("./images/coin.png")));
    gameEngine.addEntity(new Coin2(gameEngine, AM.getAsset("./images/coin.png")));
    gameEngine.addEntity(new Coin3(gameEngine, AM.getAsset("./images/coin.png")));
    gameEngine.addEntity(new Coin4(gameEngine, AM.getAsset("./images/coin.png")));
    gameEngine.addEntity(new Gem(gameEngine, AM.getAsset("./images/gem.png")));

    // Level # 1 Asset
    gameEngine.addEntity(new Platform(gameEngine, AM.getAsset("./images/block.png")));
    gameEngine.addEntity(new Zombie(gameEngine, AM.getAsset("./images/zombie.png")));
    gameEngine.addEntity(new Dino(gameEngine, AM.getAsset("./images/dino.png")));

    // Level # 2 Asset
    gameEngine.addEntity(new Skunk(gameEngine, AM.getAsset("./images/skunk.png")));
    gameEngine.addEntity(new Snake(gameEngine, AM.getAsset("./images/snake.png")));

    // Level # 3 Asset
    gameEngine.addEntity(new Monster(gameEngine, AM.getAsset("./images/monster.png")));
    gameEngine.addEntity(new Fly(gameEngine, AM.getAsset("./images/fly.png")));

    // All levels
    gameEngine.addEntity(new Ninja(gameEngine, AM.getAsset("./images/ninja.png")));
    gameEngine.addEntity(new TopMenu(gameEngine));

    console.log("All Done!");
});

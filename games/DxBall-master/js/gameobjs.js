
var BrickDefaults = Object.freeze({ 
				    WIDTH : ~~((DxBall.WIDTH-1)/DxBall.NCOLS) | 0, 
				    HEIGHT : ~~((DxBall.HEIGHT-1)/(2*DxBall.NROWS)) | 0,
				    PADDING : 1 | 0,
				    TRUE_HEIGHT : ~~(DxBall.HEIGHT/(2*DxBall.NROWS)) | 0,
				    TRUE_WIDTH : ~~(DxBall.WIDTH/8) | 0
				 }); 

var PaddleDefaults = Object.freeze({ 
				     WIDTH : ~~(DxBall.WIDTH/8) | 0,
				     HEIGHT : 10 | 0,
				     SPEED : 7 | 0,
				     XPOS : DxBall.WIDTH/2 | 0 
				   }); 
								  
var BallDefaults = Object.freeze({ 
				   RADIUS : 6 | 0,
				   COLOR : Colors.WHITE,
				   SPEED : 4 | 0, 
				   DX : 2 | 0,
				   DY : -4 | 0,
				   X : 25 | 0,
				   Y : 250 | 0, 
				   SPEED_UP : 2 | 0
				 }); 
				 
/***********************Ball********************************/

function Ball(x, y, radius, movex, movey, color) {
	
	var self = this ; 
	
	self.x = x ; 
	self.y = y ;
	self.radius = radius ;
	self.dx = movex ;
	self.dy = movey ;
	self.color = color ;
	self.through = false ; 
	self.life = 0 ; 
	
	self.anotherLife = function() {
		self.life++ ; 
	};
	
	self.usedOneLife = function() {
		self.life-- ;
	};
}

Ball.prototype.speedup = function() {
		var self = this ; 
		if(self.dy < 0)
			self.dy -= BallDefaults.SPEED_UP ; 
		else 
			self.dy += BallDefaults.SPEED_UP ; 
	};
	
Ball.prototype.normalSpeed = function() {
		var self = this ; 
		if(self.dy < 0)
			self.dy = -BallDefaults.SPEED ; 
		else 
			self.dy = BallDefaults.SPEED ; 
	};
	
Ball.prototype.move = function() { 
		var self = this ; 
		self.x += self.dx;
		self.y += self.dy;
	};
	
Ball.prototype.draw = function() {
		var self = this ; 
		Graphics.circle(self.x, self.y, self.radius, self.color);
	};
	
Ball.prototype.collideH = function() {
		var self = this ; 
		self.dx = -self.dx ;
	};

Ball.prototype.collideV = function() {
		var self = this ; 
		self.dy = -self.dy ;
	};
	
Ball.prototype.passThrough = function() {
		var self = this ; 
		self.through = true ; 
	}; 

/********************* Paddle **************************/

function Paddle(){
	
	var self = this ; 
	
	self.x = PaddleDefaults.XPOS ; 
	self.height = PaddleDefaults.HEIGHT ; 
	self.width = PaddleDefaults.WIDTH ; 
	self.color = PaddleDefaults.COLOR ; 
	self.speed = PaddleDefaults.SPEED ; 
}

Paddle.prototype.draw = function() {
		var self = this ;
		Graphics.altImage(ImageResource[0].res, self.x, DxBall.HEIGHT-self.height, 
			self.width, self.height);
	} ; 
	
Paddle.prototype.shorten = function() {
		var self = this ;
		if(self.width > 25)
			self.width -= 10 ;
	};
	
Paddle.prototype.elongate = function() {
		var self = this ;
		if(self.width < 125)
			self.width += 10 ;
	};
	
Paddle.prototype.moveLeft = function() {
		var self = this ;
		self.x -= self.speed ; 
	};
	
Paddle.prototype.moveRight = function() {
		var self = this ;
		self.x += self.speed ;
	};	

/*************************Gifts*******************************/

function Gift(type, r, c) {
	
	var self = this ; 
	
	self.type = type ; 
	self.points = 0 ; 
	self.x = 0 ;
	self.y = 0 ; 
	self.active = false ; 
	self.res = null ; 
	self.used = false ;
	
	switch(type) {
		case 1 : 
			self.points = 1000 ; 
			self.res = ImageResource[8].res ; 
		break ;
		case 2 :
			self.res = ImageResource[9].res ; 
		break ;
		case 3 :
			self.res = ImageResource[10].res ; 
		break ;
	}
	
	self.x = r*BrickDefaults.WIDTH + ((BrickDefaults.WIDTH - self.res.width)/2) ; 
	self.y = (c+1)*BrickDefaults.TRUE_HEIGHT ; 
	
	self.activate = function() {
		if(!self.used)
			self.active = true ; 
	}; 
	
	self.deactivate = function() {
		self.active = false ; 
		self.used = true ;
		DxBall.shouldDrawHUDinGame = true ;
	}; 
}

Gift.prototype.speed = 2 ; 

Gift.prototype.draw = function() {
		var self = this ; 
		if(self.active && !self.used) 
			Graphics.image(self.res, self.x, self.y); 
	};
	
Gift.prototype.move = function() {
		var self = this ; 
		if(self.active && !self.used)
			self.y += self.speed ; 
	};
		
/***************************** Bricks ***************************/

function Brick(type) {
	
	var self = this ; 
	
	self.width = BrickDefaults.WIDTH ;
	self.height = BrickDefaults.HEIGHT ;
	self.padding = BrickDefaults.PADDING ; 
	self.points = 100 ;
	self.color = Colors.BLACK ;
	self.speedup = false ; 
	self.visible = true ; 
	self.destructible = 1 ; 
	self.destroyed = false ; 
	self.paddleElongate = 0 ; 
	self.type = type ; 
	switch(self.type) {
		case 0 :
			self.visible = false ;
		break ;
		case 1 :
			self.color = Colors.AQUA ;
			self.speedup = true ;
		break ;
		case 2 :
			self.color = Colors.MAROON ;
			self.destructible = 3 ;
		break ;
		case 3 :
			self.color = Colors.GOLD ;
			self.points = 150 ;
		break ;
		case 4 :
			self.color = Colors.FORESTGREEN ;
			self.paddleElongate = -1 ;
		break ;
		case 5 :
			self.color = Colors.WHITE ;
			self.paddleElongate = 1 ;
		break ;
		case 6 :
			self.color = Colors.RED ;
			self.destructible = 0 ;
			self.points = -50 ;
		break ;
	}
} 

Brick.prototype.draw = function(x, y) {
		var self = this ; 
		if (self.visible) {
			Graphics.rect((y * (self.width + self.padding)) + 
				self.padding, (x * (self.height + self.padding)) + 
				self.padding, self.width, self.height, self.color);
		}
	};
	
Brick.prototype.destroy = function() {
		var self = this ; 
		self.destroyed = true ;
		self.visible = false ; 
	}; 
	
Brick.prototype.hit = function() {
		var self = this ; 
		if(self.destructible > 1)
			self.destructible-- ; 
		else if(self.destructible == 1) {
			self.destroyed = true ;
			self.visible = false ; 
			DxBall.reduceBrick() ; 
		}
		DxBall.shouldDrawHUDinGame = true ;
	}; 

/**************************Game Objects******************************/

var GameObjects = new function() {
	
	var self = this ;
	
	self.bricks = new Array(DxBall.NROWS) ;
	self.ball = new Ball(BallDefaults.X, BallDefaults.Y, BallDefaults.RADIUS, 
				BallDefaults.DX, BallDefaults.DY, BallDefaults.COLOR); 
	self.gift = null ; 
	self.paddle = new Paddle() ;
	self.giftCollected  = false ; 

	self.initGifts = function() {
		self.gift = new Gift(gifts[DxBall.level].type, gifts[DxBall.level].col, 
			gifts[DxBall.level].row); 
		self.giftCollected = false ;
	};

	self.initBall = function() {
		self.ball.x = BallDefaults.X ;
		self.ball.y = BallDefaults.Y ;
		self.ball.dx = BallDefaults.DX ;
		self.ball.dy = BallDefaults.DY ; 
		self.ball.through = false ; 
	};
	
	self.initBricks = function() {
		var totalBricks = 0 ; 
		for (i=0; i < DxBall.NROWS; i++) {
			self.bricks[i] = new Array(DxBall.NCOLS);
			for (j=0; j < DxBall.NCOLS; j++) {
				self.bricks[i][j] = new Brick(gamedata[DxBall.level][i][j]); 
				if(self.bricks[i][j].visible && self.bricks[i][j].destructible != 0)
					++totalBricks ; 
			}
		}
		DxBall.setBricks(totalBricks); 
	};
	
	self.drawbricks = function() {
		for (i=0; i < DxBall.NROWS; i++) 
			for (j=0; j < DxBall.NCOLS; j++) 
				self.bricks[i][j].draw(i, j); 
	};
	
	var giftHelpers = new function() {
		var _this = this ; 
		var helpers = [] ; 
		helpers[1] = function() {
			DxBall.addPoints(self.gift.points);
		};
		helpers[2] = function() {
			self.ball.anotherLife() ;
		};
		helpers[3] = function() {
			self.ball.passThrough() ;
		};
		
		_this.distribute = function(type) {
			helpers[type]();
		};
	};
	
	var morphingHelpers = new function() {
		var _this = this ; 
		var helpers = [] ; 
		helpers[1] = function() {
			self.ball.speedup() ;
		};
		helpers[2] = function() {
			self.ball.normalSpeed();
		};
		helpers[3] = function() {
			self.ball.normalSpeed(); 
		}; 
		helpers[4] = function() {
			self.paddle.shorten();
			self.ball.normalSpeed(); 
		};
		helpers[5] = function() {
			self.paddle.elongate();
			self.ball.normalSpeed(); 
		};
		helpers[6] = function() {
			self.ball.normalSpeed(); 
		}; 
		
		_this.morph = function(type) {
			helpers[type]();
		};
	};
	
	self.distributeGift = function() {
		giftHelpers.distribute(self.gift.type);
		self.giftCollected = true ; 
	};
	
	self.morphObjects = function(row, col) {
		morphingHelpers.morph(self.bricks[row][col].type);
		DxBall.addPoints(self.bricks[row][col].points);
	};
	
	self.init = function() {
		self.initBall();
		self.initBricks();
		self.initGifts();
	};
	
	self.draw = function() {
		self.ball.draw(); 
		self.paddle.draw(); 
		self.drawbricks(); 
		self.gift.draw(); 
	}
};

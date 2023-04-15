var GameStates = Object.freeze({
				 INVALID : 0,
				 SPLASH_SCREEN : 1,
				 LEVEL_SELECT : 2,
				 RUNNING : 3,
				 LEVEL_COMPLETE : 4,
				 GAME_OVER : 5,
				 PAUSED : 6,
				 CREDIT_SCENE : 7,
				 INFO_SCREEN : 8,
				 START_SCREEN : 9,
			 });
 
var DrawGameScenes = new function() {
	
	var self = this ; 
	
	var drawScene = [];
	
	drawScene[GameStates.SPLASH_SCREEN] = function() {
		Graphics.image(ImageResource[1].res, ImageResource[1].x, ImageResource[1].y); 
	};
	
	drawScene[GameStates.LEVEL_SELECT] = function() {
		Graphics.clear(DxBall.WIDTH, DxBall.TOTAL_HEIGHT);
		Graphics.image(ImageResource[3].res, ImageResource[3].x, ImageResource[3].y); 
		for(i=0; i<6; ++i)
			Graphics.image((licondata[i].unlocked == true ? ImageResource[5].res : ImageResource[4].res), 
				licondata[i].x, licondata[i].y); 
		drawHUD();
	};
	
	drawScene[GameStates.RUNNING] = function() {
		Graphics.clear(DxBall.WIDTH, DxBall.HEIGHT);
		GameObjects.draw(); 
		drawHUDinGame();
	};
	
	drawScene[GameStates.PAUSED] = function() {
		Graphics.grayscale() ; 
		Graphics.image(ImageResource[7].res, ImageResource[7].x, ImageResource[7].y); 
		drawHUDinGame();
	};
	
	drawScene[GameStates.LEVEL_COMPLETE] = function() {
		Graphics.clear(DxBall.WIDTH, DxBall.TOTAL_HEIGHT);
		Graphics.rect(0, 0, DxBall.WIDTH, DxBall.TOTAL_HEIGHT, Colors.FORESTGREEN); 
		Graphics.text('LEVEL COMPLETE', DxBall.WIDTH/2, DxBall.TOTAL_HEIGHT/2, Colors.WHITE);
		Graphics.text('You have scored ' + DxBall.getPointsScored() + ' in ' + 
			DxBall.getElapsedTime(), DxBall.WIDTH/2, DxBall.TOTAL_HEIGHT/2 + 30, Colors.WHITE);
		Graphics.image(ImageResource[6].res, ImageResource[6].x, ImageResource[6].y); 
	};
	
	drawScene[GameStates.GAME_OVER] = function() { 
		Graphics.clear(DxBall.WIDTH, DxBall.TOTAL_HEIGHT);
		Graphics.rect(0, 0, DxBall.WIDTH, DxBall.TOTAL_HEIGHT, Colors.RED); 
		Graphics.text('GAME OVER', DxBall.WIDTH/2, DxBall.TOTAL_HEIGHT/2, Colors.GOLD);
		Graphics.text('You lost ' + DxBall.getCurrentPoints(), DxBall.WIDTH/2, 
			DxBall.TOTAL_HEIGHT/2 + 20, Colors.GOLD); 
	};

	drawScene[GameStates.CREDIT_SCENE] = function() {
		Graphics.image(ImageResource[2].res, ImageResource[2].x, ImageResource[2].y); 
	};
	
	drawScene[GameStates.INFO_SCREEN] = function() {
		Graphics.image(ImageResource[11].res, ImageResource[11].x, ImageResource[11].y); 
	};
	
	drawScene[GameStates.START_SCREEN] = function() {
		Graphics.image(ImageResource[12].res, ImageResource[12].x, ImageResource[12].y); 
	};
	
	var drawHUDinGame = function() {
		if(DxBall.shouldDrawHUDinGame) {
			Graphics.clearPortion(0, DxBall.HEIGHT, DxBall.WIDTH, 50);
			if(GameObjects.giftCollected)
				Graphics.text('Current Points : ' + DxBall.getCurrentPoints() + 
				' | Gift collected !', DxBall.WIDTH/2, (DxBall.HEIGHT+30), Colors.WHITE);
			else
				Graphics.text('Current Points : ' + DxBall.getCurrentPoints(), 
					DxBall.WIDTH/2, (DxBall.HEIGHT+30), Colors.WHITE);
			DxBall.shouldDrawHUDinGame = false ;
		}
	};
	
	var drawHUD = function() {
		Graphics.text('Total Points : ' + DxBall.getPointsScored() + ' | Level : ' + (DxBall.level+1)
				, DxBall.WIDTH/2, (DxBall.HEIGHT+30), Colors.WHITE);
	};
	
	self.draw = function(state) {
		drawScene[state](); 
	};
};

var DxBall = new function() {
	
	var self = this ; 
	
	self.canvas = document.getElementById('dxball'); 
	self.ctx = self.canvas.getContext('2d');
	self.ctx.font = '20px Verdana' ;
	self.ctx.textAlign = 'center' ;
	
	self.WIDTH = self.canvas.width;
	self.HEIGHT = self.canvas.height-50;
	self.TOTAL_HEIGHT = self.canvas.height;
	self.NROWS = 8;
	self.NCOLS = 8;	
	self.MAX_LEVELS = 6 ;
	
	self.state = GameStates.SPLASH_SCREEN ; 
	self.pstate = GameStates.INVALID ; 
	self.playstate = true ; 
	self.loop = 0 ; 
	self.level = 0 ; 
	self.bricks = 0 ; 
	self.FPS = 60 ; 
	self.shouldDrawHUDinGame = false ;
	
	temp_points = 0 ;
	prev_points = 0 ;
	points = 0 ; 
	
	unit_t = 0;
	second = 0 ;
	minute = 0 ;
	
	self.tick = function() {
		++unit_t ;
		if(unit_t == self.FPS)
		{
			++second ;
			unit_t %= self.FPS ;
			if(second == 60)
			{
				++minute ;
				second %= 60 ;
			}
		}
	};
	
	self.getElapsedTime = function() {
		return minute + ':' + second ;
	};
	
	self.initTimer = function() {
		unit_t = 0 ;
		second = 0 ;
		minute = 0 ;
	};
	
	self.setState = function(state) {
		self.pstate = self.state ; 
		self.state = state ; 
	};
	
	self.addPoints = function(val) {
		if(temp_points + val >= 0)
			temp_points += val ;
	};
	
	self.setBricks = function(val) {
		self.bricks = val ;
	};
	
	self.setLevel = function(val) {
		self.level = val ;
	};
	
	self.resetPoints = function() {
		self.temp_points = 0 ;
	};
	
	self.reduceBrick = function() {
		--self.bricks ;
	};
	
	self.isComplete = function() {
		return (self.bricks == 0) ; 
	};
	
	self.isRunning = function() {
		return self.state == GameStates.RUNNING ;
	};
	
	self.isPaused = function() {
		return self.state == GameStates.PAUSED ;
	}
	
	self.nextLevel = function() {
		++self.level ;
		points += temp_points ; 
		prev_points = temp_points ;
		temp_points = 0 ;
	};
	
	self.getPointsScored = function() {
		return prev_points ;
	};
	
	self.getCurrentPoints = function() {
		return temp_points ;
	};
	
	self.getTotalPoints = function() {
		return points ;
	};

	self.restart = function() {
		self.state = GameStates.RUNNING ; 
		clearTimeout(self.loop);
		self.start(); 
	};
	
	self.start = function() {
		clearTimeout(self.loop); 
		GameObjects.init();
		self.playState = true ; 
		self.initTimer() ;
		DxBallGameLoop(); 
	};

	self.resume = function() {
		self.state = GameStates.RUNNING ;
	};
	
	self.pause = function() {
		self.state = GameStates.PAUSED ;
	}
};

function DxBallGameLoop() {
	DxBall.tick(); 
	if(DxBall.pstate != DxBall.state) {
		EventHandlers.registerGameEvents(DxBall.state, DxBall.pstate); 
		DrawGameScenes.draw(DxBall.state) ;
	}
	DxBall.pstate = DxBall.state ; 
	if(DxBall.isRunning()) {
		DrawGameScenes.draw(GameStates.RUNNING) ;
		GameObjects.ball.move(); 
		GameObjects.gift.move();
		DxBall.playState = CollisionSystem.handleCollisions(); 
		if(!DxBall.playState) 
			DxBall.state = GameStates.GAME_OVER ;
		if(DxBall.isComplete()) {
			DxBall.state = GameStates.LEVEL_COMPLETE ; 
			DxBall.nextLevel() ;
			licondata[DxBall.level].unlocked = true ; 
		} 
	}
	DxBall.loop = setTimeout(DxBallGameLoop, 1000/DxBall.FPS); 
}

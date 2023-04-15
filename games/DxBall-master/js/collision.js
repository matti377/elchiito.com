var CollisionSystem = new function() {
	
	var self = this ;
	
	// Handles paddle collision with canvas walls
	var handlePaddle = function() {
		if(EventUtilities.rightDown && (GameObjects.paddle.x < Graphics.canvasMaxX)) {
			GameObjects.paddle.moveRight();
		}
		else if(EventUtilities.leftDown && (GameObjects.paddle.x > Graphics.canvasMinX)) {
			GameObjects.paddle.moveLeft();
		}
	};

	// Handles ball and brick collision
	var handleBallBrick = function() {
	
	// Check if ball is within the region where bricks exist
		if(GameObjects.ball.y < DxBall.NROWS*BrickDefaults.TRUE_HEIGHT) {
		
			// Calculate row and col of the brick hit
			var row = ~~(GameObjects.ball.y/BrickDefaults.TRUE_HEIGHT);
			var col = ~~(GameObjects.ball.x/BrickDefaults.TRUE_WIDTH);
			if(row >= 0 && col >= 0 && GameObjects.bricks[row][col].visible) {
				GameObjects.bricks[row][col].hit() ;
				if(!GameObjects.ball.through) { 	
					//if(ball.x > (row)*BrickDefaults.HEIGHT && ball.x < (row+1)*BrickDefaults.HEIGHT)
					//ball.collideH() ; 
					GameObjects.ball.collideV() ;	
				}
				
				// Based on the bricks properties, change game object properties
				GameObjects.morphObjects(row, col);
				
				// If the brick has a gift associated, activate it 
				if(gifts[DxBall.level].row == row && gifts[DxBall.level].col == col)
					GameObjects.gift.activate();  
			}
		}
	};

	var handleGiftPaddle = function() {
		if(GameObjects.gift.active && (GameObjects.gift.y + GameObjects.gift.res.height) > 
			(DxBall.HEIGHT - GameObjects.paddle.height)) {
			GameObjects.gift.deactivate() ; 
			if(GameObjects.gift.x < (GameObjects.paddle.x + GameObjects.paddle.width) 
			&& GameObjects.gift.x > GameObjects.paddle.x)
				GameObjects.distributeGift();
		}
	};

	// Handles ball paddle collision 
	var handleBallPaddle = function() {
		var ballright = GameObjects.ball.x + GameObjects.ball.dx + GameObjects.ball.radius ; 
		var ballleft  = GameObjects.ball.x + GameObjects.ball.dx - GameObjects.ball.radius ; 
		var bally     = GameObjects.ball.y + GameObjects.ball.dy ;
	
		if(ballright > DxBall.WIDTH || ballleft < 0)
			GameObjects.ball.collideH() ; 
		if(bally < 0)
			GameObjects.ball.collideV();
		else if(bally > DxBall.HEIGHT - GameObjects.paddle.height) {
			if(GameObjects.ball.x > GameObjects.paddle.x && GameObjects.ball.x < 
				GameObjects.paddle.x + GameObjects.paddle.width) {
		
				//move the ball according to where it hit the paddle
				GameObjects.ball.dx =  8*((GameObjects.ball.x-(GameObjects.paddle.x + 
					GameObjects.paddle.width/2))/GameObjects.paddle.width);
				GameObjects.ball.collideV();
			}
			else if(bally > DxBall.HEIGHT) {
			
				// If player has extra life, the ball bounces off
				if(GameObjects.ball.life > 0) {
					GameObjects.ball.collideV(); 
					GameObjects.ball.usedOneLife();
				}
				else
					return false ; // ball falls here 
			}
		}
		return true ; 
	};

	// Handle all collisions and move ball
	self.handleCollisions = function() { 
		handlePaddle();
		handleBallBrick();
		handleGiftPaddle(); 
		var temp = handleBallPaddle(); 
		return temp ; 
	};
};

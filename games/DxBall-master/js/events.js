
var EventUtilities = {
	rightDown : false, 
	leftDown : false,

	checkBounds : function(pos, x1, y1, x2, y2) {
		return (pos.x < x2 && pos.x > x1 && pos.y < y2 && pos.y > y1); 
	}
};

var EventHandlers = new function() {

	var self = this ;

	var pausedGameSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' :
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				var option = ~~(ImageResource[7].height/3) ; 
				
				if(EventUtilities.checkBounds(mouse, ImageResource[7].x, ImageResource[7].y, 
					ImageResource[7].x + ImageResource[7].width, ImageResource[7].y + 
					ImageResource[7].height)) {
					if(mouse.y < (option + ImageResource[7].y)) 
						DxBall.restart(); 
					else if(mouse.y > (option + ImageResource[7].y) && 
						mouse.y < (2*option + ImageResource[7].y)) 
						DxBall.resume();  
					else
						DxBall.setState(GameStates.LEVEL_SELECT) ;  
				}
			break ;
			case 'mousemove' :
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				if(EventUtilities.checkBounds(mouse, ImageResource[7].x, ImageResource[7].y, 
					ImageResource[7].x + ImageResource[7].width, ImageResource[7].y + 
					ImageResource[7].height)) 
					DxBall.canvas.style.cursor = 'pointer' ;
				else
					DxBall.canvas.style.cursor = 'default' ;
			break ;
		}
	}
	};

	var runningGameSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'keydown' : 
				if(evt.keyCode == 39) 
					EventUtilities.rightDown = true;
				else if(evt.keyCode == 37) 
					EventUtilities.leftDown = true;
			break ;
				 
			case 'keyup' : 
				if(evt.keyCode == 39) 
					EventUtilities.rightDown = false;
				else if(evt.keyCode == 37) 
					EventUtilities.leftDown = false;
			break ;
				
			case 'mousemove' : 
				if(evt.pageX > Graphics.canvasMinX && evt.pageX < Graphics.canvasMaxX) {
					GameObjects.paddle.x = Math.max(evt.pageX - Graphics.canvasMinX - 
						(GameObjects.paddle.width/2), 0);
					GameObjects.paddle.x = Math.min(DxBall.WIDTH - GameObjects.paddle.width, 
						GameObjects.paddle.x);
			    }
			break ;
			
			case 'click' :
				if(DxBall.isRunning())
					DxBall.pause(); 
				else if(DxBall.isPaused()) 
					DxBall.resume(); 
			break ; 
		}
	}
	}; 
	
	var splashScreenHandler = {
	handleEvent : function(evt) { 
		switch(evt.type) {
			case 'click' : 
				evt.preventDefault();
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				/* If user clicked anywhere except for "credit", 
				 * go to level selection screen, else go to credit scene
				 */
				Graphics.clear(DxBall.WIDTH, DxBall.HEIGHT);
				if(EventUtilities.checkBounds(mouse, 250, 417, 402, 480))  
					DxBall.setState(GameStates.CREDIT_SCENE) ; 
				else 
					DxBall.setState(GameStates.START_SCREEN) ;
			break ;
				
			case 'mousemove' : 
				DxBall.canvas.style.cursor = 'pointer' ;
			break ;
		}
	}
	};

	var levelSelectSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' : 
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				for(i=0; i<6; ++i)
					if(EventUtilities.checkBounds(mouse, licondata[i].x, licondata[i].y, 
						licondata[i].x + ImageResource[4].width, licondata[i].y 
						+ ImageResource[4].height) && licondata[i].unlocked == true) {
						DxBall.setState(GameStates.RUNNING);
						DxBall.setLevel(i);
						DxBall.start(); 
					}
			break; 
			
			case 'mousemove':
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				for(i=0; i<=DxBall.level; ++i)
					if(EventUtilities.checkBounds(mouse, licondata[i].x, licondata[i].y, 
						licondata[i].x + ImageResource[4].width, licondata[i].y 
						+ ImageResource[4].height)) 
						DxBall.canvas.style.cursor = 'pointer' ;
					else
						DxBall.canvas.style.cursor = 'default' ;
			break;
		}
	}
	};

	var creditSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' : 
				DxBall.setState(GameStates.START_SCREEN) ; 
			break ; 
			case 'mousemove' : 
				DxBall.canvas.style.cursor = 'pointer' ; 
			break ; 
		}
	}
	};

	var levelCompleteSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' : 
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				if(EventUtilities.checkBounds(mouse, 204, DxBall.HEIGHT-90, 435, 480)) 
					DxBall.setState(GameStates.LEVEL_SELECT) ; 
			break ; 
			case 'mousemove' : 
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				if(EventUtilities.checkBounds(mouse, 204, DxBall.HEIGHT-90, 435, 480))
					DxBall.canvas.style.cursor = 'pointer' ; 
				else
					DxBall.canvas.style.cursor = 'default' ; 
			break; 
		}
	}
	}; 

	var gameOverSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' : 
				DxBall.setState(GameStates.LEVEL_SELECT) ; 
			break ;
			case 'mousemove' : 
				DxBall.canvas.style.cursor = 'pointer' ; 
			break ; 
		}
	}
	};
	
	var infoSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' :
				DxBall.setState(GameStates.START_SCREEN);
			break ;
			case 'mousemove' : 
				DxBall.canvas.style.cursor = 'pointer' ; 
			break ; 
		}
	}
	};
	
	var startSceneHandler = {
	handleEvent : function(evt) {
		switch(evt.type) {
			case 'click' :
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 

				if(EventUtilities.checkBounds(mouse, 170, 55, 437, 140)) 
					DxBall.setState(GameStates.LEVEL_SELECT); 
				else if(EventUtilities.checkBounds(mouse, 170, 322, 437, 392))
					DxBall.setState(GameStates.INFO_SCREEN);
			break ;
			
			case 'mousemove' :
				var mouse = {
					x: evt.pageX - Graphics.canvasMinX,
					y: evt.pageY - Graphics.canvasMinY
				}; 
				
				if(EventUtilities.checkBounds(mouse, 170, 55, 437, 140)
				   || EventUtilities.checkBounds(mouse, 170, 322, 437, 392)) 
					DxBall.canvas.style.cursor = 'pointer' ;
				else
					DxBall.canvas.style.cursor = 'default' ;
			break ;
		}
	}
	};		
				
	var unregisterEvents = function(state) {
		switch(state) {
			case GameStates.START_SCREEN :
				DxBall.canvas.removeEventListener('click', startSceneHandler, false);
				DxBall.canvas.removeEventListener('mousemove', startSceneHandler, false);
			break ;
			case GameStates.INFO_SCREEN :
				DxBall.canvas.removeEventListener('click', infoSceneHandler, false);
				DxBall.canvas.removeEventListener('mousemove', infoSceneHandler, false);
			break ;
			case GameStates.RUNNING : 
				DxBall.canvas.removeEventListener('keydown', runningGameSceneHandler, false); 
				DxBall.canvas.removeEventListener('keyup', runningGameSceneHandler, false); 
				DxBall.canvas.removeEventListener('mousemove', runningGameSceneHandler, false); 
				DxBall.canvas.removeEventListener('click', runningGameSceneHandler, false);
			break ;
			case GameStates.PAUSED : 
				DxBall.canvas.removeEventListener('click', pausedGameSceneHandler, false); 
				DxBall.canvas.removeEventListener('mousemove', pausedGameSceneHandler, false); 
			break ;
			case GameStates.SPLASH_SCREEN :
				DxBall.canvas.removeEventListener('click', splashScreenHandler, false); 
				DxBall.canvas.removeEventListener('mousemove', splashScreenHandler, false); 
			break;
			case GameStates.LEVEL_SELECT :
				DxBall.canvas.removeEventListener('click', levelSelectSceneHandler, false); 
				DxBall.canvas.removeEventListener('mousemove', levelSelectSceneHandler, false);
			break ; 
			case GameStates.CREDIT_SCENE :
				DxBall.canvas.removeEventListener('click', creditSceneHandler, false); 
				DxBall.canvas.removeEventListener('mousemove', creditSceneHandler, false); 
			break ; 
			case GameStates.LEVEL_COMPLETE : 
				DxBall.canvas.removeEventListener('click', levelCompleteSceneHandler, false);
				DxBall.canvas.removeEventListener('mousemove', levelCompleteSceneHandler, false);
			break ;
			case GameStates.GAME_OVER :
				DxBall.canvas.removeEventListener('click', gameOverSceneHandler, false);
				DxBall.canvas.removeEventListener('mousemove', gameOverSceneHandler, false);
			break ; 
		}
	};

	self.registerGameEvents = function(currState, prevState) {
		unregisterEvents(prevState); 
		switch(currState) {
			case GameStates.SPLASH_SCREEN :
				DxBall.canvas.addEventListener('click', splashScreenHandler, false); 
				DxBall.canvas.addEventListener('mousemove', splashScreenHandler, false); 
			break;
			case GameStates.START_SCREEN :
				DxBall.canvas.addEventListener('click', startSceneHandler, false);
				DxBall.canvas.addEventListener('mousemove', startSceneHandler, false);
			break ;
			case GameStates.INFO_SCREEN :
				DxBall.canvas.addEventListener('click', infoSceneHandler, false);
				DxBall.canvas.addEventListener('mousemove', infoSceneHandler, false);
			break ;
			case GameStates.RUNNING : 
				DxBall.canvas.addEventListener('keydown', runningGameSceneHandler, false); 
				DxBall.canvas.addEventListener('keyup', runningGameSceneHandler, false); 
				DxBall.canvas.addEventListener('mousemove', runningGameSceneHandler, false);
				DxBall.canvas.addEventListener('click', runningGameSceneHandler, false);
			break ;
			case GameStates.PAUSED : 
				DxBall.canvas.addEventListener('click', pausedGameSceneHandler, false); 
				DxBall.canvas.addEventListener('mousemove', pausedGameSceneHandler, false); 
			break ;
			case GameStates.LEVEL_COMPLETE : 
				DxBall.canvas.addEventListener('click', levelCompleteSceneHandler, false);
				DxBall.canvas.addEventListener('mousemove', levelCompleteSceneHandler, false);
			break ; 
			case GameStates.LEVEL_SELECT :
				DxBall.canvas.addEventListener('click', levelSelectSceneHandler, false); 
				DxBall.canvas.addEventListener('mousemove', levelSelectSceneHandler, false);
			break ; 
			case GameStates.CREDIT_SCENE : 
				DxBall.canvas.addEventListener('click', creditSceneHandler, false); 
				DxBall.canvas.addEventListener('mousemove', creditSceneHandler, false); 
			break ; 
			case GameStates.GAME_OVER :
				DxBall.canvas.addEventListener('click', gameOverSceneHandler, false);
				DxBall.canvas.addEventListener('mousemove', gameOverSceneHandler, false);
			break ; 
		}
	};
};

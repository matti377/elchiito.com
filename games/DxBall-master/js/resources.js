
/**********************************
 * Res 1 : Paddle image
 * Res 2 : Splash screen
 * Res 3 : Credit screen
 * Res 4 : Level select screen
 * Res 5 : Level unlocked screen
 * Res 6 : Level locked screen
 * Res 7 : Next level screen
 * Res 8 : Paused screen
 * Res 9 : Coin Gift
 * Res 10 : Extra Life Gift
 * Res 11 : Gift : Ball passes through bricks destroying them
 * Res 12 : Info screen
 * Res 13 : Start screen
***********************************/ 

var resources = ['img/paddle.png', 
		 'img/splash.png', 
		 'img/credit.png', 
		 'img/lselect.png', 
		 'img/ulevel.png',
		 'img/llevel.png',
		 'img/next.png',
		 'img/pause.png',
		 'img/coin.png',
		 'img/heart.png',
		 'img/multi.png',
		 'img/info.png',
		 'img/start.png' ]; 

function Resource(res) {
	var self = this ; 
	self.res = res ;
	self.x = 0 ;
	self.y = 0 ;
	self.height = res.height ; 
	self.width = res.width ;
}

var ImageResource = [] ; 

var licondata = new Array(6);

function givePositions() {
	var ICON_PADDING_WIDTH  = ~~((DxBall.WIDTH-(3*ImageResource[4].width))/4); 
	var ICON_PADDING_HEIGHT = ~~((DxBall.HEIGHT-(2*ImageResource[4].height))/3); 
	for(i=0; i<6; ++i)
	{
		if(i < 3)
			licondata[i] = { x: (i*ImageResource[4].width) + (i+1)*ICON_PADDING_WIDTH,
						          y: ICON_PADDING_HEIGHT, 
						          unlocked: false
					            }; 
		else
			licondata[i] = { x: ((i-3)*ImageResource[4].width) + (i-2)*ICON_PADDING_WIDTH,
		                          y: ICON_PADDING_HEIGHT*2 + ImageResource[4].height,
						          unlocked: false
					            };
	}
	licondata[0].unlocked = true ; // Start with first level
	ImageResource[6].x = ~~((DxBall.WIDTH - ImageResource[6].width)/2);
	ImageResource[6].y = ~~(DxBall.TOTAL_HEIGHT - ImageResource[6].height);
	ImageResource[7].x = ~~((DxBall.WIDTH - ImageResource[7].width)/2);
	ImageResource[7].y = ~~((DxBall.HEIGHT/2)-(ImageResource[7].height/2));
}

function preloadimages(arr){
    var newimages = [], loadedimages = 0;
    var postaction = function(){};
    var arr = (typeof arr!="object")? [arr] : arr;
    function imageloadpost(){
        loadedimages++;
        if (loadedimages == arr.length){
			//call postaction and pass in newimages array as parameter
            postaction(newimages) ;
        }
    }
    for (var i=0; i<arr.length; ++i){
        newimages[i] = new Image();
        newimages[i].src = arr[i];
        newimages[i].onload = function(){
            imageloadpost();
        };
        newimages[i].onerror = function(){
            alert('Failed to Load Resources');
        };
    }
    //return blank object with done() method
    return { 
        done:function(f){
			//remember user defined callback functions to be called when images load
            postaction = f || postaction ;
        }
    }
}
 
function loadResources(start) {
	preloadimages(resources).done(function(images){
		for(i=0; i<images.length; ++i)
			ImageResource[i] = new Resource(images[i]);
		givePositions(); 
		if(start)
			DxBall.start(); // Start game only if resources are loaded
	});
}

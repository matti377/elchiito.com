
var Colors = Object.freeze({ WHITE : "#FFFFFF",
			     BLACK : "#000000",
			     RED : "#FF0000", 
			     ROYALBLUE : "#4169E1",
			     PURPLE : "#800080",
			     ORANGERED : "#FF4500",
			     NAVYBLUE : "#000080",
			     MAROON : "#800000",
			     FORESTGREEN : "#228B22",
			     DODGERBLUE : "#1E90FF",
			     DARKGREEN : "#006400",
			     CRIMSON : "#DC143C",
			     SEAGREEN : "#2E8B57",
			     TEAL : "#008080",
			     TORQUIOSE : "#40E0D0",
			     MAGENTA : "#FF00FF",
			     AQUA : "#00FFFF",
			     GOLD : "#FFD700"
			  }); 

var Graphics = new function() {
	
	var self = this ; 
	
	self.getOffset = function(el) {
		var _x = 0;
		var _y = 0;
		while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return { top: _y, left: _x };
	};

    self.canvasMinX = self.getOffset(DxBall.canvas).left;
	self.canvasMaxX = self.canvasMinX + DxBall.WIDTH;
	self.canvasMinY = self.getOffset(DxBall.canvas).top; 

	self.circle = function(x, y, r, color) {
		DxBall.ctx.fillStyle = color ;
		DxBall.ctx.beginPath();
		DxBall.ctx.arc(x, y, r, 0, Math.PI*2, true);
		DxBall.ctx.closePath();
		DxBall.ctx.fill();
	};

	self.rect = function(x, y, w, h, color) {
		DxBall.ctx.fillStyle = color ;
		DxBall.ctx.fillRect(x, y, w, h);
	};

	self.clear = function(w, h) {
		self.rect(0, 0, w, h, Colors.BLACK);
	};
	
	self.clearPortion = function(x, y, w, h) {
		self.rect(x, y, w, h, Colors.BLACK);
	};

	self.image = function(img, x, y) {
		DxBall.ctx.drawImage(img, x, y); 
	};
	
	self.altImage = function(img, x, y, w, h) {
		DxBall.ctx.drawImage(img, x, y, w, h);
	};
	
	self.text = function(str, x, y, color) {
		DxBall.ctx.fillStyle = color ;
		DxBall.ctx.fillText(str, x, y);
	};

/* Note : If you run into the error : "Tainted canvas/DOM exception 18", 
 * then run chromium/chrome with the option --allow-file-access-from-files
 * This happens because data is accessed which is not in the same domain as
 * in the canvas 
 */
	self.grayscale = function() {
		var imageData = DxBall.ctx.getImageData(0, 0, DxBall.WIDTH, DxBall.HEIGHT);
		for(var i = 0; i < imageData.data.length; i += 4) {
			var r = imageData.data[i];
			var g = imageData.data[i + 1];
			var b = imageData.data[i + 2];
			imageData.data[i] = imageData.data[i + 1] = 
				imageData.data[i + 2] = (r+g+b)/3;
		}
		DxBall.ctx.putImageData(imageData, 0, 0);
	};
};

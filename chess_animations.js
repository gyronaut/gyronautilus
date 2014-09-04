var width;
var height;

function init(){
	var hitRegionsCanvas = $('#test_canvas')[0];
	width = hitRegionsCanvas.width;
	height = hitRegionsCanvas.height;
	splitQuarters(0, 0, width, height, 0, 0, 100);
	//$('#test_out').append('<h5> testing... </h5>');
}

function splitQuarters(x, y, w, h, red, green, blue){
	var hitRegions = $('#test_canvas')[0].getContext('2d');
	
	//clear the rectangle first with correct "background" color
	var color = "rgb("+red+", "+green+", "+(blue+50)+")";
	hitRegions.fillStyle = color;
	hitRegions.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));

	//only replace new squares if we're not on the last level.
	if(red<=40){
		var factor = (red/20)%2;
		
		color = "rgb("+red+", "+green+", "+blue+")";
		hitRegions.fillStyle = color;
		hitRegions.fillRect(x+(factor)*w/2, y, w/2, h/2);
		
		color = "rgb("+red+", "+(green+Math.pow(10, red/20))+", "+blue+")";
		hitRegions.fillStyle = color;
		hitRegions.fillRect(x+(1-factor)*w/2, y+h/2, w/2, h/2);
	}
}

function combineQuarters(x, y, w, h, red, green, blue){
	var hitRegions = $('#test_canvas')[0].getContext('2d');
	
	blue = blue - blue%100;
	green = green - Math.pow(10, red/20);
	red = red-20;
	
	
	color = "rgb("+red+", "+green+", "+blue+")";
	hitRegions.fillStyle = color;
	hitRegions.fillRect(x, y, w, h);
}

function expand(data){
	var level = (data[0]/20);
	var xOrigin = 0;
	var yOrigin = 0;
	var subWidth = width;
	var subHeight = height;
	//$('#test_out').append('<h5> expanding now! level = '+level+' </h5>');
	for (var i =0; i<level+1; i++){
		subWidth = subWidth/2;
		subHeight = subHeight/2;
		var xOffset=0;
		var yOffset=0;
		if((i%2)==0){
			xOffset += ((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))*subWidth;
			yOffset += ((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))*subHeight;
		}else{
			xOffset += ((((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))+1)%2)*subWidth;
			yOffset += ((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))*subHeight;
		}
		xOrigin += xOffset;
		yOrigin += yOffset;
	}
	//$('#test_out').append('<h5> '+xOrigin+' '+yOrigin+' '+subWidth+' '+subHeight+' '+(data[0]+20)+' '+data[1]+' '+data[2]+' </h5>');
	splitQuarters(xOrigin, yOrigin, subWidth, subHeight, data[0]+20, data[1], data[2]);	
}

function contract(data){
	var level = (data[0]/20);
	var xOrigin = 0;
	var yOrigin = 0;
	var subWidth = width;
	var subHeight = height;
	//$('#test_out').append('<h5> expanding now! level = '+level+' </h5>');
	for (var i =0; i<level+1; i++){
		subWidth = subWidth/2;
		subHeight = subHeight/2;
		var xOffset=0;
		var yOffset=0;
		if((i%2)==0){
			xOffset += ((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))*subWidth;
			yOffset += ((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))*subHeight;
		}else{
			xOffset += ((((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))+1)%2)*subWidth;
			yOffset += ((data[1]%(Math.pow(10, i+1)) - data[1]%(Math.pow(10, i)))/Math.pow(10, i))*subHeight;
		}
		xOrigin += xOffset;
		yOrigin += yOffset;
	}
	if((data[0]/20)%2){
		xOrigin -= subHeight;
	}
	splitQuarters(xOrigin, yOrigin, subWidth*2, subHeight*2, data[0], data[1], data[2]-50);
	$('#output').append('<h5> ( '+xOrigin+', '+yOrigin+' ) '+subHeight+'</h5>');
}

function changeCanvas(x, y, isShifted){
	var hitRegions = $('#test_canvas')[0].getContext('2d');
	var data = hitRegions.getImageData(x, y, 1, 1).data;
	if(data[2]%100!=0){
		contract(data);
	}else if((data[0] <= 40)){
		//$('#test_out').append('<h5> pre-expand... </h5>');
		expand(data);
	}
}
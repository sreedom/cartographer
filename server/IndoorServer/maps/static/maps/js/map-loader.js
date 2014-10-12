var startX;
var startY;
var canvasOffset;
var offsetX;
var offsetY;

var isDrawing = false;
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvasOffset = $("#myCanvas").offset();
offsetX = canvasOffset.left;
offsetY = canvasOffset.top;

function handleMouseUp() {
	isDrawing = false;
	canvas.style.cursor = "default";	
}
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = offsetX;
    var canvasY = offsetY;
    var currentElement = canvas;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

function handleMouseMove(e) {
	if (isDrawing) {
		var mouseX = parseInt(e.clientX - offsetX);
		var mouseY = parseInt(e.clientY - offsetY);				
	    context.beginPath();
		coords = relMouseCoords(event);
		console.log(coords.x,coords.y);
		context.fillRect(startX, startY, coords.x - startX,coords.y - startY);
		context.stroke();
		context.closePath();
	}
}

function handleMouseDown(e) {
	canvas.style.cursor = "crosshair";		
	isDrawing = true
	coords = relMouseCoords(event);
	startX = parseInt(coords.x);
	startY = parseInt(coords.y);
}

function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}
function loadMap() {
  /* REMOVE these defaults 
  imgHeight = 500;
  imgWidth = 975;
  /*-----------------------*/
  var sources = {
    darthVader: 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg',
    yoda: 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg'
  };

  loadImages(sources, function(images) {
  	newImgWidth = imgWidth;
    /*if(imgHeight > canvas.height || imgWidth > canvas.width){
      newImgWidth = imgWidth * (500/imgHeight);
    }*/

    //$('#myCanvas')[0].style['width']= newImgWidth+'px';
    //$('#myCanvas')[0].style['height']= '500'+'px';
    context.drawImage(images.darthVader, 0, 0, canvas.width, canvas.height);
    //context.drawImage(images.yoda, 0, 55, 93, 104);
  });
}



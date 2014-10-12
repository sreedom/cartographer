$(function(){
	initView();
	//switchSelect(1,2);
	//switchSelect(2,3);
	//switchSelect(3,4);
	//switchSelect(4,5);

});

var clusters = [];
var paths = [];
var mapID = "5438412e9a99af735cdc62e9";
var mapName = "InMobi Campus";
var floor = new Object();
var imgURI = "";

var imgWidth = 0;
var imgHeight = 0;
var img;
var _URL = window.URL || window.webkitURL;

$("#floorplan").change(function(e) {
      var file;
      if ((file = this.files[0])) {
          img = new Image();
          img.onload = function() {
              imgWidth = this.width;
              imgHeight = this.height;
          };
          img.onerror = function() {
              alert( "not a valid file: " + file.type);
          };
          img.src = _URL.createObjectURL(file);
      }
  });

function addFloor(){
	$('#phase-2-show').hide();
	$('#phase-2-add').show();
}
function showFloor(){
	$('#phase-2-show').show();
	$('#phase-2-add').hide();
}

var canvas = new fabric.Canvas('myCanvas',{ selection: false });

var rect, line, isDown, origX, origY;

function loadMap(){
  //canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.setBackgroundImage(floor.url, canvas.renderAll.bind(canvas));

}

canvasOffset = $("#myCanvas").offset();
offsetX = canvasOffset.left;
offsetY = canvasOffset.top;

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = offsetX;
    var canvasY = offsetY;
    var currentElement = document.getElementById('myCanvas');

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY - window.pageYOffset;

    return {x:canvasX, y:canvasY}
}
function setCanvasEvents(phase){
	if(phase == 3){
		canvas.on('mouse:down', function(o){
		    isDown = true;
		    var pointer = relMouseCoords(o.e);
		    origX = pointer.x;
		    origY = pointer.y;

		    var pointer = relMouseCoords(o.e);
		    rect = new fabric.Rect({
		        left: origX,
		        top: origY,
		        originX: 'left',
		        originY: 'top',
		        width: pointer.x-origX,
		        height: pointer.y-origY,
		        angle: 0,
		        fill: 'rgba(255,0,0,0.5)',
		        transparentCorners: false
		    });
		    canvas.add(rect);
		});

		canvas.on('mouse:move', function(o){
		    if (!isDown) return;
		    var pointer = relMouseCoords(o.e);
		    
		    if(origX>pointer.x){
		        rect.set({ left: Math.abs(pointer.x) });
		    }
		    if(origY>pointer.y){
		        rect.set({ top: Math.abs(pointer.y) });
		    }
		    
		    rect.set({ width: Math.abs(origX - pointer.x) });
		    rect.set({ height: Math.abs(origY - pointer.y) });
		   
		    canvas.renderAll();
		});

		canvas.on('mouse:up', function(o){
		  isDown = false;
		  var pointer = relMouseCoords(o.e);
		  if(Math.abs(origY - pointer.y)>10 || Math.abs(origX - pointer.x) > 10)
		  {
		  	  var formStr = $('#popup-form')[0].innerHTML;
			  $('#popover').popover({'placement':'top','title':'Add Cluster Details',
				'content':'<div id="inpopup">'+formStr+'</div>','html':true
			  });
			  $('#popover').css('position','absolute');
			  var newY, newX;
			  if(origY > pointer.y) {
			  	newY = pointer.y+((origY - pointer.y)/2)+'px'
			  } else {
			  	newY = pointer.y-((pointer.y - origY)/2)+'px'
			  }
			  if(origX > pointer.x) {
			  	newX = pointer.x+((origX - pointer.x)/2)+'px'
			  } else {
			  	newX = pointer.x-((pointer.x - origX)/2)+'px'
			  }
			  console.log(rect.top,rect.left,rect.width,rect.height);
			  $('#popover').css('top',newY);
			  $('#popover').css('left',newX);
			  $('#popover').popover('show');


		  } else {
		  	alert('Please fill cluster details');
			//$('#popover').popover('hide');
		  }
		});

	} else if(phase == 4) {
		canvas.off('mouse:down');
		canvas.off('mouse:move');
		canvas.off('mouse:up');
		canvas.on('mouse:down', function(o){
		  isDown = true;
		  var pointer = relMouseCoords(o.e);
		  var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
		  line = new fabric.Line(points, {
		    strokeWidth: 5,
		    fill: 'blue',
		    stroke: 'blue',
		    originX: 'center',
		    originY: 'center'
		  });
		  canvas.add(line);
		});

		canvas.on('mouse:move', function(o){
		  if (!isDown) return;
		  var pointer = relMouseCoords(o.e);
		  line.set({ x2: pointer.x, y2: pointer.y });
		  canvas.renderAll();
		});

		canvas.on('mouse:up', function(o){
		  isDown = false;
		  var pointer = relMouseCoords(o.e);
		  paths.push({
		  	'x1':line.x1,
		  	'x2':line.x2,
		  	'y1':line.y1,
		  	'y2':line.y2
		  })
		});

	}
}

function addCluster(){
	var name = $('#inpopup #clusterName').val();
	var type = $('#inpopup #clusterType').val();
	var tags = $('#inpopup #clusterTags').val().split(',');
	console.log(rect.top,rect.left,rect.top+rect.width,rect.left+rect.height,name,type,tags);
	clusters.push({
		'name':name,
		'type':type,
		'tags':tags,
		'topLeft':{'x':rect.top,'y':rect.left},
		'bottomRight':{'x':rect.top+rect.width,'y':rect.left+rect.height}
	});
	$('#popover').popover('hide');
	$('#inpopup').remove();
}

function finalize(){
	floor.clusters = clusters;
	floor.path = paths;
	// SEND data to server //
	console.log(JSON.stringify(floor));
	var BASE_URL = "http://localhost:9090/maps/update-map/";
	var url = BASE_URL + mapID;
	var data = {"floor_data":JSON.stringify(floor)}
	$.ajax({
	  type: "POST",
	  url: url,
	  data: data,
	});
	

}

//form ajax stuff

var form = document.getElementById('file-form');
var fileSelect = document.getElementById('floorplan');
var uploadButton = document.getElementById('upload-button');

form.onsubmit = function (event) {
  event.preventDefault();

  // Update button text.
  uploadButton.innerHTML = 'Uploading...';

  // The rest of the code will go here...
  var files = fileSelect.files;
  // Create a new FormData object.
  var formData = new FormData();

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    // Check the file type.
    if (!file.type.match('image.*')) {
      continue;
    }

    // Add the file to the request.
    formData.append('file', file, file.name);
  }

  // Set up the request.
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:9090/maps/upload-image/', true);
  // Set up a handler for when the request finishes.
  xhr.onload = function () {
    if (xhr.status === 200) {
      // File(s) uploaded.
      var obj = JSON.parse(xhr.responseText);
      floor.image = obj.id;
      floor.url = obj.url;
      uploadButton.innerHTML = 'Upload';
      switchSelect(2,3);
    } else {
      alert('An error occurred!');
    }
  };

  // Send the Data.
  xhr.send(formData);
};




//




function switchSelect(from,to){
	hide(from);
	select(to);
	if(from == 2){
		floor.name = $('#floorNum').val();
	}
	if(to == 3 || to == 4){
		$('#canvas-div').show();
		setCanvasEvents(to);
		loadMap();
	} else {
		$('#canvas-div').hide();
	}
}
function initView(){
	$("form").on('submit', function(e){
	  e.preventDefault();
	});
	select(1);
	hide(2); hide(3); hide(4); hide(5);
	$('#phase-2-add').hide();
	$('#canvas-div').hide();
}
function hide(id){
	$('#page-phase-'+id).removeClass('active').addClass('disabled');
	$('#phase-'+id).css('display','none');
}
function select(id){
	$('#page-phase-'+id).removeClass('disabled').addClass('active');
	$('#phase-'+id).css('display','inline');
}


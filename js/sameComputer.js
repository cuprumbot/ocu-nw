// browser support
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || oGetUserMedia;
window.requestAnimationFrame = requestAnimationFrame;

var getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
navigator.getUserMedia = getUserMedia;

//video and canvas
var video1, video2, canvas, canvasContext;

var constraints1, constraints2;

//size constants
var	CANV_WIDTH 	= 1280,
	CANV_HEIGHT = 800,
	CAM_WIDTH 	= 800,
	CAM_HEIGHT 	= 640,
	BPIXEL 		= 3;
var TRANS_VID1_X 	= (CANV_WIDTH/2 - CAM_HEIGHT)/2,
	TRANS_VID1_Y 	= CAM_WIDTH + (CANV_HEIGHT - CAM_WIDTH)/2,
	TRANS_VID2_X 	= CANV_WIDTH/2 + CAM_HEIGHT + (CANV_WIDTH/2 - CAM_HEIGHT)/2,
	TRANS_VID2_Y 	= (CANV_HEIGHT - CAM_WIDTH)/2;

function successCallback1 (stream) {
	log("Camera 1 is ready");
	video1.src = webkitURL.createObjectURL(stream);
	video1.play();
	log("Video 1 is ready");

	navigator.getUserMedia(constraints2, successCallback2, errorCallback);
}

function successCallback2 (stream) {
	log("Camera 2 is ready");
	video2.src = webkitURL.createObjectURL(stream);
	video2.play();
	log("Video 2 is ready");
}

function errorCallback (stream) {
	log("Error reading from cameras");
}

function log(msg) {
	document.getElementById('log').innerHTML = msg + "<br/>" + document.getElementById('log').innerHTML;
	//console.log("MSG >>> " + msg);
};

function draw (ctx, img, xt, yt, w, h, r, img2, xt2, yt2, w2, h2, r2) {
	var stringData;

	ctx.translate(xt, yt);
	ctx.rotate(r);
	try {
		ctx.drawImage(img, 0, 0, w, h);
		//ctx.drawImage(img,0,0);
	} catch (e) {}
	
	//undo changes
	ctx.rotate(2*Math.PI - r);
	ctx.translate(-xt, -yt);

	ctx.translate(xt2, yt2);
	ctx.rotate(r2);
	try {
		ctx.drawImage(img2, 0, 0, w2, h2); 
		//ctx.drawImage(img2,0,0);
	} catch (e) {}
	
	//undo changes
	ctx.rotate(2*Math.PI - r2);
	ctx.translate(-xt2, -yt2);

	setTimeout(	function() { draw(ctx, img, xt, yt, w, h, r, img2, xt2, yt2, w2, h2, r2); }, 1000/fps );
};

MediaStreamTrack.getSources(function(sourceInfos) {
	var firstCam = null;
	var secondCam = null;

	for (var i = 0; i != sourceInfos.length; i++) {
		var sourceInfo = sourceInfos[i];
		if (sourceInfo.kind === 'video') {
			log(sourceInfo.id + " " + sourceInfo.label || 'camera');
			if (firstCam == null) {
				firstCam = sourceInfo.id;
			} else if (secondCam == null) {
				secondCam = sourceInfo.id;
			}
		}
	}

	sourceSelected(firstCam, secondCam);
});

function sourceSelected(firstCam, secondCam) {
	video1 = document.getElementById('videoId1');
	video2 = document.getElementById('videoId2');
	canvas = document.getElementById('canvasId');
	canvasContext = canvas.getContext('2d');

	constraints1 = {
		video: {
			optional: [{sourceId: firstCam}]
		}
	};
	constraints2 = {
		video: {
			optional: [{sourceId: secondCam}]
		}
	};

	navigator.getUserMedia(constraints1, successCallback1, errorCallback);
	//navigator.getUserMedia(constraints2, successCallback2, errorCallback);
	draw(canvasContext, video1, TRANS_VID1_X, TRANS_VID1_Y+25, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2, video2, TRANS_VID1_X+(CANV_WIDTH/2), TRANS_VID1_Y-25, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2);
}

/*
$( function init () {
	video1 = document.getElementById('videoId1');
	video2 = document.getElementById('videoId2');
	canvas = document.getElementById('canvasId');
	canvasContext = canvas.getContext('2d');
	
	navigator.getUserMedia({video:true}, successCallback1, errorCallback);
	//navigator.getUserMedia(hdConstraints, successCallback1, errorCallback);


	log("Attempting first draw...");
	//draw(canvasContext, video1, TRANS_VID1_X, TRANS_VID1_Y, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2, video2, TRANS_VID2_X, TRANS_VID2_Y, CAM_WIDTH, CAM_HEIGHT, Math.PI*1/2);
	draw(canvasContext, video1, TRANS_VID1_X, TRANS_VID1_Y+25, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2, video2, TRANS_VID1_X+(CANV_WIDTH/2), TRANS_VID1_Y-25, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2);
} );
*/
"use strict";

var canvas = document.getElementById("drawingCanvas");
var ctx = canvas.getContext("2d");
var drawing = false;
var lastPos = null;

function makeCircle(x, y, color) {
	// set color
	ctx.fillStyle = color;
	// always start with beginPath
	ctx.beginPath();
	// make a 100px radius arc that is 6.28 radians around (i.e. a circle)
	ctx.arc(x, y, 100, 0, 6.28);
	// draw it
	ctx.fill();
}

function makePinwheel() {
	for (var i = 0; i < 10; i++) {
		// how far around the ring are we, in radians
		var completion = i / 10 * 6.28;
		// position with sin and cos
		var xPos = 400 + Math.sin(completion) * 100;
		var yPos = 300 + Math.cos(completion) * 100;
		// alternate colors
		var color = i % 2 === 0 ? "rgba(0, 0, 255, 0.5)" : "rgba(0, 255, 255, 0.5)";

		makeCircle(xPos, yPos, color);
	}
}

function drawImage() {
	var image = document.getElementById("circusBall");
	ctx.drawImage(image, 262, 162);
}

function loadImage() {
	var image = new Image();
	image.src = "dist/img/logo.png";
	image.onload = drawImageOnLoad;
}

function drawImageOnLoad() {
	ctx.drawImage(this, 262, 162);
}

function drawDot(e) {
	console.log(e);

	var xPos = e.offsetX;
	var yPos = e.offsetY;
	var brushSize = 5;

	ctx.fillStyle = "#0000ff";
	ctx.beginPath();
	ctx.arc(xPos, yPos, brushSize, 0, 6.28);
	ctx.fill();
}

function onDrawStart(e) {
	lastPos = {
		x: e.offsetX,
		y: e.offsetY
	};
	drawing = true;
}

function onDraw(e) {
	if (drawing) {
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(lastPos.x, lastPos.y);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();

		lastPos = {
			x: e.offsetX,
			y: e.offsetY
		};
	}
}

function onDrawEnd() {
	lastPos = null;
	drawing = false;
}

window.onload = function () {
	/**********************************
 	Draw a series of circles
 **********************************/
	// makePinwheel();

	/**********************************
 	Draw the circus logo
 **********************************/
	// drawImage();

	/**********************************
 	Load circus logo and draw
 **********************************/
	// loadImage();

	/**********************************
 	Screen pinwheel over circus logo
 **********************************/
	// drawImage();
	// ctx.globalCompositeOperation = "screen";
	// makePinwheel();

	/**********************************
 	place dots under mouse pointer
 **********************************/
	// canvas.addEventListener("mousemove", drawDot);

	/**********************************
 	Draw lines on mouse down
 **********************************/
	canvas.addEventListener("mousedown", onDrawStart);
	canvas.addEventListener("mousemove", onDraw);
	canvas.addEventListener("mouseup", onDrawEnd);
};
//# sourceMappingURL=main.js.map

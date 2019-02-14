"use strict";

var app = new PIXI.Application({
	view: document.getElementById("backgroundCanvas"),
	width: 1280,
	height: 720
});

var rgb = new PIXI.filters.RGBSplitFilter({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 });

var manifest = [{ "key": "ball", "url": "dist/img/logo.png" }, { "key": "buildings", "url": "dist/img/pierre-chatel-innocenti-1286583-unsplash.jpg" }];

function loadAssets() {
	app.loader.add(manifest);

	app.loader.load(onAssetsLoaded);
}

function onAssetsLoaded(loader, resources) {

	setupScrollProgress();

	setupTextDecompose();

	app.ticker.add(function (e) {
		return update(e);
	});
}

function setupScrollProgress() {
	// draw range circles
	var start = new PIXI.Graphics();
	start.beginFill(0xffffff);
	start.drawCircle(0, 0, 4);
	start.x = 50;
	start.y = 100;
	app.stage.addChild(start);

	var end = new PIXI.Graphics();
	end.beginFill(0xffffff);
	end.drawCircle(0, 0, 4);
	end.x = 50;
	end.y = 500;
	app.stage.addChild(end);

	// draw progress bar
	app.scrollProgress = new PIXI.Graphics();
	app.scrollProgress.beginFill(0xffffff);
	app.scrollProgress.drawRect(-2, 0, 4, 400);

	app.scrollProgress.x = 50;
	app.scrollProgress.y = 100;

	app.stage.addChild(app.scrollProgress);
}

function setupTextDecompose() {
	var style = new PIXI.TextStyle({
		fill: "white",
		fontFamily: "Helvetica",
		fontSize: 100,
		fontWeight: "bold"
	});

	app.letters = [new PIXI.Text('D', style), new PIXI.Text('E', style), new PIXI.Text('M', style), new PIXI.Text('O', style)];

	for (var i = 0; i < app.letters.length; i++) {
		var letter = app.letters[i];

		letter.y = 100;
		letter.x = 800 + i * 100;
		letter.startPt = {
			x: letter.x,
			y: 100
		};
		letter.endPt = {
			x: letter.x - Math.random() * 500,
			y: 100 + Math.random() * 500
		};
		letter.filters = [rgb];

		app.stage.addChild(letter);
	}
}

function update(e) {
	var html = document.scrollingElement;
	var percentScrolled = html.scrollTop / (html.scrollHeight - html.offsetHeight);

	// console.log(percentScrolled);

	app.scrollProgress.scale.set(1, percentScrolled);

	// change filter amt based on scroll
	rgb.red = { x: 20 * percentScrolled, y: 10 * percentScrolled };

	// lerp position
	for (var i = 0; i < app.letters.length; i++) {
		var letter = app.letters[i];

		letter.x = lerp(letter.startPt.x, letter.endPt.x, percentScrolled);
		letter.y = lerp(letter.startPt.y, letter.endPt.y, percentScrolled);
	}
}

function lerp(start, end, t) {
	return (1 - t) * start + t * end;
}

window.onload = function () {

	loadAssets();
};
//# sourceMappingURL=main.js.map

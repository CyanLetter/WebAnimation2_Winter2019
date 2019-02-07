let app = new PIXI.Application({
	view: document.getElementById("pixiCanvas"),
	width: 1024,
	height: 1280,
	transparent: true
});

let app2 = new PIXI.Application({
	view: document.getElementById("backgroundCanvas"),
	width: 1280,
	height: 720,
	backgroundColor: 0x444444
});

let rt = PIXI.RenderTexture.create(1280, 720);
let rt2 = PIXI.RenderTexture.create(1280, 720);
let renderSprite = new PIXI.Sprite(rt);

let manifest = [
	{"key" : "ball", "url" : "dist/img/logo.png"},
	{"key" : "buildings", "url" : "dist/img/pierre-chatel-innocenti-1286583-unsplash.jpg"},
	{"key" : "displacement2", "url" : "dist/img/displacement2.png"},
	{"key" : "displacement3", "url" : "dist/img/displacement3.png"}
	
];

function loadAssets() {
	app.loader.add(manifest);

	app.loader.load(onAssetsLoaded);
}

function onAssetsLoaded(loader, resources) {
	console.log(resources);

	displacementTile();

	setupStage2();

	renderCircle();

	app.ticker.add((e) => update(e));
}

function displacementTile() {
	// setup main image
	window.bg = new PIXI.Sprite(app.loader.resources.buildings.texture);
	app.stage.addChild(bg);

	// set texture to tile
	app.loader.resources.displacement2.texture.baseTexture.wrapMode	= PIXI.WRAP_MODES.REPEAT;
	// add displacement image
	let displaceSprite = new PIXI.Sprite(app.loader.resources.displacement2.texture, 2048, 1920);

	app.stage.addChild(displaceSprite);

	let displaceFilter = new PIXI.filters.DisplacementFilter(displaceSprite);
	bg.filters = [displaceFilter];

	TweenMax.fromTo(displaceFilter.scale, 6, {x: 0, y: 0}, {x: 20, y: 20, ease: Sine.easeInOut});
	TweenMax.fromTo(displaceSprite, 10, 
		{x: -1024, y: 0}, 
		{x: 0, y: -640, ease: Linear.easeNone, repeat: -1});
}

function setupStage2 () {
	app2.stage.addChild(renderSprite);

	let blur = new PIXI.filters.BlurFilter();
	// app2.stage.filters = [blur];
}

function renderCircle () {

	let circle = new PIXI.Graphics();
	circle.beginFill(0x00ffcc, 0.1);
	circle.drawCircle(0, 0, 50);
	circle.x = 900;
	circle.y = 600;

	app2.stage.addChild(circle);

	TweenMax.fromTo(circle, 8, 
		{
			x: -50
		}, {
			x: 1330, 
			ease: Sine.easeOut, 
			repeat: -1,
			yoyo: true,
			onRepeat: function() {
				circle.y = Math.random() * 720;
			}
		});
}

function update(e) {
	let temp = rt;
	rt = rt2;
	rt2 = temp;
	renderSprite.texture = rt;

	app2.renderer.render(app2.stage, rt2);
}

function resize(e) {
	console.log("resize");
	// resize canvas to center cut
	let canvasAspect = app2.screen.width / app2.screen.height;
	let screenAspect = window.innerWidth / window.innerHeight;
	let scale = 1;

	if (screenAspect >= canvasAspect) {
		// if screen > canvas, screen is wider
		// landscape, make width match
		scale = window.innerWidth / app2.screen.width;
	} else {
		// else canvas is wider, so make height match
		// portrait, make height match
		scale = window.innerHeight / app2.screen.height;
	}

	let newTransform = 'scale(' + scale + ')';

	app2.view.style.transform = newTransform;
}

window.onload = function() {
	window.addEventListener("resize", resize);
	resize();

	loadAssets();
}
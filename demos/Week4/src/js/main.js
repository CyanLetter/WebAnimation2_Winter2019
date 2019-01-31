let app = new PIXI.Application({
	view: document.getElementById("pixiCanvas"),
	width: 1280,
	height: 720
});

let manifest = [
	{"key" : "ball", "url" : "dist/img/logo.png"},
	{"key" : "background", "url" : "dist/img/nathan-langer-1331407-unsplash.jpg"},
	{"key" : "silhouette", "url" : "dist/img/maranatha-pizarras-342561-unsplash-mask.png"},
	{"key" : "displacement", "url" : "dist/img/displacement.png"},
	{"key" : "displacement2", "url" : "dist/img/displacement2.png"},
	{"key" : "displacement3", "url" : "dist/img/displacement3.png"},
	{"key" : "timelapse", "url" : "dist/video/NightSkyTImelapse.mp4"}
	
];

let testFilter;

let blurDir = 1;

function loadAssets() {
	app.loader.add(manifest);

	app.loader.load(onAssetsLoaded);
}

function onAssetsLoaded(loader, resources) {
	console.log(resources);

	// basicMask();

	// basicFilter();

	backgroundColorShift();

	videoMask();

	basicDisplacement();

	app.ticker.add((e) => update(e));
}

function basicMask() {
	// set up image to use as mask
	let ball = new PIXI.Sprite(app.loader.resources.ball.texture);
	ball.anchor.set(0.5);

	// set up background image
	let bg = new PIXI.Sprite(app.loader.resources.background.texture);
	// set mask to other sprite
	bg.mask = ball;

	app.view.addEventListener("mousemove", function(e){
		// console.log(e);
		ball.x = e.offsetX;
		ball.y = e.offsetY;
	});

	app.stage.addChild(bg);
	app.stage.addChild(ball);
	
}

function basicFilter() {
	let bg = new PIXI.Sprite(app.loader.resources.background.texture);
	app.stage.addChild(bg);

	let ball = new PIXI.Sprite(app.loader.resources.ball.texture);
	ball.x = 700;
	ball.y = 400;
	ball.anchor.set(0.5);
	app.stage.addChild(ball);

	testFilter = new PIXI.filters.BlurFilter();
	testFilter.blur = 0;

	ball.filters = [testFilter];

	TweenMax.fromTo(testFilter, 1, {blur: 0}, {blur: 10, repeat: -1, yoyo: true});

	TweenMax.fromTo(ball, 5, {rotation: 0}, {rotation: 6.28, repeat: -1, ease: Linear.easeNone});
}

function backgroundColorShift() {
	let bg = new PIXI.Sprite(app.loader.resources.background.texture);
	app.stage.addChild(bg);

	let colorFilter = new PIXI.filters.ColorMatrixFilter();
	bg.filters = [colorFilter];

	let colorFilterParams = {
		hue: 0
	};

	TweenMax.fromTo(
		colorFilterParams, 
		8, 
		{
			hue: 0
		}, 
		{
			hue: 360, 
			repeat: -1, 
			ease: Linear.easeNone,
			onUpdate: function() {
				colorFilter.hue(colorFilterParams.hue);
			}
		}
	);
}

function videoMask() {
	let vidTex = new PIXI.Texture.fromVideo(app.loader.resources.timelapse.data);

	vidTex.baseTexture.source.setAttribute('loop','');
	vidTex.baseTexture.source.setAttribute('muted','');
	vidTex.baseTexture.source.setAttribute('playsinline','');

	let vid = new PIXI.Sprite(vidTex);
	vid.y = 180;
	app.stage.addChild(vid);

	let headMask = new PIXI.Sprite(app.loader.resources.silhouette.texture);
	headMask.anchor.set(0.5, 1);
	headMask.scale.set(0.75);
	headMask.y = 720;
	headMask.x = 640;
	app.stage.addChild(headMask);

	vid.mask = headMask;

	vid.interactive = true;
	vid.on("pointerdown", function() {
		vidTex.baseTexture.source.play();
	})
}

function basicDisplacement() {
	let displaceSprite = new PIXI.Sprite(app.loader.resources.displacement3.texture);

	// displaceSprite.x = 500;
	// displaceSprite.anchor.set(0.5);
	app.stage.addChild(displaceSprite);

	let displaceFilter = new PIXI.filters.DisplacementFilter(displaceSprite);
	displaceFilter.scale.set(0);
	app.stage.filters = [displaceFilter];

	app.view.addEventListener("pointerdown", function(e){
		TweenMax.fromTo(displaceFilter.scale, 1, {x: 40, y: 40}, {x: 0, y: 0, ease: Elastic.easeOut});
	});
}

function displaceOnClick(e) {

}

function update(e) {
	// rotateBalls();

}

function resize(e) {
	console.log("resize");
	// resize canvas to center cut
	let canvasAspect = app.screen.width / app.screen.height;
	let screenAspect = window.innerWidth / window.innerHeight;
	let scale = 1;

	if (screenAspect >= canvasAspect) {
		// if screen > canvas, screen is wider
		// landscape, make width match
		scale = window.innerWidth / app.screen.width;
	} else {
		// else canvas is wider, so make height match
		// portrait, make height match
		scale = window.innerHeight / app.screen.height;
	}

	let newTransform = 'scale(' + scale + ')';

	app.view.style.transform = newTransform;
}

window.onload = function() {
	window.addEventListener("resize", resize);
	resize();

	loadAssets();
}
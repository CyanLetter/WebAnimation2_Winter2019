let app = new PIXI.Application({
	view: document.getElementById("pixiCanvas")
});

let manifest = [
	{"key" : "ball", "url" : "dist/img/logo.png"},
	{"key" : "explosion", "url" : "dist/img/explosion.json"},
	{"key" : "penguin", "url" : "dist/img/penguin_pixeled.png"}
];

let explosionSequence = [];
let penguins = [];
let didWin = false;

function loadAssets() {
	// app.loader.add("ball", "dist/img/logo.png");

	app.loader.add(manifest);

	app.loader.load(onAssetsLoaded);
}

function onAssetsLoaded(loader, resources) {
	console.log(resources);

	// addCircusBalls(resources);

	// generate array of textures for explosion
	addExplosionAnim(resources);

	// addExplodingBall(resources);

	setupGame(resources);

	app.ticker.add((e) => update(e));
}

function addExplosionAnim(resources) {
	for (let tex in resources.explosion.textures) {
		explosionSequence.push(resources.explosion.textures[tex]);
	}
}

/*****************************
	sprite examples
*****************************/

function addCircusBalls(resources) {
	let ball = new PIXI.Sprite(resources.ball.texture);
	ball.x = 400;
	ball.y = 300;
	ball.anchor.x = ball.anchor.y = 0.5;
	app.stage.addChild(ball);

	let ball2 = new PIXI.Sprite(resources.ball.texture);
	ball2.anchor.x = -1.5;
	ball2.anchor.y = 0.5;
	ball2.scale.set(0.5);
	ball.addChild(ball2);

	ball.interactive = true;
	ball.buttonMode = true;
	ball.on("pointerdown", function(e) {
		console.log(e);

		// let ball = new PIXI.Sprite(resources.ball.texture);
		// ball.x = e.data.global.x;
		// ball.y = e.data.global.y;
		// ball.anchor.x = ball.anchor.y = 0.5;
		// app.stage.addChild(ball);
	});
}

function rotateBalls() {
	// app.stage.children[0].x += 1;
	app.stage.children[0].rotation += 0.02;
	app.stage.children[0].children[0].rotation -= 0.03;
}

/*****************************
	spritesheet animation example
*****************************/

function addExplodingBall(resources) {
	let ball = new PIXI.Sprite(resources.ball.texture);
	ball.x = 400;
	ball.y = 300;
	ball.anchor.x = ball.anchor.y = 0.5;

	ball.interactive = true;
	ball.on("pointerdown", explodeOnTouch);

	app.stage.addChild(ball);
}

function explodeOnTouch(e) {
	let boom = new PIXI.extras.AnimatedSprite(explosionSequence);

	app.stage.addChild(boom);
	boom.loop = false;
	boom.anchor.x = boom.anchor.y = 0.5;
	boom.x = e.data.global.x;
	boom.y = e.data.global.y;

	boom.onComplete = () => onExplodeComplete(boom);
	boom.play();
}

function onExplodeComplete(boom) {
	app.stage.removeChild(boom);
}

/*****************************
	whack a mole game
*****************************/

function setupGame(resources) {

	for (let i = 0; i < 10; i++) {
		let newPenguin = new PIXI.Sprite(resources.penguin.texture);
		newPenguin.x = 50 + (Math.random() * 700);
		newPenguin.y = 50 + (Math.random() * 500);
		newPenguin.interactive = true;
		newPenguin.exploded = false;
		newPenguin.on("pointerdown", (e) => explodePenguin(e, newPenguin));

		penguins.push(newPenguin);

		app.stage.addChild(newPenguin);
	}

	// begin game loop
	popCycle();
}

function explodePenguin(e, peng) {
	console.log(peng);

	// disable penguin
	peng.visible = false;
	peng.exploded = true;
	let boom = new PIXI.extras.AnimatedSprite(explosionSequence);

	app.stage.addChild(boom);
	boom.loop = false;
	boom.anchor.x = boom.anchor.y = 0.5;
	boom.x = e.data.global.x;
	boom.y = e.data.global.y;

	boom.onComplete = checkForWin;
	boom.play();
}

function checkForWin() {
	for (let i = 0; i < penguins.length; i++) {
		if (penguins[i].exploded === false) {
			// found an unexploded penguin, exit
			return;
		}
	}

	didWin = true;
	alert("You win!");
}

function popCycle() {
	if (didWin) {
		return;
	}

	for (let i = 0; i < penguins.length; i++) {
		if (penguins[i].exploded === true) {
			continue;
		} else if (Math.random() > 0.5) {
			penguins[i].visible = true;
		} else {
			penguins[i].visible = false;
		}
	}

	setTimeout(popCycle, 1000);
}

function update(e) {
	// rotateBalls();
}

window.onload = function() {
	

	loadAssets();
}
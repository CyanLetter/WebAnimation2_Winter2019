const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
// for single dot
let dotData = {
	x: 0,
	y: 300,
	vX: 5,
	vY: 3
};

// for particle system
let particles = [];
let distanceLimit = 100;

function drawDot() {
	ctx.fillStyle = "#0000ff";
	ctx.beginPath();
	ctx.arc(dotData.x, dotData.y, 5, 0, 6.28);
	ctx.fill();
}

function updateDot() {
	drawDot();

	dotData.x += dotData.vX;
	dotData.y += dotData.vY;

	// handle x velocity
	if (dotData.x > 800 && dotData.vX > 0) {
		// moving right, offscreen
		dotData.vX *= -1;
	} else if (dotData.x < 0 && dotData.vX < 0) {
		// moving left, offscreen
		dotData.vX *= -1;
	}

	// handle y velocity
	if (dotData.y > 600 && dotData.vY > 0) {
		// moving down, offscreen
		dotData.vY *= -1;
	} else if (dotData.y < 0 && dotData.vY < 0) {
		// moving up, offscreen
		dotData.vY *= -1;
	}
}

function generateParticles(count) {
	// create a bunch of particle data
	for (let i = 0; i < count; i++) {
		let newParticle = {
			x: Math.floor(Math.random() * 800),
			y: Math.floor(Math.random() * 600),
			vX: Math.floor(Math.random() * 4) - 2,
			vY: Math.floor(Math.random() * 4) - 2
		}
		particles.push(newParticle);
	}
}

function updateParticles() {
	for (let i = 0; i < particles.length; i++) {
		let p = particles[i];
		p.x += p.vX;
		p.y += p.vY;
		checkBoundaries(p);
		drawParticle(p.x, p.y);
		connectToOtherParticles(p);
	}
}

function checkBoundaries(particle) {
	// handle x velocity
	if (particle.x > 800 && particle.vX > 0) {
		// moving right, offscreen
		particle.vX *= -1;
	} else if (particle.x < 0 && particle.vX < 0) {
		// moving left, offscreen
		particle.vX *= -1;
	}

	// handle y velocity
	if (particle.y > 600 && particle.vY > 0) {
		// moving down, offscreen
		particle.vY *= -1;
	} else if (particle.y < 0 && particle.vY < 0) {
		// moving up, offscreen
		particle.vY *= -1;
	}
}

function drawParticle(x, y) {
	// black particles
	ctx.fillStyle = "#000000";

	// semi-transparent
	// ctx.fillStyle = "rgba(255, 0, 255, 0.2)";

	// experiment with composite operations
	// ctx.globalCompositeOperation = "difference";
	// ctx.fillStyle = "rgba(255, 255, 255, 1)";
	
	ctx.beginPath();
	// dots
	ctx.arc(x, y, 3, 0, 6.28);
	// big circles
	// ctx.arc(x, y, 50, 0, 6.28);
	ctx.fill();
}

function connectToOtherParticles(currentParticle) {
	// this is hugely inefficient to run for all particles every time
	// we are doing it this way for simplicity
	for (let i = 0; i < particles.length; i++) {
		let p = particles[i];
		if (p === currentParticle) {
			continue;
		}

		let dist = distance(currentParticle, p);
		if (dist > distanceLimit) {
			// don't connect to particles that are too far away
			continue;
		}

		// for basic solid lines
		// ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";

		// calculate alpha based on distance
		let alpha = 0.5 * (1 - (dist / distanceLimit));
		// black line with alpha
		// ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
		// randomized color line with alpha
		ctx.strokeStyle = "rgba(" + (i * 2) + ", 0, " + (255 - (i * 2)) + ", " + alpha + ")";

		ctx.beginPath();
		ctx.moveTo(currentParticle.x, currentParticle.y);
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
	}
}

function distance(a, b) {
	var dX = a.x - b.x;
	var dY = a.y - b.y;

	return Math.sqrt( dX*dX + dY*dY );
}

function update(e) {
	// clear every frame
	// ctx.clearRect(0, 0, 800, 600);

	// fade out and make a trail behind moving objects
	ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
	ctx.fillRect(0, 0, 800, 600);

	// bounce dot around screen
	// updateDot();

	// loop through all particles, change positions and draw
	updateParticles();
	
	// loop indefinitely
	requestAnimationFrame(update);
}

window.onload = function(){
	// generateParticles(5000);

	generateParticles(100);

	// start update loop
	requestAnimationFrame(update);
}


// https://github.com/JunoNgx/crisp-game-lib-tutorial as reference

title = "Prototype 2";

description = `One Button.`;

const G = {
	WIDTH: 200,
	HEIGHT: 150,
	SCROLLSPEED: 1.0,
};

characters = [
	`
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	LLLLLLLL
	`
	// ,
	// `
	// lll
	// lll
	// lll
  	// `
	];

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	theme: "dark",
	isReplayEnabled: true
};

/**
 * @typedef {{
 * pos: Vector,
 * }} Cursor
 */

/**
 * @type { Cursor }
 */
let cursor;

/**
 * @typedef {{
 * pos: Vector,
 * color: Color,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * color: Color
 * }} Box
 */

/**
 * @type { Box [] }
 */
let Boxes;

/**
 * @typedef {{
 * pos: Vector
 * color: Color
 * }} ColorButton
 */

/**
 * @type { ColorButton [] }
 */
let ColorButtons;


/**
 * @typedef {{
 * pos: Vector
 * color: Color
 * }} Obstacle
 */

/**
 * @type { Obstacle [] }
 */

// Top level var declarations
let Obstacles;
let obstacleSpawnTimer;

function update() {
	score += 1;
	if (!ticks) {
		start();
	}
	player_update();
	box_update();
	obstacle_update();
	button_update();
	cursor_update();
}

function start(){
	score = 0;
	player = {
		pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
		color:"red"
	};
	cursor = {
		pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
	};
	Obstacles = [];
	Boxes = [];

	ColorButtons = [];
	ColorButtons.push({
		pos: vec(G.WIDTH / 3, G.HEIGHT/2 - 40),
		color: "blue"
	});
	ColorButtons.push({
		pos: vec(G.WIDTH / 2, G.HEIGHT/2 - 40),
		color: "green"
	});
	ColorButtons.push({
		pos: vec(2 * G.WIDTH / 3, G.HEIGHT/2 - 40),
		color: "red"
	});

	obstacleSpawnTimer = 200;
}

function gameEnd(){
	end();
	
	// TODO: find some sound to play on death
	play("powerUp");
}

function cursor_update(){
	 // Updating and drawing the cursor
	 cursor.pos = vec(input.pos.x, input.pos.y);
	 cursor.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
	 color ("black");
	 let visualPos = vec(cursor.pos.x - 1, cursor.pos.y - 1)
	 rect(visualPos, 3,3);

	 console.log(player.color == "red")
	 if (input.isJustPressed && player.color == "red"){
		console.log("swap from red to green");
		player.color = "green";
	 }
	 else if (input.isJustPressed && player.color == "green"){
		console.log("swap from green to blue");
		player.color = "blue";
	 }
	 else if (input.isJustPressed && player.color == "blue"){
		console.log("swap from blue to red");
		player.color = "red";
	 }
}

function player_update(){
    color (player.color);
    char("a", player.pos);
}

function box_update(){
	// Time to spawn new box
    if (ticks % 10 == 0) {
        // Create the box
        Boxes.push({
            pos: vec(G.WIDTH + 10, player.pos.y + 10),
			color: Boxes.length % 2 == 0 ? "light_yellow" : "light_black"
        });
    }

	// Updating and drawing boxes
    Boxes.forEach((b) => {
        // Move the boxes backwards
        b.pos.x -= G.SCROLLSPEED;
        
        // Drawing
        color(b.color);
        box(b.pos, 10);
    });

	// Time to spawn new obstacle
	if (ticks % obstacleSpawnTimer == 0) {
		// Create the obstacle
		Obstacles.push({
			pos: vec(G.WIDTH + 10, player.pos.y - 10),

			// TODO: more advanced color randomization
			color: Obstacles.length % 2 == 0 ? "red" : "green"
		});
	}
}

function obstacle_update(){
	// Updating and drawing boxes

	// Decrement timer to gradually increase difficulty
	if (ticks % 5 == 0){
		obstacleSpawnTimer -= 1;
	}

	// Minimum timer
	if (obstacleSpawnTimer < 100) {
		obstacleSpawnTimer = 100;
	}

	Obstacles.forEach((o) => {
		// Drawing
		color(o.color);
		let isCollidingWithPlayer = rect(o.pos, 10, 30).isColliding.char.a;

		// Move the obstacles backwards
		o.pos.x -= G.SCROLLSPEED;


        if (isCollidingWithPlayer && o.color != player.color) { // If collision happens AND colors are mismatching, DIE
			gameEnd();
        }
		

	});
}

function button_update(){
	ColorButtons.forEach((b) => {
		// Drawing
		color(b.color);
		let r = rect(b.pos, 10, 10);

		// let isCollidingWithCursor = r.isColliding
		// // TODO: this color switching does not work aaaaaa
		// console.log("colliding: "+ isCollidingWithCursor)
        // if (isCollidingWithCursor && input.isPressed) {
		// 	console.log("SWAP TO: " + b.color);

		// 	player.color = b.color
        // }
	});
}

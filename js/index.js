// player coordinates
var playerX = 300;
var playerY = 400;
// size of player
var playerSize = 10;
// the step size for players
var playerStep = 8;
// player color
var playerColor = "#ff0000";
// the step size for bots
var botStep = 3;
// size of the bots
var botSize = 10;
// the time gap between each bot spawn
var botGenerationInterval = 3000;
// array of all bots
var bots = [];


$(document).ready(function(){

	var gameCanvas = $("#game-canvas").get(0).getContext("2d");
	
	// control the player
	$(document).keydown(function(event){
  		switch(event.which)
  		{
  			// left
  			case 37:
  				playerX -= playerStep;
  				break;

  			// up
  			case 38:
  				playerY -= playerStep;
  				break;

  			// right
  			case 39:
  				playerX += playerStep;
  				break;

  			// down
  			case 40:
  				playerY += playerStep;
  				break;
  		}
  		event.preventDefault();
  	});

	// update and draw the canvas
	var fps = 30;
	graphicsInterval = setInterval(function(){
		update(gameCanvas);
		draw(gameCanvas);
	}, 1000/fps);

	// generate new bots
	botCreationInterval = setInterval(addBot, botGenerationInterval);

	$("#restart").click(function(){
		window.location.reload();
	})

});


// adds a bot to the canvas
function addBot()
{
	var colors = ["#ff0000", "#1B7108", "#1C3D71"];
	var bot = {
		color : colors[Math.floor(Math.random() * 3)],
		x : 0,
		y : 0
	};
	bot.x = Math.floor(Math.random() * 501 + 50);
	bots.push(bot);
	console.log(bots.length);
}


// detects a collision between player and bot
function collisionDetected(botX, botY)
{
	return ((Math.abs(botX - playerX) <= (playerSize + botSize)) && (Math.abs(botY - playerY) <= (playerSize + botSize)))

}


// detects if bot is out of bounds
function botOutOfBoundary(botX, botY)
{
	return (botY > 500);
}


// updates the game state
function update(gameCanvas)
{
	var newBots = [];
	$.each(bots, function(index){
		if(collisionDetected(bots[index].x, bots[index].y))
		{
			if(bots[index].color == playerColor)
				playerSize += playerStep;
			else
				playerSize -= playerStep;

		}
		else if (botOutOfBoundary(bots[index].x, bots[index].y)) 
		{
			// ignore the bot
		}
		else
		{
			bots[index].y += botStep;
			newBots.push(bots[index]);
		}
	});
	bots = newBots;

	// check if game ended
	if (playerSize <= 0)
	{
		// reset player size
		playerSize = 0;

		// stop interval calls
		clearInterval(graphicsInterval);
		clearInterval(botCreationInterval);
		
		// give restart option
		$("#game-over-display").css("visibility", "visible");
		$("#restart").css("visibility", "visible");

	}
}
  	

// redraw the canvas with new state
function draw(gameCanvas)
{
	// redraw the canvas
	gameCanvas.clearRect(0, 0, 600, 500);

	// draw the player
	gameCanvas.beginPath();
	gameCanvas.arc(playerX, playerY, playerSize, 0, 2 * Math.PI);
	gameCanvas.fillStyle = playerColor;
	gameCanvas.fill();

	// draw all the bots
	$.each(bots, function(index){
		gameCanvas.beginPath();
		gameCanvas.arc(bots[index].x, bots[index].y, botSize, 0, 2 * Math.PI);
		gameCanvas.fillStyle = bots[index].color;
		gameCanvas.fill();

	});
}





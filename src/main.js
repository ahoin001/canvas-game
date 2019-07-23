/*******************************************
 *  Prepare canvas context
*******************************************/

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

/*******************************************
 *  Create Image instances for use
*******************************************/

let tile = new Image();

/*******************************************
 *  Global Variables
*******************************************/
var gameover = false;
var intervalVar;
var foodList = [];
var tileList = [];

// Locations that food will drop from on X
//TODO Come back and do randdom drop after making sure everything works
var foodDropXPositions = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

// Game Logic starts here

tile.onload = function () {

    let player = new Catcher();

    // todo Might be able to simplify
    /*******************************************
    * MOVEMENT
    *******************************************/

    document.onkeydown = function (e) {

        // if player position is not left of left border of canvas, allow move
        if (e.keyCode === 37 && player.x > 0) {
            player.speed = -5;

            // switch to movement animation
            player.image.src = "../images/catcher4.png";
            player.leftPressed = true;
        }

        // if player position is not right of right border of canvas, allow move
        if (e.keyCode === 39 && player.x < 500 - player.width) {
            player.speed = 5;
            player.image.src = "../images/catcher4.png";
            player.rightPressed = true;
        }
    }

    document.onkeyup = function (e) {
        if (e.keyCode === 37) {

            // switch to Still animation
            player.image.src = "../images/catcher2.png";
            player.leftPressed = false;
        }
        if (e.keyCode === 39) {
            player.image.src = "../images/catcher2.png";
            player.rightPressed = false;
        }
    }

    const updatePlayerPosition = () => {

        if (player.leftPressed && player.x > 0) {
            player.x += player.speed;
        }
        if (player.rightPressed && player.x < 500 - player.width) {
            player.x += player.speed;
        }
        // todo if i a
        if (player.y > 500) {

            // player.y =450;
            //gameover = true;
        }
    }

    const gameOver = () => {
        console.log("game")
        ctx.save();
        // dim Canvas brush so blood is more transparent 
        ctx.globalAlpha = 0.6
        ctx.drawImage(player.endImage, 100, 100, 150, 150)

        ctx.globalAlpha = 1;
        ctx.font = "20px Roboto";
        ctx.strokeText("Game Over Slime", 180, 200);
        ctx.strokeText("Want to try Again?", 160, 250);

        ctx.restore();

        // Stop the game canvas from refreshing 
        clearInterval(intervalVar);

    }


    const updateFoodPosition = () => {

        for (const i in foodList) {

            // if food drop passes the bottom of canvas
            if (foodList[i].y > 500) {
                // remove it from list/memory
                foodList.splice(i, 0);
            }
            else {
                // each frame we redraw, move cupcake down by 3
                foodList[i].y += foodList[i].speed;
            }
        }
    }

    /**************************************************************************************
    * COLLISION FUNCTION FOR PLAYER AND FOOD
    **************************************************************************************/

    const playerAndFoodCollision = (theFood) => {

        return ((theFood.x < player.x + player.width)
            && (player.x < theFood.x + theFood.width)
            && (theFood.y < player.y + player.height)
            && (player.y < theFood.y + theFood.height))

    }

    const tileAndFoodCollision = (theFood, theTile) => {

        return ((theFood.x < theTile.x + theTile.width)
            && (theTile.x < theFood.x + theFood.width)
            && (theFood.y < theTile.y + theTile.height)
            && (theTile.y < theFood.y + theFood.height))

    }


    const tileAndPlayerCollision = (theTile) => {

        return ((player.x <= theTile.x + theTile.width)
            && (theTile.x <= player.x + player.width)
            && (player.y + player.height <= theTile.y)
        )

    }


    const updateCanvas = () => {

        // Clear the canvas 
        ctx.clearRect(0, 0, 500, 500);

        //draw background
        ctx.drawImage(player.background, 0, 0, 500, 500);

        //draw player
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

        // food timer to time drops
        player.foodTimer++;

        console.log('before if');
        if (gameOver === true) {
            console.log('before func');
            gameOver();
            console.log('after func');
        }

        // when 100ms pass
        if (player.foodTimer > 100) {

            // Get random index to select from xpositions array
            let randomIndex = Math.floor(Math.random() * Math.floor(10));

            // Each update, make a new food object that will have a random x position to fall from 
            let aFood = new Food(foodDropXPositions[randomIndex]);

            // add the object to array to be spawned
            foodList.push(aFood);

            // because every 100ms we will drop a food, set this back to 0 after each drop
            player.foodTimer = 0;
        }

        //draw each tile
        for (let i in tileList) {

            // draw each tile from the array we created earlier
            ctx.drawImage(tileList[i].image, tileList[i].x, tileList[i].y, tileList[i].width, tileList[i].height);

        }

        //draw each food
        for (let i in foodList) {
            // draw each food from the previous array
            ctx.drawImage(foodList[i].image, foodList[i].x, foodList[i].y, foodList[i].width, foodList[i].height);

        }


        // before updating player position, make sure they are safe on tile
        for (let i in tileList) {

            // if player is on tile, they are safe
            if (tileAndPlayerCollision(tileList[i])) {
                // player is safe as long as they are on tile
                player.safe = true;
                console.log("------------------PLAYER IS SAFE");
                break;

            }

            //if not on tile set safe to false
            player.safe = false;
        }

        //if player is not safe (Not on tile) They fall down canvas
        if (player.safe === false) {
            player.image.src = "../images/catcher3.png";
            player.y += 5;

            if (player.y >= 500) {
                //gameover = true;
            }
        }


        // Update player position on before next canvas redraw
        updatePlayerPosition();

        // Before Updating food position again, check if any of the food was touched by player
        for (let i in foodList) {
            if (playerAndFoodCollision(foodList[i])) {
                console.log("COLLISION");
                // add 1 to score
                player.score += 1;

                //todo come up with level increase logic instead of decrease
                // whenever score is divisible by 2, increase level (by decreasing, i could not figure another way to do this yet )
                if (player.score % 2) {
                    player.level--;
                }

                foodList.splice(i, 1);
            }
        }

        // Before Updating food position again, check if any of the food was touched by tile
        // for each food

        //console.log(foodList); One foood in array each time we arrive at this loop

        for (let i in foodList) {

            // test if it touched any tile 
            for (let j in tileList) {

                //if it touched a tile then remove the tile
                if (tileAndFoodCollision(foodList[i], tileList[j])) {
                    //console.log("TILE COLLISION");
                    tileList.splice(j, 1);
                }

            }

            // Keep looping 

        }


        //  update food drops by redrawing them lower every redraw
        updateFoodPosition();


    }


    const startGame = () => {
        //TODO Can i delete these since these are values declared globally?
        score = 0;
        level = 100;


        //TODO If tiles don't work come here
        // Create 10 tile objects into array
        for (let i = 0; i <= 9; i++) {
            // Create a new tile in each loop iteration
            let aTile = new Tile();

            //Each tile will have width of 50 and placed beside each other on x axis (i*50)
            aTile.x = i * 50;
            aTile.y = 400;

            tileList.push(aTile);
        }

        // Keep Updating board every 10ms , for 100 fps. 
        intervalVar = setInterval(updateCanvas, 10);


    }


    startGame();

}
tile.src = "images/tile.png"

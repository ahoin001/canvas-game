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
var intervalVar;
var foodList = [];
var tileList = [];

// Locations that food will drop from on X, hey are above each tile
var foodDropXPositions = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

// Game Logic starts here

tile.onload = function () {

    // prepare objects
    let player = new Catcher();
    // let oneFood = new Food();



    //ctx.drawImage(player.background, 0, 0, 500, 500);
    ctx.font = "40px Calibri";
    ctx.strokeText("Click anywhere to start! ", 50, 200);




    // give canvas click detection
    document.querySelector('canvas').onmousedown = function () {

        // if  not on game over
        if (player.gameOver === false) {
            // 
            clearInterval(intervalVar);
            // start a new game
            startGame();
        }

        // // if game over, 
        if (player.gameOver === true) {
            console.log('RUNNININIFNIFNINFINFINIF');
            // clear canvas
            ctx.clearRect(0, 0, 500, 500);
            //ctx.drawImage(player.background, 0, 0, 500, 500);

            ctx.font = "40px Calibri";
            ctx.strokeText("Click whenever you're ready ! ", 30, 200);

            player.gameOver = false;
            startGame();

        }


    }

    // todo Might be able to simplify
    /*******************************************
    * MOVEMENT
    *******************************************/

    document.onkeydown = function (e) {

        // if player position is not left of left border of canvas, allow move
        if (e.keyCode === 37 && player.x > 0) {
            player.speed = -5;

            // switch to movement animation
            player.image.src = "./images/catcher4.png";
            player.leftPressed = true;


        }

        // if player position is not right of right border of canvas, allow move
        if (e.keyCode === 39 && player.x < 500 - player.width) {
            player.speed = 5;
            player.image.src = "./images/catcher4.png";
            player.rightPressed = true;
        }

        // if up is pressed, and player not in air and on on tiles
        if (e.keyCode === 38 && !player.onAir < 500 && player.y === 350) {

            player.jump = 100;
            player.onAir = true;
            // player.image.src = "../images/catcher4.png";


        }
    }

    const jump = () => {

        if (player.jump > 0 && player.onAir) {

            // player will move up 5 pixels at a time when jumping
            player.y -= player.jumpUnit;

            player.jump -= player.jumpUnit

        }

        if (player.jump <= 0 && player.jump > -100 && player.onAir) {
            player.y += player.jumpUnit;
            player.jump -= player.jumpUnit;
        }

        if (player.jump <= -100 && player.onAir) {
            player.onAir = false;
        }

    }


    document.onkeyup = function (e) {
        if (e.keyCode === 37) {

            // switch to Still animation
            player.image.src = "./images/catcher2.png";
            player.leftPressed = false;
        }
        if (e.keyCode === 39) {
            player.image.src = "./images/catcher2.png";
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

        if (player.y > 500) {

            player.y = 500;
            player.gameOver = true;
        }

        if (player.gameOver === true) {

            gameOver();
        }

    }

    const gameOver = () => {

        console.log("game over")
        ctx.save();
        // dim Canvas brush so blood is more transparent 
        ctx.globalAlpha = 0.6
        ctx.drawImage(player.endImage, 100, 100, 300, 300)

        ctx.globalAlpha = 1;
        ctx.font = "20px Roboto";
        ctx.strokeText("Game Over Slime", 180, 200);
        ctx.strokeText("Click to start again?", 160, 250);

        ctx.restore();

        // Stop the game canvas from refreshing 
        clearInterval(intervalVar);

        //player.gameOver = false;

    }


    const updateFoodPosition = () => {

        for (const i in foodList) {

            // if food drop passes the bottom of canvas
            if (foodList[i].y > 500) {
                // remove it from list/memory
                foodList.splice(i, 0);
            }
            else {

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
        //ctx.drawImage(player.background, 0, 0, 500, 500);

        //draw player
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

        // food timer to time drops
        player.foodTimer++;


        // when 100ms pass
        if (player.foodTimer > player.level) {

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
            if (tileAndPlayerCollision(tileList[i]) || player.onAir === true) {
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
            player.image.src = "./images/catcher3.png";
            player.y += 5;

            if (player.y >= 500) {

            }
        }


        // Update player position on before next canvas redraw
        updatePlayerPosition();
        jump();

        // Before Updating food position again, check if any of the food was touched by player
        for (let i in foodList) {
            if (playerAndFoodCollision(foodList[i])) {
                console.log("COLLISION");
                // add 1 to score
                player.score += 1;

                //todo come up with level increase logic instead of decrease
                // whenever score is divisible by 2, increase level (by decreasing, i could not figure another way to do this yet )
                if (player.score % 2) {
                    player.level -= 2;

                }

                foodList.splice(i, 1);
            }
        }

        // Before Updating food position again, check if any of the food was touched by tile
        //console.log(foodList); One food in array each time we arrive at this loop
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

        /**************************************************************************************
        * Draw the Score and level
        **************************************************************************************/
        // Draw the scor
        ctx.drawImage(player.foodImage, 400, 10, 30, 30)
        ctx.font = "40px Calibri";
        ctx.strokeText(player.score, 440, 40);

        ctx.fillStyle = "white";
        ctx.strokeText("Level: " + (100 - player.level + 1), 60, 40);

        //  update food drops by redrawing them lower every redraw
        updateFoodPosition();


    }


    const startGame = () => {

        // refresh game board and player character
        player.x = 100;
        player.y = 350;
        player.safe = true;
        player.level = 100;
        player.score = 0;
        player.foodTimer = 0;
        player.gameOver = false;
        player.image.src = "./images/catcher2.png";

        foodList = [];


        ctx.clearRect(0, 0, 500, 500);

        // // Create 10 tile objects into array
        for (let i = 0; i <= 11; i++) {

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

}
tile.src = "images/tile.png"

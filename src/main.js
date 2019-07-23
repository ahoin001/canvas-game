/*******************************************
 *  Prepare canvas context
*******************************************/

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

/*******************************************
 *  Create Image instances for use
*******************************************/
let catcherAniOne = new Image();
let catcherAniTwo = new Image();
let catcherAniThree = new Image();
let catcherAniFour = new Image();
let background = new Image();
let tile = new Image();
let blood = new Image();
let food = new Image();


/*******************************************
 *  Global Variables
*******************************************/
var score = 0;
var level = 100;
var playerState = 0;
var foodTimer = 0;
var gameover = false;
var intervalVar;
var foodList = [];
var tileList = [];

// Locations that food will drop from on X
//TODO Come back and do randdom drop after making sure everything works
var foodDropXPositions = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];


// Make sure all images are loaded before doing anything 
background.onload = function () {
    blood.onload = function () {
        catcherAniOne.onload = function () {
            catcherAniTwo.onload = function () {
                catcherAniThree.onload = function () {
                    catcherAniFour.onload = function () {
                        food.onload = function () {


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

                                /*******************************************
                                * COLLISION FUNCTION FOR PLAYER AND FOOD
                                *******************************************/

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


                                const updateCanvas = () => {

                                    // Clear the canvas 
                                    ctx.clearRect(0, 0, 500, 500);

                                    //draw background
                                    ctx.drawImage(player.background, 0, 0, 500, 500);

                                    //draw player
                                    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

                                    // food timer to time drops
                                    foodTimer++;

                                    // when 100ms pass
                                    if (foodTimer > 100) {

                                        // Get random index to select from xpositions array
                                        let randomIndex = Math.floor(Math.random() * Math.floor(10));

                                        // Each update, make a new food object that will have a random x position to fall from 
                                        let aFood = new Food(foodDropXPositions[randomIndex]);

                                        // add the object to array to be spawned
                                        foodList.push(aFood);

                                        // because every 100ms we will drop a food, set this back to 0 after each drop
                                        foodTimer = 0;
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


                                    // Update player position on before next canvas redraw
                                    updatePlayerPosition();

                                    // Before Updating food position again, check if any of the food was touched by player
                                    for (let i in foodList) {
                                        if (playerAndFoodCollision(foodList[i])) {
                                            console.log("COLLISION");
                                            foodList.splice(i, 1);
                                        }
                                    }

                                    for (let i in foodList) {

                                        for (let j in tileList) {

                                            if (tileAndFoodCollision(foodList[i], tileList[j])) {
                                                console.log("TILE COLLISION");
                                                tileList.splice(j, 1);
                                            }

                                        }

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
                        }
                        food.src = "images/food.png"
                    }
                    catcherAniFour.src = "images/catcher4.png"
                }
                catcherAniThree.src = "images/catcher3.png"
            }
            catcherAniTwo.src = "images/catcher2.png"
        }
        catcherAniOne.src = "images/catcher1.png"

    }
    blood.src = "images/blood.png";
}
background.src = "images/background.jpg";



/*******************************************
 *  Prepare canvas context
*******************************************/
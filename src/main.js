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
var foodDrop = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];


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
                                        player.leftPressed = true;
                                    }

                                    // if player position is not right of right border of canvas, allow move
                                    if (e.keyCode === 39 && player.x < 500 - player.width) {
                                        player.speed = 5;
                                        player.rightPressed = true;
                                    }
                                }

                                document.onkeyup = function (e) {
                                    if (e.keyCode === 37)  {

                                        player.leftPressed = false;
                                    }
                                    if (e.keyCode === 39) {

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


                                const updateCanvas = () => {

                                    // Clear the canvas 
                                    ctx.clearRect(0, 0, 500, 500);

                                    //draw background
                                    ctx.drawImage(player.background, 0, 0, 500, 500);

                                    //draw player
                                    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

                                    //draw each tile
                                    for (let i = 0; i < tileList.length; i++) {
                                        //TODO Maybe I can do both in for loop jobs in one loop? Come back and test
                                        // draw each tile from the previous array
                                        ctx.drawImage(tileList[i].image, tileList[i].x, tileList[i].y, tileList[i].width, tileList[i].height);

                                    }

                                    // Update player position on every redraw
                                    updatePlayerPosition();

                                    /*******************************************
                                    *  Make player blink
                                    *******************************************/

                                    // starts at 0, so when character is spawned
                                    if (playerState === 0) {

                                        setTimeout(function () {

                                            // draw character with open eyes 
                                            player.image.src = "../images/catcher2.png";
                                            ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

                                            // change value used to detect player img
                                            playerState = 1;
                                        }, 900);


                                    }
                                    else {

                                        setTimeout(function () {

                                            // change to closed eyes img
                                            player.image.src = "../images/catcher1.png";
                                            ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

                                            // change value used to detect player img
                                            playerState = 0;
                                        }, 900);

                                    }


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

                                        //Each tile will have width of 50 and placed 5p px aprt on x axis (i*50)
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
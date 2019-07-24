class Catcher {

    constructor() {
        
        /// position and dimensions
        this.x = 100;
        this.y = 350;
        this.width = 30;
        this.height = 50;

        // movement
        this.jump = 0;
        this.jumpUnit = 5;
        this.onAir = false;
        this.speed = 0;
        this.rightPressed = false;
        this.leftPressed = false;
        this.gravity = 10;

        // game logic
        this.safe = true;
        this.level = 100;
        this.score = 0;
        this.foodTimer = 0;
        this.gameOver = false;

        // initial images
        this.image = new Image();
        this.image.src = "../images/catcher2.png";

        // game over screen image
        this.endImage = new Image();
        this.endImage.src = "../images/blood.png";

    }

}
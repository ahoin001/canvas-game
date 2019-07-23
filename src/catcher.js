class Catcher {

    constructor() {
        
        this.x = 100;
        this.y = 350;
        this.width = 30;
        this.height = 50;
        this.jump = 0;
        this.jumpUnit = 5;
        this.onAir = false;
        this.speed = 0;
        this.rightPressed = false;
        this.leftPressed = false;
        this.gravity = 10;
        this.safe = true;

        this.image = new Image();
        this.image.src = "../images/catcher2.png";
        
        this.background = new Image();
        this.background.src = "../images/background.jpg";

    }

}
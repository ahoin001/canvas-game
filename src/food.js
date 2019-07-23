class Food {

    constructor(xPosition) {
        this.width = 50;
        this.height = 50;
        this.speed = 3;

        // will be random number passed in
        this.x = xPosition;
       
        this.y = 0;

        this.image = new Image();
        this.image.src = "../images/food.png";
    }


}
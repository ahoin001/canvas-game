let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let catcherAniOne = new Image();
let catcherAniTwo = new Image();
let catcherAniThree = new Image();
let catcherAniFour = new Image();
let background = new Image();
let blood = new Image();
let tile = new Image();
let food = new Image();


background.onload = function() {
    blood.onload = function() {
        catcherAniOne.onload = function() {
            catcherAniTwo.onload = function() {
                catcherAniThree.onload = function() {
                    catcherAniFour.onload = function() {
                        food.onload = function() {
                            tile.onload =function() {
                                console.log('All images loaded');
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
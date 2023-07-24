// <6>
class Player {
    constructor(gameScreen, left, top, width, height, imgSrc) {
        this.gameScreen = gameScreen;

        // horizontal position of the player (via position absolute)
        this.left = left;

        // vertical position of the player (via position absolute)
        this.top = top;

        // width of the player
        this.width = width;

        // height of the player
        this.height = height;

        // direction of the player's moving horizontally
        this.directionX = 0;

        // direction of the player's moving vertically
        this.directionY = 0;

        // Limit the vertical movement within half of the screen's height
        this.bottomBoundary = 150;

        // create the image tag for the player, define src and do default styling
        this.element = document.createElement("img");
        this.element.src = imgSrc;
        this.element.style.position = "absolute";

        // set up default element's properties
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;

        // Append player to the game screen
        this.gameScreen.appendChild(this.element);
    }
    // </6>

    // <7> boat move
    move() {
        //update player's boat position based on directionX and direction Y
        this.left += this.directionX;
        this.top += this.directionY;

        // ensure the player's boat stays inside the game's screen

        // handle left and right borders
        // .offSetWidth() returns the width of an element in data tyoe number

        // right side
        if (this.left + this.width > this.gameScreen.offsetWidth) {
            this.left = this.gameScreen.offsetWidth - this.width;
        }
        //  This condition checks if the right side of the boat (calculated as this.left + this.width, this.width is the width of the boat) exceeds the width of the game screen (this.gameScreen.offsetWidth). If it does, the boat is positioned at the right edge of the game screen to prevent it from moving beyond that point.

        // left side
        else if (this.left < 0) {
            this.left = 0;
        }
        // This condition checks if the left side of the boat (this.left) goes beyond the left edge of the game screen (less than 0). If it does, the boat is positioned at the left edge of the game screen to prevent it from moving beyond that point.

        // handle top and bottom borders

        // bottom
        if (this.top + this.height > this.gameScreen.offsetHeight) {
            this.top = this.gameScreen.offsetHeight - this.height;
        }
        // This condition checks if the bottom side of the boat (this.top + this.height, where height is the height of the boat) exceeds the height of the game screen (this.gameScreen.offsetHeight). If it does, the boat is positioned at the bottom edge of the game screen to prevent it from moving beyond that point.
        else if (this.top < this.bottomBoundary) {
            this.top = this.bottomBoundary;
        }
        // This condition checks if the top side of the boat (represented by this.top) goes below a specified bottom boundary (this.bottomBoundary). If it does, the boat is positioned at the bottom boundary, restricting it from moving further downward.

        this.updatePosition();
    }
    // </7>

    // <8> update the position of the boat in the css
    updatePosition() {
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

    didCollide(obstacle) {
        // .getBoundingClientRect() gives info about top, left, right, bottom, width, height
        const playerRect = this.element.getBoundingClientRect();
        const obstacleRect = obstacle.element.getBoundingClientRect(); // These lines calculate the bounding rectangles of the player's boat and the given obstacle, respectively. The getBoundingClientRect() method provides information about the position and size of an HTML element on the screen. It returns an object containing properties such as top, left, right, bottom, width, and height that define the boundaries of the element's rectangular box in relation to the viewport.

        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacle.top
        ) {
            return true;
        } else {
            return false;
        }
    }
    // </8>
}

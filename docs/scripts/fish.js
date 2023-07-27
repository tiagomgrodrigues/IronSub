// <12>
class Fish {
    constructor(gameScreen) {
        this.gameScreen = gameScreen;

        this.left = this.gameScreen.offsetWidth;
        this.top =
            Math.floor(
                Math.random() * (this.gameScreen.offsetHeight / 2 + 50)
            ) + 110;
        // + 150 means that is 150 from the top to the bottom
        this.width = 40;
        this.height = 40;

        // create the HTML element and default styling
        this.element = document.createElement("img");
        this.element.src = "docs/images/fish.png";
        this.element.style.position = "absolute";
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.width = `${this.width}px`;

        this.gameScreen.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

    move() {
        // Drop the obstacle 3px to the bottom
        this.left -= 3;
        this.updatePosition();
    }
}
// </12>

class Skeleton {
    constructor(gameScreen, speed) {
        this.gameScreen = gameScreen;
        this.speed = speed;

        this.left = this.gameScreen.offsetWidth;
        this.top =
            Math.floor(
                Math.random() * (this.gameScreen.offsetHeight / 2 + 60)
            ) + 110;
        this.width = 30;
        this.height = 30;

        // create tge HTML element and default styling
        this.element = document.createElement("img");
        this.element.src = "docs/images/fishSkeleton.png";
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
        this.left -= this.speed;
        this.updatePosition();
    }
}

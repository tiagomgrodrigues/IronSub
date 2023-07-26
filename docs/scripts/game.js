class Game {
    // stores all properties to the future objects
    constructor() {
        // get all the possible screens
        // game-screen and game-end are initially hodden.
        this.startScreen = document.getElementById("game-intro");
        this.gameScreen = document.getElementById("game-screen");
        this.gameEndScreen = document.getElementById("game-end");
        this.statusScreen = document.getElementById("status");

        // style for the game board
        this.width = 900; /* width of the animation */
        this.height = 410;

        this.gameVersion = "single";

        // property of the player
        this.player = new Player(
            this.gameScreen,
            100 /* x position of the player */,
            200 /* y position of the player */,
            60 /* length of the player */,
            30 /* width of the player */,
            "docs/images/sub.png"
        );

        this.player2 = null;

        // fishes and hearts
        this.fishes = [];

        this.hearts = [];

        // obstacles
        this.rocks = [];

        this.skeletons = [];

        // flag to give info about process of pushing a fish
        this.isPushingFish = false;

        // flag to give info about process of pushing a heart
        this.isPushingHeart = false;

        // flag to give info about process of pushing an obstacle
        this.isPushingRock = false;
        this.isPushingSkeleton = false;

        // gameOver flag
        this.gameOver = false;
    }

    // <4> start() Initializes the game by executing the following sequence of steps when called:
    start() {
        // set the height and width of the game screen
        this.gameScreen.style.height = `${this.height}px`;
        this.gameScreen.style.width = `${this.width}px`;

        // hide the start screen
        this.startScreen.style.display = "none";
        // Hide status
        this.statusScreen.style.display = "none";
        // show the status
        this.statusScreen.style.display = "flex";

        // show the game screen
        this.gameScreen.style.display = "flex";
        if (this.gameVersion == "multiplayer") {
            this.player2 = new Player(
                this.gameScreen,
                100 /* x position of the player */,
                100 /* y position of the player */,
                60 /* length of the player */,
                30 /* width of the player */,
                "docs/images/sub2.png"
            );
        }

        if (this.gameVersion == "multiplayer") {
            // score
            this.score = 0;
            // lives
            this.lives = 6;
        } else {
            // score
            this.score = 0;
            // lives
            this.lives = 3;
        }

        // start the game loop
        this.gameLoop();
    }

    // gameLoop() Runs the game loop by executing the following steps:
    gameLoop() {
        // console.log("Game Loop");

        // Check if the game is over to interrupt the game loop
        if (this.gameIsOver) {
            return;
        }

        this.update(); /* updates the game state, such as the position of game objects, their interactions, and any other game logic that needs to be recalculated on each frame. */

        this.player.move(); /* updates the position of the player */

        // requestAnimationFrame is a JS method that updates information of your screen
        window.requestAnimationFrame(() => this.gameLoop());
    }

    // <13> update() This method is responsible for updating the game state during each loop iteration. For now, we will leave it empty and come back to implement it in the upcoming iterations.
    update() {
        // Bonus: scores and lives
        let score = document.getElementById("score");
        let lives =
            document.getElementById(
                "lives"
            ); /* These lines fetch the HTML elements with IDs "score" and "lives" from the document */

        score.innerHTML = this.score;
        lives.innerHTML =
            this.lives; /* These lines update the contents (innerHTML) of the "score" and "lives" elements with the current values of this.score and this.lives, respectively. */

        if (this.lives === 0) {
            this.endGame();
        }

        // PLAYER 1 AND PLAYER 2
        if (this.player2) {
            // Move player 2
            this.player2.move();
            // Move player 1
            this.player.move();

            // FISHES
            for (let i = 0; i < this.fishes.length; i++) {
                const fish = this.fishes[i];
                fish.move();

                // check if the player collided with the object
                if (
                    this.player.didCollide(fish) ||
                    this.player2.didCollide(fish)
                ) {
                    // remove the obstacle from the DOM
                    fish.element.remove();
                    // remove obstacle from the array
                    this.fishes.splice(i, 1);
                    // remove player's live by 1
                    this.score++;
                }

                // check if the obstacle is off the screen (at the left)
                else if (fish.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    this.lives--;

                    // remove the obstacle from the HTML
                    fish.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.fishes.splice(i, 1);
                }
            }

            // Update FISHES
            if (!this.fishes.length && !this.isPushingFish) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                let timeFishes = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.fishes.push(new Fish(this.gameScreen));
                    this.isPushingFish = false;
                }, timeFishes); /* 0.5 seconds */
            }

            // HEARTS
            for (let i = 0; i < this.hearts.length; i++) {
                const heart = this.hearts[i];
                heart.move();

                // check if the player collided with the object
                if (
                    this.player.didCollide(heart) ||
                    this.player2.didCollide(heart)
                ) {
                    // remove the obstacle from the DOM
                    heart.element.remove();
                    // remove obstacle from the array
                    this.hearts.splice(i, 1);
                    // remove player's live by 1
                    this.lives++;
                }

                // check if the obstacle is off the screen (at the left)
                else if (heart.left < 0) {
                    // remove the obstacle from the HTML
                    heart.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.hearts.splice(i, 1);
                }
            }

            // Update obstacles
            if (!this.hearts.length && !this.isPushingHeart) {
                this.isPushingHeart = true;
                setTimeout(() => {
                    this.hearts.push(new Heart(this.gameScreen));
                    this.isPushingHeart = false;
                }, 15000); /* 0.5 seconds */
            }

            // ROCKS
            for (let i = 0; i < this.rocks.length; i++) {
                const rock = this.rocks[i];
                rock.move();

                // check if the player collided with the rock
                if (
                    this.player.didCollide(rock) ||
                    this.player2.didCollide(rock)
                ) {
                    // remove the rock from the DOM
                    rock.element.remove();
                    // remove rock from the array
                    this.rocks.splice(i, 1);
                    // remove player's live by 1
                    this.lives--;
                }

                // check if the obstacle is off the screen (at the left)
                else if (rock.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    //this.score++;

                    // remove the obstacle from the HTML
                    rock.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.rocks.splice(i, 1);
                }
            }

            if (!this.rocks.length && !this.isPushingRock) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                this.isPushingRock = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                let timeRock = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.rocks.push(
                        new Rock(this.gameScreen, this.randomSpeed(6, 3))
                    );
                    this.isPushingRock = false;
                }, timeRock); /* 0.5 seconds */
            }

            // SKELETONS
            for (let i = 0; i < this.skeletons.length; i++) {
                const skeleton = this.skeletons[i];
                skeleton.move();

                // check if the player collided with the fishSkeleton
                if (
                    this.player.didCollide(skeleton) ||
                    this.player2.didCollide(skeleton)
                ) {
                    // remove the rock from the DOM
                    skeleton.element.remove();
                    // remove rock from the array
                    this.skeletons.splice(i, 1);
                    // remove player's live by 1
                    this.lives--;
                } else if (skeleton.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    //this.score++;

                    // remove the obstacle from the HTML
                    skeleton.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.skeletons.splice(i, 1);
                }
            }

            if (this.skeletons.length <= 3 && !this.isPushingSkeleton) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                if (this.skeletons.length <= 3) {
                    this.isPushingSkeleton = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                }
                let timeSkeleton = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.skeletons.push(
                        new Skeleton(this.gameScreen, this.randomSpeed(6, 3))
                    );
                    this.isPushingSkeleton = false;
                }, timeSkeleton); /* 0.5 seconds */
            }

            // --------------------------------------------------------------------------------------------------------------------------
        } else {
            // Move player 1
            this.player.move();

            // FISHES
            for (let i = 0; i < this.fishes.length; i++) {
                const fish = this.fishes[i];
                fish.move();

                // check if the player collided with the object
                if (this.player.didCollide(fish)) {
                    // remove the obstacle from the DOM
                    fish.element.remove();
                    // remove obstacle from the array
                    this.fishes.splice(i, 1);
                    // remove player's live by 1
                    this.score++;
                }

                // check if the obstacle is off the screen (at the left)
                else if (fish.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    this.lives--;

                    // remove the obstacle from the HTML
                    fish.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.fishes.splice(i, 1);
                }
            }

            // Update FISHES
            if (!this.fishes.length && !this.isPushingFish) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                setTimeout(() => {
                    this.fishes.push(new Fish(this.gameScreen));
                    this.isPushingFish = false;
                }, 500); /* 0.5 seconds */
            }

            // HEARTS
            for (let i = 0; i < this.hearts.length; i++) {
                const heart = this.hearts[i];
                heart.move();

                // check if the player collided with the object
                if (this.player.didCollide(heart)) {
                    // remove the obstacle from the DOM
                    heart.element.remove();
                    // remove obstacle from the array
                    this.hearts.splice(i, 1);
                    // remove player's live by 1
                    this.lives++;
                }

                // check if the obstacle is off the screen (at the left)
                else if (heart.left < 0) {
                    // remove the obstacle from the HTML
                    heart.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.hearts.splice(i, 1);
                }
            }

            // Update obstacles
            if (!this.hearts.length && !this.isPushingHeart) {
                this.isPushingHeart = true;
                setTimeout(() => {
                    this.hearts.push(new Heart(this.gameScreen));
                    this.isPushingHeart = false;
                }, 15000); /* 0.5 seconds */
            }

            // ROCKS
            for (let i = 0; i < this.rocks.length; i++) {
                const rock = this.rocks[i];
                rock.move();

                // check if the player collided with the rock
                if (this.player.didCollide(rock)) {
                    // remove the rock from the DOM
                    rock.element.remove();
                    // remove rock from the array
                    this.rocks.splice(i, 1);
                    // remove player's live by 1
                    this.lives--;
                }

                // check if the obstacle is off the screen (at the left)
                else if (rock.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    //this.score++;

                    // remove the obstacle from the HTML
                    rock.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.rocks.splice(i, 1);
                }
            }

            if (!this.rocks.length && !this.isPushingRock) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                this.isPushingRock = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                let timeRock = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.rocks.push(
                        new Rock(this.gameScreen, this.randomSpeed(6, 3))
                    );
                    this.isPushingRock = false;
                }, timeRock); /* 0.5 seconds */
            }

            // SKELETONS
            for (let i = 0; i < this.skeletons.length; i++) {
                const skeleton = this.skeletons[i];
                skeleton.move();

                // check if the player collided with the fishSkeleton
                if (this.player.didCollide(skeleton)) {
                    // remove the rock from the DOM
                    skeleton.element.remove();
                    // remove rock from the array
                    this.skeletons.splice(i, 1);
                    // remove player's live by 1
                    this.lives--;
                } else if (skeleton.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    //this.score++;

                    // remove the obstacle from the HTML
                    skeleton.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.skeletons.splice(i, 1);
                }
            }

            if (this.skeletons.length <= 3 && !this.isPushingSkeleton) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                if (this.skeletons.length <= 3) {
                    this.isPushingSkeleton = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                }
                let timeSkeleton = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.skeletons.push(
                        new Skeleton(this.gameScreen, this.randomSpeed(6, 3))
                    );
                    this.isPushingSkeleton = false;
                }, timeSkeleton); /* 0.5 seconds */
            }
        }
    }

    endGame() {
        // remove the player element from the DOM
        this.player.element.remove();
        if (this.player2) {
            this.player2.element.remove();
        }

        this.fishes.forEach((fish) => {
            // remove from the HTML
            fish.element.remove();
        });

        // remove all rocks from the array of rocks
        this.rocks.forEach((rock) => {
            // remove from the HTML
            rock.element.remove();
        });

        // remove all skeletons from the array of skeletons
        this.skeletons.forEach((skeleton) => {
            // remove from the HTML
            skeleton.element.remove();
        });

        this.gameIsOver = true;

        // hide the game screen
        this.gameScreen.style.display = "none";

        // show end game screen
        this.gameEndScreen.style.display = "flex";
    }

    randomTime(maxTime, minTime) {
        return Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
    }

    randomSpeed(maxSpeed, minSpeed) {
        return Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed);
    }

    // alterar aqui
    randomPosition() {
        return (
            Math.floor(
                Math.random() * (this.gameScreen.offsetHeight / 2 - 50)
            ) +
            this.gameScreen.offsetHeight / 2
        );
    }
}

class Game {
    // stores all properties to the future objects
    constructor() {
        // get all the possible screens
        // game-screen and game-end are initially hodden.
        this.startScreen = document.getElementById("game-intro");
        this.gameScreen = document.getElementById("game-screen");
        this.gameEndScreen = document.getElementById("game-end");
        this.statusScreen = document.getElementById("status");

        // Sounds
        this.gameMusic = document.getElementById("gameAudio");
        this.gameOverSound = new Audio("/docs/sounds/gameOver3.wav");
        this.heartSound = new Audio("/docs/sounds/heartSound.wav");
        this.fishSound = new Audio("/docs/sounds/fishSound2.wav");
        this.levelSound = new Audio("/docs/sounds/levelSound.wav");
        this.loseLifeSound = new Audio("/docs/sounds/loseLife.wav");
        this.rocksSkeletonsSound = new Audio(
            "/docs/sounds/rocksSkeletonsSound.wav"
        );

        // Volumes
        this.gameMusic.volume = 0.4;
        this.gameOverSound.volume = 0.3;
        this.heartSound.volume = 0.2;
        this.fishSound.volume = 0.5;
        this.levelSound.volume = 0.5;
        this.loseLifeSound.volume = 0.5;

        // Boolean conditions
        this.checkLevelPlay = true;

        // Levels
        this.arrLevels = [10, 20, 30, 40, 50, 50];

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

    // start() Initializes the game by executing the following sequence of steps when called:
    start() {
        // Load sound && play sound && put loop = true
        this.gameMusic.load();
        this.gameMusic.play();
        this.gameMusic.loop = true;
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

        // Score and lives
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
                    // Play sound
                    this.playAndLoud(this.fishSound);
                    // remove the obstacle from the DOM
                    fish.element.remove();
                    // remove obstacle from the array
                    this.fishes.splice(i, 1);
                    // remove player's live by 1
                    this.score++;
                    // Put this.checkLevelPlay = true
                    this.checkLevelPlay = true;
                }

                // check if the obstacle is off the screen (at the left)
                else if (fish.left < 0) {
                    // congratulations to you, you avoided one obstacle and won 1 live
                    this.lives--;

                    // remove the obstacle from the HTML
                    fish.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.fishes.splice(i, 1);
                    // Play sound
                    this.playAndLoud(this.loseLifeSound);
                }
            }

            // UPDATE FISHES
            if (this.score < 10) {
                if (!this.fishes.length <= 2 && !this.isPushingFish) {
                    /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                    this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                    let timeFishes = this.randomTime(2000, 400);
                    setTimeout(() => {
                        this.fishes.push(new Fish(this.gameScreen));
                        this.isPushingFish = false;
                    }, timeFishes); /* 0.5 seconds */
                }
            } else if (this.score >= 10 && this.score < 20) {
                if (this.fishes.length <= 4 && !this.isPushingFish) {
                    /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                    this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                    let timeFishes = this.randomTime(2000, 400);
                    setTimeout(() => {
                        this.fishes.push(new Fish(this.gameScreen));
                        this.isPushingFish = false;
                    }, timeFishes);
                }
            } else if (this.score >= 20) {
                if (this.fishes.length <= 6 && !this.isPushingFish) {
                    /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                    this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                    let timeFishes = this.randomTime(2000, 600);
                    setTimeout(() => {
                        this.fishes.push(new Fish(this.gameScreen));
                        this.isPushingFish = false;
                    }, timeFishes);
                }
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
                    // Play sound
                    this.playAndLoud(this.heartSound);
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

            // UPDATE HEARTS
            if (!this.hearts.length && !this.isPushingHeart) {
                this.isPushingHeart = true;
                let timeHeart = this.randomTime(30000, 15000);
                setTimeout(() => {
                    this.hearts.push(new Heart(this.gameScreen));
                    this.isPushingHeart = false;
                }, timeHeart);
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
                    // Play sound
                    this.playAndLoud(this.rocksSkeletonsSound);
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

            // UPDATE ROCKS
            if (!this.rocks.length && !this.isPushingRock) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                this.isPushingRock = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                let timeRock = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.rocks.push(
                        new Rock(this.gameScreen, this.randomSpeed(4, 2))
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
                    // Play sound
                    this.playAndLoud(this.rocksSkeletonsSound);
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

            // UPDATE SKELETONS
            if (this.skeletons.length <= 5 && !this.isPushingSkeleton) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                if (this.skeletons.length <= 5) {
                    this.isPushingSkeleton = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                }
                let timeSkeleton = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.skeletons.push(
                        new Skeleton(this.gameScreen, this.randomSpeed(4, 2))
                    );
                    this.isPushingSkeleton = false;
                }, timeSkeleton);
            }
            // Leves Conditions
            this.playLevelSound(
                this.score,
                this.levelSound,
                this.checkLevelPlay
            );

            // -------------------------------------------------------------------------------------------------------------------------- //
        } else {
            // Move player 1
            this.player.move();

            // FISHES
            for (let i = 0; i < this.fishes.length; i++) {
                const fish = this.fishes[i];
                fish.move();

                // check if the player collided with the object
                if (this.player.didCollide(fish)) {
                    // Play sound
                    this.playAndLoud(this.fishSound);
                    // remove the obstacle from the DOM
                    fish.element.remove();
                    // remove obstacle from the array
                    this.fishes.splice(i, 1);
                    // remove player's live by 1
                    this.score++;
                    // Put this.checkLevelPlay = true
                    this.checkLevelPlay = true;
                }

                // check if the obstacle is off the screen (at the left)
                else if (fish.left < 0) {
                    // Play sound
                    this.playAndLoud(this.loseLifeSound);
                    // congratulations to you, you avoided one obstacle and won 1 live
                    this.lives--;

                    // remove the obstacle from the HTML
                    fish.element.remove();

                    // remove the obstcle from the array of obstacles
                    this.fishes.splice(i, 1);
                }
            }

            // UPDATE FISHES

            if (this.score < 10) {
                if (!this.fishes.length && !this.isPushingFish) {
                    /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                    this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                    let timeFishes = this.randomTime(3000, 300);
                    setTimeout(() => {
                        this.fishes.push(new Fish(this.gameScreen));
                        this.isPushingFish = false;
                    }, timeFishes); /* 0.5 seconds */
                }
            } else if (this.score >= 10 && this.score < 20) {
                if (this.fishes.length <= 2 && !this.isPushingFish) {
                    /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                    this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                    let timeFishes = this.randomTime(3000, 300);
                    setTimeout(() => {
                        this.fishes.push(new Fish(this.gameScreen));
                        this.isPushingFish = false;
                    }, timeFishes);
                }
            } else if (this.score >= 20) {
                if (this.fishes.length <= 3 && !this.isPushingFish) {
                    /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                    this.isPushingFish = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                    let timeFishes = this.randomTime(3000, 300);
                    setTimeout(() => {
                        this.fishes.push(new Fish(this.gameScreen));
                        this.isPushingFish = false;
                    }, timeFishes);
                }
            }

            // HEARTS
            for (let i = 0; i < this.hearts.length; i++) {
                const heart = this.hearts[i];
                heart.move();

                // check if the player collided with the object
                if (this.player.didCollide(heart)) {
                    // Play sound
                    this.playAndLoud(this.heartSound);
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

            // UPDATE HEARTS
            if (!this.hearts.length && !this.isPushingHeart) {
                this.isPushingHeart = true;
                let timeHearts = this.randomTime(30000, 15000);
                setTimeout(() => {
                    this.hearts.push(new Heart(this.gameScreen));
                    this.isPushingHeart = false;
                }, timeHearts);
            }

            // ROCKS
            for (let i = 0; i < this.rocks.length; i++) {
                const rock = this.rocks[i];
                rock.move();

                // check if the player collided with the rock
                if (this.player.didCollide(rock)) {
                    // Play sound
                    this.playAndLoud(this.rocksSkeletonsSound);
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

            // UPDATE ROCKS
            if (!this.rocks.length && !this.isPushingRock) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                this.isPushingRock = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                let timeRock = this.randomTime(2500, 300);
                setTimeout(() => {
                    this.rocks.push(
                        new Rock(this.gameScreen, this.randomSpeed(4, 2))
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
                    // Play sound
                    this.playAndLoud(this.rocksSkeletonsSound);
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

            // UPDATE SKELETONS
            if (this.skeletons.length <= 6 && !this.isPushingSkeleton) {
                /* This condition checks if there are no obstacles present in the game and if the game is not currently in the process of pushing a new obstacle. If both conditions are true, it means there are no obstacles on the screen, and it's time to push a new obstacle into the game. */
                if (this.skeletons.length <= 6) {
                    this.isPushingSkeleton = true; /*  the game is currently in the process of adding a new obstacle. This is done to prevent multiple simultaneous attempts to push obstacles and maintain control over when the obstacles are added. */
                }
                let timeSkeleton = this.randomTime(1000, 300);
                setTimeout(() => {
                    this.skeletons.push(
                        new Skeleton(this.gameScreen, this.randomSpeed(4, 2))
                    );
                    this.isPushingSkeleton = false;
                }, timeSkeleton); /* 0.5 seconds */
            }

            // Leves Conditions

            this.playLevelSound(
                this.score,
                this.levelSound,
                this.checkLevelPlay
            );
        }
    }

    endGame() {
        // Stop sound
        this.gameMusic.pause();
        // Play sound
        this.gameOverSound.play();

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

    // Extra Functions

    randomTime(maxTime, minTime) {
        return Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
    }

    randomSpeed(maxSpeed, minSpeed) {
        if (this.score < 10) {
            return Math.floor(
                Math.random() * (maxSpeed - minSpeed + 1) + minSpeed
            );
        } else if (this.score >= 10) {
            return (
                Math.random() * (maxSpeed * 1.2 - minSpeed * 1.2 + 1) +
                minSpeed * 1.2
            );
        } else if (this.score >= 20) {
            return (
                Math.random() * (maxSpeed * 1.4 - minSpeed * 1.4 + 1) +
                minSpeed * 1.4
            );
        } else if (this.score >= 30) {
            return (
                Math.random() * (maxSpeed * 1.9 - minSpeed * 1.9 + 1) +
                minSpeed * 1.9
            );
        } else if (this.score >= 40) {
            return (
                Math.random() * (maxSpeed * 2.2 - minSpeed * 2.2 + 1) +
                minSpeed * 2.2
            );
        } else if (this.score >= 50) {
            return (
                Math.random() * (maxSpeed * 2.5 - minSpeed * 2.5 + 1) +
                minSpeed * 2.5
            );
        }
    }

    playAndLoud(sound) {
        sound.play();
    }

    // Check level up
    playLevelSound(score, sound, checkLevelPlay) {
        if (this.arrLevels.includes(score) && checkLevelPlay) {
            sound.play();
            this.checkLevelPlay = false;
        }
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

// Play the beat
//beat.play();

// Pause/stop the beat
//beat.pause();

// Reload the beat (back to the start)
//beat.load();

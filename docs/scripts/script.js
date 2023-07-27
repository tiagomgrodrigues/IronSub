window.onload = function () {
    const startButton = document.getElementById("start-button");
    const startMultiPlayerButton = document.getElementById("start-button-2");
    const restartButton = document.getElementById("restart-button");

    this.initialSound = new Audio("/docs/sounds/initialSound.wav");

    let game;

    startButton.addEventListener("click", function () {
        startGame();
    });

    startMultiPlayerButton.addEventListener("click", function () {
        startGame(true);
    });

    function startGame(isMulti) {
        if (!isMulti) {
            game = new Game();

            game.start();
        } else {
            game = new Game();

            game.gameVersion = "multiplayer";

            game.start();
        }
    }

    restartButton.addEventListener("click", function () {
        location.reload();
    });

    //Function that handles keydown (pressing a key) events
    function handleKeyDown(event) {
        const key = event.key;
        const possibleKeystrokes = [
            "ArrowLeft",
            "ArrowUp",
            "ArrowRight",
            "ArrowDown",
        ];

        // check if the pressed key belongs to tge array of possible keys
        if (possibleKeystrokes.includes(key)) {
            // prevent the default key actions from happening.
            // in this case, it's scroll-up / scroll-down / scroll-left / scroll-right in the browser window.
            event.preventDefault();
        }
        // only when we have a game loaded, we can move the player
        if (game) {
            switch (key) {
                case "ArrowLeft":
                    game.player.directionX = -1;
                    break;
                case "ArrowUp":
                    game.player.directionY = -1;
                    break;
                case "ArrowRight":
                    game.player.directionX = 1;
                    break;
                case "ArrowDown":
                    game.player.directionY = 1;
                    break;
            }
        }
    }

    // Function that handles keydown (pressing a key) events
    function handleKeyUp(event) {
        const key = event.key;
        const possibleKeystrokes = [
            "ArrowLeft",
            "ArrowUp",
            "ArrowRight",
            "ArrowDown",
        ];

        // check if the pressed key belongs to tge array of possible keys
        if (possibleKeystrokes.includes(key)) {
            // prevent the default key actions from happening.
            // in this case, it's scroll-up / scroll-down / scroll-left / scroll-right in the browser window.
            event.preventDefault();
        }
        // only when we have a game loaded, we can move the player
        if (game) {
            switch (key) {
                case "ArrowLeft":
                    game.player.directionX = 0;
                    break;
                case "ArrowUp":
                    game.player.directionY = 0;
                    break;
                case "ArrowRight":
                    game.player.directionX = 0;
                    break;
                case "ArrowDown":
                    game.player.directionY = 0;
                    break;
            }
        }
    }

    function handleKeyDown2(event) {
        console.log(event.key);
        const key = event.key;
        const possibleKeystrokes = ["d", "w", "a", "s"];

        // check if the pressed key belongs to tge array of possible keys
        if (possibleKeystrokes.includes(key)) {
            // prevent the default key actions from happening.
            // in this case, it's scroll-up / scroll-down / scroll-left / scroll-right in the browser window.
            event.preventDefault();
        }
        // only when we have a game loaded, we can move the player
        if (game) {
            switch (key) {
                case "a":
                    game.player2.directionX = -2;
                    break;
                case "w":
                    game.player2.directionY = -2;
                    break;
                case "d":
                    game.player2.directionX = 2;
                    break;
                case "s":
                    game.player2.directionY = 2;
                    break;
            }
        }
    }
    // Function that handles keydown (pressing a key) events
    function handleKeyUp2(event) {
        const key = event.key;
        const possibleKeystrokes = ["d", "w", "a", "s"];

        // check if the pressed key belongs to tge array of possible keys
        if (possibleKeystrokes.includes(key)) {
            // prevent the default key actions from happening.
            // in this case, it's scroll-up / scroll-down / scroll-left / scroll-right in the browser window.
            event.preventDefault();
        }
        // only when we have a game loaded, we can move the player
        if (game) {
            switch (key) {
                case "a":
                    game.player2.directionX = 0;
                    break;
                case "w":
                    game.player2.directionY = 0;
                    break;
                case "d":
                    game.player2.directionX = 0;
                    break;
                case "s":
                    game.player2.directionY = 0;
                    break;
            }
        }
    }

    // Assossiate the handleKeydown function with an Event Listener
    // The "keydown" event is triggered when a keyboard key is pressed down
    window.addEventListener("keydown", handleKeyDown);
    // The "keyup" event is triggered when a keyboard key is pressed up
    window.addEventListener("keyup", handleKeyUp);

    window.addEventListener("keydown", handleKeyDown2);
    // The "keyup" event is triggered when a keyboard key is pressed up
    window.addEventListener("keyup", handleKeyUp2);
};

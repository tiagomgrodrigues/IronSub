// esta parte ja estava
window.onload = function () {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
  
    let game;

    startButton.addEventListener("click", function() {
      startGame();
    });
  
    function startGame() {
      console.log("start game");
// estava ate aqui
      // <1>
      game = new Game();

      game.start();
    }

    restartButton.addEventListener("click", function() {
      location.reload();
    });
    // </1>

    // <9> Function that handles keydown (pressing a key) events
  function handleKeyDown(event) {
    const key = event.key;
    const possibleKeystrokes = [
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown"
    ]

    // check if the pressed key belongs to tge array of possible keys
    if (possibleKeystrokes.includes(key)) {
      // prevent the default key actions from happening.
      // in this case, it's scroll-up / scroll-down / scroll-left / scroll-right in the browser window.
      event.preventDefault();
    }
    // only when we have a game loaded, we can move the player
    if (game) {
      switch(key) {
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
      // </9>
    } 
  }
  // <10> Function that handles keydown (pressing a key) events
  function handleKeyUp(event) {
    const key = event.key;
    const possibleKeystrokes = [
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown"
    ]

    // check if the pressed key belongs to tge array of possible keys
    if (possibleKeystrokes.includes(key)) {
      // prevent the default key actions from happening.
      // in this case, it's scroll-up / scroll-down / scroll-left / scroll-right in the browser window.
      event.preventDefault();
    }
    // only when we have a game loaded, we can move the player
    if (game) {
      switch(key) {
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
    // </10> 
  }
 
  // <11> Assossiate the handleKeydown function with an Event Listener
  // The "keydown" event is triggered when a keyboard key is pressed down
  window.addEventListener("keydown", handleKeyDown);
  // The "keyup" event is triggered when a keyboard key is pressed up
  window.addEventListener("keyup", handleKeyUp)
};
// </11>
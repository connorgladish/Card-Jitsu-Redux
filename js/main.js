document.addEventListener("DOMContentLoaded", () => {
    const playerCard = document.getElementById("player-card");
    const opponentCard = document.getElementById("opponent-card");
    const playerScoreDisplay = document.getElementById("player-score");
    const opponentScoreDisplay = document.getElementById("opponent-score");
    const cardOptions = document.querySelectorAll(".card-option");
    const choices = ["fire", "water", "snow"]; // Possible card types
  
    const endGameModal = document.getElementById("end-game-modal");
    const endGameImage = document.getElementById("end-game-image");
  
    let playerChoice = null;
    const playerScore = { fire: [], water: [], snow: [] };
    const opponentScore = { fire: [], water: [], snow: [] };
  
    // Add click event listener to each card option for the player
    cardOptions.forEach((card) => {
      card.addEventListener("click", () => {
        if (!playerChoice) {
          // Player makes their choice
          playerChoice = card.getAttribute("data-card");
          playerCard.src = `assets/images/friendlypenguin${playerChoice}.png`;
          console.log(`You chose: ${playerChoice}`);
  
          // Wait a few seconds, then opponent makes their choice
          setTimeout(() => {
            const opponentChoice = getRandomChoice();
            opponentCard.src = `assets/images/enemypenguin${opponentChoice}.png`;
            console.log(`Opponent chose: ${opponentChoice}`);
  
            // Determine the winner and update scores
            determineWinner(opponentChoice, playerChoice);
  
            // Check if the game is over
            const result = checkGameOver();
            if (result) {
              showEndGameModal(result === "player");
              resetGame(true); // Reset the game with a winner announcement
            } else {
              resetGame(); // Reset for the next round
            }
          }, 2000); // Delay for suspense
        }
      });
    });
  
    // Function to determine the winner and update scores
    function determineWinner(opponent, player) {
      if (opponent === player) {
        console.log("It's a draw!");
      } else if (
        (opponent === "fire" && player === "snow") ||
        (opponent === "water" && player === "fire") ||
        (opponent === "snow" && player === "water")
      ) {
        console.log("Opponent wins this round!");
        updateScore(opponentScore, opponent, opponentScoreDisplay);
      } else {
        console.log("You win this round!");
        updateScore(playerScore, player, playerScoreDisplay);
      }
    }
  
    // Function to update the score and display
    function updateScore(scoreObject, cardType, scoreDisplay) {
      scoreObject[cardType].push(cardType); // Add the win to the appropriate card type
      updateScoreDisplay(scoreObject, scoreDisplay);
    }
  
    // Function to update the score displays
    function updateScoreDisplay(scoreObject, scoreDisplay) {
      scoreDisplay.innerHTML = choices
        .map((card) => {
          if (scoreObject[card].length > 0) {
            return `
              <div class="score-column">
                ${scoreObject[card]
                  .map(() => `<img src="assets/images/${card}.png" alt="${card} card" class="score-icon">`)
                  .join("")}
              </div>`;
          }
          return "";
        })
        .join("");
    }
  
    // Function to check if the game is over
    function checkGameOver() {
      const playerHasThreeUnique = hasThreeUnique(playerScore);
      const opponentHasThreeUnique = hasThreeUnique(opponentScore);
      const playerHasThreeOfEach = hasThreeOfEach(playerScore);
      const opponentHasThreeOfEach = hasThreeOfEach(opponentScore);
  
      if (playerHasThreeUnique || playerHasThreeOfEach) {
        return "player"; // Player wins
      } else if (opponentHasThreeUnique || opponentHasThreeOfEach) {
        return "opponent"; // Opponent wins
      }
      return null; // Game continues
    }
  
    // Check for three unique card types
    function hasThreeUnique(scoreObject) {
      return Object.keys(scoreObject).filter((card) => scoreObject[card].length > 0).length === 3;
    }
  
    // Check for three of the same card type
    function hasThreeOfEach(scoreObject) {
      return Object.values(scoreObject).some((cards) => cards.length === 3);
    }
  
    // Function to display the end game modal
    function showEndGameModal(playerWon) {
      endGameImage.src = `assets/images/${playerWon ? "victory.png" : "defeat.png"}`;
      endGameModal.style.display = "flex"; // Show the modal
    }
  
    // Function to reset the game
    function resetGame(gameOver = false) {
      setTimeout(() => {
        if (gameOver) {
          Object.keys(playerScore).forEach((key) => (playerScore[key] = []));
          Object.keys(opponentScore).forEach((key) => (opponentScore[key] = []));
          updateScoreDisplay(playerScore, playerScoreDisplay);
          updateScoreDisplay(opponentScore, opponentScoreDisplay);
  
          // Hide the end game modal after a delay
          setTimeout(() => {
            endGameModal.style.display = "none"; // Hide the modal
          }, 3000);
        }
        playerChoice = null;
        opponentCard.src = "assets/images/enemypenguin.png";
        playerCard.src = "assets/images/friendlypenguin.png";
        console.log("Game reset. Your turn to choose a card!");
      }, gameOver ? 3000 : 2000); // Slightly longer delay if game over
    }
  
    // Function for the enemy to randomly select a card
    function getRandomChoice() {
      const randomIndex = Math.floor(Math.random() * choices.length);
      return choices[randomIndex];
    }
  });
  
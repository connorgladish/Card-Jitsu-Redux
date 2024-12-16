document.addEventListener("DOMContentLoaded", () => {
    const playerCard = document.getElementById("player-card");
    const opponentCard = document.getElementById("opponent-card");
    const playerScoreDisplay = document.getElementById("player-score");
    const opponentScoreDisplay = document.getElementById("opponent-score");
    const playerSelectedCard = document.getElementById("player-selected-card");
    const opponentSelectedCard = document.getElementById("opponent-selected-card");
    const taskbar = document.getElementById("card-toolbar");
    const endGameModal = document.getElementById("end-game-modal");
    const endGameImage = document.getElementById("end-game-image");
  
    const elements = ["fire", "water", "snow"];
    const cardDeck = createDeck();
    let playerHand = [];
    let computerHand = [];
    let canSelectCard = true;
  
    const playerScore = { fire: [], water: [], snow: [] };
    const opponentScore = { fire: [], water: [], snow: [] };
  
    // Initialize the game
    startRound();
  
    function startRound() {
      resetBoard();
      playerHand = dealCards([...cardDeck]); // Deal 5 random cards to player
      computerHand = dealCards([...cardDeck]); // Deal 5 random cards to computer
      displayPlayerHand(playerHand); // Update taskbar with player's cards
      console.log("Player's hand:", playerHand);
      console.log("Computer's hand:", computerHand); // Hidden from player
      canSelectCard = true; // Allow card selection
    }
  
    // Function to create the full deck of cards
    function createDeck() {
      const deck = [];
      for (let number = 2; number <= 8; number++) {
        for (let element of elements) {
          deck.push({
            element: element,
            number: number,
            image: `assets/images/${element}${number}.png`,
          });
        }
      }
      return deck;
    }
  
    // Function to deal 5 random cards from the deck
    function dealCards(deck) {
      const hand = [];
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        hand.push(deck.splice(randomIndex, 1)[0]);
      }
      return hand;
    }
  
    // Function to display the player's hand on the taskbar
    function displayPlayerHand(hand) {
      taskbar.innerHTML = ""; // Clear existing cards
      hand.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card-option";
        cardElement.dataset.element = card.element;
        cardElement.dataset.number = card.number;
  
        cardElement.innerHTML = `
          <img src="${card.image}" alt="${card.element} ${card.number}">
          <p>${card.element.charAt(0).toUpperCase() + card.element.slice(1)} ${card.number}</p>
        `;
  
        // Add click event for card selection
        cardElement.addEventListener("click", () => {
          if (canSelectCard) {
            handlePlayerCardSelection(card, index);
          }
        });
  
        taskbar.appendChild(cardElement);
      });
    }
  
    // Handle player card selection
    function handlePlayerCardSelection(card, index) {
      canSelectCard = false; // Disable card selection during the round
  
      // Display the player's selected card next to their character
      playerSelectedCard.innerHTML = `<img src="${card.image}" alt="${card.element} ${card.number}">`;
  
      // Remove the selected card from the player's hand
      playerHand.splice(index, 1);
  
      // Computer selects a card
      const computerCard = computerPlay(computerHand);
  
      // Display the computer's selected card next to their character
      opponentSelectedCard.innerHTML = `<img src="${computerCard.image}" alt="${computerCard.element} ${computerCard.number}">`;
  
      // Determine the winner of the round
      determineWinner(card, computerCard);
  
      // Check if the game is over
      const result = checkGameOver();
      if (result) {
        showEndGameModal(result === "player");
        setTimeout(() => {
          resetGame(true); // End the game and reset
        }, 3000);
      } else {
        setTimeout(() => {
          resetRound();
          if (playerHand.length === 0) {
            startRound(); // If all cards are played, start a new round
          } else {
            canSelectCard = true; // Re-enable card selection
          }
        }, 2000);
      }
    }
  
    // Computer randomly selects a card
    function computerPlay(hand) {
      const randomIndex = Math.floor(Math.random() * hand.length);
      return hand.splice(randomIndex, 1)[0]; // Remove and return the card
    }
  
    // Determine the winner of the round
    function determineWinner(playerCard, computerCard) {
      if (playerCard.element === computerCard.element) {
        if (playerCard.number > computerCard.number) {
          console.log("You win this round!");
          updateScore(playerScore, playerCard.element, playerScoreDisplay);
        } else if (playerCard.number < computerCard.number) {
          console.log("Opponent wins this round!");
          updateScore(opponentScore, computerCard.element, opponentScoreDisplay);
        } else {
          console.log("It's a draw!");
        }
      } else if (
        (playerCard.element === "fire" && computerCard.element === "snow") ||
        (playerCard.element === "water" && computerCard.element === "fire") ||
        (playerCard.element === "snow" && computerCard.element === "water")
      ) {
        console.log("You win this round!");
        updateScore(playerScore, playerCard.element, playerScoreDisplay);
      } else {
        console.log("Opponent wins this round!");
        updateScore(opponentScore, computerCard.element, opponentScoreDisplay);
      }
    }
  
    // Update score and display
    function updateScore(scoreObject, cardType, scoreDisplay) {
      scoreObject[cardType].push(cardType);
      updateScoreDisplay(scoreObject, scoreDisplay);
    }
  
    function updateScoreDisplay(scoreObject, scoreDisplay) {
      scoreDisplay.innerHTML = elements
        .map((element) => {
          if (scoreObject[element].length > 0) {
            return `
              <div class="score-column">
                ${scoreObject[element]
                  .map(() => `<img src="assets/images/${element}.png" alt="${element}" class="score-icon">`)
                  .join("")}
              </div>`;
          }
          return "";
        })
        .join("");
    }
  
    // Check if the game is over
    function checkGameOver() {
      const playerHasThreeUnique = hasThreeUnique(playerScore);
      const opponentHasThreeUnique = hasThreeUnique(opponentScore);
      const playerHasThreeOfEach = hasThreeOfEach(playerScore);
      const opponentHasThreeOfEach = hasThreeOfEach(opponentScore);
  
      if (playerHasThreeUnique || playerHasThreeOfEach) return "player";
      if (opponentHasThreeUnique || opponentHasThreeOfEach) return "opponent";
      return null;
    }
  
    function hasThreeUnique(scoreObject) {
      return Object.keys(scoreObject).filter((element) => scoreObject[element].length > 0).length === 3;
    }
  
    function hasThreeOfEach(scoreObject) {
      return Object.values(scoreObject).some((cards) => cards.length === 3);
    }
  
    function resetBoard() {
      playerCard.src = "assets/images/friendlypenguin.png";
      opponentCard.src = "assets/images/enemypenguin.png";
  
      // Clear the selected card displays
      playerSelectedCard.innerHTML = "";
      opponentSelectedCard.innerHTML = "";
  
      taskbar.innerHTML = "";
    }
  
    function resetRound() {
      playerSelectedCard.innerHTML = "";
      opponentSelectedCard.innerHTML = "";
      playerCard.src = "assets/images/friendlypenguin.png";
      opponentCard.src = "assets/images/enemypenguin.png";
    }
  
    function showEndGameModal(playerWon) {
      endGameImage.src = `assets/images/${playerWon ? "victory.png" : "defeat.png"}`;
      endGameModal.style.display = "flex";
      setTimeout(() => {
        endGameModal.style.display = "none";
      }, 3000);
    }
  
    function resetGame(gameOver) {
      if (gameOver) {
        Object.keys(playerScore).forEach((key) => (playerScore[key] = []));
        Object.keys(opponentScore).forEach((key) => (opponentScore[key] = []));
        updateScoreDisplay(playerScore, playerScoreDisplay);
        updateScoreDisplay(opponentScore, opponentScoreDisplay);
      }
      startRound();
    }
  });
  
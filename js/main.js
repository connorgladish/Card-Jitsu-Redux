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

  const mainMenu = document.getElementById("main-menu");
  const startGameButton = document.getElementById("start-game-button");
  const instructionsButton = document.getElementById("instructions-button");
  const battleStage = document.getElementById("battle-stage");
  const resetGameButton = document.getElementById("reset-game-button");

  const elements = ["fire", "water", "snow"];
  let cardDeck = createDeck();
  let playerHand = [];
  let computerHand = [];
  let canSelectCard = true;

  const playerScore = { fire: [], water: [], snow: [] };
  const opponentScore = { fire: [], water: [], snow: [] };

  // Main Menu Logic
  startGameButton.addEventListener("click", () => {
    mainMenu.style.display = "none"; // Hide main menu
    battleStage.style.display = "flex"; // Show the game board
    startRound();
  });

  instructionsButton.addEventListener("click", () => {
    alert("Instructions:\n\n1. Each round, select a card to play.\n2. Fire beats Snow, Snow beats Water, Water beats Fire.\n3. Higher numbers win in case of ties.\n4. Win by collecting 3 unique cards or 3 of the same type.");
  });

  resetGameButton.addEventListener("click", resetGame);

  function startRound() {
    resetBoard(); // Clear visuals
    cardDeck = createDeck(); // Create a fresh deck
    playerHand = dealCards([...cardDeck]); // Deal new cards to player
    computerHand = dealCards([...cardDeck]); // Deal new cards to opponent
    displayPlayerHand(playerHand); // Display the new player's hand
    canSelectCard = true; // Allow card selection
  }

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

  function dealCards(deck) {
    const hand = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      hand.push(deck.splice(randomIndex, 1)[0]);
    }
    return hand;
  }

  function displayPlayerHand(hand) {
    taskbar.innerHTML = ""; // Clear the toolbar
    hand.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card-option";
      cardElement.innerHTML = `<img src="${card.image}" alt="${card.element} ${card.number}">`;
      cardElement.addEventListener("click", () => {
        if (canSelectCard) handlePlayerCardSelection(card, index);
      });
      taskbar.appendChild(cardElement);
    });
  }

  function handlePlayerCardSelection(card, index) {
    if (!canSelectCard) return;
    canSelectCard = false;

    playerSelectedCard.innerHTML = `<img src="${card.image}" alt="${card.element} ${card.number}">`;
    const computerCard = computerPlay(computerHand);
    opponentSelectedCard.innerHTML = `<img src="${computerCard.image}" alt="${computerCard.element} ${computerCard.number}">`;

    determineWinner(card, computerCard);

    setTimeout(() => {
      if (checkGameOver()) return;

      playerHand = dealCards(createDeck());
      computerHand = dealCards(createDeck());
      displayPlayerHand(playerHand);
      resetRound();
      canSelectCard = true;
    }, 2000);
  }

  function computerPlay(hand) {
    const randomIndex = Math.floor(Math.random() * hand.length);
    return hand.splice(randomIndex, 1)[0];
  }

  function determineWinner(playerCard, computerCard) {
    if (playerCard.element === computerCard.element) {
      if (playerCard.number > computerCard.number) {
        updateScore(playerScore, playerCard.element, playerScoreDisplay);
      } else if (playerCard.number < computerCard.number) {
        updateScore(opponentScore, computerCard.element, opponentScoreDisplay);
      }
    } else if (
      (playerCard.element === "fire" && computerCard.element === "snow") ||
      (playerCard.element === "water" && computerCard.element === "fire") ||
      (playerCard.element === "snow" && computerCard.element === "water")
    ) {
      updateScore(playerScore, playerCard.element, playerScoreDisplay);
    } else {
      updateScore(opponentScore, computerCard.element, opponentScoreDisplay);
    }
  }

  function updateScore(scoreObject, cardType, scoreDisplay) {
    scoreObject[cardType].push(cardType);
    updateScoreDisplay(scoreObject, scoreDisplay);
  }

  function updateScoreDisplay(scoreObject, scoreDisplay) {
    scoreDisplay.innerHTML = elements
      .map((element) =>
        scoreObject[element].length > 0
          ? `<div class="score-column">
               ${scoreObject[element]
                 .map(() => `<img src="assets/images/${element}.png" class="score-icon">`)
                 .join("")}
             </div>`
          : ""
      )
      .join("");
  }

  function checkGameOver() {
    if (hasThreeUnique(playerScore) || hasThreeOfEach(playerScore)) {
      showEndGameModal(true);
      return true;
    }

    if (hasThreeUnique(opponentScore) || hasThreeOfEach(opponentScore)) {
      showEndGameModal(false);
      return true;
    }
    return false;
  }

  function hasThreeUnique(scoreObject) {
    return Object.keys(scoreObject).filter((element) => scoreObject[element].length > 0).length === 3;
  }

  function hasThreeOfEach(scoreObject) {
    return Object.values(scoreObject).some((cards) => cards.length === 3);
  }

  function resetRound() {
    playerSelectedCard.innerHTML = "";
    opponentSelectedCard.innerHTML = "";
    playerCard.src = "assets/images/friendlypenguin.png";
    opponentCard.src = "assets/images/enemypenguin.png";
  }

  function resetBoard() {
    resetRound();
    taskbar.innerHTML = "";
  }

  function showEndGameModal(playerWon) {
    const imagePath = `assets/images/${playerWon ? "victory.png" : "defeat.png"}`;
    endGameImage.src = imagePath;
  
    endGameImage.onload = () => {
      console.log("End game image loaded:", imagePath);
  
      // Display the modal
      endGameModal.style.display = "flex";
      endGameModal.classList.remove("hidden");
    };
  
    endGameImage.onerror = () => {
      console.error("Failed to load end game image:", imagePath);
    };
  }
  

  function resetGame() {
    // Reset scores
    Object.keys(playerScore).forEach((key) => (playerScore[key] = []));
    Object.keys(opponentScore).forEach((key) => (opponentScore[key] = []));
    updateScoreDisplay(playerScore, playerScoreDisplay);
    updateScoreDisplay(opponentScore, opponentScoreDisplay);
  
    // Reset visuals
    resetBoard();
  
    // Hide end game modal completely
    endGameModal.style.display = "none";
    endGameImage.src = ""; // Clear the victory/defeat image
    endGameModal.classList.add("hidden");
  
    // Return to the main menu
    mainMenu.style.display = "flex";
    battleStage.style.display = "none";
  }
  
});

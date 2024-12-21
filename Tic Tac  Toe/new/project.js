const cells = document.querySelectorAll("[data-cell]");
const board = document.querySelector(".game-board");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.getElementById("winningMessageText");
const restartButton = document.getElementById("restartButton");
const turnDisplay = document.querySelector(".turn-display");

let isCircleTurn = false;

// Winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function startGame() {
  isCircleTurn = false;
  updateTurnDisplay(); // Initialize turn display at game start
  cells.forEach((cell) => {
    cell.classList.remove("taken", "x", "circle");
    cell.innerText = ""; // Clear text
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  winningMessageElement.classList.remove("show");
  removeWinningLine(); // Remove any existing winning line
  restartButton.style.display = "show"; // Hide restart button at start
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isCircleTurn ? "circle" : "x";
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    drawWinningLine(currentClass); // Draw line for the winner
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass, "taken");
  cell.innerText = isCircleTurn ? "O" : "X"; // Add inner text
}

function swapTurns() {
  isCircleTurn = !isCircleTurn;
  updateTurnDisplay(); // Update the turn display
}

function updateTurnDisplay() {
  turnDisplay.textContent = `Now Turn: ${isCircleTurn ? "O" : "X"}`;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cells].every((cell) => {
    return cell.classList.contains("x") || cell.classList.contains("circle");
  });
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.textContent = "It's a Draw!";
  } else {
    winningMessageTextElement.textContent = `${isCircleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add("show");
  restartButton.style.display = "Show"; // Show restart button
  disableBoard(); // Disable the board after game ends
}

function disableBoard() {
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
}

function drawWinningLine(winner) {
  const winningCombination = WINNING_COMBINATIONS.find((combination) =>
    combination.every((index) => cells[index].classList.contains(winner))
  );

  if (winningCombination) {
    const line = document.createElement("div");
    line.classList.add("winning-line");

    const cell1 = cells[winningCombination[0]];
    const cell3 = cells[winningCombination[2]];

    const rect1 = cell1.getBoundingClientRect();
    const rect3 = cell3.getBoundingClientRect();

    // Calculate start and end positions
    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const centerX3 = rect3.left + rect3.width / 2;
    const centerY3 = rect3.top + rect3.height / 2;

    const angle = Math.atan2(centerY3 - centerY1, centerX3 - centerX1) * (180 / Math.PI);
    const length = Math.sqrt(
      Math.pow(centerX3 - centerX1, 2) + Math.pow(centerY3 - centerY1, 2)
    );

    // Position and style the line
    line.style.width = `${length}px`;
    line.style.height = `8px`; // Adjust height for better visibility
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${centerX1}px`;
    line.style.top = `${centerY1 - 5}px`; // Adjust to center of the line

    document.body.appendChild(line);

    // Add animation
    setTimeout(() => {
      line.classList.add("animate-line");
    }, 100);
  }
}

function removeWinningLine() {
  const line = document.querySelector(".winning-line");
  if (line) {
    line.remove();
  }
}


function removeWinningLine() {
  const line = document.querySelector(".winning-line");
  if (line) {
    line.remove();
  }
}

restartButton.addEventListener("click", startGame);

startGame();

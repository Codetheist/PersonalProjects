// Constants
const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// State variables
let gameBoard = Array(9).fill("");
let playerOneName = null;
let playerTwoName = null;
let computerPiece = null;
let playerPiece = null;
let pieceToUse = null;
let playerOneScore = 0;
let playerTwoScore = 0;
let catScore = 0;
let gameDifficulty = null;
let currentPlayer = null;

// DOM elements
const gameStatusElement = document.getElementById("status");
const playerSelectionElement = document.getElementById("playerSelection");
const boardElement = document.getElementById("board");
const gameDifficultyLevelElement = document.getElementById("gameDifficultyLevel");
const gamePieceElement = document.getElementById("gamePiece");
const scoreBoardElement = document.getElementById("scoreBoard");
const resetButton = document.getElementById("reset");
const audioElement = document.getElementById("audio");

// Event listeners
document.addEventListener("DOMContentLoaded", init);

// Initialize the game
function init() {
    gameBoard.fill("");
    scoreBoardElement.innerHTML = ""; // Clear scoreboard on load
    displayPlayerSelection(); // Show player selection options
}

// Display player selection options
function displayPlayerSelection() {
    playerSelectionElement.innerHTML = `
        <div class="flex flex-col justify-center items-center">
            <h3 class="text-center text-2xl mb-4">How many players?</h3>
            <div class="grid grid-cols-2 gap-6" id="playerButtons">
                <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" id="onePlayer">One</button>
                <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" id="twoPlayers">Two</button>
            </div>
        </div>
    `;

    document.getElementById("onePlayer").addEventListener("click", () => handlePlayerSelection("one"));
    document.getElementById("twoPlayers").addEventListener("click", () => handlePlayerSelection("two"));
}

// Handle player selection
function handlePlayerSelection(mode) {
    // Check if player names are empty
    let validName = false;
    playerSelectionElement.innerHTML = ""; // Clear previous options
    if (mode === "one") {
        playerOneName = prompt("Player One, please enter your name:");
        while (!validName) {
            // Check to see if prompt was canceled to go back to initial screen
            if (playerOneName === null) {
                displayPlayerSelection();
                return;
            } else if (playerOneName.trim() === "") { // Check to see if name was entered if not give message name cannot be empty keep asking until name is entered
                alert("Name cannot be empty");
                playerOneName = prompt("Player One, please enter your name:");
            } else {
                validName = true;
                playerTwoName = "Computer";
                chooseXorO();
            }
        }
    } else {
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = prompt("Player Two, please enter your name:");
        while (!validName) {
            // Check if prompt was canceled on either name to go back to initial screen
            if (playerOneName === null || playerTwoName === null) {
                displayPlayerSelection();
                return;
                // Check to see if either names are empty if so give message name cannot be empty
            } else if (playerOneName.trim() === "" || playerTwoName.trim() === "") {
                alert("Name cannot be empty");
                playerOneName = prompt("Player One, please enter your name:");
                playerTwoName = prompt("Player Two, please enter your name:");
            } else {
                validName = true;
                chooseXorO();
            }
        }
    }
}

// Ask the user to choose X or O
function chooseXorO() {
    gamePieceElement.innerHTML = `
        <div class="flex flex-col justify-center items-center">
            <h3 class="text-center text-2xl mb-4">Do you want to be X or O?</h3>
            <div class="grid grid-cols-2 gap-10 mt-8">
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="gamePieceX">X</button>
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="gamePieceO">O</button>
            </div>
        </div>
    `;
    document.getElementById("gamePieceX").addEventListener("click", () => setPlayerPiece("X"));
    document.getElementById("gamePieceO").addEventListener("click", () => setPlayerPiece("O"));
}

// Set the player's piece
function setPlayerPiece(piece) {
    playerPiece = piece;
    computerPiece = piece === "X" ? "O" : "X";
    currentPlayer = playerOneName;

    if (playerTwoName === "Computer") {
        gamePieceElement.innerHTML = "";
        displayDifficultyButtons();
    } else {
        displayBoard();
    }
}

// Display Difficulty Level
function displayDifficultyButtons() {
    gameDifficultyLevelElement.innerHTML = `
        <div class="flex flex-col justify-center items-center">
            <h3 class="text-center text-2xl mb-4">Select the difficulty:</h3>
            <div class="grid grid-cols-3 gap-12 mt-8">
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="easy">Easy</button>
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="medium">Medium</button>
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="hard">Hard</button>
            </div>
        </div>
    `;
    document.getElementById("easy").addEventListener("click", () => setGameDifficulty("easy"));
    document.getElementById("medium").addEventListener("click", () => setGameDifficulty("medium"));
    document.getElementById("hard").addEventListener("click", () => setGameDifficulty("hard"));
}

// Set the game difficulty
function setGameDifficulty(difficulty) {
    gameDifficulty = difficulty;
    displayBoard();
}

// Display the game board and score
function displayBoard() {
    gameDifficultyLevelElement.innerHTML = ""; // Clear difficulty selection
    gamePieceElement.innerHTML = ""; // Clear piece selection
    scoreBoardElement.innerHTML = `
        <h3 class="text-center text-2xl mb-4">Score</h3>
        <div class="flex flex-col gap-16 justify-center items-center">
            <div class="grid grid-cols-3">
                <div><h3>${playerOneName}: <span id="playerOneScore">${playerOneScore}</span></h3></div>
                <div><h3>Cat: <span id="catScore">${catScore}</span></h3></div>
                <div><h3>${playerTwoName}: <span id="playerTwoScore">${playerTwoScore}</span></h3></div>
            </div>
        </div>
    `;

    // Create the game board
    boardElement.innerHTML = `
        <div class="grid grid-cols-3 gap-4 bg-gray-200 p-4 w-72">
            ${gameBoard.map((_, i) => `<div class="cell flex justify-center items-center bg-white h-20 w-20 text-3xl font-bold cursor-pointer" data-cell-index="${i}"></div>`).join("")}
        </div>
    `;

    // Display reset button
    resetButton.innerHTML = `<button class="mt-4 px-4 py-2 bg-gray-800 text-white rounded" onclick="resetGame()">Reset Game</button>`;

    // Add click event listeners to the cells
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", cellClicked);
    });

    // Play audio
    playAudio();
}

// Cell click event
function cellClicked(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute("data-cell-index");

    // Check if the cell is empty and it's the player's turn
    if (gameBoard[cellIndex] !== "") return;

    // Determin which piece to play
    if (currentPlayer === playerOneName) {
        pieceToUse = playerPiece;
    } else {
        // If another player is playing
        if (playerTwoName !== "Computer") {
            if (playerPiece === "X") {
                pieceToUse = "O";
            } else {
                pieceToUse = "X";
            }
        }
    }

    // Players move
    makeMove(cellIndex, pieceToUse);

    // Check game status after the player's move
    if (checkGameStatus(pieceToUse)) return;

    // Switch to computer's turn if applicable
    if (playerTwoName === "Computer") {
        // Play computer move after player's move
        setTimeout(computerMove, 500);
    } else {
        // Switch players if two players
        if (currentPlayer === playerOneName) {
            currentPlayer = playerTwoName;
        } else {
            currentPlayer = playerOneName;
        }
        console.log(currentPlayer);
    }
    updateStatus(`${currentPlayer}'s turn`);
}

// Make a move on the board
function makeMove(cellIndex, piece) {
    gameBoard[cellIndex] = piece;
    updateGameBoard();
}

// Computer move logic
function computerMove() {
    let move;
    switch (gameDifficulty) {
        case "easy":
            move = randomMove();
            break;
        case "medium":
            move = findWinningMove() || randomMove();
            break;
        case "hard":
            move = minimax(gameBoard, computerPiece).position;
            break;
    }
    makeMove(move, computerPiece);

    // Check game status after the computer's move
    checkGameStatus(computerPiece);
}

// Check the game status for win/tie after a move
function checkGameStatus(piece) {
    if (checkForWin(gameBoard, piece)) {
        updateStatus(`${piece === playerPiece ? playerOneName : playerTwoName} wins!`);
        updateScore(piece);
        setTimeout(clearBoard, 1000); // Reset board after a short delay
        return true;
    } else if (checkTie()) {
        updateStatus("It is a cat game!");
        catScore++;
        document.getElementById("catScore").textContent = catScore;
        setTimeout(clearBoard, 1000);
        return true;
    }

    // Switch player if no win/tie
    currentPlayer = currentPlayer === playerOneName ? playerTwoName : playerOneName;
    updateStatus(`${currentPlayer}'s turn`);
    return false;
}

// Update the status display
function updateStatus(message) {
    gameStatusElement.textContent = message;
}

// Update the scoreboard
function updateScore(piece) {
    if (piece === playerPiece) {
        playerOneScore++;
        document.getElementById("playerOneScore").textContent = playerOneScore;
    } else {
        playerTwoScore++;
        document.getElementById("playerTwoScore").textContent = playerTwoScore;
    }
}

// Clear the game board
function clearBoard() {
    gameBoard.fill("");
    displayBoard();
}

// Update the game board UI
function updateGameBoard() {
    gameBoard.forEach((piece, index) => {
        const cell = document.querySelector(`.cell[data-cell-index="${index}"]`);
        cell.textContent = piece;
        // Add border for visual separation
        cell.style.border = "2px solid black";
        // Giving background color for visual separation
        cell.style.backgroundColor = "lightgray";
    });
}

// Check for a win condition
function checkForWin(board, piece) {
    return WIN_CONDITIONS.some(condition => {
        return condition.every(index => board[index] === piece);
    });
}

// Check for a tie
function checkTie() {
    return gameBoard.every(cell => cell !== "");
}

// Generate a random move for the computer
function randomMove() {
    const emptyCells = gameBoard.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Find a winning move for the computer
function findWinningMove() {
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === "") {
            gameBoard[i] = computerPiece;
            if (checkForWin(gameBoard, computerPiece)) {
                gameBoard[i] = ""; // Reset the cell
                return i;
            }
            gameBoard[i] = ""; // Reset the cell
        }
    }
    return null;
}

// Minimax algorithm for hard difficulty
function minimax(board, piece) {
    const availableCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

    if (checkForWin(board, playerPiece)) return { score: -10 };
    if (checkForWin(board, computerPiece)) return { score: 10 };
    if (availableCells.length === 0) return { score: 0 };

    let moves = [];
    for (const cell of availableCells) {
        board[cell] = piece;
        const result = minimax(board, piece === computerPiece ? playerPiece : computerPiece);
        moves.push({ score: result.score, position: cell });
        board[cell] = ""; // Reset the cell
    }

    return piece === computerPiece
        ? moves.reduce((bestMove, move) => (move.score > bestMove.score ? move : bestMove), { score: -Infinity })
        : moves.reduce((bestMove, move) => (move.score < bestMove.score ? move : bestMove), { score: Infinity });
}

// Audio
function playAudio() {
    audioElement.innerHTML = `
    <audio id="crossfade" class="w3-display-bottommiddle" controls loop autoplay>
        <source src="audio/home.mp3" type="audio/mp3" />
    </audio>`
}

// Reset the game
function resetGame() {
    playerOneName = null;
    playerTwoName = null;
    computerPiece = null;
    playerPiece = null;
    gameBoard = Array(9).fill("");
    playerOneScore = 0;
    playerTwoScore = 0;
    catScore = 0;
    gameDifficulty = null;
    currentPlayer = null;
    gameStatusElement.textContent = "";
    scoreBoardElement.innerHTML = "";
    boardElement.innerHTML = "";
    resetButton.innerHTML = "";
    audioElement.innerHTML = "";
    displayPlayerSelection();
}
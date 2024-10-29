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
let playerOneName = null;
let playerTwoName = null;
let computerPiece = null;
let playerPiece = null;
let gameBoard = Array(9).fill("");
let playerOneScore = 0;
let playerTwoScore = 0;
let tieScore = 0;
let gameDifficulty = null;

// DOM elements
const gameStatusElement = document.querySelector("#status");
const playerSelectionElement = document.getElementById("playerSelection");
const boardElement = document.getElementById("board");
const gameDifficultyLevelElement = document.getElementById("gameDifficultyLevel");
const gamePieceElement = document.getElementById("gamePiece");
const scoreBoardElement = document.getElementById("scoreBoard");

// Event listeners
document.addEventListener("DOMContentLoaded", init);

// Initialize the game
function init() {
    playerSelectionElement.innerHTML = `
	<div class="flex flex-col justify-center items-center">
		<h3 class="text-center text-2xl mb-4">How many players?</h3>
		<div class="grid grid-cols-2 gap-6" id="playerButtons">
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" id="onePlayer">One</button>
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" id="twoPlayers">Two</button>
        </div>
    </div>
    `;
    gameBoard.fill("");
    scoreBoardElement.innerHTML = "";

    document.getElementById("onePlayer").addEventListener("click", handlePlayerSelection);
    document.getElementById("twoPlayers").addEventListener("click", handlePlayerSelection);
}

// Handle player selection
function handlePlayerSelection(event) {
    // Clear previous selections
    playerSelectionElement.innerHTML = "";
    const { id } = event.target;
    if (id === "onePlayer") {
        // Ask the user to type their name
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = "Computer";
        chooseXorO();
    } else if (id === "twoPlayers") {
        // Ask user for their names
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = prompt("Player Two, please enter your name:");
        chooseXorO();
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
        // Clear the game piece selection
        gamePieceElement.innerHTML = "";
        displayDifficultyButtons(); // Show difficulty selection for one player
    } else {
        displayBoard(); // Directly show the board for two players
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

// Display board
function displayBoard() {
    gameDifficultyLevelElement.innerHTML = ""; // Clear difficulty selection
    gamePieceElement.innerHTML = ""; // Clear piece selection
    scoreBoardElement.innerHTML = ""; // Hide the scoreboard until the game starts

    // Create the game board
    boardElement.innerHTML = `
        <div class="flex justify-center text-white">
            <div class="grid grid-cols-3 gap-4">
                ${gameBoard.map((_, i) => `<div class="cell" data-cell-index="${i}"></div>`).join("")}
            </div>
        </div>
    `;

    // Show the scoreboard only after the game starts
    scoreBoardElement.innerHTML = `
        <h3 class="text-center text-2xl mb-4">Score: </h3>
        <div class="flex flex-col gap-16 justify-center items-center">
            <div class="grid grid-cols-3">
                <div><h3>${playerOneName}: <span id="playerOneScore">${playerOneScore}</span></h3></div>
                <div><h3>Ties: <span id="tieScore">${tieScore}</span></h3></div>
                <div><h3>${playerTwoName}: <span id="playerTwoScore">${playerTwoScore}</span></h3></div>
            </div>
        </div>
    `;

    // Update game board display
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", cellClicked);
    });
}

// Cell click event
function cellClicked(event) {
    const CELL_INDEX = event.target.getAttribute("data-cell-index");
    if (gameBoard[CELL_INDEX] !== "" || currentPlayer !== playerOneName) {
        return;
    }
    gameBoard[CELL_INDEX] = playerPiece;
    updateGameBoard();
    if (checkForWin(gameBoard, playerPiece)) {
        gameStatusElement.innerHTML = winMessage();
        playerOneScore++;
        updateScore();
        resetBoard();
    } else if (checkTie(gameBoard)) {
        gameStatusElement.innerHTML = "It's a tie!";
        tieScore++;
        updateScore();
        resetBoard();
    } else {
        currentPlayer = playerTwoName;
        if (playerTwoName === "Computer") {
            setTimeout(computerTurn, 500);
        }
    }
}

// Computer turn
function computerTurn() {
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
    gameBoard[move] = computerPiece;
    updateGameBoard();
    if (checkForWin(gameBoard, computerPiece)) {
        gameStatusElement.innerHTML = winMessage();
        playerTwoScore++;
        updateScore();
        resetBoard();
    } else if (checkTie(gameBoard)) {
        gameStatusElement.innerHTML = "It's a tie!";
        tieScore++;
        updateScore();
        resetBoard();
    } else {
        currentPlayer = playerOneName;
    }
}

// Update score
function updateScore() {
    document.getElementById("playerOneScore").textContent = playerOneScore;
    document.getElementById("tieScore").textContent = tieScore;
    document.getElementById("playerTwoScore").textContent = playerTwoScore;
}

// Update gameboard
function updateGameBoard() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.textContent = gameBoard[i];
    });
}

// Use the minimax algorithm to choose the best move
function minimax(gameBoard, player) {
    // Base cases
    if (checkForWin(gameBoard, computerPiece)) {
        return { score: 10 };
    } else if (checkForWinner(gameBoard, playerPiece)) {
        return { score: -10 };
    } else if (getAvailableMoves(gameBoard).length === 0) {
        return { score: 0 };
    }

    // Recursive case
    let moves = [];
    getAvailableMoves(gameBoard).forEach((move) => {
        let newBoard = makeMove(gameBoard, move, player);
        let moveScore = minimax(newBoard, player === computerPiece ? playerPiece : computerPiece).score;
        moves.push({ position: move, score: moveScore });
    });

    // Choose the best move
    let bestMove;
    if (player === computerPiece) {
        let bestScore = -Infinity;
        moves.forEach((move) => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((move) => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }
    return bestMove;
}

function checkForWin(gameBoard, playerPiece) {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
        const [a, b, c] = WIN_CONDITIONS[i];

        // Check all positions are the same and not empty
        if (gameBoard[a] === playerPiece && gameBoard[b] === playerPiece && gameBoard[c] === playerPiece) {
            return true;
        }
    }
    return false;
}

function checkTie(gameBoard) {
    // If all cells are filled and no player has won, it's a tie
    if (gameBoard.every(cell => cell !== "")) {
        gameStatusElement.innerHTML = "It's a tie!";
        tieScore++;
        return true;
    }
    return false;
}

// Win message
function winMessage() {
    // If the game is against the computer, display a different message
    if (playerTwoName === "Computer") {
        return currentPlayer === playerPiece
            ? "You win!"
            : "You lose!";
    } else {
        return currentPlayer === playerPiece
            ? `${playerOneName} wins!`
            : `${playerTwoName} wins!`;
    }
}

// Reset board
function resetBoard() {
    gameBoard.fill("");
    gameStatusElement.innerHTML = "";
    displayBoard();
}
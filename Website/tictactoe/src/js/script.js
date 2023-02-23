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
let gameState = null;
let playerOneName = null;
let playerTwoName = null;
let playerX = null;
let playerO = null;
let computerPiece = null;
let playerPiece = null;
let gameBoard = null;
let playerOneScore = 0;
let playerTwoScore = 0;
let tieScore = 0;

// DOM elements
const gameStatusElement = document.querySelector("#status");
const playerSelectionElement = document.getElementById("playerSelection");
const boardElement = document.getElementById("board");
const playerButtonsElement = document.getElementById("playerButtons");
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
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" onclick="handlePlayerSelection()" id="onePlayer">One</button>
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" onclick="handlePlayerSelection()" id="twoPlayers">Two</button>
        </div>
    </div>
    `;
    playerSelectionElement.addEventListener("click", handlePlayerSelection);
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll("#cell").forEach(cell => cell.innerHTML = "");
}

// Handle player selection
function handlePlayerSelection(event) {
    const { id } = event.target;
    if (id === "onePlayer") {
        // Clear the player buttons and choose X or O
        playerSelectionElement.innerHTML = "";
        // Ask the user to type their name
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = "Computer";
        chooseXorO();
    } else if (id === "twoPlayers") {
        // Ask user for their names
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = prompt("Player Two, please enter your name:");
        // Clear the player buttons and choose X or O
        playerSelectionElement.innerHTML = "";
        chooseXorO();
    }
}

// Extract common code into a function
function displayGamePieceButtons(playerPieceOptions, playerPieceCallback) {
    gamePieceElement.innerHTML = `
    <div class="flex flex-col justify-center items-center">
        <h3 class="text-center text-2xl mb-4">Do you want to be X or O?</h3>
        <div class="grid grid-cols-2 gap-10 mt-8">
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="playerX">${playerPieceOptions[0]}</button>
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="playerO">${playerPieceOptions[1]}</button>
        </div>
    </div>
    `;
    document.getElementById('playerX').addEventListener('click', () => playerPieceCallback(playerPieceOptions[0]));
    document.getElementById('playerO').addEventListener('click', () => playerPieceCallback(playerPieceOptions[1]));
}

// Ask the user to choose X or O
function chooseXorO(event) {
    gamePieceElement.innerHTML = `
		<div class="flex flex-col justify-center items-center">
			<h3 class="text-center text-2xl mb-4">Do you want to be X or O?</h3>
				<div class="grid grid-cols-2 gap-10 mt-8">
					<button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="playerX">X</button>
					<button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="playerO">O</button>
				</div>
		</div>
	`;
    if (!event || !event.target || !event.target.id) {
        //const playerId = event.target.id;

        if (playerTwoName === "Computer") {
            // Display the player buttons
            displayGamePieceButtons(['X', 'O'], (playerPiece) => {
                playerPiece === 'X' ? [playerPiece, computerPiece] = ['X', 'O'] : [playerPiece, computerPiece] = ['O', 'X'];
                document.removeEventListener('click', chooseXorO);
                document.addEventListener('click', displayDifficultyButtons);
            });
        } else {
            // Display the player buttons
            displayGamePieceButtons(['X', 'O'], (playerPiece) => {
                playerPiece === 'X' ? [playerX, playerO] = ['X', 'O'] : [playerO, playerX] = ['O', 'X'];
                // Display the player names and their game pieces
                if (playerX === 'X') {
                    const gameStateText = `${playerOneName} is ${playerX} and ${playerTwoName} is ${playerO}`;
                    gameState = gameStateText;
                } else {
                    const gameStateText = `${playerOneName} is ${playerO} and ${playerTwoName} is ${playerX}`;
                    gameState = gameStateText;
                }
                document.removeEventListener('click', chooseXorO);
                document.addEventListener('click', displayBoard);
            });
        }
    }
}

// Display Difficulty Level
function displayDifficultyButtons() {
    const EASY_BUTTON_ID = "easy";
    const MEDIUM_BUTTON_ID = "medium";
    const HARD_BUTTON_ID = "hard";

    // Display the difficulty buttons
    document.querySelector("#gamePiece").innerHTML = "";
    gameDifficultyLevelElement.innerHTML = `
    <div class="flex flex-col justify-center items-center">
        <h3 class="text-center text-2xl mb-4">Select the difficulty:</h3>
        <div class="grid grid-cols-3 gap-12 mt-8">
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="${EASY_BUTTON_ID}">Easy</button>
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="${MEDIUM_BUTTON_ID}">Medium</button>
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="${HARD_BUTTON_ID}">Hard</button>
        </div>
    </div>
    `;
}

function gameDifficulty(event) {
    
    // Set the difficulty level
    let difficulty;

    // Check if the player is playing against the computer
    if (playerTwoName === "Computer") {
        // Check if the event was triggered and get the difficulty from the event
        if (event && event.target && event.target.id) {
            difficulty = event.target.id;
            switch (difficulty) {
                case EASY_BUTTON_ID:
                    difficulty = "easy";
                    break;
                case MEDIUM_BUTTON_ID:
                    difficulty = "medium";
                    //displayBoard();
                    break;
                case HARD_BUTTON_ID:
                    difficulty = "hard";
                    //displayBoard();
                    break;
                default:
                    break;
            }
            // Display the difficulty button again
            displayDifficultyButtons();
        } else {
            // If no event was triggered, display board
            displayBoard();
        }
    } else {
        // If the player is playing against another player, display the board
        displayBoard();
    }
}

// Display board
function displayBoard() {
    const gameDifficultyLevel = document.querySelector("#gameDifficultyLevel");
    gameDifficultyLevel.innerHTML = "";
    document.querySelector("#gamePiece").innerHTML = "";

    const gameBoard = `
    <div class="flex justify-center text-white">
        <div class="grid grid-cols-3 gap-2 border-8 h-96 w-96">
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="0"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="1"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="2"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="3"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="4"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="5"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="6"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="7"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl cell" data-cell-index="8"></div>
        </div>
    </div>
    `;
    boardElement.innerHTML = gameBoard;

    const scoreBoard = `
    <h3 class="text-center text-2xl mb-4">Score: </h3>
    <div class="flex flex-col gap-16 justify-center items-center">
        <div class="grid grid-cols-3">
            <div class="left-0 top-0">
                <h3 class="text-center text-2xl mb-4" id="playerOneName">${playerOneName}: </h3>
                <div class="text-center text-2xl mb-4" id="playerOneScore">${playerOneScore}</div>
            </div>

            <div class="top-0 left-0 right-0">
                <h3 class="text-center text-2xl mb-4">Tie: </h3>
                <div class="text-center text-2xl mb-4" id="tieScore">${tieScore}</div>
            </div>

            <div class="top-0 right-0">
                <h3 class="text-center text-2xl mb-4" id="playerTwoName">${playerTwoName}: </h3>
                <div class="text-center text-2xl mb-4" id="playerTwoScore">${playerTwoScore}</div>
            </div>
        </div>
    </div>
    `;
    scoreBoardElement.innerHTML = scoreBoard;

    gameLogic();
}

// Create Game Logic
function gameLogic() {
    let currentPlayer = playerOneName;

    /*// Show player vs player or computer vs player status
    let gameStatus = document.querySelector("#gameStatus");
    if (playerTwoName === "Computer") {
        gameStatus.textContent = "Computer vs Player";
    } else {
        gameStatus.textContent = "Player vs Player";
    }*/

    // Add click event listeners to each cell
    document.querySelectorAll("#cell").forEach((cell) => {
        cell.addEventListener("click", () => {
            // Mark cell with player's symbol
            cell.textContent = currentPlayer.symbol;

            // Check for win or tie
            if (checkWin(currentPlayer) || checkTie(gameBoard)) {
                updateScore();
                resetBoard();
            } else {
                // Switch to the other player
                currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
            }
        });
    });

    //playersTurn();
}

// Cell click event
function cellClicked(event) {
    try {
        const CELL_CLICKED = event.target;
        const CELL_NUMBER = parseInt(CELL_CLICKED.getAttribute("data-cell-index"));

        if (isNaN(CELL_NUMBER)) {
            throw new Error("Invalid cell index");
        }

        if (gameBoard[CELL_NUMBER] !== "") {
            return;
        }

        CELL_CLICKED.style.color = currentPlayer === "X" ? "#2b2b2b" : "#f4f4f4";
        playGame(CELL_CLICKED, CELL_NUMBER);
        gameLogic();
        updateGameStatus();
    } catch (error) {
        console.error(error);
    }
}

// Computer turn
function computerTurn(gameBoard, difficulty, computerPiece) {
    let emptyCells = [];
    let computerMove;

    switch (difficulty) {
        case "easy":
            // Loop through the board to find an empty cell to play in
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard[i][j] === "") {
                        emptyCells.push([i, j]);
                    }
                }
            }
            if (emptyCells.length > 0) {
                computerMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            } else {
                console.log("No available moves.");
            }
            break;

        case "medium":
            // Check if the computer can win, block if not, otherwise choose a random empty cell
            computerMove = findWinningMove(gameBoard, computerPiece) ||
                findWinningMove(gameBoard, getOpponentPiece(computerPiece)) ||
                chooseRandomMove(gameBoard);
            break;

        case "hard":
            // Use the minimax algorithm to choose the best move
            computerMove = minimax(gameBoard, computerPiece).position;
            break;

        default:
            console.error(`Invalid difficulty level: ${difficulty}`);
    }

    return computerMove;
}

// Players turn
function playersTurn(event) {
    // Get the cell that was clicked
    const CELL_CLICKED = event.target;
    const CELL_NUMBER = parseInt(CELL_CLICKED.getAttribute("data-cell-index"));

    // If the cell is already filled or the game is over, do nothing
    if (gameBoard[CELL_NUMBER] !== "") {
        return;
    }

    // Update the game board with the player's move
    gameBoard[CELL_NUMBER] = currentPlayer;

    // Update the UI to show the player's move
    CELL_CLICKED.innerHTML = currentPlayer;
    CELL_CLICKED.style.color = currentPlayer === "X" ? "#2b2b2b" : "#f4f4f4";

    // Check if the player has won
    if (checkForWin(currentPlayer)) {
        endGame(false);
        return;
    }

    // Check if the game is a tie
    if (isTie()) {
        endGame(true);
        return;
    }

    // Switch to the other player's turn
    switchPlayer();
}

// Play game
function playGame(CELL_CLICKED, CELL_NUMBER) {
    gameBoard[CELL_NUMBER] = currentPlayer;
    CELL_CLICKED.innerHTML = currentPlayer;
}

function switchPlayer() {
    currentPlayer == currentPlayer === playerX ? playerO : playerX;
}


// Update score
function updateScore() {
    playerOneScore > playerTwoScore
        ? document.getElementById("playerOneScore").innerHTML = ++playerOneScore
        : playerOneScore < playerTwoScore
            ? document.getElementById("playerTwoScore").innerHTML = ++playerTwoScore
            : document.getElementById("tieScore").innerHTML = ++tieScore;
}

// Use the minimax algorithm to choose the best move
function minimax(gameBoard, player) {
    // Base cases
    if (checkForWinner(gameBoard, computerPiece)) {
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
    let isRoundOver = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = WIN_CONDITIONS[i];
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            isRoundOver = true;
            break
        }
    }

    if (isRoundOver) {
        gameStatusElement.innerHTML = winMessage();
        updateScore();
        return;
    }

    return isRoundOver;
}

function checkTie(gameBoard) {
    // If all cells are filled and no player has won, it's a tie
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameBoard[i][j] === "") {
                return false;
            }
        }
        gameStatusElement.innerHTML = "It's a tie!";
        tieScore++;
    }

    return true;
}

// Win message
function winMessage() {
    // If the game is against the computer, display a different message
    if (playerTwoName === "Computer") {
        return currentPlayer === playerX
            ? "You win!"
            : "You lose!";
    } else {
        return currentPlayer === playerX
            ? `${playerOneName} wins!`
            : `${playerTwoName} wins!`;
    }
}

// Check for win
checkWin = (gameBoard, playerPiece) => {
    let isRoundOver = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = WIN_CONDITIONS[i];
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            isRoundOver = true;
            break
        }
    }

    if (isRoundOver) {
        gameStatusElement.innerHTML = winMessage();
        updateScore();
        return;
    }

    return isRoundOver;
}

// Reset board
function resetBoard() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = playerX;
    gameStatusElement.innerHTML = "";
    document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");
}
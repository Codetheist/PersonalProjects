// Constant variables
//const GAME_STATE = document.querySelector("#status");
const PLAYER_SELECTION = document.getElementById("playerSelection");
//const GAME_BOARD = document.getElementById("board");

// Changeable variables
let isGameActive = true;
let difficulty = "";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let onePlayer = document.getElementById("playerOne");
let twoPlayers = document.getElementById("playerTwo");
let scoreBoard = document.getElementById("scoreBoard");
let playerOneScore = 0;
let playerTwoScore = 0;
let tieScore = 0;
let playerOneName = document.getElementById("playerOneName");
let playerTwoName = document.getElementById("playerTwoName");
let gameBoards = document.getElementById("board");
let playerX = document.getElementById("playerX");
let playerO = document.getElementById("playerO");
let difficultyButton = document.getElementById("gameDifficultyLevel");
let gamePiece = document.getElementById("gamePiece");
let playerButtons = document.getElementById("playerButtons");

const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//const currentTurn = () => "Player " + player + "'s turn";
init();

// Initialize the game
function init() {
    PLAYER_SELECTION.innerHTML = `
    <div class="flex flex-col justify-center items-center">
        <h3 class="text-center text-2xl mb-4">How many players?</h3>
        <div class="grid grid-cols-2 gap-6" id="playerButtons">
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" onclick="numberOfPlayers()" id="playerOne">One</button>
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" onclick="numberOfPlayers()" id="playerTwo">Two</button>
        </div>
    </div>
    `;
    isGameActive = false;
    player = "X";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll("#cell").forEach(cell => cell.innerHTML = "");
    numberOfPlayers();
}

// To play the game
function playGame(CELL_CLICKED, CELL_NUMBER) {
    gameBoard[CELL_NUMBER] = player;
    CELL_CLICKED.innerHTML = player;
}


// Change the player turn
function changePlayer() {
    player = player === "X" ? "O" : "X";
}

// Create Game Logic
function gameLogic() {
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
        isGameActive = false;
        return;
    }

    let isDraw = !gameBoard.includes("");
    if (isDraw) {
        isGameActive = false;
        return;
    }

    changePlayer();
}

// Win message
function winMessage() {
    return "Player " + player + " wins!";
}

// Tie message
function tieMessage() {
    return "It's a tie!";
}

// Cell click event
function cellClicked(event) {
    const CELL_CLICKED = event.target;
    const CELL_NUMBER = parseInt(CELL_CLICKED.getAttribute("data-cell-index"));

    if (gameBoard[CELL_NUMBER] !== "" || !isGameActive) {
        return;
    }

    playGame(CELL_CLICKED, CELL_NUMBER);
    gameLogic();
}

// Function for game difficulty
function gameDifficulty() {
    difficultyButton.innerHTML = `
    <div class="flex flex-col justify-center items-center">
        <h3 class="text-center text-2xl mb-4">Select the difficulty:</h3>
        <div class="grid grid-cols-3 gap-12 mt-8">
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="easy">Easy</button>
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="medium">Medium</button>
            <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="hard">Hard</button>
        </div>
    </div>
    `;
    let easyButton = document.getElementById("easy");
    let mediumButton = document.getElementById("medium");
    let hardButton = document.getElementById("hard");
    document.querySelector("#easy").addEventListener("click", () => {
        difficulty = easyButton;
    });
    document.querySelector("#medium").addEventListener("click", () => {
        difficulty = mediumButton;
    });
    document.querySelector("#hard").addEventListener("click", () => {
        difficulty = hardButton;
    });
}

// Computer Turn
function computerTurn(gameBoard, difficulty) {
    let availableMoves = [];
    let computerMove;
    switch (difficulty) {
        case "easy":
            // Loop through the board to find an empty cell to play in
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard[i][j] === "") {
                        // Choose a random empty cell
                        availableMoves.push([i, j]);
                        //gameBoard[i][j] = changePlayer();
                        //return gameBoard;
                    }
                }
            }
            computerMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            break;
        case "medium":
            // Check if the computer can win, block if not, otherwise choose a random empty cell
            computerMove = checkForWinningMove(gameBoard, "O");
            if (!computerMove) {
                computerMove = checkForWinningMove(gameBoard, "X");
                if (!computerMove) {
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (board[i][j] === "") {
                                availableMoves.push([i, j]);
                            }
                        }
                    }
                    computerMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
            }
            break;
        case "hard":
            // Use the minimax algorithm to choose the best move
            computerMove = minimax(gameBoard, "O").position;
            break;
        default:
            console.error("Invalid difficulty level!");
    }
}

// Select number of players
function numberOfPlayers() {    
    /*// Create an event listener for the player buttons
    onePlayer.addEventListener("click", () => {
        // Clear the player buttons and display the difficulty buttons
        document.querySelector("#playerButtons").innerHTML = "";
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = "Computer";
        chooseXorO();
        gameDifficulty();
        displayScore();
        displayGameBoard();
    });

    twoPlayers.addEventListener("click", () => {
        // Ask user for their names
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = prompt("Player Two, please enter your name:");
        // Clear the player buttons
        document.querySelector("#playerButtons").innerHTML = "";
        displayScore();
        displayGameBoard();
    });*/
}

function displayScore() {
    // Display score using Tailwind CSS
    scoreBoard.innerHTML = `
    <!-- Display player names and scores -->
    <h3 class="text-center text-2xl mb-4">Score: </h3>
    <div class="flex flex-col gap-16 justify-center items-center">
        <div class="grid grid-cols-3">
            <div class="left-0 top-0">
                <h3 class="text-center text-2xl mb-4" id="playerOneName">${playerOneName}: </h3>
                <div class="text-center text-2xl mb-4" id="playerOneScore">0</div>
            </div>

            <div class="top-0 left-0 right-0">
                <h3 class="text-center text-2xl mb-4">Tie: </h3>
                <div class="text-center text-2xl mb-4" id="tieScore">0</div>
            </div>

            <div class="top-0 right-0">
                <h3 class="text-center text-2xl mb-4" id="playerTwoName">${playerTwoName}: </h3>
                <div class="text-center text-2xl mb-4" id="playerTwoScore">0</div>
            </div>
        </div>
    </div>
    `;
}

// Draw tic tac toe board
function displayGameBoard() {
    gameBoards.innerHTML = `
    <div class="flex justify-center text-white">
        <div class="grid grid-cols-3 gap-2 border-8 h-96 w-96">
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="0" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="1" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="2" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="3" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="4" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="5" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="6" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="7" id="cell"></div>
            <div class="bg-black p-5 rounded cursor-pointer flex justify-center items-center text-6xl" data-cell-index="8" id="cell"></div>
        </div>
    </div>
    `;
}

// Function to ask the user to choose X or O
function chooseXorO() {
    // Display the player buttons
    gamePiece.innerHTML = `
    <div class="flex flex-col justify-center items-center">
        <h3 class="text-center text-2xl mb-4">Do you want to be X or O?</h3>
            <div class="grid grid-cols-2 gap-10 mt-8">
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="playerX">X</button>
                <button class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md rounded" id="playerO">O</button>
            </div>
    </div>
    `;
}

// Event listeners
document.querySelectorAll("#cell").forEach(cell => (cell.addEventListener("click", cellClicked)));
document.querySelector("#reset").addEventListener("click", resetGame);


// Reset the game
function resetGame() {
    init();
}

//Refresh the page
//window.onload = init();
// Constant variables
//const GAME_STATE = document.querySelector("#status");
const PLAYER_SELECTION = document.getElementById("playerSelection");
//const GAME_BOARD = document.getElementById("board");

// Player variables
const TWO_PLAYERS = document.getElementById("twoPlayers");
let playerOneName = document.getElementById("playerOneName");
let playerTwoName = document.getElementById("playerTwoName");
let playerX, playerO, playerPiece, computerPiece;
let playerButtons = document.getElementById("playerButtons");

//Game variables
let isGameActive = true;
let difficulty = "";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameBoards = document.getElementById("board");
let difficultyButton = document.getElementById("gameDifficultyLevel");
let gamePiece = document.getElementById("gamePiece");

// Scoreboard variables
let scoreBoard = document.getElementById("scoreBoard");
let playerOneScore = 0;
let playerTwoScore = 0;
let tieScore = 0;

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
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" onclick="numberOfPlayers()" id="onePlayer">One</button>
            <button type="button" class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-md" onclick="numberOfPlayers()" id="twoPlayers">Two</button>
        </div>
    </div>
    `;
    numberOfPlayers();
    /*
    isGameActive = false;
    player = "X";
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll("#cell").forEach(cell => cell.innerHTML = "");
    */
}

// To play the game
/*function playGame(CELL_CLICKED, CELL_NUMBER) {
    gameBoard[CELL_NUMBER] = player;
    CELL_CLICKED.innerHTML = player;
}*/

// Create Game Logic
function gameLogic() {
    /*
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
    }*/
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
function gameDifficulty(event) {
    document.querySelector("#gamePiece").innerHTML = "";
    if (event && event.target && event.target.id) {
        let easyButton = document.getElementById("easy");
        let mediumButton = document.getElementById("medium");
        let hardButton = document.getElementById("hard");
        difficulty = event.target.id;
        // Select the difficulty
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

        if (difficulty === "easy") {
            difficulty = easyButton;
            gameLogic();
        } else if (difficulty === "medium") {
            difficulty = mediumButton;
            computerTurn(gameBoard, difficulty);
        } else if (difficulty === "hard") {
            difficulty = hardButton;
            computerTurn(gameBoard, difficulty);
        } else {
            alert("Please select a difficulty level.");
        }
    }
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
            computerMove = minimax(gameBoard, computerPiece).position;
            break;
        default:
            console.error("Invalid difficulty level!");
    }
}

// Select number of players
function numberOfPlayers(event) {
    if (event && event.target && event.target.id) {
        const PLAYER_SELECTION_ID = event.target.id;
        if (PLAYER_SELECTION_ID === "onePlayer") {
            // Clear the player buttons and choose X or O
            document.querySelector("#playerSelection").innerHTML = "";
            playerOneName = prompt("Player One, please enter your name:");
            playerTwoName = "Computer";
            chooseXorO();
        } else if (PLAYER_SELECTION_ID === "twoPlayers") {
            // Ask user for their names
            playerOneName = prompt("Player One, please enter your name:");
            playerTwoName = prompt("Player Two, please enter your name:");
            // Clear the player buttons and choose X or O
            document.querySelector("#playerSelection").innerHTML = "";
            chooseXorO();
        }
    }
}

function displayScore() {
    // Check to see if it's one player or two player
    if (playerTwoName === "Computer") {
        // Display score
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
    } else {
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
function chooseXorO(event) {
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
    if (event && event.target && event.target.id) {
        if (playerTwoName === "Computer") {
            if (event.target.id === "playerX") {
                document.querySelector("#gamePiece").innerHTML = "";
                playerPiece = "X";
                computerPiece = "O";
                // Add event listener to the game difficulty buttons
                //document.querySelector("#gameDifficultyLevel").addEventListener("click", gameDifficulty);
            } else if (event.target.id === "playerO") {
                document.querySelector("#gamePiece").innerHTML = "";
                playerPiece = "O";
                computerPiece = "X";
                gameDifficulty();
                // Add event listener to the game board
                //document.querySelector("#gameBoards").addEventListener("click", handleCellClick);
            }
        } else {
            if (event.target.id === "playerX") {
                document.querySelector("#gamePiece").innerHTML = "";
                playerX = "X";
                playerO = "O";
                displayGameBoard();
                // Add event listener to the game board
                document.querySelector("#gameBoards").addEventListener("click", handleCellClick);
            } else if (event.target.id === "playerO") {
                document.querySelector("#gamePiece").innerHTML = "";
                playerO = "O";
                playerX = "X";
                gamePiece.innerHTML = "";
                displayGameBoard();
                // Add event listener to the game board
                document.querySelector("#gameBoards").addEventListener("click", handleCellClick);
            }
        }
    }
}

// Event listeners
document.querySelectorAll("#cell").forEach(cell => (cell.addEventListener("click", cellClicked)));
//document.querySelector("#reset").addEventListener("click", resetGame);
document.addEventListener("click", numberOfPlayers);
//document.addEventListener("click", chooseXorO);
document.addEventListener("click", gameDifficulty);


// Reset the game
function resetGame() {
    init();
}

//Refresh the page
//window.onload = init();
const GAME_STATE = document.querySelector("#status");

let isGameActive = true;
let player = "X";
let difficulty = "";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let playerOne = document.getElementById("playerOne");
let playerTwo = document.getElementById("playerTwo");
let scoreBoard = document.getElementById("scoreBoard");
let playerOneScore = 0;
let playerTwoScore = 0;
let tieScore = 0;
let playerOneName = document.getElementById("playerOneName");
let playerTwoName = document.getElementById("playerTwoName");

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

const currentTurn = () => "Player " + player + "'s turn";

GAME_STATE.innerHTML = currentTurn();

init();

// Initialize the game
function init() {
    isGameActive = true;
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
    GAME_STATE.innerHTML = currentTurn();
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
        GAME_STATE.innerHTML = winMessage();
        isGameActive = false;
        return;
    }

    let isDraw = !gameBoard.includes("");
    if (isDraw) {
        GAME_STATE.innerHTML = tieMessage();
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
    // Create a button to select difficulty
    let difficultyButton = document.createElement("button");
    difficultyButton.setAttribute("id", "difficulty");
    difficultyButton.innerHTML = "Select Difficulty";
    document.querySelector("#difficulty").appendChild(difficultyButton);
    // Create a div to display the difficulty
    let difficultyDisplay = document.createElement("div");
    difficultyDisplay.setAttribute("id", "difficultyDisplay");
    document.querySelector("#difficultyDisplay").appendChild(difficultyDisplay);
    // Create a button to select easy difficulty
    let easyButton = document.createElement("button");
    easyButton.setAttribute("id", "easy");
    easyButton.innerHTML = "Easy";
    document.querySelector("#easy").appendChild(easyButton);
    // Create a button to select medium difficulty
    let mediumButton = document.createElement("button");
    mediumButton.setAttribute("id", "medium");
    mediumButton.innerHTML = "Medium";
    document.querySelector("#medium").appendChild(mediumButton);
    // Create a button to select hard difficulty
    let hardButton = document.createElement("button");
    hardButton.setAttribute("id", "hard");
    hardButton.innerHTML = "Hard";
    document.querySelector("#hard").appendChild(hardButton);
    // Add event listeners to the difficulty buttons
    document.querySelector("#easy").addEventListener("click", () => {
        difficulty = "easy";
        document.querySelector("#difficultyDisplay").innerHTML = "Difficulty: Easy";
    });
    document.querySelector("#medium").addEventListener("click", () => {
        difficulty = "medium";
        document.querySelector("#difficultyDisplay").innerHTML = "Difficulty: Medium";
    });
    document.querySelector("#hard").addEventListener("click", () => {
        difficulty = "hard";
        document.querySelector("#difficultyDisplay").innerHTML = "Difficulty: Hard";
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
    // Create an event listener for the player buttons
    playerOne.addEventListener("click", () => {
        // Clear the player buttons and display the difficulty buttons
        document.querySelector("#playerButtons").innerHTML = "";
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = "Computer";
        displayScore();
    });

    playerTwo.addEventListener("click", () => {
        // Ask user for their names
        playerOneName = prompt("Player One, please enter your name:");
        playerTwoName = prompt("Player Two, please enter your name:");
        // Clear the player buttons
        document.querySelector("#playerButtons").innerHTML = "";
        displayScore();
        
    });
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

// Event listeners
document.querySelectorAll("#cell").forEach(cell => (cell.addEventListener("click", cellClicked)));
document.querySelector("#reset").addEventListener("click", resetGame);
playerOne.addEventListener("click", numberOfPlayers);
document.querySelector("#playerTwo").addEventListener("click", numberOfPlayers);


// Reset the game
function resetGame() {
    init();
}

//Refresh the page
//window.onload = init();
/* script.js */
const board = document.getElementById('board');
const messageElement = document.getElementById('message');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const homeButton = document.getElementById('homeButton');
const restartButton = document.getElementById('restartButton');
const gameSetup = document.getElementById('game-setup');
const startGameButton = document.getElementById('start-game');
const gridSizeSelect = document.getElementById('grid-size');
const gameModeSelect = document.getElementById('game-mode');

let currentPlayer = 'X';
let gameState;
let gridSize;
let winningCombinations;
let gameMode;

const createBoard = (size) => {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    board.style.gridTemplateRows = `repeat(${size}, 100px)`;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleCellClick, { once: true });
        board.appendChild(cell);
    }
    gameState = Array(size * size).fill('');
    currentPlayer = 'X';
    board.classList.remove('hidden');
    gameSetup.classList.add('hidden');
    messageElement.textContent = `${currentPlayer}'s turn`;
};

const setWinningCombinations = (size) => {
    const combinations = [];

    // Rows and Columns
    for (let i = 0; i < size; i++) {
        const row = [];
        const col = [];
        for (let j = 0; j < size; j++) {
            row.push(i * size + j);
            col.push(i + j * size);
        }
        combinations.push(row, col);
    }

    // Diagonals
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * (size + 1));
        diag2.push((i + 1) * (size - 1));
    }
    combinations.push(diag1, diag2);

    return combinations;
};

startGameButton.addEventListener('click', () => {
    gridSize = parseInt(gridSizeSelect.value);
    gameMode = gameModeSelect.value;
    winningCombinations = setWinningCombinations(gridSize);
    createBoard(gridSize);
});

const handleCellClick = (e) => {
    const cell = e.target;
    const cellIndex = Array.from(board.children).indexOf(cell);
    
    if (gameState[cellIndex] !== '' || checkWin()) return;

    cell.textContent = currentPlayer;
    gameState[cellIndex] = currentPlayer;

    if (checkWin()) {
        endGame(false);
    } else if (gameState.includes('')) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageElement.textContent = `${currentPlayer}'s turn`;
        if (gameMode === 'computer' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    } else {
        endGame(true);
    }
};

const computerMove = () => {
    const emptyCells = gameState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = currentPlayer;
    board.children[randomIndex].textContent = currentPlayer;

    if (checkWin()) {
        endGame(false);
    } else {
        currentPlayer = 'X';
        messageElement.textContent = `${currentPlayer}'s turn`;
    }
};

const checkWin = () => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
};

const endGame = (draw) => {
    if (draw) {
        messageElement.textContent = "It's a Draw!";
        showPopup("It's a Draw! Keep trying.");
    } else {
        messageElement.textContent = `${currentPlayer} Wins!`;
        highlightWinningCells();
        showPopup(`${currentPlayer} Wins!`);
    }
};

const highlightWinningCells = () => {
    winningCombinations.forEach(combination => {
        if (combination.every(index => gameState[index] === currentPlayer)) {
            combination.forEach(index => {
                board.children[index].classList.add('winning-cell');
            });
        }
    });
};

const showPopup = (message) => {
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
};

const closePopup = () => {
    popup.classList.add('hidden');
};

const backToMenu = () => {
    closePopup();
    // Hide the board and show the setup options
    board.classList.add('hidden');
    gameSetup.classList.remove('hidden');
    messageElement.textContent = '';
    board.innerHTML = ''; // Clear the board content
};

const restartGame = () => {
    // Only reset the game state and create a new board
    currentPlayer = 'X';
    gameState = Array(gridSize * gridSize).fill('');
    createBoard(gridSize);
    closePopup();
};

homeButton.addEventListener('click', backToMenu);
restartButton.addEventListener('click', () => {
    closePopup();
    restartGame();
});

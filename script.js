const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
let currentPlayer = 'X'; // Pemain manusia
let board = Array(9).fill(null);
let gameOver = false;

// Fungsi untuk memeriksa pemenang
function checkWinner() {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let [a, b, c] of winningCombination) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            setTimeout(() => {
                alert(`${currentPlayer} wins!`);
            }, 100);
            gameOver = true;
            return true;
        }
    }

    if (board.every(cell => cell !== null)) {
        setTimeout(() => {
            alert("It's a draw!");
        }, 100);
        gameOver = true;
        return true;
    }

    return false;
}

// Fungsi untuk menangani klik pemain
function handleClick(event) {
    if (gameOver) return;

    const index = event.target.dataset.cell;

    if (board[index] !== null) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWinner()) return;

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (currentPlayer === 'O' && !gameOver) {
        setTimeout(aiMove, 500); // Delay untuk AI bergerak
    }
}

// Fungsi untuk memulai gerakan AI (Minimax)
function aiMove() {
    const bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    if (checkWinner()) return;
    currentPlayer = 'X';
}

// Fungsi algoritma Minimax untuk AI
function minimax(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    const availableMoves = getAvailableMoves(board);

    if (checkWinnerForPlayer(board, 'O')) {
        return { score: 1 };
    } else if (checkWinnerForPlayer(board, 'X')) {
        return { score: -1 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let move of availableMoves) {
        const newBoard = board.slice();
        newBoard[move] = player;

        const result = minimax(newBoard, opponent);
        moves.push({ index: move, score: result.score });
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// Fungsi untuk mendapatkan posisi yang tersedia
function getAvailableMoves(board) {
    return board.reduce((acc, cell, index) => {
        if (cell === null) acc.push(index);
        return acc;
    }, []);
}

// Fungsi untuk memeriksa apakah pemain menang
function checkWinnerForPlayer(board, player) {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let [a, b, c] of winningCombination) {
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk mereset permainan
function resetGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameOver = false;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

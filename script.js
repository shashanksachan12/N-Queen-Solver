const nInput = document.getElementById('nInput');
const solveBtn = document.getElementById('solveBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const boardEl = document.getElementById('board');
const solutionCountEl = document.getElementById('solutionCount');
const solutionStatusEl = document.getElementById('solutionStatus');

let n = 8;
let board = [];
let allSolutions = [];
let currentSolutionIndex = 0;
const solutionLimit = 10000;

function clampN(value) {
  return Math.min(12, Math.max(4, Number(value) || 4));
}

function setStatus(message) {
  solutionStatusEl.textContent = message;
}

function renderBoard() {
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

  for (let row = 0; row < n; row += 1) {
    for (let col = 0; col < n; col += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (board[row] === col) {
        cell.classList.add('queen');
        cell.textContent = '♛';
      }

      boardEl.appendChild(cell);
    }
  }
}

function resetBoard() {
  n = clampN(nInput.value);
  board = Array(n).fill(-1);
  allSolutions = [];
  currentSolutionIndex = 0;
  solutionCountEl.textContent = '0';
  setStatus('Waiting');
  renderBoard();
}

function solveNQueens(size) {
  const columns = new Array(size).fill(false);
  const diagonal1 = new Array(2 * size - 1).fill(false);
  const diagonal2 = new Array(2 * size - 1).fill(false);
  const current = Array(size).fill(-1);
  const solutions = [];

  function backtrack(row) {
    if (solutions.length >= solutionLimit) {
      return;
    }

    if (row === size) {
      solutions.push(current.slice());
      return;
    }

    for (let col = 0; col < size; col += 1) {
      const d1 = row + col;
      const d2 = row - col + size - 1;

      if (columns[col] || diagonal1[d1] || diagonal2[d2]) {
        continue;
      }

      columns[col] = true;
      diagonal1[d1] = true;
      diagonal2[d2] = true;
      current[row] = col;

      backtrack(row + 1);

      columns[col] = false;
      diagonal1[d1] = false;
      diagonal2[d2] = false;
    }
  }

  backtrack(0);
  return solutions;
}

function showSolution(index) {
  if (!allSolutions.length) {
    board = Array(n).fill(-1);
    setStatus('No solution');
    solutionCountEl.textContent = '0';
    renderBoard();
    return;
  }

  const safeIndex = Math.max(0, Math.min(index, allSolutions.length - 1));
  currentSolutionIndex = safeIndex;
  board = allSolutions[safeIndex];
  setStatus(`Solution ${safeIndex + 1} of ${allSolutions.length}`);
  solutionCountEl.textContent = allSolutions.length;
  renderBoard();
}

function solveCurrent() {
  n = clampN(nInput.value);
  allSolutions = solveNQueens(n);
  currentSolutionIndex = 0;

  if (allSolutions.length) {
    showSolution(0);
  } else {
    board = Array(n).fill(-1);
    setStatus('No solution');
    solutionCountEl.textContent = '0';
    renderBoard();
  }
}

function showNextSolution() {
  if (!allSolutions.length) {
    return;
  }

  const nextIndex = (currentSolutionIndex + 1) % allSolutions.length;
  showSolution(nextIndex);
}

solveBtn.addEventListener('click', solveCurrent);
nextBtn.addEventListener('click', showNextSolution);
resetBtn.addEventListener('click', resetBoard);

nInput.addEventListener('change', () => {
  nInput.value = clampN(nInput.value);
});

resetBoard();

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#canvas")
);
const btnStart = document.querySelector("#start");
const btnStop = document.querySelector("#pause");
const div = document.querySelector("#gameOver");
const btnGameOver = document.querySelector("#btnGameOver");
const divbuttonsGame = document.querySelector("#buttonsGame");

const context = canvas.getContext("2d");
const grid = 25;
const fieldW = canvas.clientWidth;
const fieldH = canvas.clientHeight;
let gameOver = null;
let isStart = false;
let lastEvent = null;
let xDirection = 0;
let yDirection = 0;
let score = 0;
divbuttonsGame.hidden = false;

const snake = {
  x: 250,
  y: 250,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 1,
};

const apple = {
  x: 300,
  y: 400,
};

btnStart.addEventListener("click", () => {
  isStart = !isStart;
  btnStart.textContent = isStart ? "Пауза" : "Продолжить";
});

btnStop.addEventListener("click", () => {
  game_over();
});

document.addEventListener("keydown", (e) => {
  if (
    (e.key === "ArrowDown" || e.key === "s" || e.key === "ы") &&
    snake.dy !== -grid
  ) {
    lastEvent = "down";
  }

  if (
    (e.key === "ArrowUp" || e.key === "w" || e.key === "ц") &&
    snake.dy !== grid
  ) {
    lastEvent = "up";
  }

  if (
    (e.key === "ArrowRight" || e.key === "d" || e.key === "в") &&
    snake.dx !== -grid
  ) {
    lastEvent = "right";
  }

  if (
    (e.key === "ArrowLeft" || e.key === "a" || e.key === "ф") &&
    snake.dx !== grid
  ) {
    lastEvent = "left";
  }
});

function eventCatch() {
  if (lastEvent === "down") {
    snake.dy = grid;
    snake.dx = 0;
  }

  if (lastEvent === "up") {
    snake.dy = -grid;
    snake.dx = 0;
  }

  if (lastEvent === "right") {
    snake.dy = 0;
    snake.dx = grid;
  }
  if (lastEvent === "left") {
    snake.dy = 0;
    snake.dx = -grid;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function clearScreen() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawSnake() {
  context.fillStyle = "#f89d13";

  snake.cells.forEach((cell, index) => {
    if (index === 0) {
      context.fillStyle = "#f89d13";
    } else {
      context.fillStyle = "green";
    }
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        game_over();
      }
    }
  });
}

function getRandomNumberOf25() {
  const randomStep = Math.floor(Math.random() * 20);
  return randomStep * 25;
}

function getRandomApple() {
  while (snake.cells.find((cell) => cell.x === apple.x && cell.y === apple.y)) {
    apple.x = getRandomNumberOf25();
    apple.y = getRandomNumberOf25();
  }
}

function drawApple() {
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
}

function drawScore() {
  context.fillStyle = "white";
  context.font = "10px verdana";
  context.fillText("Счёт: " + score, canvas.clientWidth - 50, 10);
}

function game_over() {
  isStart = false;
  gameOver = true;
  div.hidden = false;
  divbuttonsGame.hidden = true;
  btnGameOver.addEventListener("click", () => window.location.reload());
}

//смена позиции змейки у границ поля
function fieldBorder() {
  if (snake.x === canvas.clientWidth) {
    snake.x = 0;
  }
  if (snake.x === -25) {
    snake.x = 475;
  }
  if (snake.y === canvas.clientHeight) {
    snake.y = 0;
  }
  if (snake.y === -25) {
    snake.y = 475;
  }
}

//ловля событий
function update() {
  eventCatch();

  snake.x += snake.dx;
  snake.y += snake.dy;
  fieldBorder();
  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  if (snake.x === apple.x && snake.y === apple.y) {
    snake.maxCells++;
    score++;
    getRandomApple();
  }
}

//отрисовка игры
function drawGame() {
  clearScreen();
  update();
  drawApple();
  drawSnake();
  drawScore();
}

async function main() {
  drawGame();

  while (true) {
    await sleep(200);
    if (isStart) {
      drawGame();
    }
    if (gameOver) break;
  }
}

main();

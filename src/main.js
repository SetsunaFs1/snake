"use strict";
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas");
const btnStart = document.querySelector("#start");
const btnStop = document.querySelector("#pause");
const div = document.querySelector("#gameOver");
const btnGameOver = document.querySelector("#btnGameOver");
const divbuttonsGame = document.querySelector("#buttonsGame");

const CONTEXT = canvas.getContext("2d");
const GRID = 25;
const FIELD_W = canvas.clientWidth;
const FIELD_H = canvas.clientHeight;
const SNAKE_HEAD_COLOR = "#f89d13";
const SNAKE_BODY_COLOR = "green";
let gameOverBoolean = null;
let isStart = false;
let lastEvent = null;
let xDirection = 0;
let yDirection = 0;
let score = 0;
divbuttonsGame.hidden = false;

const snake = {
  x: 250,
  y: 250,
  dx: GRID,
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
    snake.dy !== -GRID
  ) {
    lastEvent = "down";
  }

  if (
    (e.key === "ArrowUp" || e.key === "w" || e.key === "ц") &&
    snake.dy !== GRID
  ) {
    lastEvent = "up";
  }

  if (
    (e.key === "ArrowRight" || e.key === "d" || e.key === "в") &&
    snake.dx !== -GRID
  ) {
    lastEvent = "right";
  }

  if (
    (e.key === "ArrowLeft" || e.key === "a" || e.key === "ф") &&
    snake.dx !== GRID
  ) {
    lastEvent = "left";
  }
});

function eventCatch() {
  if (lastEvent === "down") {
    snake.dy = GRID;
    snake.dx = 0;
  }

  if (lastEvent === "up") {
    snake.dy = -GRID;
    snake.dx = 0;
  }

  if (lastEvent === "right") {
    snake.dy = 0;
    snake.dx = GRID;
  }
  if (lastEvent === "left") {
    snake.dy = 0;
    snake.dx = -GRID;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function clearScreen() {
  CONTEXT.fillStyle = "black";
  CONTEXT.fillRect(0, 0, FIELD_W, FIELD_H);
}

function drawSnake() {
  snake.cells.forEach((cell, index) => {
    if (index === 0) {
      CONTEXT.fillStyle = SNAKE_HEAD_COLOR;
    } else {
      CONTEXT.fillStyle = SNAKE_BODY_COLOR;
    }
    CONTEXT.fillRect(cell.x, cell.y, GRID - 1, GRID - 1);

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
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
  CONTEXT.fillStyle = "red";
  CONTEXT.fillRect(apple.x, apple.y, GRID - 1, GRID - 1);
}

function drawScore() {
  CONTEXT.fillStyle = "white";
  CONTEXT.font = "10px verdana";
  CONTEXT.fillText("Счёт: " + score, FIELD_W - 50, 10);
}

function gameOver() {
  isStart = false;
  gameOverBoolean = true;
  div.hidden = false;
  divbuttonsGame.hidden = true;
  btnGameOver.addEventListener("click", () => window.location.reload());
}

//смена позиции змейки у границ поля
function fieldBorder() {
  if (snake.x === FIELD_W) {
    snake.x = 0;
  }
  if (snake.x === -GRID) {
    snake.x = FIELD_W - GRID;
  }
  if (snake.y === FIELD_H) {
    snake.y = 0;
  }
  if (snake.y === -GRID) {
    snake.y = FIELD_H - GRID;
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
    if (gameOverBoolean) break;
  }
}

main();

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#canvas")
);
const btnStart = document.querySelector("#start");
const btnStop = document.querySelector("#pause");

const context = canvas.getContext("2d");
const cell = 25;
const fieldW = canvas.clientWidth;
const fieldH = canvas.clientHeight;
let gameOver = null;
let isStart = false;
let lastEvent = null;
let xDirection = 0;
let yDirection = 0;

const snakeHead = {
  x: 250,
  y: 250,
};

const snakeBody = {
  x: null,
  y: null,
};

const snakeTail = [snakeHead];
let tailLength = 1;

const apple = {
  x: 300,
  y: 400,
};

btnStart.addEventListener("click", () => {
  isStart = !isStart;
  btnStart.textContent = isStart ? "Пауза" : "Продолжить";
});

btnStop.addEventListener("click", () => {
  isStart = false;
  gameOver = true;
});

document.addEventListener("keydown", keydown);

function keydown(e) {
  if (e.key === "ArrowDown") {
    // console.log("down");
    if (yDirection == -cell) return;
    yDirection = cell;
    xDirection = 0;
    lastEvent = "down";
  }

  if (e.key === "ArrowUp") {
    // console.log("up");
    if (yDirection == cell) return;
    yDirection = -cell;
    xDirection = 0;
    lastEvent = "up";
  }

  if (e.key === "ArrowRight") {
    if (xDirection == -cell) return;
    // console.log("right");
    yDirection = 0;
    xDirection = cell;
    lastEvent = "right";
  }

  if (e.key === "ArrowLeft") {
    if (xDirection == cell) return;
    // console.log("left");
    yDirection = 0;
    xDirection = -cell;
    lastEvent = "left";
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
  context.fillStyle = "green";
  for (let i = 0; i < snakeTail.length; i++) {
    let body = snakeTail[i];
    context.fillRect(body.x, body.y, cell, cell);
    if (snakeTail.length < tailLength) {
      snakeTail.push(snakeBody);
    }
  }
}

function getRandomNumberOf25() {
  const randomStep = Math.floor(Math.random() * 21);
  return randomStep * 25;
}

function getRandomApple() {
  apple.x = getRandomNumberOf25();
  apple.y = getRandomNumberOf25();
}

function drawApple() {
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, cell, cell);
  // console.log(apple.x, apple.y)
}

function fieldBorder() {
  if (snakeHead.x == canvas.clientWidth) {
    snakeHead.x = 0;
  }
  if (snakeHead.x == -25) {
    snakeHead.x = 475;
  }
  if (snakeHead.y == canvas.clientHeight) {
    snakeHead.y = 0;
  }
  if (snakeHead.y == -25) {
    snakeHead.y = 475;
  }
}

//ловля событий
function update(lastEvent) {
  if (lastEvent) {
    snakeHead.x = snakeHead.x + xDirection;
    snakeHead.y = snakeHead.y + yDirection;
    fieldBorder();
  }

  if (snakeHead.x == apple.x && snakeHead.y == apple.y) {
    getRandomApple();
    tailLength++;
  }
}

//отрисовка игры
function drawGame() {
  clearScreen();
  drawApple();
  drawSnake();
  update(lastEvent);
}

async function main() {
  drawGame();

  while (true) {
    await sleep(200);
    if (isStart && lastEvent === null) {
      while (true) {
        await sleep(200);
        snakeHead.x += cell;
        fieldBorder();
        drawGame();
        if (lastEvent) break;
      }
    }
    if (isStart) {
      drawGame();
    }
    if (gameOver) break;
  }
}

main();

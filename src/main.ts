const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const btnStart = document.querySelector("#start") as HTMLButtonElement;
const btnStop = document.querySelector("#pause") as HTMLButtonElement;
const btnPause = document.querySelector("#pause") as HTMLButtonElement;
const div = document.querySelector("#gameOver") as HTMLDivElement;
const btnGameOver = document.querySelector("#btnGameOver") as HTMLButtonElement;
const divbuttonsGame = document.querySelector("#buttonsGame") as HTMLDivElement;
const table = document.querySelector("#scoreTable") as HTMLTableElement;

const CONTEXT = canvas.getContext("2d")!;
const GRID: number = 25;
const FIELD_W: number = canvas.clientWidth;
const FIELD_H: number = canvas.clientHeight;
const SNAKE_HEAD_COLOR: string = "#f89d13";
const SNAKE_BODY_COLOR: string = "green";
let gameOverBoolean: boolean | null = null;
let isStart: boolean = false;
let lastEvent: string | null = null;
let score: number = 0;
divbuttonsGame.hidden = false;
btnPause.hidden = true;

type Storage = Array<{ score: number; data: string }>;

const storage: Storage = [];
let newStorage: Storage = [];

type Snake = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  cells: Array<{ x: number; y: number }>;
  maxCells: number;
};
const snake: Snake = {
  x: 250,
  y: 250,
  dx: GRID,
  dy: 0,
  cells: [],
  maxCells: 1,
};

type Apple = {
  x: number;
  y: number;
};
const apple: Apple = {
  x: 300,
  y: 400,
};

btnStart.addEventListener("click", () => {
  isStart = !isStart;
  btnPause.hidden = false;
  btnStart.textContent = isStart ? "Пауза" : "Продолжить";
});

btnStop.addEventListener("click", () => {
  gameOver();
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

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function clearScreen() {
  if (CONTEXT) {
    CONTEXT.fillStyle = "black";
    CONTEXT.fillRect(0, 0, FIELD_W, FIELD_H);
  }
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

  storage.push({
    score: score,
    data: new Date().toLocaleString(),
  });
  localStorage.setItem("user", JSON.stringify(storage));
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
  updateTableOfRecords();
  drawScoreTable(newStorage);
}

function updateTableOfRecords() {
  let retrievedStorage = localStorage.getItem("user");
  if (!retrievedStorage) return [];
  const arr = JSON.parse(retrievedStorage) as Storage;
  newStorage = arr.toSorted((a, b) => b.score - a.score);
  return newStorage;
}

function drawScoreTable(arr: Storage) {
  table.replaceChildren();
  if (arr.length === 0) return;
  for (let i = 0; i < arr.length; i++) {
    if (i >= 5) break;
    const tr = document.createElement("tr");
    tr.setAttribute("class", "tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    td1.textContent = String(i + 1);
    td2.textContent = String(arr[i].score);
    td3.textContent = arr[i].data;
    table.append(tr);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
  }
}

function reset() {
  gameOverBoolean = false;
  div.hidden = true;
  btnPause.hidden = true;
  divbuttonsGame.hidden = false;
  btnStart.textContent = "Старт";
  lastEvent = null;
  score = 0;
  snake.x = 250;
  snake.y = 250;
  snake.dx = GRID;
  snake.dy = 0;
  snake.cells = [];
  snake.maxCells = 1;
  apple.x = 300;
  apple.y = 400;
  main();
}

async function main() {
  drawGame();

  while (true) {
    await sleep(200);
    if (isStart) {
      drawGame();
    }
    if (gameOverBoolean) {
      break;
    }
  }
}

main();
btnGameOver.addEventListener("click", () => reset());

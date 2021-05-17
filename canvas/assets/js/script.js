// Define the board
const board = document.querySelector('#snakeCanvas');
const ctx = board.getContext('2d'); // if present, browser supports canvas
const scoreBoard = document.querySelector('#score');
let score = 0;
// Define stylings
const boardBorder = 'rgb(0, 0, 0)';
const boardBackground = 'rgb(255, 255, 255)';
const snakeFill = 'rgb(173, 216, 230)';
const snakeBorder = 'rgb(0, 20, 40)';
const foodFill = 'rgb(144,238,144)';
const foodStroke = 'rgb(0,20,13)';
// Define the snake
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];
// Horizontal movement
let dx = 10;
// Vertical movement
let dy = 0;
// define food position vars
let food_x;
let food_y;

// main function called repeatedly to keep the game running
function main() {
  setTimeout(function onTick() {
    if (hasGameEnded()) return console.log('game over');

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    // Repeat
    main();
  }, 200);
}

// draw a border around the canvas
function clearCanvas() {
  //  Select the colour to fill the drawing
  ctx.fillStyle = boardBackground;
  //  Select the colour for the border of the canvas
  ctx.strokestyle = boardBorder;
  // Draw a "filled" rectangle to cover the entire canvas
  ctx.fillRect(0, 0, board.width, board.height);
  // Draw a "border" around the entire canvas
  ctx.strokeRect(0, 0, board.width, board.height);
}

/* DRAW SNAKE & SNAKE MOVEMENTS */
// Function to draw snake section
function drawSnakeSection(section) {
  // Set the color of the section
  ctx.fillStyle = snakeFill;
  // Set the border of the section
  ctx.strokeStyle = snakeBorder;
  // Draw a "filled" with the selected fill color on the given coordinates x,y
  ctx.fillRect(section.x, section.y, 10, 10);
  // Draw a border around the section with the given stroke & coordinates x,y
  ctx.strokeRect(section.x, section.y, 10, 10);
}

// function that draws all the snake sections
function drawSnake() {
  snake.forEach((block) => drawSnakeSection(block));
}

/* SNAKE MOVEMENTS */
// function to move snake with a given dx + or -
function moveSnake() {
  // Create new head with given deltas
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  // Checks if snake as eaten food
  const hasEatenFood = snake[0].x === food_x && snake[0].y === food_y;
  if (hasEatenFood) {
    // Increase score
    score += 10;
    // Display score on screen
    scoreBoard.textContent = score;
    // Generate new food location
    genFood();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}

/* CAPTURE KEY INPUT */
function changeDirection(e) {
  // Check current direction
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  // update according to current direction & avoid reversing
  if (e.key === 'ArrowUp' && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (e.key === 'ArrowDown' && !goingUp) {
    dx = 0;
    dy = 10;
  }
  if (e.key === 'ArrowRight' && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (e.key === 'ArrowLeft' && !goingRight) {
    dx = -10;
    dy = 0;
  }
}

/* CHECK FOR GAMEOVER */
function hasGameEnded() {
  // 1. gameover by colliding with itself
  // check if the head hit another block of the body
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
  }
  // 2. gameover by hitting a wall
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > board.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > board.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/* ADDING FOOD */
function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function genFood() {
  // Generate a random number the food x-coordinate
  food_x = randomFood(0, board.width - 10);
  // Generate a random number for the food y-coordinate
  food_y = randomFood(0, board.height - 10);
  // prevent food spawning over the snake
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach(function hasSnakeEatenFood(part) {
    const hasEaten = part.x == food_x && part.y == food_y;
    if (hasEaten) genFood();
  });
}

function drawFood() {
  ctx.fillStyle = foodFill;
  ctx.strokestyle = foodStroke;
  ctx.fillRect(food_x, food_y, 10, 10);
  ctx.strokeRect(food_x, food_y, 10, 10);
}

/* GAME INIT */

// update delta movement uppon key pressed events
document.addEventListener('keyup', changeDirection);

// wait for DOM content loaded
document.addEventListener('DOMContentLoaded', () => genFood());
document.addEventListener('DOMContentLoaded', () => main());

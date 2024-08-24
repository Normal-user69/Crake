'use strict';

var player = 1;
var lineColor = "#ddd";
var canvas = document.getElementById('tic-tac-toe-board');
var context = canvas.getContext('2d');
var canvasSize = 500;
var sectionSize = canvasSize / 3;
canvas.width = canvasSize;
canvas.height = canvasSize;
context.translate(0.5, 0.5);

var winnerText = document.getElementById('winner-text');
var restartBtn = document.getElementById('restart-btn');

function getInitialBoard(defaultValue) {
  var board = [];
  for (var x = 0; x < 3; x++) {
    board.push([]);
    for (var y = 0; y < 3; y++) {
      board[x].push(defaultValue);
    }
  }
  return board;
}

var board = getInitialBoard("");

function addPlayingPiece(mouse, random = false) {
  if (winnerText.textContent) return; // Prevent moves after game ends

  var xCordinate, yCordinate, emptySpaces = [];

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      xCordinate = x * sectionSize;
      yCordinate = y * sectionSize;

      if (board[x][y] === "") {
        emptySpaces.push({ x, y, xCordinate, yCordinate });
      }

      if (!random && 
          mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
          mouse.y >= yCordinate && yCordinate + sectionSize &&
          board[x][y] === "") {
        placePiece(x, y, xCordinate, yCordinate);
      }
    }
  }

  if (random && emptySpaces.length > 0) {
    var randomIndex = Math.floor(Math.random() * emptySpaces.length);
    var { x, y, xCordinate, yCordinate } = emptySpaces[randomIndex];
    placePiece(x, y, xCordinate, yCordinate);
  }
}

function placePiece(x, y, xCordinate, yCordinate) {
  clearPlayingArea(xCordinate, yCordinate);
  if (player === 1) {
    drawX(xCordinate, yCordinate);
    board[x][y] = "X";
    player = 2;
  } else {
    drawO(xCordinate, yCordinate);
    board[x][y] = "O";
    player = 1;
  }
  checkWinner();
}

function checkWinner() {
  var winningCombinations = [
    // Horizontal
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    // Vertical
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    // Diagonal
    [board[0][0], board[1][1], board[2][2]],
    [board[2][0], board[1][1], board[0][2]]
  ];

  for (var combo of winningCombinations) {
    if (combo[0] !== "" && combo[0] === combo[1] && combo[1] === combo[2]) {
      winnerText.textContent = `Player ${combo[0]} wins!`;
      return;
    }
  }

  if (board.flat().every(cell => cell !== "")) {
    winnerText.textContent = "It's a draw!";
  }
}

function clearPlayingArea(xCordinate, yCordinate) {
  context.fillStyle = "#fff";
  context.fillRect(xCordinate, yCordinate, sectionSize, sectionSize);
}

function drawO(xCordinate, yCordinate) {
  var halfSectionSize = (0.5 * sectionSize);
  var centerX = xCordinate + halfSectionSize;
  var centerY = yCordinate + halfSectionSize;
  var radius = (sectionSize - 100) / 2;
  var startAngle = 0 * Math.PI;
  var endAngle = 2 * Math.PI;

  context.lineWidth = 10;
  context.strokeStyle = "#01bBC2";
  context.beginPath();
  context.arc(centerX, centerY, radius, startAngle, endAngle);
  context.stroke();
}

function drawX(xCordinate, yCordinate) {
  context.strokeStyle = "#f1be32";
  context.beginPath();
  var offset = 50;
  context.moveTo(xCordinate + offset, yCordinate + offset);
  context.lineTo(xCordinate + sectionSize - offset, yCordinate + sectionSize - offset);
  context.moveTo(xCordinate + offset, yCordinate + sectionSize - offset);
  context.lineTo(xCordinate + sectionSize - offset, yCordinate + offset);
  context.stroke();
}

function drawLines(lineWidth, strokeStyle) {
  var lineStart = 4;
  var lineLenght = canvasSize - 5;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.strokeStyle = strokeStyle;
  context.beginPath();
  for (var y = 1; y <= 2; y++) {
    context.moveTo(lineStart, y * sectionSize);
    context.lineTo(lineLenght, y * sectionSize);
  }
  for (var x = 1; x <= 2; x++) {
    context.moveTo(x * sectionSize, lineStart);
    context.lineTo(x * sectionSize, lineLenght);
  }
  context.stroke();
}

drawLines(10, lineColor);

function getCanvasMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

canvas.addEventListener('mouseup', function (event) {
  var canvasMousePosition = getCanvasMousePosition(event);
  addPlayingPiece(canvasMousePosition);
  drawLines(10, lineColor);
});

document.getElementById('random-move-btn').addEventListener('click', function () {
  addPlayingPiece(null, true);
});

restartBtn.addEventListener('click', function () {
  board = getInitialBoard("");
  context.clearRect(0, 0, canvasSize, canvasSize);
  drawLines(10, lineColor);
  winnerText.textContent = "";
  
  // Reset to Player 1 or 2 randomly
  player = Math.random() < 0.5 ? 1 : 2;

  // Make the random move for the selected player
  addPlayingPiece(null, true);
});

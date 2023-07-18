let can = document.getElementById("table");
let draw_ = can.getContext("2d");

const ball = {
  x: can.width / 2,
  y: can.height / 2,
  radius: 10,
  velX: 7,
  velY: 7,
  speed: 7,
  color: "green"
};

const user = {
  x: 0,
  y: can.height / 2 - 50,
  width: 10,
  height: 100,
  score: 0,
  color: "red"
};

const cpu = {
  x: can.width - 10,
  y: can.height / 2 - 50,
  width: 10,
  height: 100,
  score: 0,
  color: "blue"
};

const sep = {
  x: (can.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "orange"
};

function drawRectangle(x, y, width, height, color) {
  draw_.fillStyle = color;
  draw_.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
  draw_.fillStyle = color;
  draw_.beginPath();
  draw_.arc(x, y, radius, 0, Math.PI * 2, false);
  draw_.closePath();
  draw_.fill();
}

function drawScore(text, x, y) {
  draw_.fillStyle = "white";
  draw_.font = "60px Arial";
  draw_.fillText(text, x, y);
}

function drawSeparator() {
  for (let i = 0; i <= can.height; i += 20) {
    drawRectangle(sep.x, sep.y + i, sep.width, sep.height, sep.color);
  }
}

function draw() {
  // Clear the canvas
  drawRectangle(0, 0, can.width, can.height, "black");

  // Draw the paddles
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);

  // Draw the ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);

  // Draw the scores
  drawScore(user.score, can.width / 4, can.height / 5);
  drawScore(cpu.score, (3 * can.width) / 4, can.height / 5);

  // Draw the separator
  drawSeparator();
}

function update() {
  // Move the ball
  ball.x += ball.velX;
  ball.y += ball.velY;

  // Ball collision with walls
  if (ball.y + ball.radius > can.height || ball.y - ball.radius < 0) {
    ball.velY = -ball.velY;
  }

  // Ball collision with paddles
  if (ball.x - ball.radius < user.x + user.width && ball.y > user.y && ball.y < user.y + user.height) {
  	ball.velX = -ball.velX;
  } else if (
    ball.x + ball.radius > cpu.x &&
    ball.y > cpu.y &&
    ball.y < cpu.y + cpu.height
  ) {
    ball.velX = -ball.velX;
  }

  // Update the score and reset the ball if there's a score
  if (ball.x - ball.radius < 0) {
    // Computer scores
    cpu.score++;
    resetBall();
  } else if (ball.x + ball.radius > can.width) {
    // User scores
    user.score++;
    resetBall();
  }

  // Move the opponent paddle
  if (cpu.y + cpu.height / 2 < ball.y) {
    cpu.y += 4;
  } else {
    cpu.y -= 4;
  }
}

function resetBall() {
  ball.x = can.width / 2;
  ball.y = can.height / 2;
  ball.velX = -ball.velX;
  ball.speed = 5;
}

function movePaddle(e) {
  const rect = can.getBoundingClientRect();
  user.y = e.clientY - rect.top - user.height / 2;
}

document.addEventListener("keydown", function (e) {
  const key = e.keyCode;
  if (key === 38) {
    // Up arrow key
    user.y -= 12;
  } else if (key === 40) {
    // Down arrow key
    user.y += 12;
  }
  key.preventDefault();
});

can.addEventListener("mousemove", movePaddle);

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

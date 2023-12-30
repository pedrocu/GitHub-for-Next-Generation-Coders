const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let obstacles = [];
let stars = [];
const obstacleWidth = 60;
const obstacleHeight = 60;
const starRadius = 10;
const obstacleSpeed = 3;
const starSpeed = 2;

function createObstacle() {
  const x = canvas.width;
  const y = Math.random() * (canvas.height - obstacleHeight);
  obstacles.push({ x, y, width: obstacleWidth, height: obstacleHeight });
}

function createStar() {
  const x = canvas.width;
  const y = Math.random() * canvas.height;
  stars.push({ x, y, radius: starRadius });
}

function drawObstacle(obstacle) {
  ctx.fillStyle = "red";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawStar(star) {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.x -= obstacleSpeed;
  });
  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
}

function moveStars() {
  stars.forEach((star) => {
    star.x -= starSpeed;
  });
  stars = stars.filter((star) => star.x + star.radius > 0);
}

let spaceship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  speed: 5,
};

function drawSpaceship() {
  ctx.fillStyle = "white";
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveObstacles();
  moveStars();

  // Check for collisions
  obstacles.forEach((obstacle) => {
    if (isCollidingWithObstacle(spaceship, obstacle)) {
      // Handle collision with obstacle
      console.log("Collision with obstacle!");
    }
    drawObstacle(obstacle);
  });

  stars.forEach((star, index) => {
    if (isCollidingWithStar(spaceship, star)) {
      // Handle collision with star (e.g., increase score)
      console.log("Star collected!");
      stars.splice(index, 1); // Remove the star
    } else {
      drawStar(star);
    }
  });

  drawSpaceship();

  requestAnimationFrame(update);
}

setInterval(createObstacle, 2000); // Create a new obstacle every 2000 milliseconds
setInterval(createStar, 1000); // Create a new star every 1000 milliseconds

function keyDownHandler(e) {
  if (
    (e.key == "Right" || e.key == "ArrowRight") &&
    spaceship.x < canvas.width - spaceship.width
  ) {
    spaceship.x += spaceship.speed;
  } else if ((e.key == "Left" || e.key == "ArrowLeft") && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  } else if ((e.key == "Up" || e.key == "ArrowUp") && spaceship.y > 0) {
    spaceship.y -= spaceship.speed;
  } else if (
    (e.key == "Down" || e.key == "ArrowDown") &&
    spaceship.y < canvas.height - spaceship.height
  ) {
    spaceship.y += spaceship.speed;
  }
}

function isCollidingWithObstacle(spaceship, obstacle) {
  return (
    spaceship.x < obstacle.x + obstacle.width &&
    spaceship.x + spaceship.width > obstacle.x &&
    spaceship.y < obstacle.y + obstacle.height &&
    spaceship.y + spaceship.height > obstacle.y
  );
}

function isCollidingWithStar(spaceship, star) {
  const distX = Math.max(
    star.x - spaceship.x,
    0,
    spaceship.x + spaceship.width - star.x
  );
  const distY = Math.max(
    star.y - spaceship.y,
    0,
    spaceship.y + spaceship.height - star.y
  );
  return distX * distX + distY * distY < star.radius * star.radius;
}

document.addEventListener("keydown", keyDownHandler);

update();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let plane, checkpoints, score, gameOver;

function resetGame() {
  plane = {
    x: 0, y: 0, z: 0,
    pitch: 0, yaw: 0,
    speed: 5
  };

  checkpoints = Array.from({ length: 10 }, (_, i) => ({
    x: (Math.random() - 0.5) * 500,
    y: (Math.random() - 0.5) * 400,
    z: i * 400 + 800
  }));

  score = 0;
  gameOver = false;
}

restartBtn.addEventListener("click", resetGame);

function updatePlane() {
  if (keys["ArrowUp"]) plane.pitch -= 0.015;
  if (keys["ArrowDown"]) plane.pitch += 0.015;
  if (keys["ArrowLeft"]) plane.yaw -= 0.02;
  if (keys["ArrowRight"]) plane.yaw += 0.02;

  const dx = Math.sin(plane.yaw) * plane.speed;
  const dz = Math.cos(plane.yaw) * plane.speed;
  const dy = Math.sin(plane.pitch) * plane.speed;

  plane.x += dx;
  plane.y += dy;
  plane.z += dz;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  checkpoints.forEach((cp, i) => {
    const dx = cp.x - plane.x;
    const dy = cp.y - plane.y;
    const dz = cp.z - plane.z;

    if (dz < 10) return;

    const scale = 500 / dz;
    const x2d = canvas.width / 2 + dx * scale;
    const y2d = canvas.height / 2 - dy * scale;
    const size = 80 * scale;

    ctx.beginPath();
    ctx.arc(x2d, y2d, size, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20 && Math.abs(dz) < 30) {
      checkpoints.splice(i, 1);
      score++;
    }
  });

  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 20);

  if (checkpoints.length === 0) {
    ctx.font = "20px sans-serif";
    ctx.fillText("✅ All checkpoints cleared!", 260, 300);
    gameOver = true;
  }
}

function gameLoop() {
  if (!gameOver) updatePlane();
  render();
  requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();

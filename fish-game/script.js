// Canvas setup

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Georgia";

// Mouse interactivity

let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};
canvas.addEventListener("mousedown", (event) => {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener("mouseup", () => {
  mouse.click = false;
});

// Player

class Player {
  MOVE_STEP = 20;
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    // coordinates of the frame in the sprite sheet
    this.frameX = 0;
    this.frameY = 0;
    // number of frames on sprite sheet
    this.frame = 0;
    // width of sprite sheet divided by number of columns
    this.spriteWidth = 498;
    // height of sprite sheet divided by number of columns
    this.spriteHeight = 327;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    if (mouse.x != this.x) {
      this.x -= dx / this.MOVE_STEP;
    }
    if (mouse.y != this.y) {
      this.y -= dy / this.MOVE_STEP;
    }
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();
// Bubbles

const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
  }
  update() {
    this.y -= this.speed;
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}
function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let bubble of bubblesArray) {
    bubble.update();
    bubble.draw();
  }
}

// Animation loop

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  player.update();
  player.draw();
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();

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
const playerLeftImage = new Image();
playerLeftImage.src = "./sprites/__cartoon_fish_06_red_swim_left.png";
const playerRightImage = new Image();
playerRightImage.src = "./sprites/__cartoon_fish_06_red_swim_right.png";
class Player {
  MOVE_STEP = 20;
  constructor() {
    this.x = canvas.width;
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
    this.angle = Math.atan2(dy, dx);
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
    ctx.fillRect(this.x, this.y, this.radius, 10);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.x >= mouse.x) {
      ctx.drawImage(
        playerLeftImage,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      ctx.drawImage(
        playerRightImage,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    ctx.restore();
  }
}

const player = new Player();

// Bubbles
let bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.popped = false;
  }
  update() {
    this.y -= this.speed;
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.popped = distance < this.radius + player.radius;
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

const pop1Audio = document.createElement("audio");
pop1Audio.src = "./sounds/pop1.ogg";
const pop2Audio = document.createElement("audio");
pop2Audio.src = "./sounds/pop2.ogg";
const pop3Audio = document.createElement("audio");
pop3Audio.src = "./sounds/pop3.ogg";

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray = bubblesArray.concat(new Bubble());
  }
  for (let bubble of bubblesArray) {
    bubble.update();
    bubble.draw();
  }
  // remove bubbles that have left canvas
  bubblesArray = bubblesArray.filter((bubble) => {
    if (bubble.popped) {
      Math.random() <= 0.5
        ? pop1Audio.play()
        : Math.random() <= 0.5
        ? pop2Audio.play()
        : pop3Audio.play();
      score++;
      return false;
    }
    if (bubble.y < 0 - 100) {
      return false;
    }
    return true;
  });
}

// Animation loop

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 50);
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();

window.addEventListener(
  "resize",
  () => (canvasPosition = canvas.getBoundingClientRect())
);

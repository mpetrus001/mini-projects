// Canvas setup

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "30px Georgia";
let gameSpeed = 1;
let gameOver = false;

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
playerLeftImage.src = "./sprites/fish/__cartoon_fish_06_red_swim_left.png";
const playerRightImage = new Image();
playerRightImage.src = "./sprites/fish/__cartoon_fish_06_red_swim_right.png";
class Player {
  MOVE_STEP = 20;
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 40;
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
    // change angle to match direction to mouse
    this.angle = Math.atan2(dy, dx);

    if (mouse.x != this.x) {
      this.x -= dx / this.MOVE_STEP;
    }
    if (mouse.y != this.y) {
      this.y -= dy / this.MOVE_STEP;
    }
    // cycle through sprite sheet every 5 frames
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
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
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    // flip the image if going the other way
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
const bubbleImage1 = new Image();
bubbleImage1.src = "./sprites/bubbles/bubble_pop_one_spritesheet.png";
let bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.popped = false;
    // coordinates of the frame in the sprite sheet
    this.frameX = 0;
    this.frameY = 0;
    // number of frames on sprite sheet
    this.frame = 0;
    // width of sprite sheet divided by number of columns
    this.spriteWidth = 512;
    // height of sprite sheet divided by number of columns
    this.spriteHeight = 512;
  }
  update() {
    this.y -= this.speed;
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.popped = distance < this.radius + player.radius;
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();
    ctx.drawImage(
      bubbleImage1,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 66,
      this.y - 65,
      this.spriteWidth / 3.9,
      this.spriteHeight / 3.9
    );
  }
}

const pop1Audio = document.createElement("audio");
pop1Audio.src = "./sounds/pop1.ogg";
const pop2Audio = document.createElement("audio");
pop2Audio.src = "./sounds/pop2.ogg";
const pop3Audio = document.createElement("audio");
pop3Audio.src = "./sounds/pop3.ogg";

function handleBubbles() {
  if (gameFrame % 10 == 0) {
    bubblesArray = bubblesArray.concat(new Bubble());
  }
  for (let bubble of bubblesArray) {
    bubble.update();
    bubble.draw();
  }
  // remove bubbles that have left canvas or were popped
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

// Enemies
const enemyImage1 = new Image();
enemyImage1.src = "./sprites/fish/__yellow_cartoon_fish_01_swim.png";
let enemiesArray = [];
class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * canvas.height + 90;
    this.speed = Math.random() * 2 + 2;
    this.radius = 40;
    this.touched = false;
    this.angle = 0;
    // coordinates of the frame in the sprite sheet
    this.frameX = 0;
    this.frameY = 0;
    // number of frames on sprite sheet
    this.frame = 0;
    // width of sprite sheet divided by number of columns
    this.spriteWidth = 418;
    // height of sprite sheet divided by number of columns
    this.spriteHeight = 397;
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - 100) {
      this.x = canvas.width + 200;
      this.y = Math.random() * canvas.height + 90;
      this.speed = Math.random() * 2 + 2;
    }

    // cycle through sprite sheet every 5 frames
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
    // calculate collision with player
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.touched = distance < this.radius + player.radius;
  }
  draw() {
    // ctx.fillStyle = "yellow";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();
    ctx.drawImage(
      enemyImage1,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 50,
      this.y - 52,
      this.spriteWidth / 4,
      this.spriteHeight / 4
    );
  }
}

function handleEnemies() {
  if (gameFrame % 300 == 0) {
    enemiesArray = enemiesArray.concat(new Enemy());
  }
  for (let enemy of enemiesArray) {
    enemy.update();
    enemy.draw();
    if (enemy.touched) handleGameOver();
  }
}

function handleGameOver() {
  ctx.fillStyle = "white";
  ctx.fillText("Game Over", 225, 225);
  ctx.fillText(`Final Score: ${score}`, 225, 265);
  gameOver = true;
}

// Scrolling background
const background = new Image();
background.src = "./backgrounds/background1.png";

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

function handleBackground() {
  BG.x1--;
  if (BG.x1 < -BG.width) BG.x1 = BG.width;
  BG.x2--;
  if (BG.x2 < -BG.width) BG.x2 = BG.width;
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  // added plus 2 to the width to cover seam
  ctx.drawImage(background, BG.x2, BG.y, BG.width + 2, BG.height);
}

// Animation loop

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  player.update();
  player.draw();
  handleBubbles();
  handleEnemies();
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 50);
  gameFrame++;
  if (!gameOver) requestAnimationFrame(animate);
}

animate();

window.addEventListener(
  "resize",
  () => (canvasPosition = canvas.getBoundingClientRect())
);

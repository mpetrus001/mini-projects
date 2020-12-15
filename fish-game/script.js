// Canvas setup
const canvas = document.getElementById("canvas1");
canvas.width = 800;
canvas.height = 500;
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;
let gameFrame = 0;

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
window.addEventListener(
  "resize",
  () => (canvasPosition = canvas.getBoundingClientRect())
);

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
playerLeftImage.src = "./sprites/fish/__red_cartoon_fish_06_swim_left.png";
const playerRightImage = new Image();
playerRightImage.src = "./sprites/fish/__red_cartoon_fish_06_swim_right.png";
class Player {
  MOVE_STEP = 20;
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    // radius of hitbox
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
    // change angle to match direction of mouse click
    this.angle = Math.atan2(dy, dx);

    if (mouse.x != this.x) {
      this.x -= dx / this.MOVE_STEP;
    }
    if (mouse.y != this.y) {
      this.y -= dy / this.MOVE_STEP;
    }
    // cycle through sprite sheet every 5 frames
    if (gameFrame % 8 == 0) {
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
    // circle for collision debug
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 10);
    const drawPlayer = (image) => {
      ctx.drawImage(
        image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    };
    // stash the current state then rotate the player
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    // flip the image if going the other way
    if (this.x >= mouse.x) {
      drawPlayer(playerLeftImage);
    } else {
      drawPlayer(playerRightImage);
    }
    ctx.restore();
  }
}

const player = new Player();

function handlePlayer() {
  player.update();
  player.draw();
}

// Bubbles
const bubbleImage1 = new Image();
bubbleImage1.src = "./sprites/bubbles/bubble_pop_1_spritesheet.png";
const bubbleImage2 = new Image();
bubbleImage2.src = "./sprites/bubbles/bubble_pop_2_spritesheet.png";
let bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.popped = false;
    this.counted = false;
    this.finished = false;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.imageChoice = Math.random() < 0.5 ? 1 : 2;
  }
  update() {
    if (this.popped) {
      if (gameFrame % 5 == 0) {
        this.frame++;
        if (this.frame == 4) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }
        if (this.frame < 4) this.frameY = 0;
        else if (this.frame < 8) this.frameY = 1;
        if (this.frame >= 8) this.finished = true;
      }
    } else {
      this.y -= this.speed;
      let dx = this.x - player.x;
      let dy = this.y - player.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      this.popped = distance < this.radius + player.radius;
    }
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();
    let bubbleImage = bubbleImage1;
    let spriteWidth = 512;
    let spriteHeight = 512;
    if (this.imageChoice > 1) {
      bubbleImage = bubbleImage2;
      spriteWidth = 393.75;
      spriteHeight = 511.5;
    }
    ctx.drawImage(
      bubbleImage,
      this.frameX * spriteWidth,
      this.frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      this.x - 66,
      this.y - 65,
      spriteWidth / 3.9,
      spriteHeight / 3.9
    );
  }
}

const pop1Audio = new Audio("./sounds/pop1.ogg");
const pop2Audio = new Audio("./sounds/pop2.ogg");
const pop3Audio = new Audio("./sounds/pop3.ogg");

function handleBubbles() {
  if (gameFrame % 10 == 0) {
    bubblesArray = bubblesArray.concat(new Bubble());
  }
  for (let bubble of bubblesArray) {
    bubble.update();
    bubble.draw();
    if (bubble.popped && !bubble.counted) {
      score++;
      let choice = ~~(Math.random() * 3) + 1;
      let audio = pop1Audio.cloneNode();
      switch (choice) {
        case 2:
          audio = pop2Audio.cloneNode();
          break;
        case 3:
          audio = pop3Audio.cloneNode();
          break;
        default:
          break;
      }
      audio.play();
      bubble.counted = true;
    }
  }
  bubblesArray = bubblesArray.filter((bubble) => {
    // remove bubbles that were popped and finished animating
    if (bubble.popped && bubble.finished) {
      return false;
    }
    // remove bubbles that have left canvas
    if (bubble.y < 0 - 100) {
      return false;
    }
    return true;
  });
}

// Enemies
const enemyImage1 = new Image();
enemyImage1.src = "./sprites/fish/__blue_cartoon_fish_01_swim.png";
const enemyImage2 = new Image();
enemyImage2.src = "./sprites/fish/__green_cartoon_fish_01_swim.png";
const enemyImage3 = new Image();
enemyImage3.src = "./sprites/fish/__orange_cartoon_fish_01_swim.png";
const enemyImage4 = new Image();
enemyImage4.src = "./sprites/fish/__pink_cartoon_fish_01_swim.png";
const enemyImage5 = new Image();
enemyImage5.src = "./sprites/fish/__red_cartoon_fish_01_swim.png";
const enemyImage6 = new Image();
enemyImage6.src = "./sprites/fish/__yellow_cartoon_fish_01_swim.png";
let enemiesArray = [];
class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * canvas.height + 90;
    this.speed = Math.random() * 2 + 2;
    this.radius = 40;
    this.touched = false;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.imageChoice = ~~(Math.random() * 6) + 1;
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
    let enemyImage = enemyImage1;
    let spriteWidth = 418;
    let spriteHeight = 397;
    switch (this.imageChoice) {
      case 1:
        enemyImage = enemyImage1;
        break;
      case 2:
        enemyImage = enemyImage2;
        break;
      case 3:
        enemyImage = enemyImage3;
        break;
      case 4:
        enemyImage = enemyImage4;
        break;
      case 5:
        enemyImage = enemyImage5;
        break;
      case 6:
        enemyImage = enemyImage6;
        break;
      default:
        break;
    }
    ctx.drawImage(
      enemyImage,
      this.frameX * spriteWidth,
      this.frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      this.x - 50,
      this.y - 52,
      spriteWidth / 4,
      spriteHeight / 4
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
    if (enemy.touched) gameOver = true;
  }
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
  handleBubbles();
  handlePlayer();
  handleEnemies();
  ctx.font = "30px Georgia";
  ctx.fillStyle = "black";
  ctx.textAlign = "start";
  ctx.fillText(`Score: ${score}`, 10, 30);
  gameFrame++;
  if (!gameOver) requestAnimationFrame(animate);
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", 387, 227);
    ctx.fillText(`Final Score: ${score}`, 387, 277);
    ctx.fillStyle = "yellow";
    ctx.fillText("Game Over", 385, 225);
    ctx.fillText(`Final Score: ${score}`, 385, 275);
  }
}

animate();

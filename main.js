var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var shipHeight = 70;
var shipWidth = 70;
var shipTxt = './assets/SF01.png';
var shipX = 10;
var shipY = canvas.height/2;
var upPressed = false;
var downPressed = false;
var shoot = false;
var fireRadius = 4;
var fireX = 10;
var fireY = shipY;
var shots = [];
var enemiesTxt = ['./assets/enemy01.png', './assets/enemy02.png', './assets/enemy04.png'];
var enemies = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", clickHandler, false);

function clickHandler() {
  addShot();
}
function mouseMoveHandler(e) {
  if(e.clientY > 0+shipHeight/2 && e.clientY < canvas.height-shipHeight/2) {
      shipY = e.clientY-shipHeight/2;
  }
}
function keyDownHandler(e) {
    if(e.keyCode == 38) {
      upPressed = true;
    }
    else if(e.keyCode == 40) {
      downPressed = true;
    }
    else if (e.keyCode == 32) {
      addShot();
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 38) {
      upPressed = false;
    }
    else if(e.keyCode == 40) {
      downPressed = false;
    }
}

function addShot() {
  if (shots.length < 30){
    shots.push({x: shipWidth, y: shipY+shipHeight/2});
  }
}
function remShot() {
  shots.shift();
}

function drawShip() {
  let img = new Image();
  img.src = shipTxt;
  ctx.beginPath();
  ctx.drawImage(img, shipX, shipY, shipHeight, shipWidth);
  ctx.closePath();
}

function drawShot(item) {
  itemX = item.x;
  itemY = item.y;
  ctx.beginPath();
  ctx.arc(itemX, itemY, fireRadius, 0, Math.PI*2);
  ctx.fillStyle = "crimson";
  ctx.fill();
  ctx.closePath();
}

function drawReload() {
  ctx.font = "26px Arial";
  ctx.fillStyle = "#eee";
  ctx.fillText("Reloading...", canvas.width/2-30, canvas.height/2);
  }

function addEnemy() {
  let altitude = (canvas.height/2)+(canvas.height/2-shipHeight)*Math.sin(Math.random()*7+0);
  let rand = Math.floor(Math.random()*3);
  enemies.push({x: canvas.width-100, y: altitude, texture: enemiesTxt[rand], speed: rand });
}

function collisionDetection() {
  enemies.forEach((enemy, i) => {
    shots.forEach((shot, j) => {
      if (shot.y > enemy.y && shot.y < enemy.y+shipHeight && shot.x > enemy.x) {
        enemies.splice(i,1);
        shots.splice(j,1);
      }
    })
  })
}

function drawEnemy(enX, enY, enTxt) {
  let img = new Image();
  img.src = enTxt;
  ctx.beginPath();
  ctx.drawImage(img, enX, enY, shipHeight, shipWidth);
  ctx.closePath();
}
setInterval(addEnemy, 1000);
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  collisionDetection();

  enemies.forEach((enemy) => {
    drawEnemy(enemy.x, enemy.y, enemy.texture);
    enemy.x-=(4+enemy.speed);
  });


  if (upPressed && shipY > 0) {
    shipY -= 10;
  }
  else if(downPressed && shipY < canvas.height-shipHeight) {
    shipY += 10;
  }

  shots.forEach((item) => {
    if (item.x < canvas.width) {
      item.x += 7;
      drawShot(item);
    }
    else if (itemX >= canvas.width) {
      remShot();
    }
  });
  if (shots.length >= 30) drawReload();

  requestAnimationFrame(render);
}

render();
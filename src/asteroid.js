"use strict";

const MS_PER_FRAME = 1000/8;

module.exports = exports = Asteroid;
var big = [];
var med = [];
var sm = [];
big[0] = new Image();
big[0].src = 'assets/Big 1.png';
big[1] = new Image();
big[1].src = 'assets/Big 2.png';
big[2] = new Image();
big[2].src = 'assets/Big 3.png';
big[3] = new Image();
big[3].src = 'assets/Big 4.png';
med[0] = new Image();
med[0].src = 'assets/Med 1.png';
med[1] = new Image();
med[1].src = 'assets/Med 2.png';
sm[0] = new Image();
sm[0].src = 'assets/Sm 1.png';
sm[1] = new Image();
sm[1].src = 'assets/Sm 2.png';
var beenHit = 0;

function Asteroid(position, size, canvas){
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.mass = size;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: Math.random()*.6 - .3,
    y: Math.random()*.6 - .3
  };
  this.angle = 0;
  if(this.mass == 3){
    this.radius  = 30;
  }
  else if(this.mass == 2){
    this.radius  = 15;
  }
  else{
    this.radius  = 7;
  }

  if(this.mass == 3){
    this.img = big[parseInt(Math.random()*4)];
  }else if(this.mass == 2){
    this.img = med[parseInt(Math.random()*2)];
  }else{
    this.img = sm[parseInt(Math.random()*2)];
  }

}

Asteroid.prototype.update = function (time){
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

Asteroid.prototype.render = function(time,ctx){
    ctx.save();
    // Draw the asteroid
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(-this.angle);
    if(this.img == big[0]){
      ctx.drawImage(this.img, 0, 0, 120, 100,
      0, 0, 60, 60);
    }
    else if(this.img == big[1]){
      ctx.drawImage(this.img, 0, 0, 89, 82,
      0, 0, 60, 60);
    }
    else if(this.img == big[2]){
      ctx.drawImage(this.img, 0, 0, 98, 96,
      0, 0, 60, 60);
    }
    else if (this.img == big[3]){
      ctx.drawImage(this.img, 0, 0, 101, 84,
      0, 0, 60, 60);
    }
    else if (this.img == med[0]){
      ctx.drawImage(this.img, 0, 0, 43, 43,
      0, 0, 30, 30);
    }
    else if (this.img == med[1]){
      ctx.drawImage(this.img, 0, 0, 45, 40,
      0, 0, 30, 30);
    }
    else if (this.img == sm[0]){
      ctx.drawImage(this.img, 0, 0, 28, 28,
      0, 0, 15, 15);
    }
    else{
      ctx.drawImage(this.img, 0, 0, 29, 26, 0, 0, 15, 15);
    }
    ctx.restore();
}

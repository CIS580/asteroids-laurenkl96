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

function Asteroid(position, canvas){
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: .25,
    y: .25
  }
  this.angle = 0;
  this.radius  = 64;
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
    ctx.drawImage(this.img, 0,0, 120, 100,
    0, 0, 60, 60);
}

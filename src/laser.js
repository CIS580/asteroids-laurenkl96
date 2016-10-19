"use strict";

module.exports = exports = Laser;

var img = new Image()
img.src = 'assets/Laser.png';

function Laser(position, angle, canvas){
  this.img = img;
  this.angle = angle;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.acceleration = {
    x: Math.sin(angle),
    y: Math.cos(angle)
  };
  this.velocity = {
    x: -this.acceleration.x * 5,
    y: -this.acceleration.y * 5
  }
  this.len = 15;
}

Laser.prototype.update = function(time){
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
}

Laser.prototype.render = function(time, ctx){
  ctx.save();
  // Draw laser
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.drawImage(this.img, 0,0, 13, 57,
  0, 0, 3, 15);
  ctx.restore();
}

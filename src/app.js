"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Asteroid = require('./asteroid.js');
cons Vector = require('./vector.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var asteroids = [];
var axisList = [];
for(var a = 0; a < 20; a++){
  asteroids.push(
    new Asteroid({x: Math.random() * canvas.width, y: Math.random()* canvas.height}, canvas);
  )
  axisList.push(asteroids[a]);
}
axisList.push(player);
axisList.sort(function(a,b){return a.position.x - b.position.x})
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  asteroids.forEach(function (a){
    a.update(elapsedTime);
  });
  axisList.sort(function(a,b){return a.position.x - b.position.x});
  var active = [];
  var potentials = [];
  axisList.forEach(function(obj, index){
    active = active.filter(function(act){
      return obj.position.x - act.position.x
    })
  })
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
  asteroids.forEach(function(a){
    a.render(elapsedTime, ctx);
  })
}

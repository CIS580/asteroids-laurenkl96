"use strict;"

/* Classes */
const Game = require('./game');
const Player = require('./player');
const Asteroid = require('./asteroid');
const Vector = require('./vector');
const Laser = require('./laser')

/* Global variables */
var state = "init";
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var asteroids = [];
var axisList = [];
var laserList = [];
var score = 0;
for(var a = 0; a < 10; a++){
  asteroids.push(
    new Asteroid({x: Math.random() * canvas.width, y: Math.random() * canvas.height}, 3, canvas)
  );
  axisList.push(asteroids[a]);
}
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
  if( state == "init"){
    var flag = true;
    asteroids.forEach(
      function(a){
        if(a.img == undefined){
          flag = false;
        }
      }
    );
    if(player.img == undefined){
      flag = false;
    }
    laserList.forEach(
      function(l){
        if(l.img == undefined){
          flag = false;
        }
      }
    );
    if(flag == true){
      state = "game";
    }
  }
  else{
    player.update(elapsedTime);
    asteroids.forEach(function (a){
      a.update(elapsedTime);
    });
    window.onkeypress = function(event){
      switch(event.key){
        case ' ':
          laserList.push(new Laser({x:player.position.x, y: player.position.y}, player.angle, canvas))
      }
    };
    laserList.forEach(function(l){
      l.update(elapsedTime);
    })
    axisList.sort(function(a,b){return a.position.x - b.position.x});
    var active = [];
    var potentials = [];
    var laserActive = [];
    var laserPotential = [];
    axisList.forEach(function(obj, index){
      active = active.filter(function(act){
        return (obj.position.x - act.position.x) < (obj.radius + act.radius)
      });
      laserActive = laserList.filter(function (las){
        return (obj.position.x - las.position.x) < (obj.radius + las.len)
      });
      active.forEach(function(act, bindex){
        potentials.push({a: obj, b: act});
      });
      laserActive.forEach(function(las){
        laserPotential.push({a: las, b: obj});
      });
      active.push(obj);
    });
    var collisions = [];
    laserPotential.forEach(function({a,b}){
      var lDistSquared =
        Math.pow( a.position.x - b.position.x, 2) +
        Math.pow(a.position.y - b.position.y, 2);
      if(lDistSquared < Math.pow(a.len + b.radius, 2)){
        if(b.mass == 3){
          var c = new Asteroid ({x: b.position.x, y: b.position.y}, 2, canvas);
          var d = new Asteroid ({x: b.position.x, y: b.position.y}, 2, canvas);
          asteroids.push(c);
          asteroids.push(d);
          axisList.push(c);
          axisList.push(d);
        }
        else if (b.mass == 2){
          var c = new Asteroid ({x: b.position.x, y: b.position.y}, 1, canvas);
          var d = new Asteroid ({x: b.position.x, y: b.position.y}, 1, canvas);
          asteroids.push(c);
          asteroids.push(d);
          axisList.push(c);
          axisList.push(d);
        }
        var dNum = asteroids.indexOf(b);
        delete asteroids[dNum];
        var aNum = axisList.indexOf(b);
        delete axisList[aNum];
        var lNum = laserList.indexOf(a);
        delete laserList[lNum];
        score +=25;
      }
    })
    potentials.forEach(function(pair){
      var distSquared =
        Math.pow(pair.a.position.x - pair.b.position.x, 2) +
        Math.pow(pair.a.position.y - pair.b.position.y, 2);
      if(distSquared < Math.pow(pair.a.radius + pair.b.radius, 2)){
        collisions.push(pair);
      }
    });
    collisions.forEach(function(pair){
      var collisionNormal = {
        x: pair.a.position.x - pair.b.position.x,
        y: pair.a.position.y - pair.b.position.y
      }
      var overlap = (pair.a.radius + pair.b.radius) - Vector.magnitude(collisionNormal);
      collisionNormal = Vector.normalize(collisionNormal);
      pair.a.position.x += collisionNormal.x * overlap/2;
      pair.a.position.y += collisionNormal.y * overlap/2;
      pair.b.position.x -= collisionNormal.x * overlap/2;
      pair.b.position.y -= collisionNormal.y * overlap/2;
      //rotate the problem space
      var angle = Math.atan2(collisionNormal.y, collisionNormal.x);
      var a = Vector.rotate(pair.a.velocity, angle);
      var b = Vector.rotate(pair.b.velocity, angle);
      //solve the collision along the x-axis
      var temp = a.x;
      a.x = b.x;
      b.x = temp;
      //Rotate back
      a = Vector.rotate(a, -angle);
      b = Vector.rotate(b, -angle);
      pair.a.velocity.x = a.x;
      pair.a.velocity.y = a.y;
      pair.b.velocity.x = b.x;
      pair.b.velocity.y = b.y;
    });
    //check player collisions
    var playerActive = [];
    playerActive = axisList.filter(function (ast){
      return (player.position.x - ast.position.x) < (player.position.x + ast.position.x)
    });
    playerActive.forEach(function (ast){
      var distSquared =
        Math.pow(player.position.x - ast.position.x, 2) +
        Math.pow(player.position.y - ast.position.y, 2);
      if(distSquared < Math.pow(player.radius + ast.radius, 2)){
        player.lives --;
        player.position.x = canvas.width/2;
        player.position.y = canvas.height/2;
        if(player.lives < 1){
          state = "over";
        }
      }
    });
  }
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
  if(state == "game"){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    player.render(elapsedTime, ctx);
    asteroids.forEach(function(a){
      a.render(elapsedTime, ctx);
    });
    laserList.forEach(function(l){
      l.render(elapsedTime, ctx);
    });
    ctx.fillStyle = "white";
    ctx.font = '24px monospace';
    ctx.fillText('Lives: '+player.lives, 10, 20);
    ctx.fillText('Score: '+score, 10, 45);
    ctx.restore();
  }
  else if(state == "over"){
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = '48px monospace';
    ctx.fillText('Game Over', (canvas.width - ctx.measureText('Game Over').width)/2, canvas.height/2);
    ctx.font = '24px monospace';
    ctx.fillText('Go again?', (canvas.width - ctx.measureText('Game Over').width)/2, canvas.height/2 + 50);
  }
}

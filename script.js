const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const moves = document.getElementById("moves");
const output = document.getElementById("output_area");

function updateMoves(str, source, dest) {
  moves.innerHTML = "<h3>Moves: " + str + "</h3>";
  output.value += (source + 1) + " to " + (dest + 1) + "\n";
}

const WIDTH = 600;
const HEIGHT = 400;

function drawPost(i) {
  ctx.fillStyle = "#CC9900";

  // post is 5px wide
  ctx.fillRect(i * WIDTH / 4 - 5/2, 180, 5, 180);

  // base is 100px wide
  ctx.fillRect(i * WIDTH / 4 - 100/2, 360, 100, 20);
}

const COLORS = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'wheat'];

function drawDisc(post, size, level) {

  ctx.fillStyle = COLORS[size]
  var center = post * WIDTH / 4;
  var width = 100 - 10 * size
  var left = center - width / 2;
  var bottom = 360 - 20 - 20 * (level);
  
  ctx.fillRect(left, bottom, width, 20);
  
}

function drawFreeDisc(size) {

  ctx.fillStyle = COLORS[size]
  var center = WIDTH / 2;
  var width = 100 - 10 * size
  var left = center - width / 2;
  var bottom = 100;

  ctx.fillRect(left, bottom, width, 20);

}

drawPost(1);
drawPost(2);
drawPost(3);

function Spindle(id) {
  this.id = id;
  this.stack = [];
  
  this.add = function(disc) {
    this.stack.push(disc);
  };
  
  this.remove = function() {
    return this.stack.pop();
  };

  this.clear = function() {
    this.stack = [];
  };
  
  this.draw = function() {
    for(let i = 0; i < this.stack.length; i++) {
      drawDisc(this.id, this.stack[i], i);
    }
  };

  this.top = function() {
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1];
    } else {
      return -1;
    }
  }

  this.count = function() {
    return this.stack.length;
  }
}

const hanoi = {
  spindles: [ new Spindle(1),
              new Spindle(2),
              new Spindle(3)],

  free: 0,
  moves: 0,
  source: -1,

  draw: function() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawPost(1);
    drawPost(2);
    drawPost(3);

    if (this.free > 0) {
      drawFreeDisc(this.free)
    }
    
    for(let i = 0; i < 3; i++) {
      this.spindles[i].draw();
    }
  },

  init: function() {
    this.spindles[0].clear();
    this.spindles[1].clear();
    this.spindles[2].clear();

    for(let i = 1; i <= 6; i++){
      this.spindles[0].add(i);
    } 
  },

  remove: function(spindle) {
    if(this.free == 0) {
      let disc = this.spindles[spindle].remove();
      this.free = disc;
      this.source = spindle;
      this.draw();
    }
  },

  getCount: function(spindle) {
    return this.spindles[spindle].stack.length;
  },
  
  add: function(spindle) {

    this.spindles[spindle].add(this.free);
    this.free = 0;
    
    
    // Free move if you are just putting it back
    if (this.source != spindle) {
      this.moves++;
      updateMoves(this.moves, this.source, spindle);
    }

    this.source = -1;

    this.draw();

    // create a message and add the printing to the draw function
    if (this.spindles[1].count() == 6 || this.spindles[2].count() == 6) {
      ctx.font = "30px Arial black";
      ctx.fillText("Yay!", 10, 50);
    }
  },

  hasDiscs: function(spindle) {
    return this.spindles[spindle].stack.length != 0;
  }
  
}

var step = 0;
var i_list = [];

function go() {
  // re-initialize the tower
  hanoi.init();
  
   // read the instructions
  let instructions = document.getElementById("instructions").value;
  i_list = instructions.split("\n");
  setTimeout(takeDisc, 500);
}

function takeDisc() {
  
  let source = parseInt(i_list[step].substring(0, 1)) - 1;
  hanoi.remove(source);
  setTimeout(putDisc, 500);
  
}

function putDisc() {
  let dest = parseInt(i_list[step].substring(5, 6)) - 1;
  hanoi.add(dest);
  step++;
  if (step < i_list.length) {
    setTimeout(takeDisc, 500);
  }
}

let xpos = 10;
function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "red"
  ctx.fillRect(xpos, 10, 10, 10,);
  xpos += 1;

  if (xpos>600) xpos = 0;

  window.requestAnimationFrame(animate)
}

function click(e) {
  let tower = 0; 

  if (e.offsetY > 200 ) {
    if (100 < e.offsetX && e.offsetX < 200) {
      tower = 0;
    } else if (250 < e.offsetX && e.offsetX < 350) {
      tower = 1;
    } else if (400 < e.offsetX && e.offsetX < 500) {
      tower = 2;
    }


    if (hanoi.free == 0 && hanoi.hasDiscs(tower)) {
      hanoi.remove(tower);
    } else if (hanoi.free > 0 && hanoi.free > hanoi.spindles[tower].top()){
      hanoi.add(tower);
    }
  
    
  }
}

canvas.onclick = click;
  
hanoi.init();
hanoi.draw();


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
}

const hanoi = {
  spindles: [ new Spindle(1),
              new Spindle(2),
              new Spindle(3)],

  free: 0,

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
    for(let i = 1; i <= 6; i++){
      this.spindles[0].add(i);
    } 
  },

  remove: function(spindle) {
    if(this.free == 0) {
      let disc = this.spindles[spindle].remove();
      this.free = disc;
      // alert(this.spindles[0].stack);
      // window.requestAnimationFrame(this.draw);
      this.draw();
    }
  },

  getCount: function(spindle) {
    return this.spindles[spindle].stack.length;
  },
  
  add: function(spindle) {
    if (this.free > 0) {
      this.spindles[spindle].add(this.free);
      this.free = 0;
    }
    
    this.draw();
  },

  hasDiscs: function(spindle) {
    return this.spindles[spindle].stack.length != 0;
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

    
    let discs = hanoi.getCount(tower)
    if (hanoi.free == 0 ) {
      hanoi.remove(tower);
    } else {
      if (hanoi.free > hanoi.spindles[tower].top()) {
        hanoi.add(tower);
      }
      
    }
    
  }

  
  
  
}


canvas.onclick = click;
  
hanoi.init();
hanoi.draw();


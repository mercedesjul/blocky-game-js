class Game {
  keycode = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  pause;
  audio;
  scoreboard;
  canvas;
  preview;
  screenrefresh = null;
  intervalspeed = 0;
  interval_option;
  interval = null;
  height;
  width;
  tiles = [];
  active_block = null;
  next_block = null;
  main_render = null;
  preview_render = null;
  constructor(width = 20, height = 30) {
    this.audio = new Audio('tetris.mp3');
    this.audio.loop = true;
    this.audio.autoplay = true;
    let largetstBlock = this.getLargestBlock();
    // Generate Canvas and append to body
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "board");
    this.canvas.setAttribute("height", height * 20);
    this.canvas.setAttribute("width", width * 20);
    document.querySelector(".col-2").appendChild(this.canvas);

    this.preview = document.createElement("canvas");
    this.preview.setAttribute("id", "preview");
    this.preview.setAttribute("height", largetstBlock * 20);
    this.preview.setAttribute("width", largetstBlock * 20);
    document.querySelector(".col-3").appendChild(this.preview);

    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector(".col-2").appendChild(this.audio);
    });
    document.addEventListener("click", () => {
      if (this.audio.currentTime === 0) {
        this.audio.play();
      }
    });
    // Add EventListener for Keystrokes
    document.addEventListener("keydown", e => {
      this.handleKey(e.keyCode);
    });

    // Get Configs Container from DOM
    this.scoreboard = document.querySelector("#score");
    this.interval_option = document.querySelector("#intervallspeed");

    // Set Intervall from DOM and add Change Event Listener to restart Intervall on Change of Speed
    this.intervalspeed = this.interval_option.value;
    this.interval_option.addEventListener("change", e => {
      this.intervalspeed = this.interval_option.value;
      clearInterval(this.interval);
      this.interval = setInterval(this.mainLoop.bind(this), this.intervalspeed);
    });

    this.init(height, width);
  }
  init(height, width) {
    this.interval = null;
    this.tiles = [];
    this.main_render = null;
    

    this.height = height;
    this.width = width;
    this.main_render = new Render(this.canvas);
    this.preview_render = new Render(this.preview);
    for (let i = 0; i < height * width; i++) {
      this.tiles.push(new Tile(i, this.width));
    }
    this.active_block = new Block(this.width / 2, 2);
    this.next_block = new Block(0, 0);

    this.interval = setInterval(this.mainLoop.bind(this), this.intervalspeed);
    this.screenrefresh = setInterval(this.updateScreen.bind(this), 16.6);
  }
  
  getLargestBlock() {
    let max = 0;
    layouts.forEach(layout => {
      let size = Math.sqrt(layout.length);
      max = size > max ? size : max;
    });
    return max;
  }

  mainLoop() {
    let list = this.active_block.moveDown(true);
    if (
      this.checkForGroundCollision(list) ||
      this.checkForBlockCollision(list)
    ) {
      this.blockToBackground(this.active_block);
      this.active_block = this.next_block;
      this.active_block.x = this.width / 2;
      if (this.checkForBlockCollision(this.active_block.getTilePositionsFromLayout().list)) {
        alert("Game Over!");
        document.location.reload();
      }
      this.next_block = new Block(0, 0);
      clearInterval(this.interval);
      this.interval = setInterval(
        this.mainLoop.bind(this),
        this.interval_option.value
      );
      this.applyTileGravity(this.checkForFullRows());
    } else {
      this.active_block.moveDown();
    }
  }

  updateScreen() {
    this.main_render.clear();
    this.preview_render.clear();
    this.main_render.drawRasterBackground(this.tiles);
    this.renderBlocks();
    if (this.pause) {
      this.main_render.renderText("PAUSED", (g.width * 20) / 4, (g.height * 20) / 2);
    }
  }

  renderBlocks() {
    // Render inactive Blocks
    this.tiles.forEach(tile => {
      if (tile.active) {
        this.main_render.drawTile(tile.x, tile.y, tile.color);
      }
    });
    // Render active Block
    let active_block_tiles = this.active_block.getTilePositionsFromLayout();
    active_block_tiles.list.forEach(block_tile => {
      this.main_render.drawTile(
        block_tile.x,
        block_tile.y,
        active_block_tiles.color
      );
    });
    // Render preview Block
    let preview_block_tiles = this.next_block.getTilePositionsFromLayout();
    preview_block_tiles.list.forEach(block_tile => {
        this.preview_render.drawTile(
          block_tile.x,
          block_tile.y,
          preview_block_tiles.color
        );
    });
  }

  blockToBackground(block) {
    let block_object = block.getTilePositionsFromLayout();
    block_object.list.forEach(list_tile => {
      let tile = this.getTileByXY(list_tile.x, list_tile.y);
      tile.color = block_object.color;
      tile.active = true;
    });
  }

  checkForFullRows() {
    let deleted_rows = [];
    for (let row = 0; row < this.height; row++) {
      let count = 0; // Counter for each row
      this.tiles.forEach(tile => {
        if (tile.active && tile.y === row) count++;
      });
      if (count == this.width) {
        this.tiles.forEach(tile => {
          if (tile.y == row) {
            tile.active = false;
          }
        });
        deleted_rows.push(row);
      }
      const score = parseInt(this.scoreboard.innerHTML) + (50 * deleted_rows.length);
      const bonus = (deleted_rows.length - 1) * 50;
      const total_score = bonus < 0 ? score : score + bonus;
      this.scoreboard.innerHTML = total_score;
    }
    return deleted_rows;
  }

  applyTileGravity(rows) {    
    for (let i = 0; i < rows.length; i++) {
      const row_y = rows[i];
      let active_tiles = this.tiles.filter(tile => {
        return tile.active && tile.y < row_y;
      });
      active_tiles.reverse();
      active_tiles.forEach(tile => {
        const newTile = this.getTileByXY(tile.x, tile.y + 1);
        if(!newTile || newTile.active) {
          return;
        } else {
          tile.active = false;
          newTile.active = true;
          newTile.color = tile.color;
        }
      });
    }
  }

  checkForGroundCollision(list) {
    let hit = false;
    list.forEach(tile => {
      if (tile.y == this.height) {
        hit = true;
      }
    });
    return hit;
  }

  checkForWallCollisionRight(list) {
    let hit = false;
    list.forEach(tile => {
      if (tile.x > this.width - 1) {
        hit = true;
      }
    });
    return hit;
  }
  checkForWallCollisionLeft(list) {
    let hit = false;
    list.forEach(tile => {
      if (tile.x < 0) {
        hit = true;
      }
    });
    return hit;
  }

  checkForBlockCollision(list) {
    let hit = false;
    list.forEach(list_tile => {
      this.tiles.forEach(tile => {
        if (tile.active && list_tile.y === tile.y && list_tile.x === tile.x)
          hit = true;
      });
    });
    return hit;
  }

  getTileByXY(x, y) {
    if (x > this.width - 1 || y > this.height - 1 || x < 0 || y < 0) {
    }
    return this.tiles[x + this.width * y];
  }

  toggleMute() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  togglePause() {
    if (this.pause) {
      this.interval = setInterval(
        this.mainLoop.bind(this),
        this.interval_option.value
      );
      this.pause = false;
    } else {
      clearInterval(this.interval);
      this.pause = true;
    }
  }

  handleKey(keyCode) {
    let list;
    let no_collision;
    switch (keyCode) {
      case this.keycode.left:
        if(this.pause) break;
        list = this.active_block.moveLeft(true);
        no_collision = !this.checkForWallCollisionLeft(list) && !this.checkForBlockCollision(this.active_block.moveLeft(true));
        if (no_collision) {
          this.active_block.moveLeft();
        }
        break;
      case this.keycode.right:
        if(this.pause) break;
        list = this.active_block.moveRight(true);
        no_collision = !this.checkForWallCollisionRight(list) && !this.checkForBlockCollision(this.active_block.moveRight(true));
        if (no_collision) {
          this.active_block.moveRight();
        }
        break;
      case this.keycode.up:
        if(this.pause) break;
        list = this.active_block.rotateRight(true);
        no_collision = !this.checkForWallCollisionLeft(list) && !this.checkForWallCollisionRight(list) && !this.checkForBlockCollision(list) && !this.checkForGroundCollision(list);
        if (no_collision) {
          this.active_block.rotateRight();
        }
        break;
      case this.keycode.down:
        if(this.pause) break;
        clearInterval(this.interval);
        this.interval = setInterval(this.mainLoop.bind(this), 25);
        break;
    }
  }
}

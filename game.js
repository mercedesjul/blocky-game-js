class Game {
  keycode = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  scoreboard;
  screenrefresh = null;
  intervalspeed = 0;
  interval_option;
  interval = null;
  height;
  width;
  tiles = [];
  active_block = null;
  render = null;
  constructor(height = 40, width = 20) {
    // Generate Canvas and append to body
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "board");
    canvas.setAttribute("height", height * 20);
    canvas.setAttribute("width", width * 20);
    document.querySelector(".col-2").appendChild(canvas);

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
    this.render = null;

    this.height = height;
    this.width = width;
    this.render = new Render();
    for (let i = 0; i < height * width; i++) {
      this.tiles.push(new Tile(i, this.width));
    }

    this.active_block = new Block(this.width / 2, 2);

    this.interval = setInterval(this.mainLoop.bind(this), this.intervalspeed);
    this.screenrefresh = setInterval(this.updateScreen.bind(this), 16.6);
  }

  mainLoop() {
    let list = this.active_block.moveDown(true);
    if (
      this.checkForGroundCollision(list) ||
      this.checkForBlockCollision(list)
    ) {
      this.blockToBackground(this.active_block);
      this.active_block = new Block(this.width / 2, 0);
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
    this.render.clear();
    this.render.drawRasterBackground(this.tiles);
    this.renderBlocks();
  }

  renderBlocks() {
    // Render inactive Blocks
    this.tiles.forEach(tile => {
      if (tile.active) {
        this.render.drawTile(tile.x, tile.y, tile.color);
      }
    });
    // Render active Block
    let active_block_tiles = this.active_block.getTilePositionsFromLayout();
    active_block_tiles.list.forEach(block_tile => {
      this.render.drawTile(
        block_tile.x,
        block_tile.y,
        active_block_tiles.color
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

  checkForWallCollisionRight() {
    let hit = false;
    this.active_block.moveRight(true).forEach(tile => {
      if (tile.x === this.width) {
        hit = true;
      }
    });
    return hit;
  }
  checkForWallCollisionLeft() {
    let hit = false;
    this.active_block.moveLeft(true).forEach(tile => {
      if (tile.x === -1) {
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

  handleKey(keyCode) {
    switch (keyCode) {
      case this.keycode.left:
        if (
          !this.checkForWallCollisionLeft() &&
          !this.checkForBlockCollision(this.active_block.moveLeft(true))
        ) {
          this.active_block.moveLeft();
        }
        break;
      case this.keycode.right:
        if (
          !this.checkForWallCollisionRight() &&
          !this.checkForBlockCollision(this.active_block.moveRight(true))
        ) {
          this.active_block.moveRight();
        }
        break;
      case this.keycode.up:
        this.active_block.rotateRight();
        break;
      case this.keycode.down:
        clearInterval(this.interval);
        this.interval = setInterval(this.mainLoop.bind(this), 25);
        break;
    }
  }
}

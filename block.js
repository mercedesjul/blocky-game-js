const layouts = [
  [
    1, 1, 1, 1,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ],
  [
    0, 0, 1,
    1, 1, 1,
    0, 0, 0,
  ],
  [
    1, 0, 0,
    1, 1, 1,
    0, 0, 0,
  ],
  [
    1, 1,
    1, 1,
  ],
  [
    0, 1, 1,
    1, 1, 0,
    0, 0, 0,
  ],
  [
    0, 1, 0,
    1, 1, 1,
    0, 0, 0,
  ],
  [
    1, 1, 0,
    0, 1, 1,
    0, 0, 0,
  ],
];
class Block {
  x = null;
  y = null;
  active = true;
  layout = layouts[Math.floor(Math.random() * layouts.length)];
  color = this.randomColor();
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
  }
  randomColor() {
    return 'rgba(' + [this.randomColorValue(), this.randomColorValue(), this.randomColorValue()].join(',') + ')';
  }
  randomColorValue() {
    return Math.round(Math.random() * 255);
  }
  moveLeft(dryrun) {
    if (!dryrun) {
      this.x -= 1;
      return this.getTilePositionsFromLayout().list;
    }
    return this.getTilePositionsFromLayout(this.x - 1, this.y).list;
  }
  moveRight(dryrun) {
    if (!dryrun) {
      this.x += 1;
      return this.getTilePositionsFromLayout().list;
    }
    return this.getTilePositionsFromLayout(this.x + 1, this.y).list;
  }
  moveDown(dryrun) {
    if (!dryrun) {
      this.y += 1;
      return this.getTilePositionsFromLayout().list;
    }
    return this.getTilePositionsFromLayout(this.x, this.y + 1).list;
  }
  moveUp(dryrun) {
    if (!dryrun) {
      this.y -= 1;
      return this.getTilePositionsFromLayout().list;
    }
    return this.getTilePositionsFromLayout(this.x, this.y - 1).list;
  }
  rotateRight(dryrun) {
    let newLayout = [];
    // May the Lord be pleased with this solution
    const layout_length = this.layout.length;
    const sqrt_length = Math.sqrt(layout_length);
    let counter = 0;
    for (let i = sqrt_length; counter < layout_length; i--) {
      for (let k = 0; k < Math.sqrt(this.layout.length); k++) {
        newLayout[counter] = this.layout[layout_length - ((sqrt_length * k) + i)];
        counter++;
      }
    }
    if (!dryrun) {
      this.layout = newLayout;
    }
    return this.getTilePositionsFromLayout(this.x, this.y, newLayout).list;
  }

  getTilePositionsFromLayout(x = this.x, y = this.y, layout = this.layout) {
    let list = [];
    let block_width = Math.sqrt(layout.length);
    for(let i = 0; i < layout.length; i++) {
      if (layout[i] === 1) {
        list.push(
          {
            x: Math.floor(i % block_width) + x,
            y: Math.floor(i / block_width) + y,
          });
      }
    }
    return {
      color: this.color,
      list: list,
    };
  }
}

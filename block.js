const layouts = [
  [
    0, 0, 0, 0, 0,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 0,
  ],
  [
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
  ],
  [
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 1, 0, 0, 0,
    0, 1, 0, 0, 0,
  ],
  [
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 0, 0, 0, 0,
  ],
  [
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 1, 0, 0, 0,
    0, 1, 0, 0, 0,
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
  rotateRight() {
    // May the Lord forgive me for this solution
    let newLayout = [];
    newLayout[0] = this.layout[20];
    newLayout[1] = this.layout[15];
    newLayout[2] = this.layout[10];
    newLayout[3] = this.layout[5];
    newLayout[4] = this.layout[0];
    newLayout[5] = this.layout[21];
    newLayout[6] = this.layout[16];
    newLayout[7] = this.layout[11];
    newLayout[8] = this.layout[6];
    newLayout[9] = this.layout[1];
    newLayout[10] = this.layout[22];
    newLayout[11] = this.layout[17];
    newLayout[12] = this.layout[12];
    newLayout[13] = this.layout[7];
    newLayout[14] = this.layout[2];
    newLayout[15] = this.layout[23];
    newLayout[16] = this.layout[18];
    newLayout[17] = this.layout[13];
    newLayout[18] = this.layout[8];
    newLayout[19] = this.layout[3];
    newLayout[20] = this.layout[24];
    newLayout[21] = this.layout[19];
    newLayout[22] = this.layout[14];
    newLayout[23] = this.layout[9];
    newLayout[24] = this.layout[4];
    this.layout = newLayout;
  }

  getTilePositionsFromLayout(x = this.x, y = this.y) {
    let list = [];
    for(let i = 0; i < this.layout.length; i++) {
      if (this.layout[i] === 1) {
        list.push(
          {
            x: Math.floor(i % 5) + x - 2,
            y: Math.floor(i / 5) + y - 2,
          });
      }
    }
    return {
      color: this.color,
      list: list,
    };
  }
}

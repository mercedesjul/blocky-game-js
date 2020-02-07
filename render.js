class Render {
  board = null;
  ctx = null;
  constructor(board) {
    this.board = board;
    this.ctx = board.getContext("2d");
  }
  drawRasterBackground(tiles) {
    tiles.forEach(tile => {
      this.drawBackgroundTile(tile);
    });
  }
  drawBackgroundTile(tile, color = "rgb(0, 0, 0)") {
    this.ctx.fillStyle = color;
    this.ctx.strokeRect(tile.x * 20, tile.y * 20, 20, 20);
  }
  drawTile(x, y, color = "rgb(0, 0, 0)") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * 20, y * 20, 20, 20);
  }
  renderText(text, x, y) {
    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.font = "62px Monospace"
    this.ctx.fillText(text, x, y);
  }
  clear() {
    this.ctx.clearRect(0, 0, board.width, board.height);
  }

}

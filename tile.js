class Tile {
    x;
    y;
    color;
    active;
    constructor(pos, gameSize) {
        this.x = Math.floor(pos % gameSize);
        this.y =  Math.floor(pos / gameSize);
    }
    equalTo(tile) {
        return this.x == tile.x && this.y == tile.y;
    }
    toRender() {
        return {x: this.x, y: this.y};
    }
    __toString() {
        return "X: " + this.x + " | Y: " + this.y;
    }
}
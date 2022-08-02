const { Box } = require("detect-collisions");

class Shot {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.Shape = new Box({ x: this.x, y: this.y }, 5, 5);
  }
  update() {
    this.x += this.speed;
    this.Shape.setPosition(this.x, this.y);
  }
  isVisible() {
    return this.x > 0 && this.x < 800;
  }
}

module.exports = Shot;

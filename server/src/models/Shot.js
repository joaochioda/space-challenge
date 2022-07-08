class Shot {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  update() {
    this.x += this.speed;
  }
  isVisible() {
    return this.x > 0 && this.x < 800;
  }
}

module.exports = Shot;

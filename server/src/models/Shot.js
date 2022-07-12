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

  isCollision(rect) {
    return (
      this.x > rect.x &&
      this.x < rect.x + rect.width &&
      this.y > rect.y &&
      this.y < rect.y + rect.height
    );
  }
}

module.exports = Shot;

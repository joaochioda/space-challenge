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
  isCollision(enemy) {
    return (
      this.x >= enemy.x &&
      this.x <= enemy.x + enemy.width &&
      this.y >= enemy.y &&
      this.y <= enemy.y + enemy.height
    );
  }
}

module.exports = Shot;

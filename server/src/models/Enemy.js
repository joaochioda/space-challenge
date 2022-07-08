class Enemy {
  constructor(difficulty, where) {
    this.x = 800;
    this.y = 0;
    this.difficulty = difficulty;
    this.velocity = 1;
    this.life = 10;
    this.where = where;
    this.spaw();
  }
  spaw() {
    this.x = 800;
    if (this.where === "up") {
      this.y = Math.floor(Math.random() * (300 - 0) + 0);
    } else {
      this.y = Math.floor(Math.random() * (600 - 300) + 300);
    }

    if (this.difficulty === "easy") {
      this.velocity = 1;
      this.life = 10;
    }
  }
  update() {
    this.x -= this.velocity;
  }
  isVisible() {
    return this.x < -10;
  }
}

module.exports = Enemy;

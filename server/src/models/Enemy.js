class Enemy {
  constructor(difficulty, where) {
    this.y = 0;
    this.difficulty = difficulty;
    this.velocity = 1;
    this.life = 10;
    this.where = where;
    this.angle = 0;
    this.spaw();
  }
  spaw() {
    this.x = 300;
    this.width = 50;
    this.height = 50;
    if (this.where === "up") {
      this.y = 5;
    } else {
      this.y = Math.floor(Math.random() * (600 - 300) + 300);
    }

    if (this.difficulty === "easy") {
      this.velocity = 3;
      this.life = 10;
    }
  }
  update() {
    // this.x -= this.velocity;
    // this.x = Math.floor(this.x);
    this.rotate();
  }
  rotate() {
    this.angle = 30;
  }
  isVisible() {
    return this.x < -10;
  }
}

module.exports = Enemy;

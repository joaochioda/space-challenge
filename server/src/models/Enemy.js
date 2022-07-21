const { Circle, Polygon, Box } = require("detect-collisions");

class Enemy {
  constructor(difficulty, where, spin, type) {
    this.x = 800;
    this.y = 0;
    this.type = type;
    this.spin = spin;
    this.difficulty = difficulty;
    this.velocity = 1;
    this.life = 10;
    this.where = where;
    this.angle = 0;
    this.spaw();
  }
  spaw() {
    this.x = 800;
    this.width = 50;
    this.height = 50;

    if (this.where === "up") {
      this.y = Math.floor(Math.random() * (300 - 0) + 0);
    } else {
      this.y = Math.floor(Math.random() * (600 - 300) + 300);
    }

    if (this.type === "circles") {
      this.spin = true;
    }

    if (this.difficulty === "easy") {
      this.velocity = 3;
      this.life = 10;
      this.damage = 10;
    }
    this.velocity = 3;
    this.Shape = new Box({ x: this.x, y: this.y }, this.width, this.height);
    this.Shape.translate(-this.width / 2, -this.height / 2);
  }
  update() {
    this.x -= this.velocity;
    this.x = Math.floor(this.x);
    this.Shape.setPosition(this.x, this.y);
    if (this.spin) {
      this.rotate();
    }
  }
  rotate() {
    this.angle += 0.5;
    let angle = (this.angle * 3.14) / 180;
    this.Shape.rotate(angle);
  }
  isVisible() {
    return this.x < -10;
  }
}

module.exports = Enemy;

const { Circle, Polygon, Box } = require("detect-collisions");

class Enemy {
  constructor(difficulty, where, spin = false, type) {
    this.x = 800;
    this.y = 0;
    this.type = type;
    this.spin = spin;
    this.difficulty = difficulty;
    this.velocity = 1;
    this.life = 10;
    this.where = where;
    this.live = true;
    this.angle = 0;
    this.spaw();
  }

  setParamsDifficulty() {
    if (this.difficulty === "easy") {
      this.velocity = 3;
      this.life = 10;
      this.damage = 10;
    } else if (this.difficulty === "medium") {
      this.velocity = 5;
      this.life = 20;
      this.damage = 20;
    } else {
      this.velocity = 7;
      this.life = 30;
      this.damage = 30;
    }
  }

  setParamsShape() {
    if (this.type === "square") {
      this.Shape = new Box({ x: this.x, y: this.y }, this.width, this.height);
      this.Shape.translate(-this.width / 2, -this.height / 2);
    } else if (this.type === "circle") {
      this.Shape = new Circle({ x: this.x, y: this.y }, 10);
    } else if (this.type === "spacenemy") {
      this.Shape = new Polygon({ x: this.x, y: this.y }, [
        { x: 20, y: -10 },
        { x: 30, y: -10 },
        { x: 50, y: -30 },
        { x: 70, y: -10 },
        { x: 70, y: 10 },
        { x: 50, y: 30 },
        { x: 50, y: 30 },
        { x: 30, y: 10 },
        { x: 20, y: 10 },
        { x: 0, y: 0 },
      ]);
    }
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

    this.setParamsDifficulty();
    this.setParamsShape();
  }

  update() {
    if (this.live) {
      this.x -= this.velocity;
      this.x = Math.floor(this.x);
      this.Shape.setPosition(this.x, this.y);
      if (this.spin) {
        this.rotate();
      }
    }
  }
  rotate() {
    this.angle += 0.5;
    let angle = (this.angle * 3.14) / 180;
    this.Shape.rotate(angle);
  }
  isVisible() {
    return this.x > -10;
  }
  canDestoy() {
    return !this.live || this.x < -10;
  }
  kill() {
    this.type = "";
    this.live = false;
  }
}

module.exports = Enemy;

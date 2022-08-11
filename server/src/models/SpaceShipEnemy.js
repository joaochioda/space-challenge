const Enemy = require("./Enemy");
const Shot = require("./Shot");

class SpaceShipEnemy extends Enemy {
  constructor(difficulty, where, spin, type, level) {
    super(difficulty, where, spin, type);
    this.type = type;
    this.difficulty = difficulty;
    this.level = level;
    this.shots = [];
    this.maxShots = 3;
    this.shoot();
  }

  spaw() {
    super.spaw();
  }
  update() {
    super.update();
    this.shots.forEach((shot) => {
      if (shot.isVisible()) {
        shot.update();
      } else {
        this.shots.splice(this.shots.indexOf(shot), 1);
      }
    });
  }
  canDestoy() {
    return (this.shots.length === 0 && !this.live) || this.x < -20;
  }
  shoot() {
    this.shootInterval = setInterval(() => {
      if (this.live) {
        const shot = new Shot(this.x, this.y, -10);
        this.shots.push(shot);
      }
    }, 1500);
  }
  destroy() {
    clearInterval(this.shootInterval);
  }
}

module.exports = SpaceShipEnemy;

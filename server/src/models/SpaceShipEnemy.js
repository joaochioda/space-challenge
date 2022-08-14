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
    this.frame = 0;
    this.shootInterval = 60;
  }

  spaw() {
    super.spaw();
  }
  update() {
    super.update();
    this.frame++;
    this.shots.forEach((shot) => {
      if (shot.isVisible()) {
        shot.update();
      } else {
        this.shots.splice(this.shots.indexOf(shot), 1);
      }
    });
    this.shoot();
  }
  canDestoy() {
    return (this.shots.length === 0 && !this.live) || this.x < -20;
  }
  shoot() {
    if (this.live && this.frame % this.shootInterval === 0) {
      const shot = new Shot(this.x, this.y, -10);
      this.shots.push(shot);
      this.frame = 0;
    }
  }
}

module.exports = SpaceShipEnemy;

const { Circle, Polygon, Box } = require("detect-collisions");

const Shot = require("./Shot");

const maxAccelerationX = 3;
const maxAccelerationY = 3;

const acceleration = 0.3;

const maxXScreen = 500;
const maxYScreen = 300;

class Player {
  constructor(socket, player) {
    this.socket = socket;
    this.id = socket.id;
    this.score = 0;
    this.life = 100;
    this.isAlive = true;
    this.limit_x_start = 0;
    this.limit_x_end = maxXScreen;
    this.limit_y_start = player === "a" ? 0 : maxYScreen;
    this.limit_y_end = player === "a" ? maxYScreen : maxYScreen * 2;
    this.x = 0;
    this.y = player === "a" ? 0 : maxYScreen;
    this.width = 10;
    this.height = 10;
    this.direction = null;
    this.movimentation = ""; //1 = up, -1 = down
    this.acceleration = {
      x: 0,
      y: 0,
    };
    this.shoots = [];
    this.Shape = new Box({ x: this.x, y: this.y }, this.width, this.height);

    this.socket.on("move", (data) => {
      // only move after period of time
      this.handleMovimentation(data);
    });
    this.socket.on("shoot", (data) => {
      this.shoot();
    });
  }

  move() {
    if (this.x + this.acceleration.x > this.limit_x_end) {
      this.x = this.limit_x_end;
      this.acceleration.x = 0;
    }
    if (this.x + this.acceleration.x < this.limit_x_start) {
      this.x = this.limit_x_start;
      this.acceleration.x = 0;
    }
    if (this.y + this.acceleration.y > this.limit_y_end) {
      this.y = this.limit_y_end;
      this.acceleration.y = 0;
    }
    if (this.y + this.acceleration.y < this.limit_y_start) {
      this.y = this.limit_y_start;
      this.acceleration.y = 0;
    }

    this.x += this.acceleration.x;
    this.y += this.acceleration.y;
    this.Shape.setPosition(this.x, this.y);
    this.acceleration.x =
      this.acceleration.x - 0.02 < -2 ? -2 : this.acceleration.x - 0.05;

    this.shoots.forEach((shot) => {
      shot.update();
      if (!shot.isVisible()) {
        this.shoots.splice(this.shoots.indexOf(shot), 1);
      }
    });
  }

  handleMovimentation(data) {
    const mapMoves = {
      up: {
        x: this.acceleration.x,
        y:
          -acceleration + this.acceleration.y < -maxAccelerationY
            ? -maxAccelerationY
            : -acceleration + this.acceleration.y,
      },
      down: {
        x: this.acceleration.x,
        y:
          acceleration + this.acceleration.y > maxAccelerationY
            ? maxAccelerationY
            : acceleration + this.acceleration.y,
      },
      right: {
        x:
          acceleration + this.acceleration.x > maxAccelerationX
            ? maxAccelerationX
            : acceleration + this.acceleration.x,
        y: this.acceleration.y,
      },
      upLeft: {
        x: this.acceleration.x,
        y:
          -acceleration + this.acceleration.y < -maxAccelerationY
            ? -maxAccelerationY
            : -acceleration + this.acceleration.y,
      },
      upRight: {
        x:
          acceleration + this.acceleration.x > maxAccelerationX
            ? maxAccelerationX
            : acceleration + this.acceleration.x,
        y:
          -acceleration + this.acceleration.y < -maxAccelerationY
            ? -maxAccelerationY
            : -acceleration + this.acceleration.y,
      },
      downLeft: {
        x: this.acceleration.x,
        y:
          acceleration + this.acceleration.y > maxAccelerationY
            ? maxAccelerationY
            : acceleration + this.acceleration.y,
      },
      downRight: {
        x:
          acceleration + this.acceleration.x > maxAccelerationX
            ? maxAccelerationX
            : acceleration + this.acceleration.x,
        y:
          acceleration + this.acceleration.y > maxAccelerationY
            ? maxAccelerationY
            : acceleration + this.acceleration.y,
      },
    };
    if (mapMoves[data]) {
      this.acceleration = mapMoves[data];
      this.movimentation = data;
    } else {
      this.movimentation = "";
    }
  }

  shoot() {
    const shot = new Shot(this.x, this.y, 10);
    this.shoots.push(shot);
  }

  takeDamage(damage) {
    this.life -= damage;
    // console.log(this.life);
    if (this.life <= 0) {
      this.isAlive = false;
    }
  }
}

module.exports = Player;

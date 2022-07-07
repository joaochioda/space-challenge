const maxAccelerationX = 3;
const maxAccelerationY = 3;

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
    this.direction = null;
    this.lastMove_y = 0; //1 = up, -1 = down
    this.acceleration = {
      x: 0,
      y: 0,
    };
    this.socket.on("move", (data) => {
      this.handleMovimentation(data);
    });
  }

  move() {
    if (this.direction) {
      if (this.direction === "up") {
        this.acceleration.y -= 0.1;
        if (this.acceleration.y < -maxAccelerationY) {
          this.acceleration.y = -maxAccelerationY;
        }
      } else if (this.direction === "down") {
        this.acceleration.y += 0.1;
        if (this.acceleration.y > maxAccelerationY) {
          this.acceleration.y = maxAccelerationY;
        }
      } else if (this.direction === "left") {
        this.acceleration.x -= 0.1;
        if (this.acceleration.x < -maxAccelerationX) {
          this.acceleration.x = -maxAccelerationX;
        }
      } else if (this.direction === "right") {
        this.acceleration.x += 0.1;
        if (this.acceleration.x > maxAccelerationX) {
          this.acceleration.x = maxAccelerationX;
        }
      }
    }

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
  }

  handleMovimentation(data) {
    const mapMoves = {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    };
    if (mapMoves[data]) {
      this.direction = mapMoves[data];
    }
  }
}

module.exports = Player;

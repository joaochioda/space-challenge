const velocity = 5;

const mapMoves = {
  up: {
    x: 0,
    y: -velocity,
  },
  down: {
    x: 0,
    y: velocity,
  },
  left: {
    x: -velocity,
    y: 0,
  },
  right: {
    x: velocity,
    y: 0,
  },
};

class Player {
  constructor(socket, player) {
    this.socket = socket;
    this.id = socket.id;
    this.score = 0;
    this.life = 100;
    this.isAlive = true;
    this.limit_x_start = 0;
    this.limit_x_end = 500;
    this.limit_y_start = player === "a" ? 0 : 500;
    this.limit_y_end = player === "a" ? 500 : 1000;
    this.x = 0;
    this.y = player === "a" ? 0 : 500;
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.socket.on("move", (data) => {
      console.log("move", data);
      this.handleMovimentation(data);
    });
  }

  move() {
    if (
      this.x + this.velocity.x > this.limit_x_start &&
      this.x + this.velocity.x < this.limit_x_end
    ) {
      this.x += this.velocity.x;
    } else {
      this.x = this.x;
    }
    if (
      this.y + this.velocity.y > this.limit_y_start &&
      this.y + this.velocity.y < this.limit_y_end
    ) {
      this.y += this.velocity.y;
    } else {
      this.y = this.y;
    }
  }

  handleMovimentation(data) {
    if (data in mapMoves) {
      this.velocity = mapMoves[data];
    }
  }
}

module.exports = Player;

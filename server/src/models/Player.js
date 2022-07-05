const mapMoves = {
  up: {
    x: 0,
    y: -0.1,
  },
  down: {
    x: 0,
    y: 0.1,
  },
  left: {
    x: -0.1,
    y: 0,
  },
  right: {
    x: 0.1,
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
    this.limit_x_start = player === "a" ? 0 : 500;
    this.limit_x_end = player === "a" ? 500 : 1000;
    this.limit_y = 500;
    this.x = player === "a" ? 0 : 500;
    this.y = 0;
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.socket.on("move", (data) => {
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
      this.y + this.velocity.y > 0 &&
      this.y + this.velocity.y < this.limit_y
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

const Player = require("./Player");
const Enemy = require("./Enemy");

class Game {
  constructor(players) {
    this.playerA = new Player(players[0], "a");
    this.playerB = new Player(players[1], "b");
    this.enemies = [];
    this.startGame();
    this.spawnEnemy();
  }
  startGame() {
    setInterval(() => {
      this.playerA.move();
      this.playerB.move();
      this.sendDataTofront();
      this.moveEnemies();
    }, 1000 / 60);
  }
  spawnEnemy() {
    setInterval(() => {
      const enemy1 = new Enemy("easy", "up");
      const enemy2 = new Enemy("easy", "down");
      this.enemies.push(enemy1);
      this.enemies.push(enemy2);
    }, 3000);
  }

  moveEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.isVisible();
    });
  }

  sendDataTofront() {
    const data = [
      {
        x: this.playerA.x,
        y: this.playerA.y,
        id: this.playerA.id,
        shoots: this.playerA.shoots,
        movimentation: this.playerA.movimentation,
        enemy: this.enemies,
      },
      {
        x: this.playerB.x,
        y: this.playerB.y,
        id: this.playerB.id,
        shoots: this.playerB.shoots,
        movimentation: this.playerB.movimentation,
        enemy: this.enemies,
      },
    ];
    this.playerA.socket.emit("gameData", data);
    this.playerB.socket.emit("gameData", data);
  }
}

module.exports = Game;

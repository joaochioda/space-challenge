const Player = require("./Player");
const Enemy = require("./Enemy");
const { System } = require("detect-collisions");

const typesEnemy = (int) => {
  switch (int) {
    case 0:
      return "square";
    case 1:
      return "circles";
    case 2:
      return "triangle";
  }
};

class Game {
  constructor(players) {
    this.playerA = new Player(players[0], "a");
    this.playerB = new Player(players[1], "b");
    this.enemies = [];
    this.system = new System();
    this.startGame();
    this.spawnEnemy();
  }
  startGame() {
    setInterval(() => {
      this.playerA.move();
      this.playerB.move();
      this.sendDataTofront();
      this.moveEnemies();
      this.checkShootCollision();
    }, 1000 / 60);
  }
  spawnEnemy() {
    setInterval(() => {
      // const spin = Math.random() * (1 - 0) + 0 > 0.5 ? true : false;
      // const randomEnemy = Math.floor(Math.random() * (2 - 0) + 0);

      // const enemy1 = new Enemy("easy", "up", spin, typesEnemy(randomEnemy));
      // this.enemies.push(enemy1);

      // const enemy2 = new Enemy("easy", "down", spin, typesEnemy(randomEnemy));
      // this.enemies.push(enemy2);
      const enemy1 = new Enemy("easy", "up", true, "squares");
      this.enemies.push(enemy1);
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

  checkShootCollision() {
    this.playerA.shoots.forEach((shoot) => {
      this.enemies.forEach((enemy) => {
        if (shoot.isCollision(enemy)) {
          enemy.life -= shoot.damage;
          this.playerA.shoots.splice(this.playerA.shoots.indexOf(shoot), 1);
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });
    });
    this.playerB.shoots.forEach((shoot) => {
      this.enemies.forEach((enemy) => {
        if (shoot.isCollision(enemy)) {
          enemy.life -= shoot.damage;
          this.playerB.shoots.splice(this.playerB.shoots.indexOf(shoot), 1);
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });
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

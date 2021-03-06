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
  constructor(players, roomId) {
    this.playerA = new Player(players[0], "a");
    this.playerB = new Player(players[1], "b");
    this.enemies = [];
    this.system = new System();
    this.startGame();
    this.spawnEnemy();
    this.roomId = roomId;
  }
  startGame() {
    this.startGameInterval = setInterval(() => {
      this.playerA.update();
      this.playerB.update();
      this.sendDataTofront();
      this.moveEnemies();
      this.checkEnemyCollision();
    }, 1000 / 40);
  }
  spawnEnemy() {
    this.spawnEnemyInterval = setInterval(() => {
      const spin = Math.random() * (1 - 0) + 0 > 0.5 ? true : false;
      const randomEnemy = Math.floor(Math.random() * (2 - 0) + 0);

      const enemy1 = new Enemy("easy", "up", spin, "square");
      this.enemies.push(enemy1);
      const enemy2 = new Enemy("easy", "down", spin, "square");
      this.enemies.push(enemy2);
    }, 3000);
  }

  moveEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
    this.enemies = this.enemies.filter((enemy) => {
      this.system.remove(enemy.Shape);
      return !enemy.isVisible();
    });
    this.system.update();
  }

  checkEnemyCollision() {
    this.enemies.forEach((enemy) => {
      if (this.system.checkCollision(this.playerA.Shape, enemy.Shape)) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
        this.playerA.takeDamage(enemy.damage);
      }
      if (this.system.checkCollision(this.playerB.Shape, enemy.Shape)) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
        this.playerB.takeDamage(enemy.damage);
      }
    });

    this.playerA.shoots.forEach((shoot) => {
      this.enemies.forEach((enemy) => {
        if (this.system.checkCollision(shoot.Shape, enemy.Shape)) {
          enemy.life -= shoot.damage;
          this.playerA.shoots.splice(this.playerA.shoots.indexOf(shoot), 1);
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });
    });
    this.playerB.shoots.forEach((shoot) => {
      this.enemies.forEach((enemy) => {
        if (this.system.checkCollision(shoot.Shape, enemy.Shape)) {
          enemy.life -= shoot.damage;
          this.playerB.shoots.splice(this.playerB.shoots.indexOf(shoot), 1);
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });
    });
  }

  shootsToString() {
    const shoots = this.playerA.shoots.concat(this.playerB.shoots);
    return shoots
      .map((shoot) => {
        return `${shoot.x.toFixed(0)},${shoot.y.toFixed(0)}`;
      })
      .join(",");
  }

  enemiesToString() {
    return this.enemies
      .map((enemy) => {
        return `${enemy.x.toFixed(0)},${enemy.y.toFixed(0)},${enemy.life},${
          enemy.width
        },${enemy.height},${enemy.angle}`;
      })
      .join(",");
  }

  sendDataTofront() {
    const data = `${this.playerA.x.toFixed(0)},${this.playerA.y.toFixed(0)},${
      this.playerA.life
    },${this.playerA.width},${this.playerA.height},${this.playerA.id},${
      this.playerA.movimentation
    }/${this.playerB.x.toFixed(0)},${this.playerB.y.toFixed(0)},${
      this.playerB.life
    },${this.playerB.width},${this.playerB.height},${this.playerB.id},${
      this.playerB.movimentation
    }/${this.shootsToString()}/${this.enemiesToString()}`;
    this.playerA.socket.emit("gameData", data);
    this.playerB.socket.emit("gameData", data);
  }
  destroy() {
    this.playerA.socket.disconnect();
    this.playerB.socket.disconnect();
    clearInterval(this.startGameInterval);
    clearInterval(this.spawnEnemyInterval);
  }
}

module.exports = Game;

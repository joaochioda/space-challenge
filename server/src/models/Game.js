const Player = require("./Player");
const Enemy = require("./Enemy");
const SpaceShipEnemy = require("./SpaceShipEnemy");

const { System } = require("detect-collisions");
const { enemiesToString, shootsToString } = require("../utils");

class Game {
  constructor(players, roomId) {
    this.playerA = new Player(players[0], "a");
    this.playerB = new Player(players[1], "b");
    this.enemies = [];
    this.system = new System();
    this.roomId = roomId;
    this.frame = 0;
    this.spawnInterval = 60;
    this.runGame();
  }

  runGame() {
    this.startGameInterval = setInterval(() => {
      this.playerA.update();
      this.playerB.update();
      this.sendDataTofront();
      this.moveEnemies();
      this.checkEnemyCollision();
      this.spawnEnemy();
      this.frame++;
    }, 1000 / 40);
  }

  spawnEnemy() {
    if (this.frame % this.spawnInterval === 0) {
      const spin = Math.random() * (1 - 0) + 0 > 0.5 ? true : false;
      // const randomEnemy = Math.floor(Math.random() * (2 - 0) + 0);

      const enemy1 = new Enemy("easy", "up", spin, "square");
      this.enemies.push(enemy1);
      // const enemy2 = new Enemy("easy", "down", false, "spacenemy");
      // this.enemies.push(enemy2);
      const spaceShip = new SpaceShipEnemy(
        "easy",
        "down",
        false,
        "spacenemy",
        1
      );
      this.enemies.push(spaceShip);
    }
  }

  moveEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.canDestoy()) {
        this.system.remove(enemy.Shape);
        return false;
      } else {
        return true;
      }
    });
    this.system.update();
  }

  checkEnemyCollision() {
    const players = [this.playerA, this.playerB];

    players.forEach((player) => {
      this.enemies.forEach((enemy) => {
        //check player collision with enemies
        if (this.system.checkCollision(player.Shape, enemy.Shape)) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
          player.takeDamage(enemy.damage);
        }
        //check player collision with shoots
        player.shoots.forEach((shoot) => {
          if (
            enemy.live &&
            this.system.checkCollision(shoot.Shape, enemy.Shape)
          ) {
            enemy.life -= shoot.damage;
            enemy.kill();
            player.shoots.splice(player.shoots.indexOf(shoot), 1);
          }
        });
      });
    });
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
    }/${shootsToString(this.playerA, this.playerB)}/${enemiesToString(
      this.enemies
    )}`;
    this.playerA.socket.emit("gameData", data);
    this.playerB.socket.emit("gameData", data);
  }
  destroy() {
    this.playerA.socket.disconnect();
    this.playerB.socket.disconnect();
    clearInterval(this.startGameInterval);
  }
}

module.exports = Game;

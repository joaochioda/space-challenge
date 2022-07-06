const Player = require("./Player");
class Game {
  constructor(players) {
    this.playerA = new Player(players[0], "a");
    this.playerB = new Player(players[1], "b");
    this.startGame();
  }
  startGame() {
    setInterval(() => {
      this.playerA.move();
      this.playerB.move();
      this.sendDataTofront();
    }, 1000 / 60);
  }

  sendDataTofront() {
    const data = [
      {
        x: this.playerA.x,
        y: this.playerA.y,
      },
      {
        x: this.playerB.x,
        y: this.playerB.y,
      },
    ];
    this.playerA.socket.emit("gameData", data);
    this.playerB.socket.emit("gameData", data);
  }
}

module.exports = Game;

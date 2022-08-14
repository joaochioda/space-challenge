module.exports = {
  enemiesToString(enemies) {
    return enemies
      .map((enemy) => {
        let stringShotsEnemy = "";
        if (enemy.shots && enemy.shots.length > 0) {
          enemy.shots.forEach((shoot, idx) => {
            if (idx === enemy.shots.length - 1) {
              stringShotsEnemy += `${shoot.x.toFixed(0)}@${shoot.y.toFixed(0)}`;
            } else {
              stringShotsEnemy += `${shoot.x.toFixed(0)}@${shoot.y.toFixed(
                0
              )}@`;
            }
          });
        }
        return `${enemy.x.toFixed(0)},${enemy.y.toFixed(0)},${enemy.life},${
          enemy.width
        },${enemy.height},${enemy.angle},${enemy.type},${stringShotsEnemy}`;
      })
      .join(",");
  },
  shootsToString(playerA, playerB) {
    const shoots = playerA.shoots.concat(playerB.shoots);
    return shoots
      .map((shoot) => {
        return `${shoot.x.toFixed(0)},${shoot.y.toFixed(0)}`;
      })
      .join(",");
  },
};

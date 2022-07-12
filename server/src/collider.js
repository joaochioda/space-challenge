module.exports = {
  colliderShotEnemy(shot, enemy) {
    return (
      shot.x > enemy.x &&
      shot.x < enemy.x + enemy.width &&
      shot.y > enemy.y &&
      shot.y < enemy.y + enemy.height
    );
    return false;
  },
};

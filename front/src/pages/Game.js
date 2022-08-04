import React, { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import me from "../assets/me-space12.png";

import newSocket from "../Socket";
const keyMap = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

const keyPressed = [];

function Game() {
  const [ping, setPing] = useState(0);
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    sendMove(newSocket);

    const img = new Image();
    img.src = me;
    img.onload = () => {
      setImage(img);
    };
    setInterval(() => {
      const start = Date.now();
      newSocket.emit("ping", () => {
        const duration = Date.now() - start;
        setPing(duration);
      });
    }, 1000);

    newSocket.on("gameData", (data) => {
      setData(data);
    });
    // return () => newSocket.close();
  }, []);

  function convertDataStringToArray() {
    if (data.length > 0) {
      const dataArray = data.split("/");
      const playerA = dataArray[0].split(",");
      const playerB = dataArray[1].split(",");
      const shoots = dataArray[2].split(",");
      const enemies = dataArray[3].split(",");

      return [playerA, playerB, shoots, enemies];
    } else {
      return [[], [], [], []];
    }
  }

  function renderPlayer(player, ctx) {
    const x = parseInt(player[0]);
    const y = parseInt(player[1]);
    const movimentation = player[6];
    ctx.beginPath();
    if (player[5] === newSocket.id) {
      ctx.strokeStyle = "blue";
      ctx.stroke();
    } else {
      ctx.strokeStyle = "red";
    }
    ctx.rect(player[0], player[1], player[3], player[4]);
    ctx.stroke();
    if (movimentation) {
      renderMovimentation(ctx, x, y, movimentation);
    }
  }

  function renderMovimentation(ctx, x, y, movimentation) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    if (movimentation === "up") {
      ctx.moveTo(x + 5, y + 10);
      ctx.lineTo(x + 5, y + 25);
      ctx.stroke();
    } else if (movimentation === "down") {
      ctx.moveTo(x + 5, y - 15);
      ctx.lineTo(x + 5, y);
      ctx.stroke();
    } else if (movimentation === "right") {
      ctx.moveTo(x - 15, y + 5);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
    } else if (movimentation === "upRight") {
      ctx.moveTo(x + 5, y + 10);
      ctx.lineTo(x + 5, y + 25);
      ctx.stroke();
      ctx.moveTo(x - 15, y + 5);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
    } else if (movimentation === "downRight") {
      ctx.moveTo(x + 5, y - 15);
      ctx.lineTo(x + 5, y);
      ctx.stroke();
      ctx.moveTo(x - 15, y + 5);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
    }
    ctx.stroke();
  }

  function renderShoots(shoots, ctx) {
    if (shoots.length > 1) {
      ctx.beginPath();
      console.log("shoots", shoots);
      for (let i = 0; i < shoots.length; i += 2) {
        ctx.strokeStyle = "black";
        ctx.fillRect(shoots[i], shoots[i + 1], 5, 5);
      }
      ctx.stroke();
    }
  }

  function renderSquare(ctx, x, y, width, height, angle) {
    const radAngle = (angle * Math.PI) / 180;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(radAngle);
    ctx.translate(-x, -y);
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
    ctx.restore();
  }

  function renderCircle(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function renderSpacenemy(ctx, x, y) {
    if (image) {
      console.log(x, y);
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y + -10);
      ctx.lineTo(x + 30, y + -10);
      ctx.lineTo(x + 50, y + -30);
      ctx.lineTo(x + 70, y + -10);
      ctx.lineTo(x + 70, y + 10);
      ctx.lineTo(x + 50, y + 30);
      ctx.lineTo(x + 50, y + 30);
      ctx.lineTo(x + 30, y + 10);
      ctx.lineTo(x + 20, y + 10);
      ctx.lineTo(x, y);

      ctx.stroke();
      ctx.drawImage(image, x + 4, y - 30);
    }
  }

  function renderEnemies(enemies, ctx) {
    ctx.beginPath();
    for (let i = 0; i < enemies.length; i += 7) {
      const x = parseInt(enemies[i + 0]);
      const y = parseInt(enemies[i + 1]);
      const width = parseInt(enemies[i + 3]);
      const height = parseInt(enemies[i + 4]);
      const angle = parseInt(enemies[i + 5]);
      const type = enemies[i + 6];
      if (type === "square") {
        renderSquare(ctx, x, y, width, height, angle);
      } else if (type === "circle") {
        console.log("circle");
        renderCircle(ctx, x, y);
      } else if (type === "spacenemy") {
        renderSpacenemy(ctx, x, y);
      }
    }
    ctx.stroke();
  }

  const draw = (ctx) => {
    const [playerA, playerB, shoots, enemies] = convertDataStringToArray();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (playerA.length > 0) {
      renderPlayer(playerA, ctx);
    }
    if (playerB.length > 0) {
      renderPlayer(playerB, ctx);
    }
    if (shoots.length > 0) {
      renderShoots(shoots, ctx);
    }
    if (enemies.length > 0) {
      renderEnemies(enemies, ctx);
    }
  };

  const sendMove = (newSocket) => {
    setInterval(() => {
      let direction = "";
      if (keyPressed.length >= 2) {
        if (keyPressed.includes("up") && keyPressed.includes("left")) {
          direction = "upLeft";
        } else if (keyPressed.includes("up") && keyPressed.includes("right")) {
          direction = "upRight";
        } else if (keyPressed.includes("down") && keyPressed.includes("left")) {
          direction = "downLeft";
        } else if (
          keyPressed.includes("down") &&
          keyPressed.includes("right")
        ) {
          direction = "downRight";
        } else if (keyPressed.includes("up") && keyPressed.includes("Space")) {
          direction = "up";
        } else if (
          keyPressed.includes("down") &&
          keyPressed.includes("Space")
        ) {
          direction = "down";
        } else if (
          keyPressed.includes("right") &&
          keyPressed.includes("Space")
        ) {
          direction = "right";
        }
      } else if (keyPressed.length === 1) {
        direction = keyPressed[0];
      }
      if (direction && direction !== "Space") {
        newSocket.emit("move", direction);
      }
    }, 100);
  };

  const handleKeyDownCustom = (e) => {
    const key = e.code === "Space" ? e.code : keyMap[e.key];
    if (key && !keyPressed.includes(key)) {
      keyPressed.push(key);
    }
  };

  const handleKeyUpCustom = (e) => {
    if (e.code === "Space") {
      newSocket.emit("shoot");
    } else {
      const key = keyMap[e.key];
      if (key) {
        const index = keyPressed.indexOf(key);
        if (index > -1) {
          keyPressed.splice(index, 1);
        }
      }
      newSocket.emit("move", null);
    }
  };

  return (
    <div>
      <p>{ping}ms</p>
      {/* {data && <div> Life: {data.find((d) => d.id === socket.id)?.life}</div>} */}
      <Canvas
        draw={draw}
        handleKeyDownCustom={handleKeyDownCustom}
        handleKeyUpCustom={handleKeyUpCustom}
      />
    </div>
  );
}

export default Game;

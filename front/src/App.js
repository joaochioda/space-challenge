import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Button from "./components/button";
import Canvas from "./components/Canvas";

const keyMap = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

const keyPressed = [];

function App() {
  const [socket, setSocket] = useState(null);
  const [ping, setPing] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    //const newSocket = io(`meu-ip:3333`); connect through internet
    const newSocket = io(`http://localhost:3333`);
    setSocket(newSocket);
    sendMove(newSocket);
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
    return () => newSocket.close();
  }, [setSocket]);

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    data.forEach((player) => {
      if (player.shoots.length > 0) {
        player.shoots.forEach((shoot) => {
          ctx.beginPath();
          ctx.fillRect(shoot.x, shoot.y, 5, 5);
          ctx.stroke();
        });
      }
      if (player.movimentation) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        if (player.movimentation === "up") {
          ctx.moveTo(player.x + 5, player.y + 10);
          ctx.lineTo(player.x + 5, player.y + 25);
          ctx.stroke();
        } else if (player.movimentation === "down") {
          ctx.moveTo(player.x + 5, player.y - 15);
          ctx.lineTo(player.x + 5, player.y);
          ctx.stroke();
        } else if (player.movimentation === "right") {
          ctx.moveTo(player.x - 15, player.y + 5);
          ctx.lineTo(player.x, player.y + 5);
          ctx.stroke();
        } else if (player.movimentation === "upRight") {
          ctx.moveTo(player.x + 5, player.y + 10);
          ctx.lineTo(player.x + 5, player.y + 25);
          ctx.stroke();
          ctx.moveTo(player.x - 15, player.y + 5);
          ctx.lineTo(player.x, player.y + 5);
          ctx.stroke();
        } else if (player.movimentation === "downRight") {
          ctx.moveTo(player.x + 5, player.y - 15);
          ctx.lineTo(player.x + 5, player.y);
          ctx.stroke();
          ctx.moveTo(player.x - 15, player.y + 5);
          ctx.lineTo(player.x, player.y + 5);
          ctx.stroke();
        }
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.rect(player.x, player.y, 10, 10);
      ctx.stroke();
    });
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
      socket.emit("shoot");
    } else {
      const key = keyMap[e.key];
      if (key) {
        const index = keyPressed.indexOf(key);
        if (index > -1) {
          keyPressed.splice(index, 1);
        }
      }
      socket.emit("move", null);
    }
  };

  return (
    <div>
      <header>React Chat</header>
      <Button socket={socket} />
      <p>{ping}ms</p>
      <Canvas
        draw={draw}
        handleKeyDownCustom={handleKeyDownCustom}
        handleKeyUpCustom={handleKeyUpCustom}
      />
    </div>
  );
}

export default App;

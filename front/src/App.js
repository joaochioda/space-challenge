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

function App() {
  const [socket, setSocket] = useState(null);
  const [ping, setPing] = useState(0);
  const [data, setData] = useState([]);
  useEffect(() => {
    const newSocket = io(`http://localhost:3333`);
    setSocket(newSocket);

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

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    data.forEach((player) => {
      ctx.rect(player.x, player.y, 10, 10);
    });
    ctx.stroke();
  };

  const handleKeyDownCustom = (e) => {
    socket.emit("move", keyMap[e.key]);
  };

  return (
    <div>
      <header>React Chat</header>
      <Button socket={socket} />
      <p>{ping}ms</p>
      <Canvas draw={draw} handleKeyDownCustom={handleKeyDownCustom} />
    </div>
  );
}

export default App;

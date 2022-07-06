import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Button from "./components/button";

function App() {
  const [socket, setSocket] = useState(null);
  const [ping, setPing] = useState(0);
  useEffect(() => {
    const newSocket = io(`http://localhost:3333`);
    setSocket(newSocket);

    setInterval(() => {
      const start = Date.now();
      newSocket.emit("ping", () => {
        const duration = Date.now() - start;
        console.log(duration);
        setPing(duration);
      });
    }, 1000);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div>
      <header>React Chat</header>
      <Button socket={socket} />
      <p>{ping}ms</p>
    </div>
  );
}

export default App;

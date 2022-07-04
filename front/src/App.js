import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3333`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div>
      <header>React Chat</header>
      {socket ? (
        <div>
          <div>Connected</div>
          <button onClick={() => socket.emit("test")}>Test</button>
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
}

export default App;

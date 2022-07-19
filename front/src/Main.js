import React, { useEffect, useState } from "react";

import Game from "./pages/Game";
import Room from "./pages/Room";
import socket from "./Socket";

export const Main = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    socket.on("joinedRoom", (data) => {
      setSelectedRoom(data);
    });
    socket.on("playerEntered", (data) => {
      console.log("entrou player");
    });
  }, []);

  return <div>{selectedRoom ? <Game /> : <Room />}</div>;
};

export default Main;

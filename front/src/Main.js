import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "./context/UserContext";
import Game from "./pages/Game";
import Room from "./pages/Room";
import socket from "./Socket";

export const Main = () => {
  const { user } = useContext(UserContext);
  const [selectedRoom, setSelectedRoom] = useState(null);
  useEffect(() => {
    socket.on("joinedRoom", (data) => {
      setSelectedRoom(data);
    });
    socket.on("playerEntered", (data) => {
      console.log("entrou player");
    });
  }, []);
  return (
    <div>
      <div>
        {user && <span>{user.name}</span>}
        {user && <img src={user.image} alt="user" width={25} height={25} />}
      </div>
      <div>{selectedRoom ? <Game /> : <Room />}</div>
    </div>
  );
};

export default Main;

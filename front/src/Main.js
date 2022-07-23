import React, { useEffect, useState } from "react";

import Game from "./pages/Game";
import Room from "./pages/Room";
import socket from "./Socket";
import axios from "axios";

export const Main = () => {
  axios.get("http://localhost:3333").then(console.log);
  // const [selectedRoom, setSelectedRoom] = useState(null);
  // useEffect(() => {
  //   socket.on("joinedRoom", (data) => {
  //     setSelectedRoom(data);
  //   });
  //   socket.on("playerEntered", (data) => {
  //     console.log("entrou player");
  //   });
  // }, []);
  // return <div>{selectedRoom ? <Game /> : <Room />}</div>;
  return <div> dsada </div>;
};

export default Main;

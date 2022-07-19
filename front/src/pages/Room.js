import React, { useState, useEffect } from "react";

import socket from "../Socket";

export const Room = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setInterval(() => {
      socket.emit("roomList", () => {});
    }, 1000);
    socket.on("roomList", (data) => {
      setRooms(data);
    });
  }, []);

  function handleCreaeteRoom() {
    socket.emit("createRoom");
  }

  function handleJoinRoom(room) {
    socket.emit("joinRoom", room);
  }
  return (
    <div>
      <h1>Room</h1>
      <ul>
        {rooms.map((room) => (
          <div>
            <li key={room}>{room}</li>
            <button onClick={() => handleJoinRoom(room)}>Join Room</button>
          </div>
        ))}
      </ul>
      <button onClick={handleCreaeteRoom}>Create Room</button>
    </div>
  );
};

export default Room;

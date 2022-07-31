import React, { useState, useEffect } from "react";

import socket from "../Socket";
import { getStorage } from "../service/storageService";

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
    socket.emit("createRoom", getStorage());
  }

  function handleJoinRoom(room) {
    socket.emit("joinRoom", { room, bearer: getStorage() });
  }
  return (
    <div id="room">
      <h1>Room</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <div>
              <li key={room.id}>{room.name}</li>
              <button onClick={() => handleJoinRoom(room.id)}>Join Room</button>
            </div>
          ))}
        </ul>
      ) : (
        <div className="no-rooms">No rooms</div>
      )}
      <button className="create-room" onClick={handleCreaeteRoom}>
        Create Room
      </button>
    </div>
  );
};

export default Room;

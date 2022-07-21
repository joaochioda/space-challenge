const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Game = require("./src/models/Game");
const { v4: uuidv4 } = require("uuid");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const players = [];
let games = [];
const rooms = [];

app.get("/", (req, res) => {
  res.send("Hello World from my pc");
});

io.on("connection", (socket) => {
  players.push(socket);
  console.log("a user connected");
  console.log(players.length);

  socket.on("ping", (callback) => {
    callback();
  });

  socket.on("createRoom", () => {
    const idRoom = uuidv4();
    const room = {
      id: idRoom,
      players: [socket.id],
    };
    rooms.push(room);
    socket.emit("joinedRoom", "bla");
  });

  socket.on("roomList", () => {
    socket.emit(
      "roomList",
      rooms.filter((room) => room.players.length < 2).map((room) => room.id)
    );
  });

  socket.on("joinRoom", async (room) => {
    const roomFound = rooms.find((r) => r.id === room);
    if (roomFound) {
      if (roomFound.players.length === 1) {
        roomFound.players.push(socket.id);
        const player = players.find((p) => p.id === roomFound.players[0]);
        const gameObj = new Game([player, socket], roomFound.id);
        games.push(gameObj);
        socket.emit("joinedRoom", room);
      }
      // rooms.splice(rooms.indexOf(room), 1);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    players.splice(players.indexOf(socket), 1);
    const myRoomId = rooms.find((room) => room.players.includes(socket.id));
    if (!myRoomId) return;
    const room = rooms.find((room) => room.id === myRoomId.id);
    if (room) {
      room.players.splice(room.players.indexOf(socket.id), 1);
      if (room.players.length === 0) {
        rooms.splice(rooms.indexOf(room), 1);
      }
    }
    let game = games.find((g) => g.roomId === myRoomId.id);
    if (game) {
      game.destroy();
    }
  });
});

server.listen(3333, () => {
  console.log("listening on :3333");
});

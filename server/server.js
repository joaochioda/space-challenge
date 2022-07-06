const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Game = require("./src/models/Game");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const players = [];

app.get("/", (req, res) => {
  res.send("Hello World from my pc");
});

io.on("connection", (socket) => {
  players.push(socket);
  console.log("a user connected");

  if (players.length === 2) {
    console.log("game started");
    new Game(players);
  }
  socket.on("ping", (callback) => {
    callback();
  });

  socket.on("test", (data) => {
    console.log("------test------");
  });
});

server.listen(3333, () => {
  console.log("listening on :3333");
});

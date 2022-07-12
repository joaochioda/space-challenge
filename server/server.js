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
let games = [];
app.get("/", (req, res) => {
  res.send("Hello World from my pc");
});

io.on("connection", (socket) => {
  players.push(socket);
  console.log("a user connected");
  console.log(players.length);
  if (players.length === 2) {
    console.log("game started");
    const game = new Game(players);
    games = game;
  }
  socket.on("ping", (callback) => {
    callback();
  });

  socket.on("test", (data) => {
    console.log("------test------");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    players.splice(players.indexOf(socket), 1);
  });
});

server.listen(3333, () => {
  console.log("listening on :3333");
});

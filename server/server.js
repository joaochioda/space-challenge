const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  socket.on("test", () => {
    console.log("chegou", socket.id);
  });
  console.log("a user connected");
});

server.listen(3333, () => {
  console.log("listening on :3333");
});

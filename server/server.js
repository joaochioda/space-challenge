const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Game = require("./src/models/Game");
const { v4: uuidv4 } = require("uuid");
var jwt = require("jsonwebtoken");
const cors = require("cors");
const { SESSION_SECRET } = require("./keys_twitch");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const players = [];
let games = [];
const rooms = [];

app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/me", (req, res) => {
  try {
    // res.send({ name: "John Doe" });
    if (
      req?.headers?.authorization &&
      req?.headers?.authorization?.split(" ")[0] === "Bearer"
    ) {
      const decoded = handleBearer(req.headers.authorization.split(" ")[1]);
      if (decoded) {
        //verify backend if access token is valid
        res.send({ name: decoded.name, image: decoded.image });
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
});

io.on("connection", (socket) => {
  players.push(socket);
  console.log("a user connected");
  console.log(players.length);

  socket.on("ping", (callback) => {
    callback();
  });

  socket.on("createRoom", (bearer) => {
    try {
      const decoded = handleBearer(bearer);
      const idRoom = uuidv4();
      const room = {
        id: idRoom,
        players: [socket.id],
        name: `${decoded.name}'s room`,
      };
      rooms.push(room);
      socket.emit("joinedRoom", "bla");
    } catch (err) {
      socket.disconnect();
    }
  });

  socket.on("roomList", () => {
    socket.emit(
      "roomList",
      rooms
        .filter((room) => room.players.length < 2)
        .map((room) => {
          return {
            id: room.id,
            name: room.name,
          };
        })
    );
  });

  socket.on("joinRoom", async ({ room, bearer }) => {
    try {
      handleBearer(bearer);
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
    } catch (err) {
      socket.disconnect();
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

function handleBearer(bearer) {
  const token = bearer;
  return jwt.verify(token, SESSION_SECRET);
  // return true;
}

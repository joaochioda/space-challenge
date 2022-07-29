const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(3333, () => {
  console.log("listening on :3333");
});

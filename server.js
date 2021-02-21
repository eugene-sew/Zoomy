const { Socket } = require("dgram");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

// setting up view engine
app.set("view engine", "ejs");

// setting up static folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/room ${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// setting up a room as user joins
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

// user disconnects

// listen on port
server.listen(3000);

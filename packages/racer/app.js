/**
 * LAMBDA Racer Server
 *
 * Serves the themed outrun-style racer and pushes lap times to every
 * connected player while they are racing.
 */

"use strict";

const http = require("http");
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");

const routes = require("./routes");
const players = require("./models/players");

const PORT = process.env.PORT || 1338;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", routes.index);

// what the container healthcheck (and any uptime monitor) pings
app.get("/healthz", routes.health);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  // A new racer wants the current board before doing anything else
  socket.emit("init", { result: players.leaderboard() });

  socket.on("join", (data) => {
    const player = players.join((data || {}).id, (data || {}).name);

    if (player.error) {
      socket.emit("error", { err: player.error });
      return;
    }

    socket.data.player = player;
    socket.broadcast.emit("player connected", { name: player.name });
    socket.emit("ready", { player });
  });

  socket.on("update laptime", (data) => {
    const player = socket.data.player;
    if (!player) {
      socket.emit("error", { err: "no player on this socket, join first" });
      return;
    }

    const lap = players.recordLap(player.id, (data || {}).lapTime);
    if (lap.error) {
      socket.emit("error", { err: lap.error });
      return;
    }

    if (lap.isBest) {
      socket.broadcast.emit("new best time", {
        name: player.name,
        lapTime: lap.lapTime,
      });
      socket.emit("new personal best time", { lapTime: lap.lapTime });
      io.emit("update leaderboard", {
        result: players.leaderboard(),
        player: { id: player.id, name: player.name, time: lap.lapTime },
      });
    } else {
      socket.broadcast.emit("new laptime", {
        name: player.name,
        lapTime: lap.lapTime,
      });
      socket.emit("new personal laptime", { lapTime: lap.lapTime });
    }
  });
});

let playerCount;
try {
  playerCount = players.open();
} catch (err) {
  console.error(
    "could not open the leaderboard at " + players.FILE + ": " + err.message
  );
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(
    "LAMBDA Racer server listening on port " +
      PORT +
      " (" +
      playerCount +
      " players in " +
      players.FILE +
      ")"
  );
});

// Docker stops the container with SIGTERM, so the socket connections are
// closed and the database checkpointed before the process goes away
const shutdown = (signal) => {
  console.log(signal + " received, shutting down");
  io.close(() => {
    players.close();
    process.exit(0);
  });
  setTimeout(() => {
    console.error("shutdown took too long, exiting hard");
    process.exit(1);
  }, 5000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

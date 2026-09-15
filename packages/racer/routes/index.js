/*****************
 * GET home page.
 *****************/

var players = require("../models/players");

exports.index = function (req, res) {
  res.render("index", { title: "LAMBDA Racer" });
};

/*****************
 * GET health check, for the container healthcheck and whatever else pings us.
 *****************/

exports.health = function (req, res) {
  res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    players: players.playerCount(),
  });
};

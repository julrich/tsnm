/**
 * Player store.
 *
 * Every connected racer is identified by an id the client keeps in
 * localStorage, so a name can be reused by two people without them
 * overwriting each other's best time. The best lap times live in a single
 * sqlite file, which is also the one thing that has to survive a restart
 * of the app (or of its container).
 */

"use strict";

const fs = require("fs");
const path = require("path");

let DatabaseSync;
try {
  ({ DatabaseSync } = require("node:sqlite"));
} catch (err) {
  throw new Error(
    "node:sqlite is not available in " +
      process.version +
      " (need Node >= 22.13): " +
      err.message
  );
}

const FILE =
  process.env.DB_FILE ||
  path.join(__dirname, "..", "data", "leaderboard.sqlite");

const MAX_ID_LENGTH = 64;
const MAX_NAME_LENGTH = 16;
const MAX_LAP_TIME = 60 * 60; // seconds, keeps obviously bogus lap times out of the board

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS players (
    id        TEXT PRIMARY KEY,
    name      TEXT NOT NULL,
    best_time REAL NOT NULL DEFAULT 0
  ) STRICT;
  CREATE INDEX IF NOT EXISTS players_best_time ON players (best_time);
`;

let db = null;

function cleanId(raw) {
  return String(raw == null ? "" : raw).trim().slice(0, MAX_ID_LENGTH);
}

function cleanName(raw) {
  return String(raw == null ? "" : raw)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

/** Opens (and creates) the database file, returns the number of players in it. */
function open() {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });

  db = new DatabaseSync(FILE);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA synchronous = NORMAL;");
  db.exec(SCHEMA);

  return playerCount();
}

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

function playerCount() {
  return db.prepare("SELECT COUNT(*) AS count FROM players").get().count;
}

function findById(id) {
  return db
    .prepare("SELECT id, name, best_time AS time FROM players WHERE id = ?")
    .get(id);
}

/** Registers (or re-registers) the player behind a socket. */
function join(rawId, rawName) {
  const id = cleanId(rawId);
  const name = cleanName(rawName);

  if (!id || !name) {
    return { error: "join needs a player id and a name" };
  }

  db.prepare(
    `INSERT INTO players (id, name, best_time) VALUES (?, ?, 0)
       ON CONFLICT (id) DO UPDATE SET name = excluded.name
       WHERE players.name <> excluded.name`
  ).run(id, name);

  return findById(id);
}

/** Returns { player, lapTime, isBest } or { error }. */
function recordLap(rawId, rawLapTime) {
  const player = findById(cleanId(rawId));
  if (!player) {
    return { error: "unknown player, join first" };
  }

  // same tenths the client displays, so the board never reads 0.1s slower than the HUD
  const lapTime = Math.floor(Number(rawLapTime) * 10) / 10;
  if (!Number.isFinite(lapTime) || lapTime <= 0 || lapTime > MAX_LAP_TIME) {
    return { error: "implausible lap time: " + rawLapTime };
  }

  // the condition is part of the update, so two racers can never overwrite a better time
  const updated = db
    .prepare(
      `UPDATE players SET best_time = ?
        WHERE id = ? AND (best_time = 0 OR best_time > ?)`
    )
    .run(lapTime, player.id, lapTime);

  const isBest = Number(updated.changes) === 1;
  if (isBest) {
    player.time = lapTime;
  }

  return { player, lapTime, isBest };
}

function leaderboard() {
  return db
    .prepare(
      `SELECT id, name, best_time AS time FROM players
        WHERE best_time > 0 ORDER BY best_time`
    )
    .all();
}

module.exports = {
  FILE,
  open,
  close,
  join,
  recordLap,
  leaderboard,
  playerCount,
};

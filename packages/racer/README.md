lambdaracer-server
==================

The LAMBDA Outrun Edition racer: an outrun-style javascript game (the tsnm fork
of jakesgordon/javascript-racer, with the themed art, the music and the
beat-synced background) plus the multiplayer server that shows every lap time
live on the leaderboard while people are racing.

Requirements
------------

Node 22.13 or newer (24 LTS is what the container uses). The leaderboard is a
sqlite file and uses the built-in `node:sqlite`, so there is no native module
to compile and nothing to install besides the three javascript dependencies.

Running
-------

The package lives in this repository's pnpm workspace; dependencies come from
the root install.

    pnpm install                              # from the repository root
    pnpm --filter lambdaracer-server start    # http://localhost:1338

Configuration
-------------

| variable  | default                   | purpose                     |
| --------- | ------------------------- | --------------------------- |
| `PORT`    | `1338`                    | http port                   |
| `DB_FILE` | `data/leaderboard.sqlite` | sqlite file of the board    |

Docker
------

    docker build -f packages/racer/Dockerfile -t lambdaracer .   # from the repository root
    docker run -d --name racer --restart unless-stopped \
      -p 1338:1338 -v racer_data:/data lambdaracer

The image is `node:24-alpine`, ships the pruned bundle `pnpm deploy` produces,
runs as the unprivileged `node` user and carries a `HEALTHCHECK` against
`/healthz` (json with uptime and player count).

`/data` is the only thing that has to outlive the container: it holds
`DB_FILE` (`/data/leaderboard.sqlite` by default in the image), so mount a
volume there or the leaderboard starts over on every deploy. With a bind mount
instead (`-v $PWD/data:/data`) the host directory has to be writable by uid
1000.

Behind a reverse proxy just forward the whole site, `/socket.io/` included -
the default websocket + polling transports need no special configuration.

Deployment
----------

Kamal service `racer`, deployed from the repository root:

    set -a && . packages/website/.env.sh && . packages/racer/.env && set +a
    kamal setup -c config/deploy-racer.yml     # first time on a fresh host
    kamal deploy -c config/deploy-racer.yml

`packages/racer/.env` holds the image name, domain (`racer.tsnm.de`) and host;
`KAMAL_REGISTRY_PASSWORD` comes from the shell (it lives in
`packages/website/.env.sh`). `config/deploy-racer.yml` runs the container on
port 1338 behind kamal-proxy with a Let's Encrypt certificate and keeps the
leaderboard in the named volume `racer_data` mounted at `/data`.

Players
-------

A browser gets a random id in localStorage and picks a name on the intro
screen. The server keeps the best lap time per player and pushes everything to
the connected clients:

* `player connected` — somebody started racing
* `new best time` / `laptime` — a lap finished
* `update leaderboard` — the board changed, everyone gets the new data

The board itself is rendered client side, split into the "under 2 minutes" and
"best 5 over 2 minutes" sections the event used.

Data
----

    CREATE TABLE players (
      id        TEXT PRIMARY KEY,   -- browser id from localStorage
      name      TEXT NOT NULL,      -- what the racer typed
      best_time REAL NOT NULL       -- best lap in seconds, 0 = no lap yet
    );

The file is opened in WAL mode, so a `-wal` and a `-shm` file appear next to
it. Deleting the file (with the app stopped) starts the event over.

Notes
-----

* Music, and the beat the background sky and trees react to, starts on the
  "Rennen starten!" click, because browsers keep the AudioContext suspended
  until the page got a user gesture. The speaker button next to the multiplayer
  feed switches music off - that stops the beat detection too, so the
  background stops reacting instead of just going silent.
* Music and sprites (`public/music/`, `public/images/`) are tracked with **Git LFS**, so the repository keeps no second copy of the 18 MB of audio and art. Run `git lfs install` once per machine, otherwise a checkout - and therefore `docker build`, which copies `public/` from the working tree - sees pointer files instead of the assets. The game code in `public/javascripts/` and `public/stylesheets/` stays in plain git.
* `public/` is the whole game, `data/` is the only state the server keeps.

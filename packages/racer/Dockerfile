# The app is plain javascript with no native dependency (the leaderboard uses
# the built-in node:sqlite), so there is nothing to compile and the image only
# needs a node runtime plus the three production dependencies.
FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

# Copy workspace config files first for layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
# Copy pnpm patches so they are applied during install
COPY patches/ ./patches/
COPY packages/racer/package.json ./packages/racer/

RUN pnpm install --frozen-lockfile --ignore-scripts

# Cache-bust: everything below here rebuilds when source changes.
# Pass --build-arg CACHEBUST=$(date +%s) to force a fresh build.
ARG CACHEBUST=0

COPY packages/racer/ ./packages/racer/

# Production stage — use pnpm deploy for a pruned, self-contained bundle
FROM node:24-alpine AS production
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app
COPY --from=builder /app ./
RUN pnpm --filter lambdaracer-server deploy --prod /prod/racer

WORKDIR /prod/racer

ENV NODE_ENV=production
# The leaderboard is the only state the app keeps, so it lives outside the
# deploy directory where a volume can be mounted over it.
ENV DB_FILE=/data/leaderboard.sqlite

EXPOSE 1338

RUN mkdir -p /data && chown node:node /data

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 1338) + '/healthz').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"

CMD ["node", "--disable-warning=ExperimentalWarning", "app.js"]

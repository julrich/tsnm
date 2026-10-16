#!/usr/bin/env node
// drift-report.mjs — what differs between this repository and an upstream ref, path by path.
//
// The point is to turn drift into a reviewable artifact instead of a feeling. It compares
// `git ls-tree -r --full-tree <upstream>` against `git ls-tree -r --full-tree HEAD`, keyed by
// (path, blob sha), so it costs seconds regardless of repository size and never checks the
// upstream side out.
//
//   node scripts/drift-report.mjs [--upstream <ref>=upstream/main] [--out docs/internal/drift] [--check]
//
// Classification comes from scripts/drift-rules.json — globs, first match wins, default `shared`:
//
//   generated  regenerate, never port (lockfiles, committed catalogs, snapshots)
//   brand      brand assets and values; never port into the template (ADR-003)
//   project    legitimately per-repo; listed, never gating. This is also where packages that live
//              in exactly one repository by design belong: `packages/agent-eval` is the template's
//              own evaluation suite and is never ported downstream — if a client ever needs the
//              harness it is reset to that client's own evaluation data, not synced.
//   shared     everything else; a differing `shared` path is the only thing that gates
//
// A differing `shared` path listed in docs/internal/drift-allow.txt is reported as `allowed` with
// its reason. Everything else differing and `shared` is `needs-triage` — and `--check` exits 1
// while any of those exist, which is what makes "the inventories are filled in" checkable.
//
// Exit: 0 normally; 1 with --check when `needs-triage` is non-empty.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback = undefined) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

const upstreamRef = flag("upstream", "upstream/main");
const outDir = flag("out", "docs/internal/drift");
const check = has("check");

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const git = (ref) =>
  execFileSync("git", ["ls-tree", "-r", "-z", "--full-tree", ref], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1 << 28,
  })
    .split("\0")
    .filter(Boolean)
    .map((entry) => {
      const [meta, path] = entry.split("\t");
      const [mode, type, sha] = meta.split(" ");
      return { mode, type, sha, path };
    });

// `**` crosses directories, `*` does not — the usual glob reading, and the one the rules are
// written against.
const globToRegExp = (glob) => {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const body = escaped
    .replace(/\*\*\//g, "(?:.*/)?")
    .replace(/\*\*/g, ".*")
    .replace(/(?<!\.)\*/g, "[^/]*");
  return new RegExp(`^${body}$`);
};

const rulesPath = join(repoRoot, "scripts", "drift-rules.json");
const rules = JSON.parse(readFileSync(rulesPath, "utf8"));
const classes = Object.entries(rules.classes).map(([name, globs]) => [
  name,
  globs.map(globToRegExp),
]);

const classify = (path) => {
  for (const [name, patterns] of classes) {
    if (patterns.some((re) => re.test(path))) return name;
  }
  return "shared";
};

const allowPath = join(repoRoot, "docs", "internal", "drift-allow.txt");
const allowed = new Map();
if (existsSync(allowPath)) {
  for (const line of readFileSync(allowPath, "utf8").split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const [path, ...reason] = line.split("\t");
    allowed.set(path.trim(), reason.join(" ").trim() || "(no reason given)");
  }
}

const local = new Map(git("HEAD").map((e) => [e.path, e.sha]));
const upstream = new Map(git(upstreamRef).map((e) => [e.path, e.sha]));
const upstreamSha = execFileSync("git", ["rev-parse", upstreamRef], { cwd: repoRoot, encoding: "utf8" }).trim();

const rows = [];
let identical = 0;
for (const [path, sha] of [...local].sort(([a], [b]) => a.localeCompare(b))) {
  const other = upstream.get(path);
  const status = other === undefined ? "only-local" : other === sha ? "identical" : "differ";
  if (status === "identical") identical += 1;
  rows.push({ path, status, class: classify(path) });
}
for (const [path, sha] of [...upstream].sort(([a], [b]) => a.localeCompare(b))) {
  if (local.has(path)) continue;
  rows.push({ path, status: "only-upstream", class: classify(path) });
}

for (const row of rows) {
  if (row.class !== "shared" || row.status === "identical") continue;
  if (allowed.has(row.path)) {
    row.disposition = "allowed";
    row.reason = allowed.get(row.path);
  } else {
    row.disposition = "needs-triage";
  }
}

const inBoth = rows.filter((r) => r.status !== "only-local" && r.status !== "only-upstream").length;
const summary = {
  upstream_ref: upstreamRef,
  upstream_sha: upstreamSha,
  local_sha: execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim(),
  generated_at: new Date().toISOString(),
  counts: {
    paths_in_both: inBoth,
    identical,
    differ: rows.filter((r) => r.status === "differ").length,
    only_upstream: rows.filter((r) => r.status === "only-upstream").length,
    only_local: rows.filter((r) => r.status === "only-local").length,
    needs_triage: rows.filter((r) => r.disposition === "needs-triage").length,
    allowed: rows.filter((r) => r.disposition === "allowed").length,
  },
  rows,
};

const date = new Date().toISOString().slice(0, 10);
const base = join(repoRoot, outDir, `${upstreamSha.slice(0, 12)}-${date}`);
mkdirSync(join(repoRoot, outDir), { recursive: true });
writeFileSync(`${base}.json`, `${JSON.stringify(summary, null, 2)}\n`);

const md = [
  `# Drift against \`${upstreamRef}\``,
  "",
  `Upstream \`${upstreamSha.slice(0, 12)}\`, compared with \`HEAD\`. ${inBoth} paths in both, ${identical} identical.`,
  "",
  `| class | status | path | disposition |`,
  `|---|---|---|---|`,
  ...rows
    .filter((r) => r.status !== "identical")
    .map(
      (r) =>
        `| ${r.class} | ${r.status} | \`${r.path}\` | ${r.disposition ?? ""}${r.reason ? ` — ${r.reason}` : ""} |`,
    ),
  "",
].join("\n");
writeFileSync(`${base}.md`, md);

const { counts } = summary;
console.log(
  `${upstreamRef} ${upstreamSha.slice(0, 12)}: ${counts.paths_in_both} in both, ${counts.identical} identical, ` +
    `${counts.differ} differ, ${counts.only_upstream} only-upstream, ${counts.only_local} only-local`,
);
console.log(
  `  shared and differing: ${counts.needs_triage} needs-triage, ${counts.allowed} allowed — wrote ${outDir}/`,
);
process.exit(check && counts.needs_triage > 0 ? 1 : 0);

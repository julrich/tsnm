# Copilot instructions

This repository keeps its agent instructions in a single place: **[`/AGENTS.md`](../AGENTS.md)** at the repository root, plus package-local `AGENTS.md` files under `packages/*/`.

Read `/AGENTS.md` first. It contains the package map, verified commands (pnpm filter selectors matter), architecture invariants, generated-file list, destructive commands, testing reality, deployment table, and known defects. The nearest `AGENTS.md` to the file you are editing wins.

Do not duplicate content here — this file exists only so Copilot's default lookup path resolves to the canonical document.

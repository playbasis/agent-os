# Contributing

Thanks for your interest in the Playbasis Agent OS harness. This project has
one unusual rule that shapes everything else: **claims must trace to
evidence**. Code that works but can't prove it works is treated as unfinished.

## Setup

Requires Node 20+ and pnpm 10+.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm mission:doctor -- --profile fixture
```

All four should pass on a fresh clone before you change anything. If they
don't, please open an issue with the output rather than working around it.

## Development Rules

1. **Fixture-first.** New capabilities must work under the deterministic
   `fixture` profile with no network, database, or LLM access. Live-profile
   behavior is added behind explicit flags afterwards, never as the only path.
2. **Evidence discipline.** If your change affects what a run produces or how
   it is scored, run the relevant proof command (see
   [`docs/COMMANDS.md`](docs/COMMANDS.md)) and include the resulting report
   path in your PR description. Do not edit committed proof reports by hand.
3. **No secrets, ever.** No `.env*` files, no credential values, no raw
   provider payloads or response IDs in tracked files. Aggregate scores and
   hashes only. The leak scan must pass before artifacts are written.
4. **Held-out protection.** Never commit held-out eval bodies or answer keys,
   and never wire code that exposes them to an optimizing agent. Public files
   carry manifests, commitments, and hashes only.
5. **Claim boundary.** Documentation changes may not claim more than the
   current proof artifacts support. When in doubt,
   [`docs/ROBUST_PROOF_PROTOCOL.md`](docs/ROBUST_PROOF_PROTOCOL.md) wins.
6. **Clean-room donors.** Ideas from `raw-donors/` may be reimplemented in
   `packages/donor-primitives` with a registry entry; donor code is never
   imported directly.

## Pull Requests

Before opening a PR:

```bash
pnpm typecheck
pnpm test
pnpm pbos donor:verify
```

In the PR description, state what the change proves or affects, which
commands you ran, and paths to any new or regenerated proof artifacts. Keep
PRs focused; refactors and behavior changes go in separate PRs.

Commit messages follow the existing history style: a `feat:`/`fix:`/`chore:`
prefix and an imperative summary.

## Reporting Issues

- Bugs: include the command, the profile, and the relevant report or trace
  path under `reports/` or `runs/`.
- Security issues: do **not** open a public issue; see
  [`SECURITY.md`](SECURITY.md).

## Code Style

TypeScript throughout, ESM modules, no default exports in packages. Match the
surrounding code's naming and comment density — comments explain constraints,
not narration. Tests live in `tests/` and run under Vitest.

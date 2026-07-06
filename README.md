# Playbasis Agent OS

An evidence-gated agent harness. Every mission run produces traces, artifacts,
eval scores, a promotion decision, and a redaction report — so an agent's
claim to have improved something is always backed by an inspectable proof
pack, and a claim it cannot back is exposed instead of papered over.

Built as the proof-of-value lane for [Playbasis](https://playbasis.ai), the
API-first engagement platform, but the kernel, eval model, trace/evidence
format, and fixture examples are platform-agnostic.

## Status

This is a research harness, not a production agent OS. We publish exactly what
the evidence supports and label the rest as roadmap:

- **Proven:** the end-to-end loop — mission runs, hill-climbing, held-out
  scoring with pre-registered commitments, promotion gates, secret redaction,
  run warehousing, and dashboard generation — across deterministic fixture and
  local-integration profiles.
- **Not yet proven:** externally validated benchmark wins, measured economic
  value, human-reviewed output quality, or unsupervised production autonomy.

The full, current claim boundary lives in
[`docs/ROBUST_PROOF_PROTOCOL.md`](docs/ROBUST_PROOF_PROTOCOL.md); if any doc
disagrees with it, the proof protocol wins. We consider this discipline the
most useful thing about the project.

## What's Inside

| Area | What it does |
| --- | --- |
| `packages/kernel` | Mission runner: traces, artifacts, evidence packs |
| `packages/evals` | Run scoring and promotion decisions |
| `packages/hill-climber` | Iterative improvement with score-delta proof |
| `packages/mission-optimizer` | Candidate generation, training-only selection, held-out reporting |
| `packages/navigator` | Path-fan planning, council voting, ambition ratchet, Prompt Twin A/B proofs, daily-loop proofing |
| `packages/router-lab` | Model-routing eval primitives with hash-only telemetry |
| `packages/run-warehouse` | JSON index over runs, evals, proofs, and lineage |
| `packages/sandbox-dashboard` | Static credibility dashboard from warehouse artifacts |
| `packages/donor-registry` / `donor-primitives` | Indexing and clean-room reimplementation of donor-code ideas |
| `packages/env-vault` | Whitelisted env loading and redaction |
| `packages/cli` | The `pbos` command surface |
| `apps/navigator-desktop` | Runnable six-screen Navigator shell fed by generated proof data |
| `eval-families/` | Public manifests and scorer commitments (answer sheets stay outside the repo) |
| `examples/`, `goals/`, `schemas/` | Runnable missions, compiled goals, public schemas |
| `reports/` | Committed proof and dashboard evidence |

## Quick Start

Requires Node 20+ and pnpm 10+. The fixture profile is fully deterministic:
no network, database, or LLM calls.

```bash
pnpm install
pnpm mission:doctor -- --profile fixture   # preflight
pnpm mission:fixture                       # run one evidence-gated mission
pnpm hill-climb:fixture                    # watch scores improve across iterations
pnpm pbos runs:summary                     # inspect the run warehouse
pnpm prove:robust                          # full multi-profile proof gate
```

Every run leaves an evidence pack under `runs/` and indexed summaries under
`reports/`. The complete command surface — Navigator path fans, Prompt Twin
A/B proofs, eval factories, the visual asset-clone loop, router lab, CEO-sim,
and value experiments — is documented in
[`docs/COMMANDS.md`](docs/COMMANDS.md).

## Profiles

| Profile | Behavior |
| --- | --- |
| `fixture` | Deterministic mocked capabilities. Safe anywhere; used by CI and all public proofs. |
| `local-monorepo` | Connects to a locally cloned Playbasis platform (expected as a sibling checkout, e.g. `../playbasis-platform`). |
| `staging-sandbox` | Connects to configured staging services behind explicit allow-flags. Internal use only. |

No `.env*` file is ever committed. Env values are loaded in memory only,
whitelisted per profile, redacted in traces, and scanned before artifacts are
written.

## Documentation

Start with [`docs/VISION.md`](docs/VISION.md) (product doctrine and operating
loop), then use [`docs/DOCS_INDEX.md`](docs/DOCS_INDEX.md) to route into the
deep dives: proof protocol, Navigator planning, loss-function design, router
evals, visual-quality loops, use-case patterns, and the Operator Twin product
lane. The index also records how documentation conflicts are resolved.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, test and typecheck
commands, and the evidence rules every change must respect (fixture-first
development, no secrets in artifacts, claims must trace to proof files).
Security issues: see [`SECURITY.md`](SECURITY.md).

## Public Boundary

The published repository intentionally excludes:

- `raw-donors/` — the private donor-code archive that seeded clean-room
  reimplementations;
- private service connectors, env vaults values, and provider credentials;
- held-out eval bodies and answer keys (only hashes and commitments are
  public);
- screenshots, image payloads, and raw provider responses (aggregate scores
  and hashes only).

`pnpm pbos export-oss-candidate --verify` produces and verifies the sanitized
export; its verification report is committed under
`reports/oss-export-verification.json`.

## License

[Apache-2.0](LICENSE)

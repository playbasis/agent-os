# Current-State Honest Assessment and Private Judgment Assets

Last updated: 2026-07-04

Canonical framing: `docs/VISION.md` preserves this doc's durable distinction:
the current repo is a governed proof lab with real rails; the production Agent
OS and broad autonomous navigation are target states that require more proof.

Two kinds of ground truth are codified here so they are not lost or
softened over time:

1. An honest, component-by-component assessment of what the system actually
   is right now - what is real, what is simulated, and where the gap
   between "proving plumbing" and "proving navigation" sits.
2. The provenance of the private judgment assets - the Prompt Twin corpus
   and the quant/donor source repos - which are both the judgment layer and
   the commercial moat.

IMPORTANT: the assessment below is a point-in-time review. This repo is
edited by multiple sessions concurrently and moves fast. Some gaps named
here have since started closing (catalog-bridge, the Flappy eval factory,
LFD navigator goal artifacts, real mission dispatch into loop observations,
the creative-bridge asset-clone/pixel-diff proof, and Progress Sharpe
selection have shipped or are landing). Re-verify any specific claim against
current code before treating it as still-true. The FRAMING is durable; the
line-item status is not.

## 1. What the System Actually Is (the honest verdict)

One sentence: a governed exoskeleton with real rails and safety, plus a
decision stack that was mostly proven against synthetic evidence - not yet a
self-improving mind. The build order is correct (skeleton first, swap
fixtures for reality organ by organ), but the distinction between the two
must never be blurred.

The single distinction that matters: proving PLUMBING (the loop's machinery
runs end to end) vs. proving NAVIGATION (the loop's decisions are driven by
real evidence and make real work better). Reality fraction is the metric
that measures the crossing from the first to the second.

### Component-by-component (as reviewed)

Genuinely real, and the hard/rare parts:

- Harness / mission runner: missions execute against registered tools;
  every run emits traces, hashed artifacts, an evidence pack, a promotion
  decision. Replayable, multi-profile, reproducible by command. Real.
- Connectors: authenticated Playbasis API, WorkspaceOps, and a live Azure
  call, with env vaulting and redaction holding a genuine zero-leak record.
  A real security property, verified per run.
- Governance: budgets, promotion policies, quarantine on leaks, a written
  claim boundary, a proof protocol that fails loudly. The part almost
  nobody else builds and cannot retrofit.
- Reality touchpoints that are real: the Flappy validator hashes the actual
  broken seed, detects its true defects, runs a repaired Pygame artifact for
  real frames; mission dispatch maps a real evidence pack into observations.

Simulated / to watch (read the code, not the labels):

- Evals were a feature-presence checklist, not a judge: artifact counts,
  keyword hits in artifact names, self-reported coverage signals. Could not
  tell a brilliant output from a mediocre one. (The held-out split + LFD
  eval factory are the fix, now landing.)
- The historical hill climb was a staircase, not a search: iterations
  stepped through a fixed maturity ladder, so the famous lift was monotonic
  BY CONSTRUCTION. It proved the loop's plumbing, not that anything got
  smarter.
- The loop had never eaten real evidence: fixture observations were
  hardcoded numbers the loop replayed - structurally the same risk class as
  the old staircase until real dispatch feeds it.
- The council was one deterministic scorer in five hats: roles were recorded
  strings, ELO over a formula was an elaborate argsort. No judgment
  diversity until live multi-model seats with measured disagreement.
- The fan was not diverse: every path shared the same milestones with
  different numbers - twenty parameterizations of one plan, not twenty
  plans. Needs LLM/research-generated decompositions.
- Shape library written but not read: memory that nothing consumes is not
  yet memory.

### The four substitutions that turn exoskeleton into navigator

1. Real variation: LLM/research-proposed mission/prompt/path deltas instead
   of the scripted ladder.
2. Non-gameable selection: held-out gates, external judges, economic
   outcomes instead of self-reported keyword scores.
3. Durable memory: run warehouse + persisted winning deltas so improvement
   survives the session.
4. Real work content: super-prompt runtime and real WorkspaceOps workflows
   so the loop improves something with genuine economic surface.

When all four are in and held-out lift is still positive, it is a continuous
evidence-gated improvement harness and can be called one with evidence. Not
before.

### The analogy to keep

A gym with excellent safety equipment, referees, and scoreboards, whose
current athlete is doing a choreographed routine. Not a failure - the
correct build order for a GOVERNED system, and the casing (governance +
evidence) is the part nobody else has. But the casing is what it is until
the athlete performs unscripted.

## 2. The Prompt Twin Corpus (judgment layer + moat)

This is the user's quality bar, taste, and steering style captured as data.
It is simultaneously the Navigator value-function layer 4 (the taste gate)
and the clearest example of the commercial moat: private ground truth that
cannot be distilled from any public artifact.

Location (verified read-only; raw corpus stays LOCAL, never in git):
`~/Documents/Codex/2026-05-30/can-you-take-a-transcript-and`

Verified counts (exports/user_inputs_latest/):

- 50,934 raw extracted user-input records
- 28,990 deduped; 28,977 redacted training messages
- 25,197 prompt-style records (`training_messages_style_user_only.jsonl`)
- 3,000 `digital_twin_qa_pairs.jsonl` (with train/validation/test splits)
- 750 `golden_prompt_training_pairs.jsonl`
- ~29,444 total Codex-sourced records in summary.json

Key generated assets: `digital_twin_prompt_style_guide.md`,
`virtual_hitl_prompt_pack.md`, `prompt_twin_codex_manager_prompt.md`,
`user_inputs_redacted.jsonl`, and the golden-prompt mining files. The
reviewer skill exists and is complete:
`.agents/skills/prompt-twin-reviewer/SKILL.md` (+ agents, references).

### The two-halves synthesis (the load-bearing insight)

Two bodies of work cover different halves of the same system:

- The digital-twin corpus captures the STEERING STYLE: direct,
  evidence-driven, privacy-aware, scope-tight, product-minded.
- The Flappy / Agent Harness gives measurable CODING OUTCOMES: prompt,
  generated code, runtime result, lint, score, diff, iteration history
  (146 trace files, 557 `game_v*.py` snapshots, real defect detection).

Joined, they become a Prompt-Twin coding-agent control plane: Coder writes
code in the harness; harness collects evidence; Prompt Twin reviews in the
user's style and returns pass/continue/blocked; on continue, the feedback
becomes the next prompt. The highest-leverage first artifact is one adapter
that normalizes both worlds into a single
`prompt_twin_coding_outcomes.jsonl` (prompt -> current_code ->
generated_code -> diff -> lint/runtime/score -> reviewer decision), then a
pre-registered A/B: control manager vs. twin manager on held-out variants.

### The honesty constraint on the twin

The twin mimics the user's VOICE; sounding like the user is not the same as
JUDGING like the user. Score the twin by objective outcomes (does
twin-steered work beat control on runtime pass rate, iterations-to-pass,
cost-per-passing-artifact), never by style fidelity. The twin never
overrules measured reality or the actual user.

## 3. Source-Repo Provenance (mine ideas, respect the boundary)

The path-distribution insight and several reusable engines came from local
quant/forecasting repos. Codified so the provenance and the sanitization
boundary are not lost.

- `~/simulation_project` - cleanest forecasting/simulation core:
  Alpaca ingestion, return distributions, GARCH volatility, biased Monte
  Carlo paths, RMSE/MAE ranking, Hyperopt tuning. Modules under `modules/`.
  The reference implementation of fan-generate / re-weight / converge.
- `~/good_idea` - large quant playground: Q-learning selection,
  PyPortfolioOpt allocation, curve-shape similarity, fundamentals graphs.
  Research archive to mine (mission-selection policy, compute allocation).
- `~/src` (Boltfolio backend) - production-shaped data/product
  layer: portfolio metrics, CAPM, HRP, SQL screens, financials schema.
- `../playbasis-healthcare-only/services/queue-analytics` -
  transferable forecasting/sim engine: AutoARIMA/ETS/Theta, CONFORMAL
  intervals (the source of the drift-envelope concept), Monte Carlo stress
  tests, Gymnasium RL reward structure.

The core insight repurposed from these: the stock model predicted the price
AND the path - many Monte Carlo paths with distinct shapes, and the
prediction EMERGED as real data confirmed one path. That is exactly the
Navigator REWEIGHT step for software plans.

Sanitization boundary (same rule as the prompt corpus): mine ideas and
module structure; do NOT import credentialed scripts (one older
SQL-learning file has hardcoded DB fields), do NOT commit ticker CSVs or
generated PNGs, keep all raw data local. A missing piece in these repos -
no leakage-safe walk-forward backtester - is exactly what held-out task
families provide on our side.

## 4. Why This Doc Exists

The forward-looking plans (Navigator, LFD, capability bridges, use cases,
cockpit) describe where the system is GOING. This doc records where it IS
and what private ground truth it stands on - the two things most easily
lost as sessions turn over and optimism accumulates. Keep the framing
honest; verify the line items against current code.

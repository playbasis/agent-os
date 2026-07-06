# Use Cases and Goal Patterns for the Navigator Loop

Last updated: 2026-07-04
Companion to: `docs/NAVIGATOR_PATH_PLANNING_AND_MODEL_COUNCIL_PLAN.md`,
`docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md`,
`docs/CAPABILITY_BRIDGES_SEARCH_RESEARCH_IMAGE.md`.
Canonical framing: `docs/VISION.md` defines the mission optimizer; this
catalog defines which mission shapes are worth optimizing first.

This doc is the durable catalog of what a user should actually point the
system at. It exists because "build me a Flappy Bird clone" is a toy, and
the value of the system is not obvious without concrete, verifiable,
continuously-improving goals. Do not lose these.

## 0. The Fit Filter (read first)

A prompt is a good fit for the Navigator loop if and only if it has a
cheap, correct, automatable score. "Build a Flappy clone" works because the
Pygame validator cannot be sweet-talked. Anything scored by "an LLM decides
if it is good" is a bad fit - that is the exact trap the system is built to
avoid.

Every use case below leads with its un-gameable evaluator, because the
evaluator - not the agent - is where the value lives. Search without a
trustworthy evaluator is noise generation.

The pattern to hand any user:

> Take [X] from [current measurable state] to [ambitious bar] on [a
> held-out set I keep private], without regressing [guardrail], under
> [time/cost budget].

If they can fill every bracket - especially the private held-out set - it
is a strong fit. If they cannot name the evaluator, it is a chat task, not
a loop task.

## 1. Software / Engineering (strongest fit: reality checks are free)

### 1.1 Coverage lift with mutation defense
- Goal: "Get our test suite from 61% to 90% branch coverage without
  weakening a single assertion."
- Evaluator: coverage report + mutation testing (does a fix catch injected
  bugs, or just execute lines?).
- Held-out: a rotating set of hidden mutants the agent never sees.
- Continuous: 90 is a bar you descend toward, never "done."
- Cheat it will try: tests that execute code but assert nothing -> mutation
  testing fences this off immediately.

### 1.2 Latency target
- Goal: "Make this endpoint p99 latency under 40ms at 500 rps, no
  correctness regressions."
- Evaluator: load harness (`pb-loadgen` exists) + existing conformance
  suite as the correctness gate.
- Real-world sensing helps: web_search for "how others optimized this ORM
  pattern" on a stall.

### 1.3 Build/cold-start time
- Goal: "Cut Docker image cold-start / build time by 50%, build stays
  green."
- Evaluator: wall-clock build time + CI green. This is the Turbo-cache-bug
  genre - objective, overnight-shaped, verifiable by morning.

### 1.4 Library migration
- Goal: "Port this module from library A to library B until the full test
  suite passes and the public API is byte-identical."
- Evaluator: existing tests + API-diff tool. "Done" is unambiguous.

## 2. Data / Retrieval / ML (labeled ground truth = ideal)

### 2.1 Search relevance
- Goal: "Beat our current search relevance - get nDCG@10 above 0.85 on the
  held-out query set."
- Evaluator: nDCG on a blinded query split. Labeled data already exists
  (`prompt_product_relevancy.json` in the donor archive).
- Why strong: answer keys hash-committed, held-out split never seen.

### 2.2 Structured extraction
- Goal: "Build an extractor that pulls these 12 fields from messy invoices
  at 95% field-accuracy on the held-out set."
- Evaluator: field-level accuracy vs. a labeled gold set kept outside the
  agent's workspace.
- Failure mode it exercises: memorizing the visible set -> the memorization
  alarm catches it.

### 2.3 Cost-down at fixed quality
- Goal: "Reduce our LLM feature's cost-per-accepted-output by 40% at fixed
  quality."
- Evaluator: quality held constant by a blinded judge + rubric, cost
  measured directly. This is Progress Sharpe as a goal.

## 3. Research / Competitive Distillation (the LFD headline genre)

### 3.1 Coverage distillation
- Goal: "Surface every Thai company that filed for X permit in the last 18
  months - beat the reference product's coverage on the same queries."
- Evaluator: recall against a blinded ground-truth set assembled privately
  (the moat). The reference product is the floor, not the ceiling.
- Organs: web_search + deep_research.

### 3.2 Continuous competitive monitor
- Goal: "Maintain a live competitive feature matrix for our top 5 rivals;
  flag every material change within 24h."
- Evaluator: precision/recall against a human-verified change log.
- Shape: runs continuously rather than converging - the daily-loop cadence
  made real.

### 3.3 Market-entry brief (softer score, honest about it)
- Goal: "Build the strongest evidence-backed market-entry brief for
  [segment], scored against a pre-registered rubric by a blinded external
  judge + one human spot-check."
- Evaluator: rubric pre-registered before the run; pairs external-judge
  layer with human spot-checks. Not fully un-gameable - labeled as such.

## 4. Creative-with-a-loss (only works WITH an instrument)

### 4.1 Asset clone
- Goal: "Reproduce this brand asset / landing hero until pixel-diff < 2% and
  it passes the brand-taste gate."
- Evaluator: deterministic pixel-diff (creative-bridge instrument) as the
  hard floor, Prompt Twin taste gate on top. The essay's exact lesson: give
  it a pixel-diff tool, not an LLM eyeballing screenshots. Second objective
  domain beyond Flappy.

### 4.2 Copy that descends on real engagement
- Goal: "Generate ad-copy variants and descend on real engagement."
- Evaluator: live CTR through the publisher lanes (the strongest possible
  score - the market itself), behind approval gates. Long-horizon; needs
  the governance layer precisely because it touches the outside world.

## 5. Meta (the flywheel eating its own tail)

### 5.1 Prompt-strategy discovery
- Goal: "Find the prompt strategy that makes our coding agent measurably
  better on held-out repair tasks."
- Evaluator: the eval factory's blinded Flappy/repair families. This is the
  twin-A/B - the system improving the thing that improves things. Most
  valuable because every win compounds into all other use cases.

## 6. Recommended First Trials

Try these two first - both have ground truth already sitting in the repos,
both are un-gameable, both prove the loop on real work tonight rather than
on a toy:

1. Section 1.1 - coverage + mutation testing.
2. Section 2.1 - search relevance on `prompt_product_relevancy.json`.

## 7. Anti-Patterns (do NOT point the loop at these)

- "Make our landing page better" - no evaluator; taste-only.
- "Write good documentation" - no held-out score.
- "Improve our brand" - unmeasurable; the optimizer will invent a proxy and
  game it.
- Anything where the only judge is an LLM reading the output with no
  ground-truth anchor. If you cannot blind a scoring set, it is a chat
  task.

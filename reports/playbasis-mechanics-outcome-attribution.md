# Playbasis Mechanics Outcome Attribution

Generated At: 2026-07-06T00:06:54.002Z

Profile: staging-sandbox

Claim Status: mechanics-correlated-not-causal

## Summary
- Runs: 720
- Promoted runs: 366
- Zero-leak runs: 720
- Average training score: 0.7444
- Average held-out score: 0.8005
- Average trust score: 0.993
- Average economic score: 0
- Mechanics covered: 16/16
- Ledger records: 61
- Live-backed ledger records: 54
- Blocked ledger records: 10
- Activation gates: 0 ready / 4 blocked
- Outcome-linked mechanics: 16
- Causal proof ready: false
- Zero leak: true

## Outcome Signals
| Signal | Source | Value | Evidence Hash | Claim Boundary |
| --- | --- | --- | --- | --- |
| run-count | run-warehouse | 720 | d8b7337a5f58 | Run volume proves replay surface size, not business value. |
| promoted-runs | run-warehouse | 366 | d8b7337a5f58 | Promotion count is internal gate evidence, not external acceptance. |
| zero-leak-runs | run-warehouse | 720 | d8b7337a5f58 | Zero-leak runs prove scanner discipline only for generated artifacts. |
| average-heldout-score | run-warehouse | 0.8005 | d8b7337a5f58 | Held-out score is internal held-out evidence unless tied to external review. |
| average-trust-score | run-warehouse | 0.993 | d8b7337a5f58 | Trust score supports governance readiness, not task SOTA. |
| service-probes | run-warehouse | 66 | d8b7337a5f58 | Service probes are hash-only availability evidence, not payload proof. |
| mechanics-covered | agent-loop-mechanics-ledger | 16/16 | a19650ee505e | Mechanics coverage proves normalized ledger presence, not causal lift. |
| live-backed-ledger-records | agent-loop-mechanics-ledger | 54 | a19650ee505e | Live-backed records show service-linked mechanics evidence only. |
| blocked-ledger-records | agent-loop-mechanics-ledger | 10 | a19650ee505e | Blocked records must remain blockers until gates are satisfied. |
| activation-blocked-gates | playbasis-mechanics-activation-gates | 4 | 4ea5ca1b3983 | Blocked gates prevent live-write/private-adapter claims. |

## Mechanics Attribution Matrix
| Mechanic | Evidence Level | Ledger Records | Live-backed | Blocked | Readiness | Linked Outcome Signals | Next Intervention |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| adjudications | safe-live | 5 | 5 | 0 | not-gated | promoted-runs, average-trust-score | Use this mechanic in the first control/treatment reward-shaping experiment and compare held-out lift. |
| analytics | safe-live | 5 | 5 | 0 | not-gated | average-heldout-score, average-trust-score | Use this mechanic in the first control/treatment reward-shaping experiment and compare held-out lift. |
| campaigns | readiness-blocked | 3 | 1 | 2 | missing-required-env | blocked-ledger-records, activation-blocked-gates | Satisfy campaigns gate (missing-required-env) before counting it as live treatment evidence. |
| cohorts | safe-live | 2 | 2 | 0 | not-gated | run-count, average-heldout-score | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |
| credits | safe-live | 2 | 2 | 0 | not-gated | average-trust-score, blocked-ledger-records | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |
| events | readiness-blocked | 5 | 4 | 1 | missing-required-env | run-count, service-probes, mechanics-covered | Satisfy events-ingest gate (missing-required-env) before counting it as live treatment evidence. |
| experiments | readiness-blocked | 5 | 3 | 2 | missing-required-env | average-heldout-score, blocked-ledger-records | Satisfy experiments gate (missing-required-env) before counting it as live treatment evidence. |
| feedback | safe-live | 5 | 5 | 0 | not-gated | average-heldout-score, promoted-runs | Use this mechanic in the first control/treatment reward-shaping experiment and compare held-out lift. |
| leaderboards | safe-live | 4 | 4 | 0 | not-gated | average-heldout-score, promoted-runs | Use this mechanic in the first control/treatment reward-shaping experiment and compare held-out lift. |
| points | safe-live | 2 | 2 | 0 | not-gated | promoted-runs, mechanics-covered | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |
| quests | safe-live | 3 | 3 | 0 | not-gated | run-count, average-heldout-score | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |
| rewards | safe-live | 4 | 4 | 2 | not-gated | promoted-runs, mechanics-covered | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |
| rulesets | safe-live | 5 | 5 | 0 | not-gated | average-trust-score, promoted-runs | Use this mechanic in the first control/treatment reward-shaping experiment and compare held-out lift. |
| webhooks | readiness-blocked | 3 | 1 | 2 | missing-required-env | service-probes, activation-blocked-gates | Satisfy webhooks gate (missing-required-env) before counting it as live treatment evidence. |
| workspaceops | safe-live | 4 | 4 | 0 | not-gated | service-probes, run-count | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |
| xp | safe-live | 4 | 4 | 1 | not-gated | promoted-runs, average-heldout-score | Keep recording hash-only evidence, then include this mechanic in the preregistered treatment policy. |

## Causal Experiment Plan
- Experiment: playbasis-mechanics-reward-shaping-heldout-v1
- Hypothesis: A Playbasis-mechanics treatment policy that emits events, applies rulesets/adjudications, updates quests/XP/credits, records feedback, and ranks variants will improve held-out mission utility without reducing trust or zero-leak rates.
- Control policy: Run the same mission optimizer with evidence gates but without mechanics-shaped reward/debit/adjudication feedback in candidate selection.
- Treatment policy: Select and revise candidates using the mechanics ledger as a reward/governance signal: reward held-out lift, zero-leak streaks, approval discipline, recovery, evidence completeness, and cost discipline; debit budget/cost/rework.
- Primary metric: heldOut score lift over control on preregistered mission families
- Replay command: `pnpm pbos mechanics attribution --profile staging-sandbox && pnpm sandbox:build && pnpm pbos knowledge compile --sources reports --out reports/agent-os-wiki`
- Promotion rule: Promote only if treatment held-out lift is positive, trust and zero-leak guardrails pass, and no blocked readiness gate is counted as live proof.

Guardrails:
- trust score >= 0.95
- zero-leak runs = all treatment runs
- blocked write/private-adapter gates remain blocked unless explicit operator gates are present
- economic score is reported but not claimed as value until blind review exists

Required mechanics:
- events
- rulesets
- adjudications
- experiments
- feedback
- credits
- leaderboards
- analytics
- workspaceops

Required new evidence:
- pre-registered control/treatment policy hashes
- run warehouse rows for both arms
- held-out eval rows invisible to candidate selection
- agent-loop mechanics ledgers for each arm
- promotion decisions and negative results
- hash-only leak scan report

## Claim Boundary
This report connects existing mechanics ledger records to current run-warehouse outcome signals. It is correlation and readiness evidence only; it is not a causal value proof, economic-value proof, external benchmark result, AGI/ASI claim, or SOTA claim.

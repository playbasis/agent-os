# Playbasis Mechanics Intervention Experiment

Generated At: 2026-07-06T00:06:15.732Z

Profile: fixture

Mission: workspaceops-launch-pack

Claim Status: executable-intervention-smoke

## Summary
- Control run: workspaceops-launch-pack-mechanics-control-20260706000615-d5c8c34b
- Treatment run: workspaceops-launch-pack-mechanics-treatment-20260706000616-b7fad93e
- Training lift: 0
- Held-out lift: 0
- Trust delta: 0
- Economic lift: 0
- Mechanics execution lift: 0.8818
- Artifact delta: 14
- Mechanics tool delta: 6
- Generic eval ceiling detected: true
- Saturated suites: training, heldOut, trust
- Primary held-out lift measurable: false
- Mechanics execution score is outcome proof: false
- Intervention smoke passed: false
- Candidate ready for replicated held-out review: false
- Causal proof ready: false
- Zero leak: true

## Policies
- Control: Run the same launch-pack mission with Playbasis mechanics coverage, CEO-sim mechanics, delta held-out review, and agent-loop ledger steps removed.
- Treatment: Run the launch-pack mission with mechanics coverage, CEO-sim mechanics, delta held-out review, and normalized agent-loop ledger enabled.
- Control mission hash: 3f60445aa651a3abc32e63f6b139485c2a0d4d2eb6eaf8b97ddc748b704b47eb
- Treatment mission hash: e9659516d6274733b5640d2464f8c7f1d5a1e6a1dfc342ba39fa00f62f912c59

## Arms
| Arm | Run | Promotion | Training | Held-out | Trust | Economic | Mechanics Execution | Mechanics Tools | Artifacts | Leaks |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| control | workspaceops-launch-pack-mechanics-control-20260706000615-d5c8c34b | promote | 1 | 1 | 1 | 0 | 0.1 | 0 | 36 | 0 |
| treatment | workspaceops-launch-pack-mechanics-treatment-20260706000616-b7fad93e | promote | 1 | 1 | 1 | 0 | 0.9818 | 6 | 50 | 0 |

## Mechanics Execution Components
| Arm | Component | Score | Weight | Evidence |
| --- | --- | ---: | ---: | --- |
| control | mechanics-tool-coverage | 0 | 0.25 | 0/6 mechanics tools used. |
| control | mechanics-artifact-coverage | 0 | 0.25 | 0/7 expected mechanics artifact families present. |
| control | mechanics-quality-signal-coverage | 0 | 0.25 | 0/6 mechanics quality signals present. |
| control | scorer-only-heldout-adapter | 0 | 0.15 | Uses scorer-only CEO-sim delta held-out signals without exposing private bodies. |
| control | execution-guardrails | 1 | 0.1 | 9/9 steps ok; leaks=0. |
| treatment | mechanics-tool-coverage | 1 | 0.25 | 6/6 mechanics tools used. |
| treatment | mechanics-artifact-coverage | 1 | 0.25 | 7/7 expected mechanics artifact families present. |
| treatment | mechanics-quality-signal-coverage | 0.9271 | 0.25 | 6/6 mechanics quality signals present. |
| treatment | scorer-only-heldout-adapter | 1 | 0.15 | Uses scorer-only CEO-sim delta held-out signals without exposing private bodies. |
| treatment | execution-guardrails | 1 | 0.1 | 15/15 steps ok; leaks=0. |

## Measurement Diagnostics
- Add a non-saturated mechanics-specific held-out mission family.
- Score treatment against blind outcomes that control does not already max out.
- Keep mechanics execution score separate from causal value proof.
- Require blind/human or external judge review before economic-value claims.

## Gates
| Gate | Status | Summary | Resume Point |
| --- | --- | --- | --- |
| control-run-complete | pass | 9/9 control steps completed. | rerun `pnpm pbos mechanics experiment --profile <profile>` after fixing control mission/tool failure |
| treatment-run-complete | pass | 15/15 treatment steps completed. | rerun `pnpm pbos mechanics experiment --profile <profile>` after fixing treatment mission/tool failure |
| mechanics-control-excluded | pass | Control used 0 mechanics-specific tools. | rebuild the control variant so mechanics-specific tools are removed |
| mechanics-treatment-exercised | pass | Treatment used 6 mechanics-specific tools. | restore mechanics coverage, CEO-sim mechanics, delta review, and agent-loop ledger steps |
| heldout-improves | fail | Treatment held-out lift was 0. | adjust the mechanics treatment policy, then rerun the treatment arm only if the control evidence is still valid |
| trust-not-regressed | pass | Treatment trust delta was 0; treatment trust score was 1. | fix trust/redaction/approval regressions, then rerun the affected arm |
| zero-leak | pass | Control leaks=0; treatment leaks=0. | quarantine leaking artifacts, fix redaction, and rerun the affected arm |
| economic-not-claimed | pass | Economic score is reported as a gap signal only; this experiment does not claim measured economic value. | add preregistered blind-review rows before any economic-value claim |

## Claim Boundary
This report proves the mechanics intervention can be executed through the real mission runner and evaluated with existing suites. It is not causal value proof, economic-value proof, an external benchmark result, AGI/ASI evidence, or a SOTA claim. Causal proof requires replicated preregistered held-out review with blind/external baselines.

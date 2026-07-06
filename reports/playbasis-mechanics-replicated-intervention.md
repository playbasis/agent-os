# Playbasis Mechanics Replicated Intervention

Generated At: 2026-07-06T01:01:42.643Z

Profile: fixture

Family: playbasis-mechanics-replication-v1

## Summary
- Replicates: 3
- Treatment wins: 3
- Treatment win rate: 1
- Median mechanics-sensitive lift: 0.875
- Average mechanics-sensitive lift: 0.875
- Average generic held-out lift: 0
- Average mechanics execution lift: 0.8818
- Replicated measurement ready: true
- Causal proof ready: false
- Zero leak: true

## Preregistration
- Hypothesis: A mechanics-ledger treatment should consistently beat a mechanics-removed control on mechanics-sensitive held-out criteria while generic held-out remains saturated.
- Minimum replicates: 3
- Required treatment win rate: 1
- Minimum median mechanics-sensitive lift: 0.5
- Maximum allowed generic held-out lift: 0

## Replicates
| Replicate | Control Run | Treatment Run | Control Score | Treatment Score | Mechanics-sensitive Lift | Generic Held-out Lift | Mechanics Execution Lift | Treatment Won | Zero Leak |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| replicate-01 | workspaceops-launch-pack-mechanics-control-replicate-01-20260706010142-67a142cb | workspaceops-launch-pack-mechanics-treatment-replicate-01-20260706010143-ab191201 | 0.125 | 1 | 0.875 | 0 | 0.8818 | true | true |
| replicate-02 | workspaceops-launch-pack-mechanics-control-replicate-02-20260706010143-60ee7f51 | workspaceops-launch-pack-mechanics-treatment-replicate-02-20260706010144-c23f99ea | 0.125 | 1 | 0.875 | 0 | 0.8818 | true | true |
| replicate-03 | workspaceops-launch-pack-mechanics-control-replicate-03-20260706010144-89a41f82 | workspaceops-launch-pack-mechanics-treatment-replicate-03-20260706010145-68a339a3 | 0.125 | 1 | 0.875 | 0 | 0.8818 | true | true |

## Gates
| Gate | Status | Summary | Resume Point |
| --- | --- | --- | --- |
| minimum-replicates | pass | 3/3 replicate pairs were scored. | rerun `pnpm pbos mechanics replicate --replicates <n>` with enough replicate pairs |
| treatment-win-rate | pass | Treatment win rate was 1; required 1. | inspect losing replicates, patch the treatment policy, and rerun from the failed replicate |
| median-mechanics-sensitive-lift | pass | Median mechanics-sensitive lift was 0.875; required 0.5. | strengthen mechanics-specific evidence or widen the held-out family |
| generic-heldout-not-driving-result | pass | Average generic held-out lift was 0; maximum allowed 0. | separate generic quality lift from mechanics-specific lift before using this proof |
| all-non-saturated-measurements | pass | All replicates non-saturated=true. | fix or discard saturated replicate cases, then rerun the scorer |
| zero-leak | pass | All replicates zero-leak=true. | quarantine leaking replicate artifacts and rerun affected pairs |
| causal-value-not-claimed | pass | Replication strengthens measurement confidence but still requires blind/human/external review before causal value claims. | run preregistered blind external review before setting causalProofReady |

## Claim Boundary
This report shows repeated mechanics-sensitive measurement of a mechanics-ledger treatment against a mechanics-removed control. It is not causal value proof, economic-value proof, external benchmark evidence, AGI/ASI evidence, or a SOTA claim. Causal proof still requires preregistered blind/human/external review and, for live-write mechanics, disposable sandbox activation gates.

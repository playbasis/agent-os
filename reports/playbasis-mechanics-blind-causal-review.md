# Playbasis Mechanics Blind Causal Review

Generated At: 2026-07-06T01:20:46.946Z

Profile: fixture

Review Mode: fixture-simulated-review

## Summary
- Blind review rows present: true
- Fixture only: true
- Human rows present: false
- External rows present: false
- Reviewer count: 2
- Review rows: 6
- Pair coverage rate: 1
- Treatment preference rate: 1
- Inter-reviewer agreement: 1
- Blind external review ready: false
- Causal proof ready: false
- Zero leak: true

## Reviewers
| Reviewer Hash | Rows |
| --- | ---: |
| 1ca0e7843644 | 3 |
| e8ef624cfaf2 | 3 |

## Gates
| Gate | Status | Summary | Resume Point |
| --- | --- | --- | --- |
| packet-ready | pass | Packet has 3 blinded pairs and source replication ready=true. | rerun `pnpm pbos mechanics blind-packet` after replication is ready |
| review-rows-present | pass | 6 blind review rows imported. | collect blind review rows using the packet schema |
| pair-coverage | pass | Reviewed pair coverage is 1; required 1. | send unreviewed blinded pairs to reviewers |
| non-fixture-review | fail | Fixture rows prove import plumbing only. | import human-blind or external-judge rows before causal claims |
| private-mapping-available | pass | Private answer-sheet commitment matches the packet. | provide the private mapping outside the repo to scorer-only review import |
| treatment-preference-threshold | pass | Treatment preference rate was 1; required 0.67. | collect enough mapped blind rows to estimate treatment preference |
| zero-leak | pass | Raw review/private/payload text included=false. | strip raw review text and retain only reason hashes/codes |
| causal-value-claim-boundary | fail | Blind review lane is not enough for causal value claims yet. | complete non-fixture blind review plus remaining causal proof gates |

## Safety
- Raw review text included: false
- Answer keys included: false
- Treatment/control mapping included: false
- Private bodies included: false

## Claim Boundary
Fixture-simulated rows are plumbing proof only. This report cannot support causal, economic, SOTA, AGI, or ASI claims unless non-fixture blind review rows, private scorer-only mapping, activation gates, intervention evidence, and outcome attribution all pass.

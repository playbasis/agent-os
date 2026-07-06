import { afterEach, describe, expect, it } from "vitest";
import {
  createLlmMissionDeltaProposer,
  generateMissionVariants,
  selectWinnerByTrainingOnly,
  type OptimizationCandidate
} from "@playbasis-agent-os/mission-optimizer";
import type { Mission } from "@playbasis-agent-os/kernel";

const originalAllowProviderCalls = process.env.PBOS_ALLOW_PROVIDER_CALLS;

afterEach(() => {
  if (originalAllowProviderCalls === undefined) {
    delete process.env.PBOS_ALLOW_PROVIDER_CALLS;
  } else {
    process.env.PBOS_ALLOW_PROVIDER_CALLS = originalAllowProviderCalls;
  }
});

describe("mission optimizer", () => {
  it("generates deterministic fixture variants from the scripted maturity ladder", async () => {
    delete process.env.PBOS_ALLOW_PROVIDER_CALLS;
    const variants = await generateMissionVariants(baseMission(), {
      profile: "fixture",
      candidateCount: 4,
      allowProviderCalls: false
    });

    expect(variants).toHaveLength(4);
    expect(variants.map((variant) => variant.strategy)).toEqual([
      "scripted-maturity-ladder",
      "scripted-maturity-ladder",
      "scripted-maturity-ladder",
      "scripted-maturity-ladder"
    ]);
    expect(variants[3].mission.inputs?.maturityLevel).toBe(3);
  });

  it("skips the LLM mission delta proposer unless provider calls are explicitly enabled", async () => {
    delete process.env.PBOS_ALLOW_PROVIDER_CALLS;
    const generator = createLlmMissionDeltaProposer();
    const skipped = await generator.generate(baseMission(), {
      profile: "local-monorepo",
      allowProviderCalls: false
    });

    process.env.PBOS_ALLOW_PROVIDER_CALLS = "1";
    const enabled = await generator.generate(baseMission(), {
      profile: "local-monorepo",
      allowProviderCalls: true
    });

    expect(skipped).toHaveLength(0);
    expect(enabled).toHaveLength(1);
    expect(enabled[0].mission.steps.at(-1)?.tool).toBe("workspaceops.superprompt.qualify");
  });

  it("selects winners using training scores without reading held-out scores", () => {
    const candidates: OptimizationCandidate[] = [
      {
        variant: variant("a"),
        trainingScore: 0.6,
        visibleToOptimizerScore: 0.6,
        heldOutScore: 1
      },
      {
        variant: variant("b"),
        trainingScore: 0.9,
        visibleToOptimizerScore: 0.9,
        heldOutScore: 0.2
      }
    ];

    expect(selectWinnerByTrainingOnly(candidates)?.variant.id).toBe("b");
  });
});

function baseMission(): Mission {
  return {
    schemaVersion: 1,
    id: "mission",
    title: "Mission",
    objective: "Optimize",
    steps: [{ id: "step", tool: "tool" }]
  };
}

function variant(id: string): OptimizationCandidate["variant"] {
  return {
    id,
    parentMissionId: "mission",
    strategy: "test",
    changes: [],
    mission: baseMission()
  };
}

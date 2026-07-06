import { buildHillClimbReport, createHillClimbMission } from "@playbasis-agent-os/hill-climber";
import type { EvidencePack, Mission } from "@playbasis-agent-os/kernel";

test("createHillClimbMission injects deterministic improvement strategy", () => {
  const mission: Mission = {
    schemaVersion: 1,
    id: "mission",
    title: "Mission",
    objective: "Improve",
    steps: [{ id: "step", tool: "tool" }]
  };
  const candidate = createHillClimbMission(mission, 2, 2);
  expect(candidate.id).toBe("mission-candidate-2");
  expect(candidate.inputs?.hillClimbStrategy).toBe("add-ml-eval-optimization-loop");
  expect(candidate.steps[0].input?.maturityLevel).toBe(2);
});

test("buildHillClimbReport proves monotonic score improvement", () => {
  const mission: Mission = {
    schemaVersion: 1,
    id: "mission",
    title: "Mission",
    objective: "Improve",
    steps: [{ id: "step", tool: "tool" }]
  };
  const report = buildHillClimbReport(mission, "fixture", "2026-01-01T00:00:00.000Z", [
    evidence("run-0", 0.5, 0),
    evidence("run-1", 0.75, 1),
    evidence("run-2", 1, 3)
  ]);
  expect(report.monotonicIncrease).toBe(true);
  expect(report.improvement).toBe(0.5);
  expect(report.proof.improves).toBe(true);
  expect(report.proof.hasAiMlLlmLoops).toBe(true);
});

function evidence(runId: string, score: number, maturityLevel: number): EvidencePack {
  return {
    runId,
    missionId: "mission",
    missionTitle: "Mission",
    profile: "fixture",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: "2026-01-01T00:00:01.000Z",
    durationMs: 1000,
    toolsUsed: ["tool"],
    steps: [{ id: "step", tool: "tool", status: "ok", summary: "ok" }],
    artifacts: [],
    evals: [
      {
        name: "score",
        suite: "training",
        source: "heuristic",
        visibleToOptimizer: true,
        score,
        status: score >= 0.85 ? "pass" : "warn",
        summary: "synthetic score"
      }
    ],
    promotionDecision: score >= 0.85 ? "promote" : "revise",
    qualitySignals: {
      maturityLevel: maturityLevel / 3,
      aiMlLlmCoverage: score,
      automationCoverage: score,
      continuousImprovementCoverage: score,
      mlOptimizationCoverage: score
    },
    redactionReport: {
      checkedArtifacts: 0,
      leaksDetected: 0
    }
  };
}

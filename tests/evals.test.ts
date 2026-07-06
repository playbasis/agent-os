import { aggregateEvalScore, decidePromotion, evaluateEvidencePack } from "@playbasis-agent-os/evals";
import type { EvidencePack, Mission } from "@playbasis-agent-os/kernel";

test("evaluateEvidencePack rewards higher maturity signals", () => {
  const baseline = evidenceWithSignals({
    aiMlLlmCoverage: 0.2,
    automationCoverage: 0.2,
    continuousImprovementCoverage: 0.15,
    serviceLeverage: 0.3,
    mlOptimizationCoverage: 0.1,
    donorPrimitiveCoverage: 0.35,
    toolPolicyCoverage: 0.45,
    approvalGateCoverage: 0.35,
    compactionCoverage: 0.4,
    swarmCoverage: 0.35,
    sourcePriorityCoverage: 0.45,
    queryOptimizationCoverage: 0.4,
    adaptiveHarnessCoverage: 0.35,
    robustnessSweepCoverage: 0.35,
    dailyLoopCoverage: 0.35
  }, 5);
  const improved = evidenceWithSignals({
    aiMlLlmCoverage: 1,
    automationCoverage: 1,
    continuousImprovementCoverage: 1,
    serviceLeverage: 1,
    mlOptimizationCoverage: 1,
    donorPrimitiveCoverage: 1,
    toolPolicyCoverage: 1,
    approvalGateCoverage: 1,
    compactionCoverage: 1,
    swarmCoverage: 1,
    sourcePriorityCoverage: 1,
    queryOptimizationCoverage: 1,
    adaptiveHarnessCoverage: 1,
    robustnessSweepCoverage: 1,
    dailyLoopCoverage: 1
  }, 23);
  expect(aggregateEvalScore(evaluateEvidencePack(improved))).toBeGreaterThan(
    aggregateEvalScore(evaluateEvidencePack(baseline))
  );
});

test("training and held-out eval suites aggregate separately", () => {
  const evidence = evidenceWithSignals({
    aiMlLlmCoverage: 1,
    automationCoverage: 1,
    continuousImprovementCoverage: 1,
    serviceLeverage: 1,
    mlOptimizationCoverage: 1,
    donorPrimitiveCoverage: 1,
    toolPolicyCoverage: 1,
    approvalGateCoverage: 1,
    compactionCoverage: 1,
    swarmCoverage: 1,
    sourcePriorityCoverage: 1,
    queryOptimizationCoverage: 1,
    adaptiveHarnessCoverage: 1,
    robustnessSweepCoverage: 1,
    dailyLoopCoverage: 1
  }, 23);
  const evals = evaluateEvidencePack(evidence);

  expect(aggregateEvalScore(evals, { suite: "training" })).toBeGreaterThan(0.9);
  expect(aggregateEvalScore(evals, { suite: "trust" })).toBeGreaterThan(0.9);
  expect(aggregateEvalScore(evals, { suite: "economic" })).toBe(0);
  expect(evals.filter((item) => item.suite === "heldOut").every((item) => !item.visibleToOptimizer)).toBe(true);
});

test("keyword stuffing can lift training while underperforming held-out gates", () => {
  const stuffed = evidenceWithSignals({
    aiMlLlmCoverage: 1,
    automationCoverage: 1,
    continuousImprovementCoverage: 1,
    serviceLeverage: 1,
    mlOptimizationCoverage: 1,
    donorPrimitiveCoverage: 1,
    toolPolicyCoverage: 1,
    approvalGateCoverage: 1,
    compactionCoverage: 1,
    swarmCoverage: 1,
    sourcePriorityCoverage: 1,
    queryOptimizationCoverage: 1,
    adaptiveHarnessCoverage: 1,
    robustnessSweepCoverage: 1,
    dailyLoopCoverage: 1
  }, 23, 1);
  const evals = evaluateEvidencePack(stuffed);
  const mission: Mission = {
    schemaVersion: 1,
    id: "mission",
    title: "Mission",
    objective: "Avoid Goodhart",
    steps: [{ id: "one", tool: "tool" }],
    promotionPolicy: {
      minScore: 0.8,
      requireNoSecretLeaks: true,
      requireAllStepsSucceeded: true
    }
  };

  expect(aggregateEvalScore(evals, { suite: "training" })).toBeGreaterThan(0.9);
  expect(aggregateEvalScore(evals, { suite: "heldOut" })).toBeLessThan(0.8);
  expect(decidePromotion(mission, stuffed, evals)).not.toBe("promote");
});

function evidenceWithSignals(qualitySignals: Record<string, number>, artifactCount: number, bytes = 100): EvidencePack {
  const names = [
    "research",
    "api",
    "campaign",
    "calendar",
    "creative",
    "checklist",
    "automation",
    "eval",
    "improvement",
    "training",
    "ml",
    "dashboard",
    "provider"
    ,
    "donor",
    "policy",
    "swarm",
    "source",
    "query",
    "adaptive",
    "robustness",
    "daily"
  ];
  return {
    runId: "run",
    missionId: "mission",
    missionTitle: "Mission",
    profile: "fixture",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: "2026-01-01T00:00:01.000Z",
    durationMs: 1000,
    toolsUsed: ["donor.registry.summarize", "playbasis.api.catalog", "workspaceops.capability.catalog", "provider.research.brief", "artifact.launch.pack"],
    steps: [
      { id: "one", tool: "donor.registry.summarize", status: "ok", summary: "ok" },
      { id: "two", tool: "playbasis.api.catalog", status: "ok", summary: "ok" },
      { id: "three", tool: "workspaceops.capability.catalog", status: "ok", summary: "ok" },
      { id: "four", tool: "provider.research.brief", status: "ok", summary: "ok" },
      { id: "five", tool: "artifact.launch.pack", status: "ok", summary: "ok" }
    ],
    artifacts: names.slice(0, artifactCount).map((name) => ({
      id: name,
      path: `artifacts/${name}.md`,
      type: "markdown",
      summary: `${name} artifact`,
      sha256: name,
      bytes,
      publicReady: false
    })),
    evals: [],
    promotionDecision: "manual-review",
    qualitySignals,
    redactionReport: {
      checkedArtifacts: artifactCount,
      leaksDetected: 0
    }
  };
}

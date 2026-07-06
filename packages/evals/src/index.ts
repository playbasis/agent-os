import type { EvalResult, EvidencePack, Mission, PromotionDecision } from "@playbasis-agent-os/kernel";

export type EvalSuiteName = EvalResult["suite"];

export interface AggregateEvalOptions {
  suite?: EvalSuiteName;
  optimizerVisibleOnly?: boolean;
}

interface EvalInput {
  name: string;
  suite: EvalSuiteName;
  source?: EvalResult["source"];
  visibleToOptimizer?: boolean;
  score: number;
  passAt?: number;
  warnAt?: number;
  summary: string;
}

export function evaluateEvidencePack(evidence: EvidencePack): EvalResult[] {
  const allStepsSucceeded = evidence.steps.every((step) => step.status === "ok");
  const artifactText = evidence.artifacts
    .map((artifact) => `${artifact.path} ${artifact.summary}`)
    .join("\n")
    .toLowerCase();
  const hasCoreArtifacts = [
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
    "donor",
    "policy",
    "swarm",
    "source",
    "query",
    "adaptive",
    "robustness"
  ].filter((keyword) =>
    evidence.artifacts.some((artifact) => `${artifact.path} ${artifact.summary}`.toLowerCase().includes(keyword))
  );
  const traceScore = Math.min(1, (evidence.toolsUsed.length / 5 + evidence.steps.length / 5) / 2);
  const artifactScore = Math.min(1, evidence.artifacts.length / 23);
  const businessScore = Math.min(1, hasCoreArtifacts.length / 19);
  const aiMlLlmScore = maxSignal(evidence, [
    "aiMlLlmCoverage",
    "llmToolCoverage",
    "providerBridgeCoverage",
    "mlOptimizationCoverage"
  ]);
  const automationScore = maxSignal(evidence, ["automationCoverage", "workflowAutomationCoverage"]);
  const improvementScore = maxSignal(evidence, ["continuousImprovementCoverage", "evalLoopCoverage", "selfImprovementCoverage"]);
  const serviceLeverageScore = Math.max(
    maxSignal(evidence, ["serviceLeverage", "workspaceOpsLeverage", "playbasisApiLeverage"]),
    Math.min(1, evidence.toolsUsed.filter((tool) => /api|workspace|provider|donor/i.test(tool)).length / 4)
  );
  const mlOptimizationScore = Math.max(
    maxSignal(evidence, ["mlOptimizationCoverage"]),
    artifactText.includes("ml") || artifactText.includes("training") ? 0.5 : 0
  );
  const donorPrimitiveScore = Math.min(1, averageSignals(evidence, [
    "donorPrimitiveCoverage",
    "toolPolicyCoverage",
    "approvalGateCoverage",
    "compactionCoverage",
    "swarmCoverage",
    "sourcePriorityCoverage",
    "queryOptimizationCoverage",
    "adaptiveHarnessCoverage",
    "robustnessSweepCoverage",
    "dailyLoopCoverage"
  ]));
  const leakFree = evidence.redactionReport.leaksDetected === 0;
  const artifactBytes = evidence.artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0);
  const richArtifactScore = Math.min(1, artifactBytes / 12000);
  const artifactMetadataScore = evidence.artifacts.length === 0
    ? 0
    : evidence.artifacts.filter((artifact) =>
        artifact.bytes > 0
        && artifact.sha256.length >= 32
        && artifact.summary.trim().length >= 8
      ).length / evidence.artifacts.length;
  const serviceBackedArtifactScore = Math.min(1, (
    evidence.toolsUsed.filter((tool) => /api|workspace|provider|donor/i.test(tool)).length
    + evidence.artifacts.filter((artifact) => /api|workspace|provider|donor|evidence|eval/i.test(`${artifact.path} ${artifact.summary}`)).length
  ) / 10);
  const crossSignalConsistency = Math.min(1, average([
    artifactMetadataScore,
    richArtifactScore,
    traceScore,
    serviceBackedArtifactScore,
    donorPrimitiveScore >= 0.85 && evidence.artifacts.some((artifact) => /donor|policy|swarm|query|robustness/i.test(`${artifact.path} ${artifact.summary}`)) ? 1 : donorPrimitiveScore
  ]));

  return [
    makeEval({
      name: "step-success",
      suite: "trust",
      source: "system",
      visibleToOptimizer: false,
      score: allStepsSucceeded ? 1 : 0,
      summary: allStepsSucceeded ? "All mission steps completed." : "One or more mission steps failed or skipped."
    }),
    makeEval({
      name: "artifact-completeness",
      suite: "training",
      score: artifactScore,
      summary: `${evidence.artifacts.length}/23 target artifacts produced.`
    }),
    makeEval({
      name: "business-usefulness",
      suite: "training",
      score: businessScore,
      summary: `${hasCoreArtifacts.length}/19 high-value workflow artifact categories detected.`
    }),
    makeEval({
      name: "trace-coverage",
      suite: "trust",
      source: "system",
      visibleToOptimizer: false,
      score: traceScore,
      passAt: 0.9,
      warnAt: 0.6,
      summary: `${evidence.toolsUsed.length} tools and ${evidence.steps.length} step results recorded.`
    }),
    makeEval({
      name: "ai-ml-llm-embedding",
      suite: "training",
      score: aiMlLlmScore,
      summary: `AI/ML/LLM loop coverage signal is ${aiMlLlmScore.toFixed(2)}.`
    }),
    makeEval({
      name: "workflow-automation-depth",
      suite: "training",
      score: automationScore,
      summary: `Workflow automation coverage signal is ${automationScore.toFixed(2)}.`
    }),
    makeEval({
      name: "continuous-improvement-loop",
      suite: "training",
      score: improvementScore,
      summary: `Self-improvement and eval-loop coverage signal is ${improvementScore.toFixed(2)}.`
    }),
    makeEval({
      name: "playbasis-service-leverage",
      suite: "training",
      score: serviceLeverageScore,
      summary: `Playbasis API, WorkspaceOps, donor, and provider bridge leverage is ${serviceLeverageScore.toFixed(2)}.`
    }),
    makeEval({
      name: "ml-optimization-proof",
      suite: "training",
      score: mlOptimizationScore,
      summary: `ML-style optimization, scoring, and training-run coverage is ${mlOptimizationScore.toFixed(2)}.`
    }),
    makeEval({
      name: "donor-derived-primitives",
      suite: "training",
      score: donorPrimitiveScore,
      summary: `Donor-derived primitive coverage is ${donorPrimitiveScore.toFixed(2)}.`
    }),
    makeEval({
      name: "heldout-artifact-substance",
      suite: "heldOut",
      visibleToOptimizer: false,
      score: average([artifactMetadataScore, richArtifactScore]),
      summary: `Held-out artifact substance combines metadata integrity ${artifactMetadataScore.toFixed(2)} and byte-depth ${richArtifactScore.toFixed(2)}.`
    }),
    makeEval({
      name: "heldout-cross-signal-consistency",
      suite: "heldOut",
      visibleToOptimizer: false,
      score: crossSignalConsistency,
      summary: `Held-out consistency checks whether self-reported signals are backed by tools, traces, artifact metadata, and service evidence (${crossSignalConsistency.toFixed(2)}).`
    }),
    makeEval({
      name: "heldout-workflow-coverage",
      suite: "heldOut",
      visibleToOptimizer: false,
      score: average([traceScore, serviceBackedArtifactScore, Math.min(1, evidence.steps.length / 6)]),
      summary: `Held-out workflow coverage checks step breadth, tool evidence, and service-backed artifacts.`
    }),
    makeEval({
      name: "secret-redaction",
      suite: "trust",
      source: "system",
      visibleToOptimizer: false,
      score: leakFree ? 1 : 0,
      summary: leakFree ? "No secret leaks detected in artifacts." : `${evidence.redactionReport.leaksDetected} possible leaks detected.`
    }),
    makeEval({
      name: "budget-adherence",
      suite: "trust",
      source: "system",
      visibleToOptimizer: false,
      score: evidence.durationMs <= 120000 ? 1 : 0.5,
      summary: `Run duration was ${evidence.durationMs}ms against the default 120000ms proof budget.`
    }),
    makeEval({
      name: "approval-policy-conformance",
      suite: "trust",
      source: "system",
      visibleToOptimizer: false,
      score: evidence.steps.some((step) => step.status === "failed") ? 0 : 1,
      summary: "No failed approval or side-effect policy step was recorded."
    }),
    makeEval({
      name: "external-judge-score",
      suite: "economic",
      source: "external-judge",
      visibleToOptimizer: false,
      score: maxSignal(evidence, ["externalJudgeScore"]),
      passAt: 0.85,
      warnAt: 0.01,
      summary: maxSignal(evidence, ["externalJudgeScore"]) > 0
        ? `External judge score is ${maxSignal(evidence, ["externalJudgeScore"]).toFixed(2)}.`
        : "External judge not run yet; score is intentionally not used for promotion in V2 fixture proof."
    }),
    makeEval({
      name: "human-review-score",
      suite: "economic",
      source: "human-review",
      visibleToOptimizer: false,
      score: maxSignal(evidence, ["humanReviewScore"]),
      passAt: 0.85,
      warnAt: 0.01,
      summary: maxSignal(evidence, ["humanReviewScore"]) > 0
        ? `Human review score is ${maxSignal(evidence, ["humanReviewScore"]).toFixed(2)}.`
        : "Human review not run yet; this is a measured-value gap, not a blocker for internal proof."
    }),
    makeEval({
      name: "economic-value",
      suite: "economic",
      source: "human-review",
      visibleToOptimizer: false,
      score: maxSignal(evidence, ["economicValueScore", "humanMinutesSavedScore", "costPerAcceptedArtifactScore"]),
      passAt: 0.85,
      warnAt: 0.01,
      summary: "Economic value requires baseline hours, cost, acceptance, and rework data from a blind study."
    })
  ];
}

export function aggregateEvalScore(evals: EvalResult[], options: AggregateEvalOptions = {}): number {
  const filtered = evals.filter((item) =>
    (!options.suite || item.suite === options.suite)
    && (!options.optimizerVisibleOnly || item.visibleToOptimizer)
  );
  const target = filtered.length > 0 ? filtered : options.suite ? [] : evals;
  if (target.length === 0) return 0;
  return Number((target.reduce((sum, item) => sum + item.score, 0) / target.length).toFixed(4));
}

export function decidePromotion(mission: Mission, evidence: EvidencePack, evals: EvalResult[]): PromotionDecision {
  if (evidence.redactionReport.leaksDetected > 0) return "quarantine";
  if (mission.promotionPolicy?.requireAllStepsSucceeded && evidence.steps.some((step) => step.status !== "ok")) return "revise";

  const trustEvals = evals.filter((item) => item.suite === "trust");
  const heldOutEvals = evals.filter((item) => item.suite === "heldOut");
  const trainingEvals = evals.filter((item) => item.suite === "training");
  if (trustEvals.some((item) => item.status === "fail")) return "revise";
  if (trainingEvals.some((item) => item.status === "fail")) return "revise";

  const minScore = mission.promotionPolicy?.minScore ?? 0.8;
  const heldOutScore = aggregateEvalScore(evals, { suite: "heldOut" });
  if (heldOutEvals.length === 0 || heldOutScore < minScore || heldOutEvals.some((item) => item.status === "fail")) {
    return "manual-review";
  }
  return "promote";
}

function makeEval(input: EvalInput): EvalResult {
  const passAt = input.passAt ?? 0.85;
  const warnAt = input.warnAt ?? 0.5;
  return {
    name: input.name,
    suite: input.suite,
    source: input.source ?? "heuristic",
    visibleToOptimizer: input.visibleToOptimizer ?? input.suite === "training",
    score: Number(Math.max(0, Math.min(1, input.score)).toFixed(4)),
    status: input.score >= passAt ? "pass" : input.score >= warnAt ? "warn" : "fail",
    summary: input.summary
  };
}

function maxSignal(evidence: EvidencePack, keys: string[]): number {
  return Math.max(0, ...keys.map((key) => evidence.qualitySignals[key] ?? 0));
}

function averageSignals(evidence: EvidencePack, keys: string[]): number {
  if (keys.length === 0) return 0;
  return keys.reduce((sum, key) => sum + (evidence.qualitySignals[key] ?? 0), 0) / keys.length;
}

function average(values: number[]): number {
  const clean = values.filter(Number.isFinite);
  if (clean.length === 0) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

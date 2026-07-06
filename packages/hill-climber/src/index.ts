import type { EvidencePack, Mission } from "@playbasis-agent-os/kernel";
import { aggregateEvalScore } from "@playbasis-agent-os/evals";

export interface HillClimbCandidate {
  iteration: number;
  strategy: string;
  maturityLevel: number;
  runId: string;
  score: number;
  deltaFromPrevious: number;
  deltaFromBaseline: number;
  promotionDecision: string;
  evals: EvidencePack["evals"];
}

export interface HillClimbReport {
  missionId: string;
  missionTitle: string;
  profile: string;
  startedAt: string;
  completedAt: string;
  baselineRunId: string;
  bestRunId: string;
  baselineScore: number;
  bestScore: number;
  improvement: number;
  monotonicIncrease: boolean;
  candidates: HillClimbCandidate[];
  bestQualitySignals: Record<string, number>;
  proof: {
    works: boolean;
    improves: boolean;
    hasAiMlLlmLoops: boolean;
    hasContinuousImprovement: boolean;
    hasAutomationLoops: boolean;
    noSecretLeaks: boolean;
  };
}

export function createHillClimbMission(baseMission: Mission, iteration: number, maturityLevel: number): Mission {
  const strategies = [
    "baseline-static-workflow",
    "embed-ai-llm-tool-usage",
    "add-ml-eval-optimization-loop",
    "add-continuous-agent-operating-system"
  ];
  return {
    ...baseMission,
    id: `${baseMission.id}-candidate-${iteration}`,
    title: `${baseMission.title} Candidate ${iteration}`,
    inputs: {
      ...baseMission.inputs,
      maturityLevel,
      hillClimbIteration: iteration,
      hillClimbStrategy: strategies[Math.min(iteration, strategies.length - 1)]
    },
    steps: baseMission.steps.map((step) => ({
      ...step,
      input: {
        ...step.input,
        maturityLevel,
        hillClimbIteration: iteration,
        hillClimbStrategy: strategies[Math.min(iteration, strategies.length - 1)]
      }
    }))
  };
}

export function summarizeCandidate(
  evidence: EvidencePack,
  iteration: number,
  maturityLevel: number,
  previousScore: number,
  baselineScore: number
): HillClimbCandidate {
  const score = aggregateEvalScore(evidence.evals, { suite: "training", optimizerVisibleOnly: true });
  return {
    iteration,
    strategy: strategyNameForIteration(iteration),
    maturityLevel,
    runId: evidence.runId,
    score,
    deltaFromPrevious: Number((score - previousScore).toFixed(4)),
    deltaFromBaseline: Number((score - baselineScore).toFixed(4)),
    promotionDecision: evidence.promotionDecision,
    evals: evidence.evals
  };
}

export function buildHillClimbReport(
  mission: Mission,
  profile: string,
  startedAt: string,
  evidences: EvidencePack[]
): HillClimbReport {
  if (evidences.length === 0) throw new Error("Cannot build hill-climb report without evidence.");
  const candidates: HillClimbCandidate[] = [];
  const baselineScore = aggregateEvalScore(evidences[0].evals, { suite: "training", optimizerVisibleOnly: true });
  let previousScore = baselineScore;
  for (let index = 0; index < evidences.length; index += 1) {
    const evidence = evidences[index];
    const maturityLevel = Math.round((evidence.qualitySignals.maturityLevel ?? index / Math.max(1, evidences.length - 1)) * 3);
    const candidate = summarizeCandidate(evidence, index, maturityLevel, previousScore, baselineScore);
    candidates.push(candidate);
    previousScore = candidate.score;
  }
  const best = [...evidences].sort((a, b) =>
    aggregateEvalScore(b.evals, { suite: "training", optimizerVisibleOnly: true })
    - aggregateEvalScore(a.evals, { suite: "training", optimizerVisibleOnly: true })
  )[0];
  const bestScore = aggregateEvalScore(best.evals, { suite: "training", optimizerVisibleOnly: true });
  const final = evidences[evidences.length - 1];
  const monotonicIncrease = candidates.every((candidate, index) => index === 0 || candidate.score >= candidates[index - 1].score);
  return {
    missionId: mission.id,
    missionTitle: mission.title,
    profile,
    startedAt,
    completedAt: new Date().toISOString(),
    baselineRunId: evidences[0].runId,
    bestRunId: best.runId,
    baselineScore,
    bestScore,
    improvement: Number((bestScore - baselineScore).toFixed(4)),
    monotonicIncrease,
    candidates,
    bestQualitySignals: best.qualitySignals,
    proof: {
      works: evidences.every((evidence) => evidence.steps.every((step) => step.status === "ok")),
      improves: bestScore > baselineScore && monotonicIncrease,
      hasAiMlLlmLoops: (best.qualitySignals.aiMlLlmCoverage ?? 0) >= 0.85,
      hasContinuousImprovement: (best.qualitySignals.continuousImprovementCoverage ?? 0) >= 0.85,
      hasAutomationLoops: (best.qualitySignals.automationCoverage ?? 0) >= 0.85,
      noSecretLeaks: evidences.every((evidence) => evidence.redactionReport.leaksDetected === 0)
    }
  };
}

export function renderHillClimbMarkdown(report: HillClimbReport): string {
  const rows = report.candidates
    .map((candidate) =>
      `| ${candidate.iteration} | ${candidate.maturityLevel} | ${candidate.strategy} | ${candidate.runId} | ${candidate.score.toFixed(4)} | ${candidate.deltaFromBaseline.toFixed(4)} | ${candidate.promotionDecision} |`
    )
    .join("\n");
  const signalRows = Object.entries(report.bestQualitySignals)
    .map(([key, value]) => `| ${key} | ${value.toFixed(2)} |`)
    .join("\n");
  return `# Hill-Climb Proof: ${report.missionTitle}

- Profile: ${report.profile}
- Baseline run: ${report.baselineRunId}
- Best run: ${report.bestRunId}
- Baseline training score: ${report.baselineScore.toFixed(4)}
- Best training score: ${report.bestScore.toFixed(4)}
- Training lift: ${report.improvement.toFixed(4)}
- Monotonic increase: ${report.monotonicIncrease ? "yes" : "no"}

## Proof Gates

| Gate | Passed |
| --- | --- |
| Works | ${report.proof.works ? "yes" : "no"} |
| Improves | ${report.proof.improves ? "yes" : "no"} |
| AI/ML/LLM loops | ${report.proof.hasAiMlLlmLoops ? "yes" : "no"} |
| Continuous improvement | ${report.proof.hasContinuousImprovement ? "yes" : "no"} |
| Automation loops | ${report.proof.hasAutomationLoops ? "yes" : "no"} |
| No secret leaks | ${report.proof.noSecretLeaks ? "yes" : "no"} |

## Candidates

| Iteration | Maturity | Strategy | Run | Training Score | Delta From Baseline | Decision |
| ---: | ---: | --- | --- | ---: | ---: | --- |
${rows}

## Best Quality Signals

| Signal | Score |
| --- | ---: |
${signalRows}
`;
}

function strategyNameForIteration(iteration: number): string {
  return [
    "baseline-static-workflow",
    "embed-ai-llm-tool-usage",
    "add-ml-eval-optimization-loop",
    "add-continuous-agent-operating-system"
  ][Math.max(0, Math.min(3, iteration))];
}

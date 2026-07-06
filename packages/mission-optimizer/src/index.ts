import { createHash } from "node:crypto";
import { aggregateEvalScore } from "@playbasis-agent-os/evals";
import { createHillClimbMission } from "@playbasis-agent-os/hill-climber";
import type { ArtifactWrite, EvidencePack, Mission, ProfileName } from "@playbasis-agent-os/kernel";

export interface MissionVariant {
  id: string;
  parentMissionId: string;
  strategy: string;
  changes: MissionVariantChange[];
  mission: Mission;
}

export interface MissionVariantChange {
  target: "inputs" | "steps" | "artifacts" | "prompts" | "budgets" | "evals";
  operation: "set" | "add" | "tighten" | "annotate";
  path: string;
  value: unknown;
  rationale: string;
}

export interface VariantGeneratorContext {
  profile: ProfileName;
  repoRoot?: string;
  candidateCount?: number;
  allowProviderCalls?: boolean;
  now?: string;
}

export interface VariantGenerator {
  name: string;
  generate(baseMission: Mission, context: VariantGeneratorContext): Promise<MissionVariant[]> | MissionVariant[];
}

export interface OptimizationCandidate {
  variant: MissionVariant;
  runId?: string;
  promotionDecision?: string;
  trainingScore?: number;
  heldOutScore?: number;
  trustScore?: number;
  economicScore?: number;
  visibleToOptimizerScore?: number;
}

export interface OptimizationRun {
  optimizationId: string;
  parentMissionId: string;
  profile: ProfileName;
  startedAt: string;
  completedAt: string;
  baseline: {
    missionId: string;
    runId?: string;
    trainingScore?: number;
    heldOutScore?: number;
  };
  candidates: OptimizationCandidate[];
  selectedWinner?: OptimizationCandidate;
  rejectedVariants: Array<{
    id: string;
    strategy: string;
    reason: string;
    trainingScore?: number;
    heldOutScore?: number;
  }>;
  proposalArtifact: {
    path: string;
    sha256: string;
    variantCount: number;
  };
  guardrails: {
    selectionMetric: "training";
    heldOutVisibleDuringSelection: false;
    llmGeneratorSkippedUnlessProviderCallsEnabled: true;
  };
}

export function createScriptedMaturityLadderGenerator(): VariantGenerator {
  return {
    name: "scripted-maturity-ladder",
    generate(baseMission, context) {
      const count = Math.max(1, Math.min(8, context.candidateCount ?? 4));
      return Array.from({ length: count }, (_, index) => {
        const maturityLevel = Math.min(3, index);
        const mission = createHillClimbMission(baseMission, index, maturityLevel);
        return {
          id: `${baseMission.id}-scripted-maturity-${index}`,
          parentMissionId: baseMission.id,
          strategy: "scripted-maturity-ladder",
          changes: [
            {
              target: "inputs",
              operation: "set",
              path: "inputs.maturityLevel",
              value: maturityLevel,
              rationale: "Deterministic maturity ladder retained as a baseline generator, not a proof of intelligence."
            },
            {
              target: "inputs",
              operation: "set",
              path: "inputs.hillClimbStrategy",
              value: mission.inputs?.hillClimbStrategy,
              rationale: "Keeps fixture optimization reproducible while stronger generators mature."
            }
          ],
          mission
        };
      });
    }
  };
}

export function createLlmMissionDeltaProposer(): VariantGenerator {
  return {
    name: "llm-mission-delta-proposer",
    generate(baseMission, context) {
      const providerAllowed = context.allowProviderCalls === true && process.env.PBOS_ALLOW_PROVIDER_CALLS === "1";
      if (!providerAllowed) return [];
      const mission: Mission = {
        ...baseMission,
        id: `${baseMission.id}-llm-delta-1`,
        title: `${baseMission.title} LLM Delta Proposal`,
        inputs: {
          ...baseMission.inputs,
          optimizerStrategy: "llm-mission-delta-proposer",
          proposedArtifact: "superprompt-qualification-report.json"
        },
        steps: [
          ...baseMission.steps,
          {
            id: "superprompt-qualification",
            title: "Qualify WorkspaceOps super-prompt fit",
            tool: "workspaceops.superprompt.qualify",
            input: {
              objective: baseMission.objective,
              proposedBy: "llm-mission-delta-proposer"
            }
          }
        ]
      };
      return [
        {
          id: `${baseMission.id}-llm-mission-delta-proposer-1`,
          parentMissionId: baseMission.id,
          strategy: "llm-mission-delta-proposer",
          changes: [
            {
              target: "steps",
              operation: "add",
              path: "steps.superprompt-qualification",
              value: "workspaceops.superprompt.qualify",
              rationale: "Add a real-work adapter that qualifies which WorkspaceOps super-prompt surfaces match the mission objective."
            },
            {
              target: "artifacts",
              operation: "add",
              path: "artifacts/superprompt-qualification-report.json",
              value: "safe qualification metadata",
              rationale: "Record rationale as a durable artifact without exposing prompt bodies, provider request bodies, or response payloads."
            }
          ],
          mission
        }
      ];
    }
  };
}

export async function generateMissionVariants(
  baseMission: Mission,
  context: VariantGeneratorContext,
  generators: VariantGenerator[] = [
    createScriptedMaturityLadderGenerator(),
    createLlmMissionDeltaProposer()
  ]
): Promise<MissionVariant[]> {
  const nested = await Promise.all(generators.map((generator) => generator.generate(baseMission, context)));
  const variants = nested.flat();
  const seen = new Set<string>();
  return variants.filter((variant) => {
    if (seen.has(variant.id)) return false;
    seen.add(variant.id);
    return true;
  });
}

export function summarizeEvidenceForOptimizer(evidence: EvidencePack): Omit<OptimizationCandidate, "variant"> {
  return {
    runId: evidence.runId,
    promotionDecision: evidence.promotionDecision,
    trainingScore: aggregateEvalScore(evidence.evals, { suite: "training" }),
    heldOutScore: aggregateEvalScore(evidence.evals, { suite: "heldOut" }),
    trustScore: aggregateEvalScore(evidence.evals, { suite: "trust" }),
    economicScore: aggregateEvalScore(evidence.evals, { suite: "economic" }),
    visibleToOptimizerScore: aggregateEvalScore(evidence.evals, { suite: "training", optimizerVisibleOnly: true })
  };
}

export function selectWinnerByTrainingOnly(candidates: OptimizationCandidate[]): OptimizationCandidate | undefined {
  return [...candidates].sort((a, b) =>
    numberValue(b.visibleToOptimizerScore ?? b.trainingScore) - numberValue(a.visibleToOptimizerScore ?? a.trainingScore)
  )[0];
}

export function buildOptimizationRun(input: {
  optimizationId: string;
  parentMission: Mission;
  profile: ProfileName;
  startedAt: string;
  completedAt?: string;
  baselineEvidence?: EvidencePack;
  variants: MissionVariant[];
  evidencesByVariantId: Record<string, EvidencePack>;
  proposalArtifactPath?: string;
}): OptimizationRun {
  const candidates = input.variants.map((variant) => ({
    variant,
    ...(
      input.evidencesByVariantId[variant.id]
        ? summarizeEvidenceForOptimizer(input.evidencesByVariantId[variant.id])
        : {}
    )
  }));
  const selectedWinner = selectWinnerByTrainingOnly(candidates);
  const proposalContent = buildProposalRationale(input.variants);
  return {
    optimizationId: input.optimizationId,
    parentMissionId: input.parentMission.id,
    profile: input.profile,
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? new Date().toISOString(),
    baseline: {
      missionId: input.parentMission.id,
      runId: input.baselineEvidence?.runId,
      trainingScore: input.baselineEvidence ? aggregateEvalScore(input.baselineEvidence.evals, { suite: "training" }) : undefined,
      heldOutScore: input.baselineEvidence ? aggregateEvalScore(input.baselineEvidence.evals, { suite: "heldOut" }) : undefined
    },
    candidates,
    selectedWinner,
    rejectedVariants: candidates
      .filter((candidate) => candidate.variant.id !== selectedWinner?.variant.id)
      .map((candidate) => ({
        id: candidate.variant.id,
        strategy: candidate.variant.strategy,
        reason: "Lower optimizer-visible training score at selection time.",
        trainingScore: candidate.trainingScore,
        heldOutScore: candidate.heldOutScore
      })),
    proposalArtifact: {
      path: input.proposalArtifactPath ?? "optimizer-proposal-rationale.json",
      sha256: createHash("sha256").update(JSON.stringify(proposalContent)).digest("hex"),
      variantCount: input.variants.length
    },
    guardrails: {
      selectionMetric: "training",
      heldOutVisibleDuringSelection: false,
      llmGeneratorSkippedUnlessProviderCallsEnabled: true
    }
  };
}

export function buildProposalRationale(variants: MissionVariant[]): Record<string, unknown> {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    variantCount: variants.length,
    variants: variants.map((variant) => ({
      id: variant.id,
      parentMissionId: variant.parentMissionId,
      strategy: variant.strategy,
      changes: variant.changes
    }))
  };
}

export function proposalRationaleArtifact(variants: MissionVariant[]): ArtifactWrite {
  return {
    path: "optimizer-proposal-rationale.json",
    type: "json",
    summary: "Optimizer candidate proposal rationale.",
    publicReady: false,
    content: buildProposalRationale(variants)
  };
}

export function renderOptimizationMarkdown(report: OptimizationRun): string {
  const rows = report.candidates
    .map((candidate) => `| ${candidate.variant.id} | ${candidate.variant.strategy} | ${candidate.runId ?? "n/a"} | ${formatScore(candidate.trainingScore)} | ${formatScore(candidate.heldOutScore)} | ${candidate.variant.id === report.selectedWinner?.variant.id ? "yes" : "no"} |`)
    .join("\n");
  return `# Mission Optimization Run

- Optimization id: ${report.optimizationId}
- Parent mission: ${report.parentMissionId}
- Profile: ${report.profile}
- Selection metric: training score only
- Held-out visible during selection: no
- Selected winner: ${report.selectedWinner?.variant.id ?? "none"}

## Candidates

| Variant | Strategy | Run | Training Score | Held-out Score | Selected |
| --- | --- | --- | ---: | ---: | --- |
${rows}

## Guardrails

This optimizer reports held-out scores after selection, but candidate selection is made only from optimizer-visible training scores. The scripted maturity ladder remains available as a baseline generator and is not treated as proof of open-ended intelligence.
`;
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatScore(value: unknown): string {
  return numberValue(value).toFixed(4);
}

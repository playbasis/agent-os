import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ProfileName = "fixture" | "local-monorepo" | "staging-sandbox";

export type PromotionDecision = "promote" | "revise" | "quarantine" | "manual-review";

export interface Mission {
  schemaVersion: 1;
  id: string;
  title: string;
  objective: string;
  profile?: ProfileName;
  inputs?: Record<string, unknown>;
  budgets?: {
    maxSteps?: number;
    maxRuntimeMs?: number;
    maxProviderCalls?: number;
  };
  steps: MissionStep[];
  evals?: string[];
  promotionPolicy?: {
    minScore: number;
    requireNoSecretLeaks: boolean;
    requireAllStepsSucceeded: boolean;
  };
}

export interface MissionStep {
  id: string;
  title?: string;
  tool: string;
  input?: Record<string, unknown>;
  retries?: number;
  dependsOn?: string[];
  approval?: "none" | "required";
}

export interface ArtifactWrite {
  path: string;
  type: "markdown" | "json" | "csv" | "text";
  summary: string;
  content: unknown;
  publicReady?: boolean;
}

export interface Artifact {
  id: string;
  path: string;
  type: ArtifactWrite["type"];
  summary: string;
  sha256: string;
  bytes: number;
  publicReady: boolean;
}

export interface ToolResult {
  status: "ok" | "skipped" | "failed";
  summary: string;
  output?: Record<string, unknown>;
  artifacts?: ArtifactWrite[];
  qualitySignals?: Record<string, number>;
}

export interface ToolExecutionContext {
  mission: Mission;
  step: MissionStep;
  profile: ProfileName;
  runId: string;
  runDir: string;
  previousStepOutputs: Record<string, ToolResult>;
  trace: (event: Omit<TraceEvent, "timestamp" | "runId">) => Promise<void>;
}

export interface RuntimeToolSpec {
  name: string;
  kind: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  requiresProfile?: ProfileName[];
  secretPolicy: "none" | "redacted" | "private";
  execute: (context: ToolExecutionContext, input: Record<string, unknown>) => Promise<ToolResult>;
}

export interface TraceEvent {
  runId: string;
  timestamp: string;
  type: "run.started" | "step.started" | "tool.called" | "artifact.written" | "step.completed" | "step.failed" | "run.completed";
  stepId?: string;
  tool?: string;
  status?: string;
  durationMs?: number;
  data?: Record<string, unknown>;
}

export interface EvalResult {
  name: string;
  suite: "training" | "heldOut" | "trust" | "economic";
  source: "heuristic" | "external-judge" | "human-review" | "system" | "benchmark";
  visibleToOptimizer: boolean;
  score: number;
  status: "pass" | "warn" | "fail";
  summary: string;
}

export interface EvidencePack {
  runId: string;
  missionId: string;
  missionTitle: string;
  profile: ProfileName;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  toolsUsed: string[];
  steps: Array<{
    id: string;
    tool: string;
    status: ToolResult["status"];
    summary: string;
  }>;
  artifacts: Artifact[];
  evals: EvalResult[];
  promotionDecision: PromotionDecision;
  qualitySignals: Record<string, number>;
  redactionReport: {
    checkedArtifacts: number;
    leaksDetected: number;
  };
}

export interface RedactionGuard {
  redactText(value: string): string;
  scanText(value: string): string[];
}

export interface MissionRunnerOptions {
  profile: ProfileName;
  tools: RuntimeToolSpec[];
  runsRoot: string;
  redactionGuard: RedactionGuard;
  evaluate: (evidence: EvidencePack) => EvalResult[];
  decidePromotion: (mission: Mission, evidence: EvidencePack, evals: EvalResult[]) => PromotionDecision;
}

export async function readMission(filePath: string): Promise<Mission> {
  const parsed = JSON.parse(await readFile(filePath, "utf8")) as Mission;
  validateMission(parsed);
  return parsed;
}

export function validateMission(mission: Mission): void {
  if (mission.schemaVersion !== 1) {
    throw new Error("Mission schemaVersion must be 1.");
  }
  if (!mission.id || !mission.title || !mission.objective) {
    throw new Error("Mission requires id, title, and objective.");
  }
  if (!Array.isArray(mission.steps) || mission.steps.length === 0) {
    throw new Error("Mission requires at least one step.");
  }
  const ids = new Set<string>();
  for (const step of mission.steps) {
    if (!step.id || !step.tool) {
      throw new Error("Each mission step requires id and tool.");
    }
    if (ids.has(step.id)) {
      throw new Error(`Duplicate mission step id: ${step.id}`);
    }
    ids.add(step.id);
  }
}

export class MissionRunner {
  private readonly toolMap: Map<string, RuntimeToolSpec>;

  constructor(private readonly options: MissionRunnerOptions) {
    this.toolMap = new Map(options.tools.map((tool) => [tool.name, tool]));
  }

  async run(mission: Mission): Promise<EvidencePack> {
    const startedAt = new Date();
    const runId = createRunId(mission.id);
    const runDir = path.join(this.options.runsRoot, runId);
    const artifactsDir = path.join(runDir, "artifacts");
    await mkdir(artifactsDir, { recursive: true });

    const tracePath = path.join(runDir, "trace.jsonl");
    const trace = async (event: Omit<TraceEvent, "timestamp" | "runId">) => {
      const fullEvent: TraceEvent = {
        runId,
        timestamp: new Date().toISOString(),
        ...event
      };
      await writeFile(tracePath, `${JSON.stringify(fullEvent)}\n`, { flag: "a" });
    };

    await trace({
      type: "run.started",
      status: "ok",
      data: {
        missionId: mission.id,
        profile: this.options.profile
      }
    });

    const previousStepOutputs: Record<string, ToolResult> = {};
    const steps: EvidencePack["steps"] = [];
    const artifacts: Artifact[] = [];
    const toolsUsed: string[] = [];
    const qualitySignals: Record<string, number> = {};
    let leakCount = 0;

    for (const step of mission.steps) {
      const tool = this.toolMap.get(step.tool);
      if (!tool) {
        throw new Error(`No tool registered for mission step ${step.id}: ${step.tool}`);
      }
      if (tool.requiresProfile && !tool.requiresProfile.includes(this.options.profile)) {
        throw new Error(`Tool ${tool.name} does not support profile ${this.options.profile}.`);
      }
      if (step.approval === "required" && this.options.profile === "fixture") {
        previousStepOutputs[step.id] = {
          status: "skipped",
          summary: "Approval-required step skipped in fixture profile."
        };
        continue;
      }

      const stepStartedAt = Date.now();
      await trace({ type: "step.started", stepId: step.id, tool: tool.name, status: "ok" });
      await trace({
        type: "tool.called",
        stepId: step.id,
        tool: tool.name,
        status: "ok",
        data: {
          kind: tool.kind,
          secretPolicy: tool.secretPolicy
        }
      });

      try {
        const result = await tool.execute(
          {
            mission,
            step,
            profile: this.options.profile,
            runId,
            runDir,
            previousStepOutputs,
            trace
          },
          step.input ?? {}
        );
        previousStepOutputs[step.id] = result;
        mergeQualitySignals(qualitySignals, result.qualitySignals);
        toolsUsed.push(tool.name);
        steps.push({
          id: step.id,
          tool: tool.name,
          status: result.status,
          summary: result.summary
        });

        for (const artifact of result.artifacts ?? []) {
          const written = await this.writeArtifact(artifactsDir, artifact);
          const leaks = this.options.redactionGuard.scanText(await readFile(path.join(runDir, written.path), "utf8"));
          leakCount += leaks.length;
          if (leaks.length > 0) {
            throw new Error(`Secret leak detected in artifact ${written.path}: ${leaks.join(", ")}`);
          }
          artifacts.push(written);
          await trace({
            type: "artifact.written",
            stepId: step.id,
            tool: tool.name,
            status: "ok",
            data: {
              path: written.path,
              sha256: written.sha256,
              bytes: written.bytes
            }
          });
        }

        await trace({
          type: "step.completed",
          stepId: step.id,
          tool: tool.name,
          status: result.status,
          durationMs: Date.now() - stepStartedAt
        });
      } catch (error) {
        await trace({
          type: "step.failed",
          stepId: step.id,
          tool: tool.name,
          status: "failed",
          durationMs: Date.now() - stepStartedAt,
          data: { message: error instanceof Error ? error.message : String(error) }
        });
        throw error;
      }
    }

    const completedAt = new Date();
    const evidenceWithoutEvals: EvidencePack = {
      runId,
      missionId: mission.id,
      missionTitle: mission.title,
      profile: this.options.profile,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMs: completedAt.getTime() - startedAt.getTime(),
      toolsUsed: [...new Set(toolsUsed)],
      steps,
      artifacts,
      evals: [],
      promotionDecision: "manual-review",
      qualitySignals,
      redactionReport: {
        checkedArtifacts: artifacts.length,
        leaksDetected: leakCount
      }
    };
    const evals = this.options.evaluate(evidenceWithoutEvals);
    const promotionDecision = this.options.decidePromotion(mission, evidenceWithoutEvals, evals);
    const evidence: EvidencePack = {
      ...evidenceWithoutEvals,
      evals,
      promotionDecision
    };

    await writeJson(path.join(runDir, "evidence.json"), evidence);
    await writeFile(path.join(runDir, "promotion-report.md"), renderPromotionReport(evidence), "utf8");
    await trace({
      type: "run.completed",
      status: "ok",
      durationMs: evidence.durationMs,
      data: {
        artifacts: artifacts.length,
        promotionDecision
      }
    });
    return evidence;
  }

  private async writeArtifact(artifactsDir: string, artifact: ArtifactWrite): Promise<Artifact> {
    const safeRelativePath = artifact.path.replace(/^\/+/, "");
    const absolutePath = path.join(artifactsDir, safeRelativePath);
    const relativePath = path.join("artifacts", safeRelativePath);
    const content = typeof artifact.content === "string"
      ? artifact.content
      : JSON.stringify(artifact.content, null, 2);
    const redacted = this.options.redactionGuard.redactText(content);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, redacted, "utf8");
    const bytes = Buffer.byteLength(redacted);
    return {
      id: createHash("sha256").update(relativePath).digest("hex").slice(0, 12),
      path: relativePath,
      type: artifact.type,
      summary: artifact.summary,
      sha256: createHash("sha256").update(redacted).digest("hex"),
      bytes,
      publicReady: artifact.publicReady ?? false
    };
  }
}

export async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function renderPromotionReport(evidence: EvidencePack): string {
  const evalRows = evidence.evals
    .map((item) => `| ${item.name} | ${item.suite} | ${item.status} | ${item.score.toFixed(2)} | ${item.visibleToOptimizer ? "yes" : "no"} | ${item.summary} |`)
    .join("\n");
  const artifactRows = evidence.artifacts
    .map((artifact) => `| ${artifact.path} | ${artifact.type} | ${artifact.bytes} | ${artifact.publicReady ? "yes" : "no"} |`)
    .join("\n");
  return `# Promotion Report: ${evidence.missionTitle}

- Run: ${evidence.runId}
- Profile: ${evidence.profile}
- Decision: ${evidence.promotionDecision}
- Duration: ${evidence.durationMs}ms
- Secret leaks: ${evidence.redactionReport.leaksDetected}

## Quality Signals

${Object.entries(evidence.qualitySignals).map(([key, value]) => `- ${key}: ${value.toFixed(2)}`).join("\n") || "- none"}

## Evals

| Eval | Suite | Status | Score | Optimizer Visible | Summary |
| --- | --- | --- | ---: | --- | --- |
${evalRows}

## Artifacts

| Artifact | Type | Bytes | Public Ready |
| --- | --- | ---: | --- |
${artifactRows}
`;
}

function createRunId(missionId: string): string {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `${missionId}-${stamp}-${randomUUID().slice(0, 8)}`;
}

function mergeQualitySignals(target: Record<string, number>, source?: Record<string, number>): void {
  if (!source) return;
  for (const [key, value] of Object.entries(source)) {
    if (!Number.isFinite(value)) continue;
    const normalized = Math.max(0, Math.min(1, value));
    target[key] = Math.max(target[key] ?? 0, normalized);
  }
}

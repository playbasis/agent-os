import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const ROUTER_STAGE_IDS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"] as const;

export type RouterStageId = typeof ROUTER_STAGE_IDS[number];

export type RouterCallOutcome = "accepted" | "retried" | "rejected" | "error" | "skipped";

export interface RouterStageDefinition {
  id: RouterStageId;
  label: string;
  repoHome: string[];
  capabilityNeed: string;
}

export const ROUTER_STAGE_DEFINITIONS: RouterStageDefinition[] = [
  { id: "S1", label: "Intake / mission compile", repoHome: ["kernel", "mission JSON"], capabilityNeed: "medium reasoning" },
  { id: "S2", label: "Objective & governance config", repoHome: ["kernel", "profiles"], capabilityNeed: "high reasoning" },
  { id: "S3", label: "Planning / path-fan generation", repoHome: ["navigator"], capabilityNeed: "highest reasoning" },
  { id: "S4", label: "Execution / tool loop", repoHome: ["kernel", "service-connectors"], capabilityNeed: "tool-call reliability" },
  { id: "S5", label: "Evidence capture", repoHome: ["run-warehouse"], capabilityNeed: "cheap structured output" },
  { id: "S6", label: "Evaluation / council", repoHome: ["evals", "navigator"], capabilityNeed: "cross-family judge quality" },
  { id: "S7", label: "Governance", repoHome: ["approval gates"], capabilityNeed: "precision over creativity" },
  { id: "S8", label: "Promotion & reporting", repoHome: ["reports"], capabilityNeed: "cheap structured output" },
  { id: "S9", label: "Learning distillation", repoHome: ["hill-climber", "mission-optimizer"], capabilityNeed: "high reasoning" }
];

export type RouterModelProvider =
  | "azure-openai"
  | "azure-ai-services"
  | "gemini"
  | "anthropic"
  | "fixture"
  | "unknown";

export type RouterModelCapability =
  | "chat"
  | "responses"
  | "tools"
  | "structured-output"
  | "long-context"
  | "image-generation"
  | "deep-research"
  | "embeddings"
  | "audio"
  | "video"
  | "fixture";

export interface RouterModelPricing {
  inputPerMtokUsd?: number | null;
  outputPerMtokUsd?: number | null;
  cachedInputPerMtokUsd?: number | null;
  reasoningPerMtokUsd?: number | null;
}

export interface RouterModelCatalogEntry {
  id: string;
  provider: RouterModelProvider;
  family: string;
  model?: string | null;
  version?: string | null;
  effort?: string | null;
  deployment?: string | null;
  deploymentEnvKey?: string | null;
  candidateDeploymentEnvKeys?: string[];
  region?: string | null;
  resource?: string | null;
  resourceGroup?: string | null;
  contextWindow?: number | null;
  capabilities: RouterModelCapability[];
  quotaTpm?: number | null;
  quotaRpm?: number | null;
  capacity?: number | null;
  pricing?: RouterModelPricing | null;
  inventorySource?: string | null;
  inventoryHash?: string | null;
  verifiedAt?: string | null;
  notes?: string | null;
}

export interface RouterModelCatalog {
  schemaVersion: 1;
  generatedAt: string;
  source: {
    pathLabel: string;
    sha256: string;
  };
  models: RouterModelCatalogEntry[];
  safety: {
    pricingOverlayIncluded: false;
    envValuesIncluded: false;
    rawApiKeysIncluded: false;
  };
}

export interface RouterModelConfig {
  schemaVersion: 1;
  configId: string;
  description?: string;
  defaultModelId?: string | null;
  stageModels: Partial<Record<RouterStageId, string>>;
  metadata?: Record<string, unknown>;
}

export interface RouterSelection {
  stage: RouterStageId;
  status: "selected" | "no-config" | "missing-model";
  modelId?: string;
  model?: RouterModelCatalogEntry;
  reason: string;
}

export interface RouterTelemetrySummary {
  recordCount: number;
  expectedCallCount?: number;
  complete: boolean;
  missingHashCount: number;
  duplicateHashes: string[];
  stageCounts: Partial<Record<RouterStageId, number>>;
  callKindCounts: Record<string, number>;
  outcomeCounts: Partial<Record<RouterCallOutcome, number>>;
  tokenTotals: ProviderUsageMetrics;
  costUsd: number;
}

export interface RouterCallContext {
  stage: RouterStageId;
  runId?: string;
  mission?: string;
  seed?: number;
  step?: string | number;
  attempt?: number;
  traceId?: string;
  configId?: string;
  modelId?: string;
  telemetryPath?: string;
}

export interface ProviderUsageMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedInputTokens: number;
  reasoningTokens: number;
}

export interface RouterTelemetryRecord {
  schemaVersion: 1;
  runId: string | null;
  mission: string | null;
  seed: number | null;
  stage: RouterStageId;
  step: string | number | null;
  attempt: number;
  callKind: string;
  configId: string | null;
  provider: RouterModelProvider | string;
  model: string;
  deploymentKey: string | null;
  deploymentHash: string | null;
  tokensIn: number;
  tokensOut: number;
  tokensReasoning: number;
  cachedTokens: number;
  latencyMs: number;
  costUsd: number;
  outcome: RouterCallOutcome;
  qualitySignals: Record<string, number | boolean | string | null>;
  traceId: string | null;
  responseIdHash: string | null;
  recordedAt: string;
  hash: string;
}

export function isRouterStageId(value: unknown): value is RouterStageId {
  return typeof value === "string" && (ROUTER_STAGE_IDS as readonly string[]).includes(value);
}

export function assertRouterStageId(value: unknown, label = "stage"): RouterStageId {
  if (!isRouterStageId(value)) {
    throw new Error(`${label} must be one of ${ROUTER_STAGE_IDS.join(", ")}.`);
  }
  return value;
}

export function buildFixtureModelCatalog(generatedAt = new Date().toISOString()): RouterModelCatalog {
  return {
    schemaVersion: 1,
    generatedAt,
    source: {
      pathLabel: "fixture",
      sha256: hashText("fixture")
    },
    models: [
      {
        id: "fixture/echo",
        provider: "fixture",
        family: "fixture",
        model: "echo",
        effort: "deterministic",
        deployment: null,
        deploymentEnvKey: null,
        capabilities: ["fixture", "chat", "structured-output"],
        quotaTpm: null,
        quotaRpm: null,
        capacity: null,
        pricing: {
          inputPerMtokUsd: 0,
          outputPerMtokUsd: 0,
          cachedInputPerMtokUsd: 0,
          reasoningPerMtokUsd: 0
        },
        inventorySource: "fixture",
        inventoryHash: hashText("fixture"),
        verifiedAt: generatedAt,
        notes: "Deterministic zero-cost dry-run model for router-lab fixture arms."
      }
    ],
    safety: {
      pricingOverlayIncluded: false,
      envValuesIncluded: false,
      rawApiKeysIncluded: false
    }
  };
}

export async function syncModelCatalogFromFile(input: {
  inventoryPath: string;
  generatedAt?: string;
}): Promise<RouterModelCatalog> {
  const inventoryText = await readFile(input.inventoryPath, "utf8");
  return parseModelCatalogFromInventoryMarkdown(inventoryText, {
    sourcePath: input.inventoryPath,
    generatedAt: input.generatedAt
  });
}

export async function readModelCatalogFromFile(filePath: string): Promise<RouterModelCatalog> {
  const catalog = JSON.parse(await readFile(filePath, "utf8")) as RouterModelCatalog;
  validateModelCatalog(catalog);
  return catalog;
}

export function parseModelCatalogFromInventoryMarkdown(
  markdown: string,
  input: {
    sourcePath?: string;
    generatedAt?: string;
  } = {}
): RouterModelCatalog {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const sourceHash = hashText(markdown);
  const sourcePath = input.sourcePath ?? "inventory.md";
  const rows = parseMarkdownTables(markdown);
  const models: RouterModelCatalogEntry[] = [];

  for (const row of rows) {
    const deployment = cleanCell(row.deployment);
    const model = cleanCell(row["backing model"] ?? row.model);
    if (!deployment || !model) continue;
    if (!looksLikeModelDeployment(deployment, model)) continue;
    const provider = inferProvider(row.kind, model, deployment);
    const capacity = parseCapacity(row.capacity ?? row["capacity / quota"]);
    const entry: RouterModelCatalogEntry = {
      id: uniqueCatalogId(provider, model, deployment, cleanCell(row.region), cleanCell(row.resource)),
      provider,
      family: inferFamily(model),
      model,
      version: cleanCell(row.version),
      effort: inferEffort(model, deployment),
      deployment,
      deploymentEnvKey: null,
      candidateDeploymentEnvKeys: deriveCandidateDeploymentEnvKeys(deployment, markdown),
      region: cleanCell(row.region),
      resource: cleanCell(row.resource),
      resourceGroup: cleanCell(row["resource group"]),
      capabilities: inferCapabilities(model, deployment),
      capacity: capacity.capacity,
      quotaTpm: capacity.quotaTpm,
      quotaRpm: capacity.quotaRpm,
      pricing: null,
      inventorySource: labelPath(sourcePath),
      inventoryHash: sourceHash,
      verifiedAt: inferVerifiedAt(markdown) ?? generatedAt,
      notes: null
    };
    entry.deploymentEnvKey = entry.candidateDeploymentEnvKeys?.[0] ?? null;
    models.push(entry);
  }

  const catalog: RouterModelCatalog = {
    schemaVersion: 1,
    generatedAt,
    source: {
      pathLabel: labelPath(sourcePath),
      sha256: sourceHash
    },
    models: dedupeCatalogEntries([...buildFixtureModelCatalog(generatedAt).models, ...models]),
    safety: {
      pricingOverlayIncluded: false,
      envValuesIncluded: false,
      rawApiKeysIncluded: false
    }
  };
  validateModelCatalog(catalog);
  return catalog;
}

export function validateModelCatalog(catalog: RouterModelCatalog): void {
  if (catalog.schemaVersion !== 1) throw new Error("Router model catalog schemaVersion must be 1.");
  const seen = new Set<string>();
  for (const model of catalog.models) {
    if (!model.id.trim()) throw new Error("Router model catalog entry id must be non-empty.");
    if (seen.has(model.id)) throw new Error(`Duplicate router model catalog id: ${model.id}`);
    seen.add(model.id);
    if (!Array.isArray(model.capabilities) || model.capabilities.length === 0) {
      throw new Error(`Router model catalog entry ${model.id} must declare at least one capability.`);
    }
    if (model.deploymentEnvKey && !/^[A-Z][A-Z0-9_]*$/.test(model.deploymentEnvKey)) {
      throw new Error(`Router model catalog entry ${model.id} has invalid deploymentEnvKey.`);
    }
  }
}

export async function readRouterModelConfigFromFile(input: {
  configPath: string;
  catalog?: RouterModelCatalog | null;
}): Promise<RouterModelConfig> {
  const config = JSON.parse(await readFile(input.configPath, "utf8")) as RouterModelConfig;
  validateModelConfig(config, input.catalog ?? null);
  return config;
}

export function validateModelConfig(config: RouterModelConfig, catalog?: RouterModelCatalog | null): void {
  if (config.schemaVersion !== 1) throw new Error("Router model config schemaVersion must be 1.");
  if (!config.configId?.trim()) throw new Error("Router model config configId must be non-empty.");
  if (!config.stageModels || typeof config.stageModels !== "object" || Array.isArray(config.stageModels)) {
    throw new Error("Router model config stageModels must be an object.");
  }
  const catalogIds = catalog ? new Set(catalog.models.map((model) => model.id)) : null;
  const referencedModelIds = new Set<string>();
  if (config.defaultModelId) referencedModelIds.add(config.defaultModelId);
  for (const [stage, modelId] of Object.entries(config.stageModels)) {
    assertRouterStageId(stage, "stageModels key");
    if (typeof modelId !== "string" || !modelId.trim()) {
      throw new Error(`Router model config stage ${stage} must reference a non-empty model id.`);
    }
    referencedModelIds.add(modelId);
  }
  if (catalogIds) {
    for (const modelId of referencedModelIds) {
      if (!catalogIds.has(modelId)) {
        throw new Error(`Router model config references unknown model id: ${modelId}`);
      }
    }
  }
}

export function selectRouterModelForStage(input: {
  stage: RouterStageId;
  config?: RouterModelConfig | null;
  catalog?: RouterModelCatalog | null;
}): RouterSelection {
  const stage = assertRouterStageId(input.stage);
  const modelId = input.config?.stageModels[stage] ?? input.config?.defaultModelId ?? undefined;
  if (!modelId) {
    return {
      stage,
      status: "no-config",
      reason: "No router model config was provided for this stage."
    };
  }
  const model = input.catalog?.models.find((entry) => entry.id === modelId);
  if (!model) {
    return {
      stage,
      status: "missing-model",
      modelId,
      reason: `Configured model ${modelId} was not found in the model catalog.`
    };
  }
  return {
    stage,
    status: "selected",
    modelId,
    model,
    reason: `Selected ${modelId} for ${stage}.`
  };
}

export function normalizeProviderUsage(usage: unknown): ProviderUsageMetrics {
  const record = usage && typeof usage === "object" && !Array.isArray(usage)
    ? usage as Record<string, unknown>
    : {};
  const inputTokens = numberField(record, [
    "input_tokens",
    "prompt_tokens",
    "inputTokens",
    "promptTokens",
    "promptTokenCount"
  ]);
  const outputTokens = numberField(record, [
    "output_tokens",
    "completion_tokens",
    "outputTokens",
    "completionTokens",
    "candidatesTokenCount"
  ]);
  const totalTokens = numberField(record, [
    "total_tokens",
    "totalTokens",
    "totalTokenCount"
  ]) || inputTokens + outputTokens;
  const cachedInputTokens = numberField(record, [
    "cached_tokens",
    "cachedTokens",
    "cachedInputTokens"
  ]) + nestedNumberField(record, ["input_tokens_details", "prompt_tokens_details"], ["cached_tokens", "cachedTokens"]);
  const reasoningTokens = numberField(record, [
    "reasoning_tokens",
    "reasoningTokens"
  ]) + nestedNumberField(record, ["output_tokens_details", "completion_tokens_details"], ["reasoning_tokens", "reasoningTokens"]);
  return {
    inputTokens,
    outputTokens,
    totalTokens,
    cachedInputTokens,
    reasoningTokens
  };
}

export function estimateProviderCostUsd(
  usage: ProviderUsageMetrics,
  pricing?: RouterModelPricing | null
): number {
  if (!pricing) return 0;
  const nonCachedInputTokens = Math.max(0, usage.inputTokens - usage.cachedInputTokens);
  const cachedInputPrice = pricing.cachedInputPerMtokUsd ?? pricing.inputPerMtokUsd ?? null;
  const cost =
    mtok(nonCachedInputTokens) * (pricing.inputPerMtokUsd ?? 0)
    + mtok(usage.cachedInputTokens) * (cachedInputPrice ?? 0)
    + mtok(usage.outputTokens) * (pricing.outputPerMtokUsd ?? 0)
    + mtok(usage.reasoningTokens) * (pricing.reasoningPerMtokUsd ?? 0);
  return roundMoney(cost);
}

export function defaultRouterTelemetryPath(repoRoot: string): string {
  return path.join(repoRoot, "reports", "router-telemetry.jsonl");
}

export function buildRouterTelemetryRecord(input: {
  context: RouterCallContext;
  callKind: string;
  provider: RouterModelProvider | string;
  model?: string | null;
  modelEntry?: RouterModelCatalogEntry | null;
  deploymentKey?: string | null;
  deployment?: string | null;
  usage?: unknown;
  latencyMs?: number | null;
  outcome: RouterCallOutcome;
  qualitySignals?: Record<string, number | boolean | string | null>;
  responseId?: string | null;
  recordedAt?: string;
}): RouterTelemetryRecord {
  const stage = assertRouterStageId(input.context.stage);
  const usage = normalizeProviderUsage(input.usage);
  const model = input.modelEntry?.id ?? input.context.modelId ?? input.model ?? "provider-default";
  const recordWithoutHash: Omit<RouterTelemetryRecord, "hash"> = {
    schemaVersion: 1,
    runId: input.context.runId ?? null,
    mission: input.context.mission ?? null,
    seed: typeof input.context.seed === "number" ? input.context.seed : null,
    stage,
    step: input.context.step ?? null,
    attempt: input.context.attempt ?? 1,
    callKind: input.callKind,
    configId: input.context.configId ?? null,
    provider: input.modelEntry?.provider ?? input.provider,
    model,
    deploymentKey: input.deploymentKey ?? input.modelEntry?.deploymentEnvKey ?? null,
    deploymentHash: input.deployment ? hashText(input.deployment) : null,
    tokensIn: usage.inputTokens,
    tokensOut: usage.outputTokens,
    tokensReasoning: usage.reasoningTokens,
    cachedTokens: usage.cachedInputTokens,
    latencyMs: Math.max(0, Math.round(input.latencyMs ?? 0)),
    costUsd: estimateProviderCostUsd(usage, input.modelEntry?.pricing ?? null),
    outcome: input.outcome,
    qualitySignals: input.qualitySignals ?? {},
    traceId: input.context.traceId ?? null,
    responseIdHash: input.responseId ? hashText(input.responseId) : null,
    recordedAt: input.recordedAt ?? new Date().toISOString()
  };
  return {
    ...recordWithoutHash,
    hash: hashText(stableStringify(recordWithoutHash))
  };
}

export async function appendRouterTelemetryRecord(filePath: string, record: RouterTelemetryRecord): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(record)}\n`, { flag: "a" });
}

export async function readRouterTelemetryJsonl(filePath: string): Promise<RouterTelemetryRecord[]> {
  const text = await readFile(filePath, "utf8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return lines.map((line, index) => {
    try {
      const record = JSON.parse(line) as RouterTelemetryRecord;
      validateRouterTelemetryRecord(record, index + 1);
      return record;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Router telemetry")) throw error;
      throw new Error(`Router telemetry line ${index + 1} is not valid JSON.`);
    }
  });
}

export function summarizeRouterTelemetry(
  records: RouterTelemetryRecord[],
  expectedCallCount?: number
): RouterTelemetrySummary {
  const seenHashes = new Set<string>();
  const duplicateHashes = new Set<string>();
  let missingHashCount = 0;
  const stageCounts: Partial<Record<RouterStageId, number>> = {};
  const callKindCounts: Record<string, number> = {};
  const outcomeCounts: Partial<Record<RouterCallOutcome, number>> = {};
  const tokenTotals: ProviderUsageMetrics = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    cachedInputTokens: 0,
    reasoningTokens: 0
  };
  let costUsd = 0;
  for (const record of records) {
    if (!record.hash) {
      missingHashCount += 1;
    } else if (seenHashes.has(record.hash)) {
      duplicateHashes.add(record.hash);
    } else {
      seenHashes.add(record.hash);
    }
    stageCounts[record.stage] = (stageCounts[record.stage] ?? 0) + 1;
    callKindCounts[record.callKind] = (callKindCounts[record.callKind] ?? 0) + 1;
    outcomeCounts[record.outcome] = (outcomeCounts[record.outcome] ?? 0) + 1;
    tokenTotals.inputTokens += record.tokensIn;
    tokenTotals.outputTokens += record.tokensOut;
    tokenTotals.totalTokens += record.tokensIn + record.tokensOut;
    tokenTotals.cachedInputTokens += record.cachedTokens;
    tokenTotals.reasoningTokens += record.tokensReasoning;
    costUsd = roundMoney(costUsd + record.costUsd);
  }
  return {
    recordCount: records.length,
    expectedCallCount,
    complete: (expectedCallCount === undefined || records.length === expectedCallCount)
      && missingHashCount === 0
      && duplicateHashes.size === 0,
    missingHashCount,
    duplicateHashes: [...duplicateHashes].sort(),
    stageCounts,
    callKindCounts,
    outcomeCounts,
    tokenTotals,
    costUsd
  };
}

export function assertRouterTelemetryCompleteness(input: {
  records: RouterTelemetryRecord[];
  expectedCallCount: number;
  mission?: string;
  configId?: string;
}): RouterTelemetrySummary {
  const summary = summarizeRouterTelemetry(input.records, input.expectedCallCount);
  if (summary.recordCount !== input.expectedCallCount) {
    throw new Error(`Router telemetry expected ${input.expectedCallCount} records but found ${summary.recordCount}.`);
  }
  if (summary.missingHashCount > 0) {
    throw new Error(`Router telemetry has ${summary.missingHashCount} records without hashes.`);
  }
  if (summary.duplicateHashes.length > 0) {
    throw new Error(`Router telemetry has duplicate record hashes: ${summary.duplicateHashes.join(", ")}`);
  }
  if (input.mission) {
    const mismatch = input.records.find((record) => record.mission !== input.mission);
    if (mismatch) throw new Error(`Router telemetry record mission mismatch: expected ${input.mission}.`);
  }
  if (input.configId) {
    const mismatch = input.records.find((record) => record.configId !== input.configId);
    if (mismatch) throw new Error(`Router telemetry record configId mismatch: expected ${input.configId}.`);
  }
  return summary;
}

export async function writeModelCatalog(filePath: string, catalog: RouterModelCatalog): Promise<void> {
  validateModelCatalog(catalog);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function validateRouterTelemetryRecord(record: RouterTelemetryRecord, lineNumber: number): void {
  const prefix = `Router telemetry line ${lineNumber}`;
  if (record.schemaVersion !== 1) throw new Error(`${prefix} must have schemaVersion 1.`);
  assertRouterStageId(record.stage, `${prefix} stage`);
  if (!record.callKind?.trim()) throw new Error(`${prefix} must include callKind.`);
  if (!record.model?.trim()) throw new Error(`${prefix} must include model.`);
  if (!["accepted", "retried", "rejected", "error", "skipped"].includes(record.outcome)) {
    throw new Error(`${prefix} has invalid outcome.`);
  }
  if (!record.hash || !/^[a-f0-9]{64}$/.test(record.hash)) throw new Error(`${prefix} must include a sha256 hash.`);
  if (record.deploymentHash !== null && !/^[a-f0-9]{64}$/.test(record.deploymentHash)) {
    throw new Error(`${prefix} has invalid deploymentHash.`);
  }
  if (record.responseIdHash !== null && !/^[a-f0-9]{64}$/.test(record.responseIdHash)) {
    throw new Error(`${prefix} has invalid responseIdHash.`);
  }
}

function parseMarkdownTables(markdown: string): Array<Record<string, string>> {
  const rows: Array<Record<string, string>> = [];
  const lines = markdown.split(/\r?\n/);
  for (let index = 0; index < lines.length - 1; index += 1) {
    const headerLine = lines[index] ?? "";
    const separatorLine = lines[index + 1] ?? "";
    if (!isTableLine(headerLine) || !/^\s*\|?\s*:?-{3,}/.test(separatorLine)) continue;
    const headers = splitTableRow(headerLine).map((cell) => normalizeHeader(cell));
    let rowIndex = index + 2;
    while (rowIndex < lines.length && isTableLine(lines[rowIndex] ?? "")) {
      const cells = splitTableRow(lines[rowIndex] ?? "");
      if (cells.length >= Math.max(2, headers.length - 1)) {
        const row: Record<string, string> = {};
        headers.forEach((header, cellIndex) => {
          if (header) row[header] = cells[cellIndex] ?? "";
        });
        rows.push(row);
      }
      rowIndex += 1;
    }
    index = rowIndex;
  }
  return rows;
}

function isTableLine(line: string): boolean {
  return line.includes("|") && line.trim().startsWith("|");
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/`/g, "").replace(/\s+/g, " ").trim();
}

function cleanCell(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/`/g, "").replace(/\*\*/g, "").trim();
  return cleaned.length > 0 && cleaned !== "-" ? cleaned : null;
}

function looksLikeModelDeployment(deployment: string, model: string): boolean {
  return /(gpt|o\d|claude|gemini|sora|image|flux|mai|embedding|whisper|tts|model-router)/i.test(`${deployment} ${model}`);
}

function inferProvider(kind: unknown, model: string, deployment: string): RouterModelProvider {
  const text = `${String(kind ?? "")} ${model} ${deployment}`.toLowerCase();
  if (text.includes("gemini")) return "gemini";
  if (text.includes("claude")) return "anthropic";
  if (text.includes("openai")) return "azure-openai";
  if (text.includes("aiservices") || text.includes("ai services")) return "azure-ai-services";
  if (text.includes("gpt") || text.includes("o3") || text.includes("o4")) return "azure-openai";
  return "unknown";
}

function inferFamily(model: string): string {
  const lower = model.toLowerCase();
  const match = lower.match(/^(gpt-\d+(?:\.\d+)?|gpt-chat|o\d(?:-[a-z-]+)?|claude-[a-z0-9-]+|gemini-[a-z0-9.-]+|sora-\d+|text-embedding-[a-z0-9-]+)/);
  return match?.[1] ?? lower.split(/\s+/)[0] ?? "unknown";
}

function inferEffort(model: string, deployment: string): string | null {
  const text = `${model} ${deployment}`.toLowerCase();
  if (/(nano|mini|flash|light)/.test(text)) return "light";
  if (/(medium|standard)/.test(text)) return "medium";
  if (/(pro|high|xhigh|frontier|gpt-5\.5)/.test(text)) return "xhigh";
  return null;
}

function inferCapabilities(model: string, deployment: string): RouterModelCapability[] {
  const text = `${model} ${deployment}`.toLowerCase();
  const capabilities = new Set<RouterModelCapability>();
  if (/image|flux|mai/.test(text)) return ["image-generation"];
  if (/deep-research/.test(text)) capabilities.add("deep-research");
  if (/embedding/.test(text)) capabilities.add("embeddings");
  if (/audio|tts|whisper|transcribe|realtime/.test(text)) capabilities.add("audio");
  if (/sora|video/.test(text)) capabilities.add("video");
  if (capabilities.size === 0 || /gpt|claude|gemini|o\d|model-router/.test(text)) {
    capabilities.add("chat");
    capabilities.add("responses");
    capabilities.add("structured-output");
  }
  if (/gpt|claude|gemini|o\d/.test(text)) capabilities.add("tools");
  return [...capabilities].sort();
}

function parseCapacity(value: unknown): { capacity: number | null; quotaTpm: number | null; quotaRpm: number | null } {
  const text = cleanCell(value) ?? "";
  const pair = text.match(/(\d[\d,]*)\s*\/\s*(\d[\d,]*)/);
  if (pair) {
    const current = Number(pair[1]?.replace(/,/g, ""));
    const limit = Number(pair[2]?.replace(/,/g, ""));
    return {
      capacity: Number.isFinite(current) ? current : null,
      quotaTpm: Number.isFinite(limit) && limit >= 1000 ? limit : null,
      quotaRpm: null
    };
  }
  const single = text.match(/\d[\d,]*/);
  const capacity = single ? Number(single[0].replace(/,/g, "")) : NaN;
  return {
    capacity: Number.isFinite(capacity) ? capacity : null,
    quotaTpm: null,
    quotaRpm: null
  };
}

function deriveCandidateDeploymentEnvKeys(deployment: string, markdown: string): string[] {
  const envKeys = new Set<string>();
  const exactKeys = markdown.match(/\b[A-Z][A-Z0-9_]*DEPLOYMENT\b/g) ?? [];
  const compact = deployment.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const underscored = deployment.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  for (const key of exactKeys) {
    const keyCompact = key.replace(/[^A-Z0-9]/g, "");
    if (keyCompact.includes(compact) || key.includes(underscored)) envKeys.add(key);
  }
  if (envKeys.size === 0 && compact) {
    envKeys.add(`PB_AZURE_OPENAI_${compact}_DEPLOYMENT`);
  }
  return [...envKeys].sort();
}

function inferVerifiedAt(markdown: string): string | null {
  const match = markdown.match(/(?:Last Updated|Last verified):\*\*\s*([^*\n]+)/i)
    ?? markdown.match(/Last verified:\s*([^\n]+)/i);
  return match?.[1]?.trim() ?? null;
}

function uniqueCatalogId(
  provider: RouterModelProvider,
  model: string,
  deployment: string,
  region: string | null,
  resource: string | null
): string {
  return [
    provider,
    slug(model),
    slug(deployment),
    region ? slug(region) : null,
    resource ? slug(resource).slice(0, 32) : null
  ].filter(Boolean).join("/");
}

function dedupeCatalogEntries(entries: RouterModelCatalogEntry[]): RouterModelCatalogEntry[] {
  const seen = new Set<string>();
  const out: RouterModelCatalogEntry[] = [];
  for (const entry of entries) {
    let id = entry.id;
    let suffix = 2;
    while (seen.has(id)) {
      id = `${entry.id}-${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    out.push({ ...entry, id });
  }
  return out;
}

function numberField(record: Record<string, unknown>, names: string[]): number {
  for (const name of names) {
    const value = cleanNumber(record[name]);
    if (value > 0) return value;
  }
  return 0;
}

function nestedNumberField(record: Record<string, unknown>, parentNames: string[], childNames: string[]): number {
  for (const parentName of parentNames) {
    const parent = record[parentName];
    if (!parent || typeof parent !== "object" || Array.isArray(parent)) continue;
    const value = numberField(parent as Record<string, unknown>, childNames);
    if (value > 0) return value;
  }
  return 0;
}

function cleanNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.round(value);
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }
  return 0;
}

function mtok(tokens: number): number {
  return Math.max(0, tokens) / 1_000_000;
}

function roundMoney(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function labelPath(filePath: string): string {
  const normalized = filePath.split(path.sep).join("/");
  const marker = "/playbasis-platform/";
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex !== -1) return `playbasis-platform/${normalized.slice(markerIndex + marker.length)}`;
  const repoMarker = "/playbasis-agent-os-pov/";
  const repoIndex = normalized.indexOf(repoMarker);
  if (repoIndex !== -1) return normalized.slice(repoIndex + repoMarker.length);
  return path.basename(filePath);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
}

function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

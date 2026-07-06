import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const roots = ["packages", "tests", "examples", "goals", "schemas", "docs", "reports", ".github", "package.json", "manifest.json", "README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "tsconfig.json", "tsconfig.base.json", "vitest.config.ts"];
const skipDirs = new Set(["node_modules", ".git"]);
const textExts = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".jsonl", ".md", ".html", ".css", ".txt", ".yaml", ".yml"]);
const forbidden = [
  { name: "raw-donor-file", re: /(?:^|["'\s])raw-donors\/[A-Za-z0-9_.-]+/ },
  { name: "local-user-path", re: /\/Users\/[A-Za-z0-9._-]+\// },
  { name: "private-eval-store", re: /playbasis-agent-os-private-evals/ },
  { name: "private-key", re: /BEGIN PRIVATE KEY/ },
  { name: "apim-subscription-key", re: /Ocp-Apim-Subscription-Key\s*:/ },
  { name: "azure-storage-connection", re: /AZURE_STORAGE_CONNECTION_STRING\s*=/ },
  { name: "env-file-reference", re: /(?:\/Users\/[^\s"']+\/\.env(?:\.[A-Za-z0-9_-]+)?|(?:^|[\s"'])(?:\.\/|\.\.\/)[^\s"']*\.env(?:\.[A-Za-z0-9_-]+)?)/ },
  { name: "provider-secret-literal", re: /(?:^|[^A-Za-z0-9_-])sk-[A-Za-z0-9_-]{32,}(?:[^A-Za-z0-9_-]|$)/ },
  { name: "raw-image-payload", re: /data:image\/[a-zA-Z0-9.+-]+;base64,/ },
  { name: "raw-provider-response-included", re: /rawProviderResponseIncluded\s*:\s*true/ },
  { name: "heldout-bodies-included", re: /heldOutBodiesIncluded\s*:\s*true/ },
  { name: "answer-key-included", re: /answerKeyIncluded\s*:\s*true/ }
];
const hits = [];
let scannedFiles = 0;

function visit(file) {
  if (!exists(file)) return;
  const stat = statSync(file);
  if (stat.isDirectory()) {
    if (skipDirs.has(path.basename(file))) return;
    for (const entry of readdirSync(file)) visit(path.join(file, entry));
    return;
  }
  if (!stat.isFile() || stat.size > 2_000_000 || !textExts.has(path.extname(file))) return;
  scannedFiles += 1;
  const text = readFileSync(file, "utf8");
  for (const item of forbidden) {
    if (item.re.test(text)) hits.push({ file, pattern: item.name });
  }
}

function exists(file) {
  try {
    statSync(file);
    return true;
  } catch {
    return false;
  }
}

for (const root of roots) visit(root);
const report = {
  ok: hits.length === 0,
  scannedFiles,
  forbiddenHits: hits,
  rawDonorsIncluded: hits.some((hit) => hit.pattern === "raw-donor-file"),
  privateProfilesIncluded: hits.some((hit) => hit.pattern === "private-eval-store"),
  envPathsIncluded: hits.some((hit) => hit.pattern === "env-file-reference"),
  liveEvidenceIncluded: false,
  heldOutBodiesIncluded: hits.some((hit) => hit.pattern === "heldout-bodies-included"),
  screenshotsIncluded: hits.some((hit) => hit.pattern === "raw-image-payload"),
  providerPayloadsIncluded: hits.some((hit) => hit.pattern === "raw-provider-response-included"),
  credentialsIncluded: hits.some((hit) => ["private-key", "apim-subscription-key", "azure-storage-connection", "provider-secret-literal"].includes(hit.pattern))
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/oss-export-scan.json", JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;

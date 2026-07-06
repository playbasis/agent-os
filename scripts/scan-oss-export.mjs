import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const roots = ["packages", "tests", "examples", "goals", "schemas", "docs", "reports", ".github", "package.json", "manifest.json", "README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "tsconfig.json", "tsconfig.base.json", "vitest.config.ts"];
const skipDirs = new Set(["node_modules", ".git"]);
const textExts = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".jsonl", ".md", ".html", ".css", ".txt", ".yaml", ".yml"]);
const forbidden = [
  { name: "raw-donor-file", re: /(?:^|["'\s])raw-donors\/[A-Za-z0-9_.-]+/ },
  { name: "local-user-path", re: /\/Users\/[A-Za-z0-9._-]+\// },
  { name: "private-eval-store", re: /playbasis-agent-os-private-evals/ },
  { name: "private-key", re: /BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY/ },
  { name: "pgp-private-key", re: /BEGIN PGP PRIVATE KEY BLOCK/ },
  { name: "apim-subscription-key", re: /Ocp-Apim-Subscription-Key\s*:/ },
  { name: "azure-storage-connection", re: /AZURE_STORAGE_CONNECTION_STRING\s*=/ },
  { name: "env-file-reference", re: /(?:\/Users\/[^\s"']+\/\.env(?:\.[A-Za-z0-9_-]+)?|(?:^|[\s"'])(?:\.\/|\.\.\/)[^\s"']*\.env(?:\.[A-Za-z0-9_-]+)?)/ },
  { name: "provider-secret-literal", re: /(?:^|[^A-Za-z0-9_-])sk-[A-Za-z0-9_-]{32,}(?:[^A-Za-z0-9_-]|$)/ },
  { name: "github-token", re: /(?:ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}/ },
  { name: "aws-access-key-id", re: /(?:AKIA|ASIA)[0-9A-Z]{16}/ },
  { name: "stripe-secret-key", re: /(?:sk|rk)_live_[A-Za-z0-9]{16,}/ },
  { name: "slack-token", re: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: "google-api-key", re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: "npm-token", re: /npm_[A-Za-z0-9]{36}/ },
  { name: "jwt-literal", re: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
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
  credentialsIncluded: hits.some((hit) => ["private-key", "pgp-private-key", "apim-subscription-key", "azure-storage-connection", "provider-secret-literal", "github-token", "aws-access-key-id", "stripe-secret-key", "slack-token", "google-api-key", "npm-token", "jwt-literal"].includes(hit.pattern))
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/oss-export-scan.json", JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;

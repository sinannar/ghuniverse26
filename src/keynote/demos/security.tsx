import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  Bot,
  Check,
  FileCode,
  Folder,
  GitPullRequest,
  KeyRound,
  Package,
  Radar,
  ScanSearch,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisualProps } from "@/scenes/scene-types";
import { usePhase, useProgress } from "@/kit/motion";
import { Bar, Panel, Pop, Severity, Verdict } from "@/kit/bits";
import { Chip } from "@/kit/ui";
import { CodeLines, TerminalFrame, WindowFrame, type TermLine } from "@/kit/frames";

/* =================================================================== AI Scan */

const REPO = [
  { path: "app/upload.php", lang: "PHP", risky: true },
  { path: "infra/main.tf", lang: "HCL", risky: true },
  { path: "docker/Dockerfile", lang: "Docker", risky: false },
  { path: "scripts/deploy.sh", lang: "Shell", risky: true },
  { path: "src/api/orders.ts", lang: "TS", risky: false },
  { path: "src/auth/session.ts", lang: "TS", risky: true },
  { path: "src/ui/cart.tsx", lang: "TSX", risky: false },
];

const FINDINGS = [
  { t: "SQL query built from request input", loc: "app/upload.php:41", cat: "String injection", sev: "High" as const, tool: "AI" },
  { t: "Storage bucket allows public reads", loc: "infra/main.tf:18", cat: "Security misconfiguration", sev: "High" as const, tool: "AI" },
  { t: "Unquoted variable passed to the shell", loc: "scripts/deploy.sh:27", cat: "String injection", sev: "Medium" as const, tool: "AI" },
  { t: "Session token written to logs", loc: "src/auth/session.ts:63", cat: "Sensitive data exposure", sev: "Medium" as const, tool: "AI" },
  { t: "Reflected cross-site scripting", loc: "src/api/orders.ts:112", cat: "Existing CodeQL alert", sev: "High" as const, tool: "CodeQL" },
];

function AiScanDemo({ step }: VisualProps) {
  const budget = useProgress(step, 2600, step === 1 || step === 2);
  const explore = usePhase(step, [0, 400, 800, 1200, 1600], step === 2);
  const riskyOrder = REPO.filter((f) => f.risky).map((f) => f.path);
  const exploring = (p: string) => step === 2 && riskyOrder.indexOf(p) >= 0 && riskyOrder.indexOf(p) < explore;
  return (
    <div className="flex h-full gap-6">
      <Panel title={<span className="flex items-center gap-2"><Folder className="size-5" aria-hidden="true" /> shop-platform · default branch</span>} className="w-[460px] shrink-0" bodyClassName="p-3">
        <p className="px-2 pb-2 font-mono-code text-[16px] text-zinc-300">latest commit 4f2a91c</p>
        <ul className="space-y-1">
          {REPO.map((f) => (
            <motion.li
              key={f.path}
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              animate={{
                backgroundColor: exploring(f.path) ? "rgba(251,146,60,0.18)" : "rgba(0,0,0,0)",
                opacity: step === 2 && !f.risky ? 0.45 : 1,
              }}
            >
              <FileCode className="size-5 shrink-0 text-zinc-300" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-mono-code text-[17px] text-white">{f.path}</span>
              <span className="rounded bg-white/10 px-1.5 text-[15px] text-zinc-200">{f.lang}</span>
              {exploring(f.path) ? (
                <span className="relative inline-flex size-3">
                  <span className="kn-pulse-ring absolute inset-0 rounded-full bg-orange-400" />
                  <span className="relative size-3 rounded-full bg-orange-400" />
                </span>
              ) : null}
            </motion.li>
          ))}
        </ul>
      </Panel>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Panel bodyClassName="flex items-center gap-5 p-5">
          <ScanSearch className="size-9 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[22px] font-semibold text-white">
              {step === 0 ? "AI Scan for repositories" : step <= 2 ? "Scanning the default branch" : "Scan complete"}
            </p>
            {step >= 1 ? (
              <>
                <div className="mt-2 flex justify-between text-[16px] text-zinc-300">
                  <span>{step === 2 ? "The agent focuses on code most likely to be vulnerable" : "Fixed time budget keeps cost bounded"}</span>
                  <span className="tabular">{Math.round((step >= 3 ? 1 : budget) * 100)}% of budget</span>
                </div>
                <Bar value={step >= 3 ? 1 : budget} className="mt-2" label="Scan time budget used" />
              </>
            ) : (
              <p className="mt-1 text-[17px] text-zinc-300">Start a scan on demand from the Code scanning page</p>
            )}
          </div>
          {step === 0 ? <span className="shrink-0 rounded-full bg-white px-5 py-2 text-[18px] font-semibold text-zinc-950">Run scan</span> : null}
        </Panel>
        {step >= 3 ? (
          <Panel title="Code scanning alerts" right={<Chip className="text-[16px]">AI Scan skips what CodeQL already reports</Chip>} className="min-h-0 flex-1">
            <ul className="divide-y divide-white/10">
              {FINDINGS.map((f, i) => (
                <motion.li
                  key={f.t}
                  className="flex items-center gap-3 px-4 py-2.5"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {step >= 4 && f.tool === "AI" ? (
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded border border-sky-300 bg-sky-400 text-zinc-950" aria-label="Selected">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="size-5 shrink-0 rounded border border-white/30" aria-hidden="true" />
                  )}
                  <Severity level={f.sev} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[18px] font-semibold text-white">{f.t}</p>
                    <p className="truncate text-[16px] text-zinc-300">
                      <span className="font-mono-code">{f.loc}</span> · {f.cat}
                    </p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[15px] font-bold", f.tool === "AI" ? "bg-orange-500/20 text-orange-100" : "bg-white/10 text-zinc-200")}>
                    {f.tool}
                  </span>
                </motion.li>
              ))}
            </ul>
          </Panel>
        ) : null}
        {step >= 4 ? (
          <Pop show className="flex items-center gap-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-3">
            <Bot className="size-7 text-emerald-300" aria-hidden="true" />
            <div>
              <p className="text-[19px] font-semibold text-white">Assigned to Copilot · draft pull request #1187</p>
              <p className="text-[16px] text-emerald-100">Fix 4 code scanning alerts · ready for your review</p>
            </div>
          </Pop>
        ) : null}
      </div>
    </div>
  );
}

function AiScanProblem() {
  const covered = ["TypeScript", "Python", "Go", "Java", "C#"];
  const gaps = ["PHP", "Shell / Bash", "Terraform (HCL)", "Dockerfile"];
  return (
    <div className="flex h-full items-start gap-10">
      <div className="w-[540px]">
        <p className="text-[22px] font-semibold text-zinc-200">Covered by CodeQL</p>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {covered.map((l) => (
            <li key={l} className="flex items-center gap-3 rounded-xl border border-white/12 bg-[#101115] px-4 py-3 text-[21px] text-white">
              <ShieldCheck className="size-6 text-emerald-300" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-[540px]">
        <p className="text-[22px] font-semibold text-zinc-200">Until now: no native scanning</p>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {gaps.map((l, i) => (
            <motion.li
              key={l}
              className="flex items-center gap-3 rounded-xl border border-dashed border-orange-300/60 bg-orange-500/5 px-4 py-3 text-[21px] text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <TriangleAlert className="size-6 text-orange-300" aria-hidden="true" />
              {l}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="mt-12 w-[480px] rounded-2xl border border-white/12 bg-[#101115] p-6 text-[22px] leading-snug text-zinc-100">
        And code already on the default branch that no pull request touched.
      </div>
    </div>
  );
}

function AiScanImpact() {
  const langs = ["PHP", "Shell / Bash", "Terraform (HCL)", "Dockerfiles", "JSP for Java", "Blazor for C#"];
  return (
    <figure className="flex h-full flex-col rounded-[24px] border border-white/12 bg-[#0f1015]/90 p-7">
      <figcaption className="text-[24px] font-semibold text-white">Coverage beyond CodeQL</figcaption>
      <ul className="mt-5 grid grid-cols-3 gap-3">
        {langs.map((l, i) => (
          <motion.li
            key={l}
            className="flex items-center gap-2 rounded-xl border border-orange-300/40 bg-orange-500/10 px-4 py-3 text-[20px] font-medium text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * i }}
          >
            <ShieldCheck className="size-5 text-orange-200" aria-hidden="true" />
            {l}
          </motion.li>
        ))}
      </ul>
      <p className="mt-5 text-[20px] text-zinc-200">…and more, plus issues that rules can miss in languages CodeQL already analyzes.</p>
      <p className="mt-auto text-[17px] text-zinc-300">Pull request scanning: generally available · Repository scanning: public preview</p>
    </figure>
  );
}

/* =================================================================== AI Scan on pull requests */

function AiScanPrVisual({ step }: VisualProps) {
  return (
    <WindowFrame title="#1190 Containerize the API · Files changed" className="h-full">
      <div className="p-4">
        <p className="font-mono-code text-[16px] text-zinc-300">docker/Dockerfile</p>
        <CodeLines
          className="mt-2 rounded-xl border border-white/10 bg-black/40 py-2 text-[17px]"
          lines={[
            { text: "FROM node:22-slim" },
            { text: "WORKDIR /app" },
            { text: "COPY . ." },
            { text: "RUN npm ci --omit=dev", mark: "add" },
            { text: 'CMD ["node", "server.js"]', mark: step >= 1 ? "hit" : "add" },
          ]}
        />
        <Pop show={step >= 1} className="mt-4 rounded-2xl border border-orange-300/50 bg-[#1a120b] p-4">
          <p className="flex flex-wrap items-center gap-2 text-[19px] font-semibold text-white">
            <span className="rounded-full bg-orange-500/25 px-2 py-0.5 text-[15px] font-bold text-orange-100">AI</span>
            Container runs as root
            <Severity level="Medium" />
          </p>
          <p className="mt-1 text-[16px] text-zinc-200">Security misconfiguration · no USER instruction before CMD</p>
          <p className="mt-2 font-mono-code text-[16px] text-emerald-200">Suggested fix: + USER node</p>
          <p className="mt-2 text-[16px] text-zinc-300">Advisory: doesn't fail the check or block the merge</p>
        </Pop>
      </div>
    </WindowFrame>
  );
}

/* =================================================================== Agentic autofix */

function AutofixVisual({ step }: VisualProps) {
  const stages = [
    { t: "Alert", s: "Path injection · files.ts:42", icon: ShieldAlert },
    { t: "Assign to Copilot", s: "Up to 25 alerts per PR", icon: Bot },
    { t: "Explore and fix", s: "Relevant files across the codebase", icon: FileCode },
    { t: "Rerun CodeQL", s: "Iterate if needed", icon: ScanSearch },
    { t: "Draft pull request", s: "Explains the fix and validation", icon: GitPullRequest },
  ];
  const ph = usePhase(step, [0, 450, 900, 1350], step >= 1);
  return (
    <div className="mx-auto flex h-full w-full max-w-[1620px] items-center gap-3">
      {stages.map((st, i) => {
        const on = i < 2 || (step >= 1 && ph >= i - 1);
        const Icon = st.icon;
        return (
          <div key={st.t} className="flex flex-1 items-center gap-3">
            <motion.div
              className="flex h-[200px] flex-1 flex-col justify-center rounded-[22px] border p-5"
              animate={{ opacity: on ? 1 : 0.3, borderColor: on ? "var(--accent-hex)" : "rgba(255,255,255,0.12)" }}
              transition={{ duration: 0.4 }}
            >
              <Icon className="size-8 text-[var(--accent-text)]" aria-hidden="true" />
              <p className="mt-3 text-[22px] font-semibold text-white">{st.t}</p>
              <p className="mt-1 text-[16px] leading-snug text-zinc-300">{st.s}</p>
            </motion.div>
            {i < stages.length - 1 ? <span aria-hidden="true" className="text-[26px] text-zinc-400">›</span> : null}
          </div>
        );
      })}
    </div>
  );
}

/* =================================================================== Security extension */

const ALERTS = [
  { t: "SQL injection in report export", loc: "reports/export.py:58", sev: "Critical" as const },
  { t: "Path traversal in file download", loc: "files/serve.go:31", sev: "High" as const },
  { t: "Missing rate limit on login", loc: "auth/login.ts:12", sev: "Medium" as const },
];

function SecurityExtensionVisual({ step }: VisualProps) {
  return (
    <WindowFrame title="GitHub Copilot app · Security" className="h-full">
      <div className="flex h-full">
        <ul className="w-[400px] shrink-0 space-y-2 border-r border-white/10 p-3">
          {ALERTS.map((a, i) => (
            <li key={a.t} className={cn("rounded-xl border p-3", i === 0 && step >= 1 ? "border-[var(--accent-hex)] bg-orange-500/10" : "border-white/10")}>
              <Severity level={a.sev} />
              <p className="mt-1.5 text-[17px] font-semibold text-white">{a.t}</p>
              <p className="font-mono-code text-[15px] text-zinc-300">{a.loc}</p>
            </li>
          ))}
          {step >= 3 ? (
            <Pop show className="rounded-xl border border-sky-400/50 bg-sky-500/10 p-3">
              <p className="text-[16px] font-semibold text-sky-100">/security-review · 1 new finding in your changes</p>
              <p className="mt-1 text-[15px] text-zinc-200">Shown next to existing alerts</p>
            </Pop>
          ) : null}
        </ul>
        <div className="min-w-0 flex-1 p-4">
          {step === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-zinc-300">
              <Shield className="size-12 text-[var(--accent-text)]" aria-hidden="true" />
              <p className="mt-3 text-[20px]">Open code scanning alerts, ordered by severity</p>
            </div>
          ) : null}
          {step >= 1 ? (
            <Pop show>
              <p className="flex items-center gap-2 text-[17px] font-semibold text-[var(--accent-text)]">
                <Sparkles className="size-5" aria-hidden="true" />
                Explain
              </p>
              <p className="mt-2 text-[18px] leading-snug text-zinc-100">
                The report name from the request is joined into the SQL string. A crafted name can read other tenants' rows.
              </p>
            </Pop>
          ) : null}
          {step >= 2 ? (
            <Pop show className="mt-4">
              <p className="flex items-center gap-2 text-[17px] font-semibold text-[var(--accent-text)]">
                <Check className="size-5" aria-hidden="true" />
                Fix · in your local working copy
              </p>
              <CodeLines
                numbers={false}
                className="mt-2 rounded-xl border border-white/10 bg-black/40 py-2 text-[16px]"
                lines={[
                  { text: 'cur.execute(f"SELECT * FROM reports WHERE name = \'{name}\'")', mark: "del" },
                  { text: 'cur.execute("SELECT * FROM reports WHERE name = %s", (name,))', mark: "add" },
                ]}
              />
              <p className="mt-2 text-[16px] text-zinc-300">Not committed · not pushed · you review first</p>
            </Pop>
          ) : null}
        </div>
      </div>
    </WindowFrame>
  );
}

/* =================================================================== AI push protection */

const PUSH_LINES: TermLine[][] = [
  [],
  [{ kind: "cmd", text: "git push origin feature/db-pooling" }],
  [{ kind: "dim", text: "Pattern-based secret detectors: no match" }],
  [
    { kind: "err", text: "remote: Push blocked: secret detected by AI" },
    { kind: "err", text: "remote:   Generic password · config/database.yml, line 5" },
    { kind: "warn", text: "remote: Remove it from every commit in this push, then push again." },
  ],
  [
    { kind: "cmd", text: "git commit --amend --no-edit" },
    { kind: "cmd", text: "git push origin feature/db-pooling" },
    { kind: "ok", text: "Pushed. The password now comes from an environment variable." },
  ],
];

function PushProtectionVisual({ step }: VisualProps) {
  const lines = PUSH_LINES.slice(0, step + 1).flat();
  const fixed = step >= 4;
  return (
    <div className="flex h-full flex-col gap-4">
      <WindowFrame title="config/database.yml · edited by a coding agent">
        <CodeLines
          className="py-2 text-[18px]"
          lines={[
            { text: "production:" },
            { text: "  host: db.internal" },
            { text: "  pool: 20", mark: "add" },
            { text: "  username: app" },
            fixed ? { text: "  password: ${DB_PASSWORD}", mark: "add" } : { text: "  password: ●●●●●●●●●●●●", mark: step >= 3 ? "hit" : "add" },
          ]}
        />
      </WindowFrame>
      <TerminalFrame title="Terminal" lines={lines.length ? lines : [{ kind: "dim", text: "# ready to push" }]} className="min-h-0 flex-1" />
      <p className="flex items-center gap-2 text-[17px] text-zinc-300">
        <KeyRound className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
        Bypass and delegated bypass still apply. Agents must get authorization first.
      </p>
    </div>
  );
}

/* =================================================================== Package firewall */

const PACKAGES = [
  { p: "react@19.1.1", ok: true, why: "Allowed" },
  { p: "date-fns@4.1.0", ok: true, why: "Allowed" },
  { p: "example-left-pad@1.0.3", ok: false, why: "Known malware" },
  { p: "example-fetch-retry@2.4.0", ok: false, why: "New install script (postinstall)" },
  { p: "example-csv-lite@0.9.1", ok: false, why: "Published 6 hours ago · minimum age 1 day" },
];

function FirewallVisual({ step }: VisualProps) {
  const ph = usePhase(step, [0, 450, 900, 1350, 1800, 2250], step === 2);
  const judged = (i: number) => step >= 3 || (step === 2 && ph > i);
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/12 bg-[#101115] px-4 py-3">
          <Bot className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
          <span className="text-[18px] font-semibold text-white">Coding agent · CI runner</span>
        </div>
        <motion.span aria-hidden="true" className="h-0.5 w-10" animate={{ backgroundColor: step >= 1 ? "#fb923c" : "rgba(255,255,255,0.3)" }} />
        <motion.div
          className="flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3"
          animate={{ borderColor: step >= 1 ? "var(--accent-hex)" : "rgba(255,255,255,0.12)", backgroundColor: step >= 1 ? "rgba(194,65,12,0.2)" : "rgba(16,17,21,1)" }}
        >
          <Shield className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
          <span className="text-[18px] font-semibold text-white">Package firewall</span>
        </motion.div>
        <span aria-hidden="true" className="h-0.5 w-10 bg-white/30" />
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/12 bg-[#101115] px-4 py-3">
          <Package className="size-6 text-zinc-300" aria-hidden="true" />
          <span className="text-[18px] font-semibold text-white">Upstream npm registry</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Known malware: block", "Advisories: Critical", "Attestation downgrades: block", "New install scripts: block", "Minimum age: 1 day"].map((c) => (
          <Chip key={c} className="text-[16px]">
            {c}
          </Chip>
        ))}
      </div>
      <TerminalFrame title="agent session" lines={[{ kind: "cmd", text: "npm install" }]} className="min-h-0 flex-1">
        <ul className="mt-2 space-y-1.5">
          {PACKAGES.map((p, i) => (
            <li key={p.p} className="flex items-center gap-3 text-[18px]">
              <span className="w-[300px] text-zinc-100">{p.p}</span>
              {judged(i) ? (
                <span className={cn("flex items-center gap-2 font-sans font-semibold", p.ok ? "text-emerald-300" : "text-red-300")}>
                  {p.ok ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
                  {p.why}
                </span>
              ) : (
                <span className="text-zinc-400">{step >= 1 ? "checking…" : "requested"}</span>
              )}
            </li>
          ))}
        </ul>
        {step >= 3 ? <p className="mt-3 font-sans text-[17px] text-zinc-200">2 installed · 3 blocked before install · request an exception if one is wrong</p> : null}
      </TerminalFrame>
    </div>
  );
}

/* =================================================================== Reachability */

const DEP_ALERTS = [
  { pkg: "template-lite 3.2.1", vuln: "Prototype pollution in compile()", sev: "High" as const, verdict: "Reachable", rank: 0 },
  { pkg: "yaml-mini 1.4.0", vuln: "Code execution in load()", sev: "Critical" as const, verdict: "Unreachable", rank: 2 },
  { pkg: "qs-lite 2.0.3", vuln: "Denial of service in parse()", sev: "Medium" as const, verdict: "Potentially reachable", rank: 1 },
  { pkg: "markup-sanitize 1.0.4", vuln: "Filter bypass in clean()", sev: "High" as const, verdict: "Unreachable", rank: 2 },
  { pkg: "img-meta 0.8.2", vuln: "Path traversal in extract()", sev: "Medium" as const, verdict: "Reachability unavailable", rank: 3 },
];

function verdictTone(v: string) {
  if (v === "Reachable") return "bg-red-500/20 text-red-100 border-red-400/50";
  if (v === "Potentially reachable") return "bg-amber-400/15 text-amber-100 border-amber-300/50";
  if (v === "Unreachable") return "bg-zinc-400/10 text-zinc-200 border-zinc-400/40";
  return "bg-white/5 text-zinc-300 border-white/20";
}

function ReachabilityVisual({ step }: VisualProps) {
  const list = step >= 3 ? [...DEP_ALERTS].sort((a, b) => a.rank - b.rank) : DEP_ALERTS;
  return (
    <div className="flex h-full gap-4">
      <Panel title="Dependabot alerts" className="w-[470px] shrink-0" bodyClassName="p-2">
        <ul>
          {list.map((a) => (
            <motion.li key={a.pkg} layout={false} className="rounded-lg px-3 py-2" initial={false} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2">
                <Severity level={a.sev} />
                <span className="truncate font-mono-code text-[16px] text-white">{a.pkg}</span>
              </div>
              <p className="mt-0.5 truncate text-[16px] text-zinc-300">{a.vuln}</p>
              {step >= 3 ? <span className={cn("mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[15px] font-semibold", verdictTone(a.verdict))}>{a.verdict}</span> : null}
            </motion.li>
          ))}
        </ul>
      </Panel>
      <div className="relative min-w-0 flex-1 rounded-[20px] border border-white/12 bg-[#0b0c0f]">
        <p className="px-5 pt-4 text-[17px] font-semibold text-zinc-200">{step >= 1 ? "CodeQL call graph across your code and dependencies" : "Which vulnerable functions does your code call?"}</p>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 560" aria-hidden="true">
          {step >= 1 ? (
            <>
              <path d="M 150 140 C 220 140, 220 230, 290 230" fill="none" stroke={step >= 2 ? "#f87171" : "rgba(255,255,255,0.3)"} strokeWidth={step >= 2 ? 4 : 2.5} />
              <path d="M 340 260 C 340 320, 380 330, 400 370" fill="none" stroke={step >= 2 ? "#f87171" : "rgba(255,255,255,0.3)"} strokeWidth={step >= 2 ? 4 : 2.5} />
              <path d="M 150 440 C 240 440, 250 470, 300 470" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} strokeDasharray="7 8" />
            </>
          ) : null}
        </svg>
        {step >= 1 ? (
          <>
            {[
              { t: "src/routes/export.ts", x: 20, y: 110, mine: true },
              { t: "src/lib/report.ts", x: 230, y: 200, mine: true },
              { t: "template-lite · compile()", x: 250, y: 370, vuln: true, hot: step >= 2 },
              { t: "src/lib/format.ts", x: 20, y: 410, mine: true },
              { t: "markup-sanitize · clean()", x: 250, y: 470, vuln: true, cold: true },
            ].map((n, i) => (
              <motion.span
                key={n.t}
                className={cn(
                  "absolute rounded-xl border px-3 py-2 font-mono-code text-[16px] whitespace-nowrap",
                  n.vuln ? (n.hot ? "border-red-400 bg-red-500/20 text-white" : "border-zinc-500 bg-white/5 text-zinc-200") : "border-white/20 bg-[#14151a] text-white",
                )}
                style={{ left: `${(n.x / 540) * 100}%`, top: `${(n.y / 560) * 100}%` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 }}
              >
                {n.t}
              </motion.span>
            ))}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Radar className="size-16 text-zinc-400" aria-hidden="true" />
          </div>
        )}
        {step >= 2 ? (
          <Pop show className="absolute right-4 bottom-4 left-4 rounded-xl border border-white/12 bg-black/70 px-4 py-2 text-[16px] text-zinc-100">
            Red: a call path reaches the vulnerable function. Dashed: no call path reaches the vulnerable function.
          </Pop>
        ) : null}
      </div>
    </div>
  );
}

/* =================================================================== AI applications */

function AiAppsVisual({ step }: VisualProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <WindowFrame title="agents/triage.ts">
        <CodeLines
          className="py-2 text-[17px]"
          lines={[
            { text: "export async function summarizeIssue(issue: Issue) {" },
            { text: "  return agent.run({" },
            { text: '    instructions: "Summarize and propose next steps",' },
            { text: "    input: issue.body,", mark: step >= 1 ? "hit" : undefined },
            { text: "    tools: [createPullRequest, sendEmail],", mark: step >= 1 ? "hit" : undefined },
            { text: "  });" },
            { text: "}" },
          ]}
        />
      </WindowFrame>
      <Pop show={step >= 1} className="rounded-2xl border border-orange-300/50 bg-[#1a120b] p-4">
        <p className="flex items-center gap-2 text-[19px] font-semibold text-white">
          <ShieldAlert className="size-5 text-orange-300" aria-hidden="true" />
          Indirect prompt injection (XPIA)
        </p>
        <p className="mt-1 text-[17px] text-zinc-100">Untrusted issue text reaches a model that can open pull requests and send email.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Treat issue text as data", "Require approval before tool calls", "Limit tools to what the task needs"].map((m) => (
            <Chip key={m} className="text-[16px]">
              {m}
            </Chip>
          ))}
        </div>
      </Pop>
    </div>
  );
}

/* =================================================================== License compliance */

function LicenseVisual({ step }: VisualProps) {
  const deps = [
    { n: "pdf-render-lite 3.1.0", l: "MIT", ok: true },
    { n: "font-kit-lite 1.2.0", l: "Apache-2.0", ok: true },
    { n: "doc-convert-pro 2.0.0", l: "AGPL-3.0", ok: false },
  ];
  return (
    <WindowFrame title="#1188 Add PDF export · checks" className="h-full">
      <div className="space-y-3 p-5">
        <p className="flex items-center gap-2 text-[19px] font-semibold text-white">
          <ScanSearch className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
          License compliance {step >= 1 ? "· 1 noncompliant dependency" : "· running"}
        </p>
        <ul className="space-y-2">
          {deps.map((d) => (
            <li key={d.n} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="min-w-0 flex-1 truncate font-mono-code text-[17px] text-white">{d.n}</span>
              <Chip className="text-[16px]">{d.l}</Chip>
              {step >= 1 ? <Verdict ok={d.ok} label={d.ok ? "Allowed by policy" : "Not allowed by policy"} /> : <span className="text-[16px] text-zinc-300">checking</span>}
            </li>
          ))}
        </ul>
        {step >= 1 ? (
          <Pop show className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[17px] text-red-50">
            AGPL-3.0 isn't allowed by the enterprise policy. Replace the package or request an exception.
          </Pop>
        ) : null}
      </div>
    </WindowFrame>
  );
}

/* =================================================================== Public monitoring */

function PublicMonitoringVisual({ step }: VisualProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1500px] items-center gap-10">
      <figure className="shrink-0 text-center">
        <div className="relative size-[340px] overflow-hidden rounded-full border border-white/15 bg-[#0b0c0f]">
          {[0.33, 0.66, 1].map((k) => (
            <span key={k} aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-300/20" style={{ width: `${k * 100}%`, height: `${k * 100}%` }} />
          ))}
          <div aria-hidden="true" className="kn-spin-slow absolute inset-0" style={{ animationDuration: "5s", background: "conic-gradient(from 0deg, rgba(251,146,60,0.35), transparent 22%)" }} />
          {[
            [30, 40],
            [62, 28],
            [70, 64],
            [40, 72],
            [22, 58],
          ].map(([x, y], i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn("absolute size-3 rounded-full", i === 2 && step >= 1 ? "bg-red-400 ring-4 ring-red-400/30" : "bg-zinc-400")}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          ))}
        </div>
        <figcaption className="mt-4 text-[18px] text-zinc-300">Public repositories, gists and comments</figcaption>
      </figure>
      {step === 0 ? (
        <div className="flex min-w-0 flex-1 items-center gap-4 rounded-[22px] border border-white/12 bg-[#101115] p-6">
          <span aria-hidden="true" className="kn-pulse-ring relative size-4 shrink-0 rounded-full bg-orange-400" />
          <p className="text-[24px] text-zinc-100">Watching the public surface in real time</p>
        </div>
      ) : (
        <Pop show className="min-w-0 flex-1 rounded-[22px] border border-red-400/40 bg-[#1a0d0d] p-6">
          <p className="flex items-center gap-2 text-[22px] font-semibold text-white">
            <KeyRound className="size-6 text-red-300" aria-hidden="true" />
            Leaked secret attributed to your enterprise
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[18px]">
            {[
              ["Secret type", "Cloud access key"],
              ["Value", "●●●●●●●●●●●●"],
              ["Location", "Public gist"],
              ["Attribution", "Verified domain"],
              ["Committer", "Personal account with a work email"],
              ["Next step", "Revoke and rotate"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-zinc-300">{k}</dt>
                <dd className="font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </Pop>
      )}
    </div>
  );
}

/* =================================================================== Router */

export default function SecurityVisuals(props: VisualProps): ReactNode {
  const { id, part } = props;
  switch (id) {
    case "ai-scan":
      if (part === "problem") return <AiScanProblem />;
      if (part === "impact") return <AiScanImpact />;
      return <AiScanDemo {...props} />;
    case "ai-scan-prs":
      return <AiScanPrVisual {...props} />;
    case "agentic-autofix":
      return <AutofixVisual {...props} />;
    case "security-extension":
      return <SecurityExtensionVisual {...props} />;
    case "ai-push-protection":
      return <PushProtectionVisual {...props} />;
    case "package-firewall":
      return <FirewallVisual {...props} />;
    case "reachability":
      return <ReachabilityVisual {...props} />;
    case "ai-app-scanning":
      return <AiAppsVisual {...props} />;
    case "license-compliance":
      return <LicenseVisual {...props} />;
    case "public-monitoring":
      return <PublicMonitoringVisual {...props} />;
    default:
      return <div className="flex h-full items-center justify-center text-[22px] text-zinc-300">{id}</div>;
  }
}

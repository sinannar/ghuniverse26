import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  Bot,
  Check,
  CircleDot,
  FileText,
  GitBranch,
  GitMerge,
  GitPullRequest,
  History,
  Link,
  Lock,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisualProps } from "@/scenes/scene-types";
import { EASE_OUT, usePhase } from "@/kit/motion";
import { Panel, Pop, Severity } from "@/kit/bits";
import { Avatar, Chip } from "@/kit/ui";
import { TerminalFrame, WindowFrame, type TermLine } from "@/kit/frames";

/* =================================================================== Stacked pull requests */

const LAYERS = [
  { n: 1045, title: "Saved searches: frontend", branch: "feat/frontend", base: "feat/api-endpoints", add: "2,960", del: "1,553", files: 57, who: { i: "MO", c: "#be185d" } },
  { n: 1044, title: "Saved searches: API endpoints", branch: "feat/api-endpoints", base: "feat/auth-layer", add: "1,240", del: "310", files: 21, who: { i: "LK", c: "#0e7490" } },
  { n: 1043, title: "Saved searches: auth layer", branch: "feat/auth-layer", base: "main", add: "612", del: "40", files: 9, who: { i: "AS", c: "#b45309" } },
];

const STACK_TERM: TermLine[][] = [
  [
    { kind: "cmd", text: "git diff --shortstat main...feat/saved-searches" },
    { kind: "out", text: "87 files changed, 4812 insertions(+), 1903 deletions(-)" },
  ],
  [
    { kind: "cmd", text: "gh stack init feat/auth-layer" },
    { kind: "dim", text: "# commit the auth changes" },
    { kind: "cmd", text: "gh stack add feat/api-endpoints" },
    { kind: "dim", text: "# commit the API changes" },
    { kind: "cmd", text: "gh stack add feat/frontend" },
    { kind: "cmd", text: "gh stack submit" },
    { kind: "ok", text: "Stack created: #1043 #1044 #1045" },
  ],
  [
    { kind: "cmd", text: "gh stack view --short" },
    { kind: "out", text: "  feat/frontend       #1045" },
    { kind: "out", text: "  feat/api-endpoints  #1044" },
    { kind: "out", text: "  feat/auth-layer     #1043" },
    { kind: "dim", text: "  main" },
  ],
  [
    { kind: "cmd", text: "gh stack merge --yes" },
    { kind: "ok", text: "Merged #1043, #1044 and #1045 into main" },
  ],
];

function StackedDemo({ step, setStep, preview }: VisualProps) {
  const [approved, setApproved] = useState<number[]>([]);
  const autoApprove = usePhase(step, [0, 700, 1400, 2100], step === 2);
  const isApproved = (i: number) => step >= 3 || approved.includes(i) || (step === 2 && autoApprove > 2 - i);
  const lines = STACK_TERM.slice(0, Math.min(step, 3) + 1).flat();
  const merged = step >= 3;
  return (
    <div className="flex h-full gap-8">
      <TerminalFrame title="Terminal · gh stack" lines={lines} className="h-full w-[640px] shrink-0" />
      <div className="relative min-w-0 flex-1">
        {step === 0 ? (
          <motion.div
            className="absolute inset-x-0 top-[90px] rounded-[24px] border border-white/15 bg-[#101115] p-7"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="flex items-center gap-3 text-[18px] text-zinc-300">
              <GitPullRequest className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
              #1042 · feat/saved-searches into main
            </p>
            <p className="mt-3 text-[36px] leading-tight font-semibold text-white">Add saved searches end to end</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[20px]">
              <span className="font-mono-code font-semibold text-emerald-300">+4,812</span>
              <span className="font-mono-code font-semibold text-red-300">−1,903</span>
              <span className="text-zinc-300">· 87 files changed</span>
            </div>
            <p className="mt-6 flex items-center gap-3 text-[20px] text-amber-100">
              <CircleDot className="size-5" aria-hidden="true" />
              Review requested 6 days ago · 0 of 87 files viewed
            </p>
          </motion.div>
        ) : (
          <>
            {LAYERS.map((l, i) => (
              <motion.div
                key={l.n}
                className={cn(
                  "absolute inset-x-0 flex items-center gap-4 rounded-[20px] border px-5",
                  merged ? "border-violet-400/50 bg-[#151024]" : "border-white/15 bg-[#101115]",
                )}
                initial={{ opacity: 0, top: 200, height: 118 }}
                animate={{ opacity: 1, top: merged ? 242 + i * 66 : 20 + i * 136, height: merged ? 56 : 118 }}
                transition={{ duration: 0.7, delay: merged ? (2 - i) * 0.12 : i * 0.12, ease: EASE_OUT }}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[17px] font-bold text-white">{3 - i}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[22px] font-semibold text-white">
                    #{l.n} {l.title}
                  </p>
                  {merged ? null : (
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[16px] text-zinc-300">
                      <GitBranch className="size-4" aria-hidden="true" />
                      <span className="font-mono-code">{l.branch}</span> into <span className="font-mono-code">{l.base}</span>
                      <span className="font-mono-code text-emerald-300">+{l.add}</span>
                      <span className="font-mono-code text-red-300">−{l.del}</span>
                      <span>· {l.files} files</span>
                    </p>
                  )}
                </div>
                {merged ? (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-500/25 px-3 py-1 text-[16px] font-semibold text-violet-100">
                    <GitMerge className="size-4" aria-hidden="true" />
                    Merged
                  </span>
                ) : null}
                {step >= 2 && !merged ? (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[16px] font-semibold text-emerald-200">
                    <Check className="size-4" aria-hidden="true" />
                    14/14 checks
                  </span>
                ) : null}
                {step >= 2 && !merged ? (
                  isApproved(i) ? (
                    <span className="flex shrink-0 items-center gap-2 text-[17px] font-semibold text-emerald-200">
                      <Avatar initials={l.who.i} hue={l.who.c} className="size-9 text-[15px]" />
                      Approved
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={preview}
                      onClick={() => setApproved((a) => [...a, i])}
                      className="kn-focus shrink-0 rounded-full border border-white/25 px-4 py-1.5 text-[17px] font-semibold text-white hover:bg-white/10"
                    >
                      Approve
                    </button>
                  )
                ) : null}
              </motion.div>
            ))}
            <motion.div
              className="absolute inset-x-0 flex items-center gap-4 rounded-[20px] border px-5"
              style={{ top: 440, height: 80 }}
              animate={{
                borderColor: merged ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.12)",
                backgroundColor: merged ? "rgba(76,29,149,0.35)" : "rgba(255,255,255,0.03)",
              }}
            >
              <GitBranch className="size-6 text-zinc-300" aria-hidden="true" />
              <span className="font-mono-code text-[20px] text-white">main</span>
              {merged ? (
                <motion.span className="ml-auto flex items-center gap-2 text-[19px] font-semibold text-violet-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <GitMerge className="size-5" aria-hidden="true" />
                  3 pull requests merged in one operation
                </motion.span>
              ) : null}
            </motion.div>
            {step === 2 ? (
              <button
                type="button"
                disabled={preview}
                onClick={() => setStep(3)}
                className="kn-focus absolute right-0 bottom-0 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-[20px] font-semibold text-white hover:bg-emerald-500"
              >
                <GitMerge className="size-5" aria-hidden="true" />
                Merge stack
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function StackedProblem() {
  const files = ["src/auth/session.ts", "src/auth/tokens.ts", "src/api/searches.ts", "src/api/routes.ts", "web/components/SearchBar.tsx", "web/pages/saved.tsx", "db/migrations/0042_saved_searches.sql", "…80 more files"];
  return (
    <div className="flex h-full gap-12">
      <motion.div className="w-[900px] rounded-[24px] border border-white/15 bg-[#101115] p-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[34px] font-semibold text-white">#1042 Add saved searches end to end</p>
        <p className="mt-3 flex gap-3 text-[22px]">
          <span className="font-mono-code text-emerald-300">+4,812</span>
          <span className="font-mono-code text-red-300">−1,903</span>
          <span className="text-zinc-300">· 87 files</span>
        </p>
        <ul className="mt-5 space-y-1.5 font-mono-code text-[18px] text-zinc-300">
          {files.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div className="mt-10 space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <p className="rounded-2xl border border-amber-300/40 bg-amber-300/10 px-6 py-4 text-[24px] text-amber-50">Review requested 6 days ago</p>
        <p className="rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-4 text-[24px] text-zinc-100">3 dependent branches rebased by hand</p>
        <p className="rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-4 text-[24px] text-zinc-100">CI only ran on the bottom branch</p>
      </motion.div>
    </div>
  );
}

/* =================================================================== Pull requests page */

const PRS = [
  { n: 1045, t: "Saved searches: frontend", who: "maria", checks: "14/14", ok: true, review: "Review requested from you", stack: "Stack 3/3", unread: true, involves: true },
  { n: 1044, t: "Saved searches: API endpoints", who: "maria", checks: "14/14", ok: true, review: "Approved", stack: "Stack 2/3", unread: false, involves: false },
  { n: 1039, t: "Fix flaky timezone test", who: "dev-kim", checks: "2 failing", ok: false, review: "Changes requested", unread: true, involves: true },
  { n: 1036, t: "Bump eslint config", who: "dependabot", checks: "12/12", ok: true, review: "Review required", unread: false, involves: false },
  { n: 1031, t: "Docs: dark mode", who: "aisha", checks: "9/9", ok: true, review: "Approved", unread: true, involves: false },
  { n: 1029, t: "Refactor session token validation", who: "you", checks: "13/14", ok: false, review: "Review required", unread: false, involves: true },
  { n: 1024, t: "Cache product images", who: "omar", checks: "12/12", ok: true, review: "Review required", unread: false, involves: false },
];

function PrListVisual({ step }: VisualProps) {
  const rows = step >= 1 ? PRS.filter((p) => p.involves) : PRS;
  const selected = step >= 3 ? [1045, 1029] : [];
  return (
    <WindowFrame title="Pull requests · shop-platform" className="h-full">
      <div className="flex h-full">
        <aside className="w-[210px] shrink-0 space-y-1.5 border-r border-white/10 p-3 text-[17px]">
          {["Open", "Authored by me", "Involves me", "Review requested"].map((f) => (
            <div key={f} className={cn("rounded-lg px-3 py-2", step >= 1 && f === "Involves me" ? "bg-white text-zinc-950 font-semibold" : "text-zinc-200")}>
              {f}
            </div>
          ))}
        </aside>
        <div className="relative min-w-0 flex-1">
          {step >= 3 ? (
            <motion.div className="flex items-center gap-3 border-b border-white/10 bg-sky-500/10 px-4 py-2.5 text-[17px] text-sky-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              2 selected
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                <Tag className="size-4" aria-hidden="true" />
                Label: release-blocker
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1">Milestone</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Close</span>
            </motion.div>
          ) : null}
          <ul className="divide-y divide-white/10">
            {rows.map((p) => (
              <motion.li key={p.n} layout={false} className={cn("flex items-center gap-3 px-4 py-3", selected.includes(p.n) && "bg-sky-500/10")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded border", selected.includes(p.n) ? "border-sky-300 bg-sky-400 text-zinc-950" : "border-white/30")} aria-hidden="true">
                  {selected.includes(p.n) ? <Check className="size-3.5" /> : null}
                </span>
                <GitPullRequest className="size-5 shrink-0 text-emerald-300" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-[18px] font-semibold text-white">{p.t}</span>
                    {step >= 3 && selected.includes(p.n) ? (
                      <span className="shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-[15px] text-red-200">release-blocker</span>
                    ) : null}
                  </p>
                  <p className="text-[16px] text-zinc-300">
                    #{p.n} · {p.who}
                  </p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[16px] font-semibold", p.ok ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200", step === 2 && "ring-2 ring-[var(--accent-hex)]")}>
                  {p.ok ? "✓" : "✕"} {p.checks}
                </span>
                <span className="w-[150px] shrink-0 text-[16px] leading-tight text-zinc-200">{p.review}</span>
                {p.stack ? (
                  <span className={cn("shrink-0 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[16px] text-violet-200", step === 2 && "ring-2 ring-[var(--accent-hex)]")}>{p.stack}</span>
                ) : null}
                <span aria-label={p.unread ? "Unread updates" : undefined} className={cn("size-2.5 shrink-0 rounded-full", p.unread ? "bg-sky-400" : "bg-transparent", step === 2 && p.unread && "ring-4 ring-[var(--accent-hex)]/50")} />
              </motion.li>
            ))}
          </ul>
          {step === 2 ? (
            <motion.p className="absolute right-4 bottom-4 rounded-xl border border-white/15 bg-black/70 px-4 py-2 text-[17px] text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Check counts, stack indicators and unread updates at a glance
            </motion.p>
          ) : null}
        </div>
      </div>
    </WindowFrame>
  );
}

/* =================================================================== Code review Max */

function CodeReviewVisual({ step }: VisualProps) {
  const agents = [
    { n: "Review agent A", c: 3 },
    { n: "Review agent B", c: 2 },
    { n: "Review agent C", c: 4 },
  ];
  const ph = usePhase(step, [0, 500, 1000, 1500], step === 1);
  return (
    <div className="flex h-full flex-col gap-4">
      <Panel bodyClassName="p-4">
        <p className="flex items-center gap-2 text-[16px] text-zinc-300">
          <GitPullRequest className="size-5" aria-hidden="true" />
          #877 · auth/session.ts, lib/tokens.ts
        </p>
        <p className="mt-1 text-[26px] font-semibold text-white">Refactor session token validation</p>
        <div className="mt-3 flex items-center gap-3">
          <Chip tone="warn">Authentication</Chip>
          <Chip tone="warn">Shared library</Chip>
          <span className="ml-auto flex items-center gap-1 rounded-full border border-white/12 p-1 text-[16px] font-semibold">
            {["Lite", "Balanced", "Max"].map((l) => (
              <span key={l} className={cn("rounded-full px-3 py-1", (step >= 1 ? l === "Max" : l === "Balanced") ? "bg-white text-zinc-950" : "text-zinc-300")}>
                {l}
              </span>
            ))}
          </span>
        </div>
      </Panel>
      {step === 1 ? (
        <div className="grid grid-cols-3 gap-3">
          {agents.map((a, i) => (
            <Pop key={a.n} show delay={i * 0.12} className="rounded-2xl border border-white/12 bg-[#101115] p-4">
              <p className="flex items-center gap-2 text-[19px] font-semibold text-white">
                <Bot className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
                {a.n}
              </p>
              <p className="mt-1 text-[16px] text-zinc-300">Independent model, different provider</p>
              <p className="mt-3 text-[30px] font-bold text-white tabular">{ph > i ? a.c : "…"}</p>
              <p className="text-[16px] text-zinc-300">findings</p>
            </Pop>
          ))}
        </div>
      ) : null}
      {step >= 2 ? (
        <Panel title="One reconciled review" right={<Chip tone="accent">Aggregation agent</Chip>} bodyClassName="space-y-2.5 p-4">
          {[
            { t: "Expired tokens accepted when clock skew exceeds the grace window", l: "High" as const },
            { t: "Raw token written to debug logs on validation failure", l: "High" as const },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <Severity level={f.l} />
              <span className="text-[18px] text-zinc-100">{f.t}</span>
            </div>
          ))}
          <p className="text-[16px] text-zinc-300">9 raw findings reconciled: duplicates merged, disagreements resolved, accuracy double-checked</p>
        </Panel>
      ) : null}
      {step >= 3 ? (
        <Pop show className="flex items-center gap-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-4">
          <Check className="size-7 text-emerald-300" aria-hidden="true" />
          <div>
            <p className="text-[20px] font-semibold text-white">Fixes pushed · Copilot re-reviewed and approved</p>
            <p className="text-[16px] text-emerald-100">Counts toward required approvals: 2 of 2 · new commits dismiss it</p>
          </div>
        </Pop>
      ) : null}
    </div>
  );
}

/* =================================================================== Agent Merge */

function AgentMergeVisual({ step }: VisualProps) {
  const ph = usePhase(step, [0, 900, 1800], step === 1 || step === 2);
  const testFixed = step > 1 || (step === 1 && ph >= 2);
  const conflictFixed = step > 2 || (step === 2 && ph >= 2);
  return (
    <WindowFrame title="#1052 Add order export · merge box" className="h-full">
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--accent-hex)]/60 bg-[#0b1a14] p-4">
          <Bot className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-semibold text-white">Watch and fix · Copilot is watching</p>
            <p className="mt-1 flex flex-wrap gap-4 text-[16px] text-zinc-200">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-300" aria-hidden="true" />
                Fix failed Actions workflows
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-300" aria-hidden="true" />
                Resolve merge conflicts
              </span>
            </p>
          </div>
        </div>
        <div className="divide-y divide-white/10 rounded-2xl border border-white/12">
          {[
            { n: "build", ok: true },
            { n: "lint", ok: true },
            { n: "test", ok: step < 1 ? true : testFixed },
          ].map((c) => (
            <div key={c.n} className="flex items-center gap-3 px-4 py-2.5 text-[18px]">
              <span className={cn("inline-flex size-6 items-center justify-center rounded-full", c.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300")}>
                {c.ok ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
              </span>
              <span className="font-mono-code text-white">{c.n}</span>
              <span className="ml-auto text-zinc-300">{c.ok ? "passed" : "failed"}</span>
            </div>
          ))}
        </div>
        {step >= 1 ? (
          <Pop show className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-[17px] text-zinc-100">
            {testFixed ? "Copilot pushed: Fix timezone assertion in export test" : "Copilot is fixing the failing test in a cloud development environment…"}
          </Pop>
        ) : null}
        {step >= 2 ? (
          <Pop show className={cn("rounded-2xl border px-4 py-3 text-[17px]", conflictFixed ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100" : "border-amber-300/50 bg-amber-300/10 text-amber-100")}>
            {conflictFixed ? "Merge conflicts resolved by Copilot" : "This branch has conflicts with main in 2 files"}
          </Pop>
        ) : null}
        {step >= 3 ? (
          <Pop show className="flex items-center gap-3 rounded-2xl bg-violet-700 px-5 py-4 text-[20px] font-semibold text-white">
            <GitMerge className="size-6" aria-hidden="true" />
            All requirements met · auto-merge landed it
          </Pop>
        ) : null}
      </div>
    </WindowFrame>
  );
}

/* =================================================================== Issue artifacts */

function IssueArtifactsVisual({ step }: VisualProps) {
  // On github.com an HTML artifact opens in Source view; Preview renders it.
  const [view, setView] = useState<"preview" | "source">("source");
  return (
    <div className="flex h-full gap-4">
      <Panel title="#311 Migrate billing webhooks to v2 events" className="w-[520px] shrink-0" bodyClassName="space-y-3 p-5 text-[18px]">
        <p className="text-zinc-100">v1 webhook events are deprecated. Move consumers to v2 without dropping events.</p>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="flex items-center gap-2 text-[16px] text-zinc-300">
            <Bot className="size-4" aria-hidden="true" />
            Copilot app session
          </p>
          <p className="mt-1 text-zinc-100">{step >= 1 ? "Attached a plan to this issue." : "Working on a plan…"}</p>
        </div>
        {step >= 3 ? (
          <div className="rounded-xl border border-white/10 bg-[#0b0c0f] p-3 font-mono-code text-[16px] text-zinc-200">
            <p>
              <span className="text-[var(--accent-text)]">$</span> gh issue artifact list 311
            </p>
            <p className="mt-1 text-zinc-300">plan.md · event-flow.html · Slack thread</p>
          </div>
        ) : null}
      </Panel>
      <Panel title="Artifacts" className="min-w-0 flex-1" bodyClassName="space-y-3 p-4">
        {step === 0 ? <p className="text-[18px] text-zinc-300">No artifacts yet</p> : null}
        <Pop show={step >= 1} className="rounded-xl border border-white/12 bg-[#101115] p-3">
          <p className="flex items-center gap-2 text-[18px] font-semibold text-white">
            <FileText className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
            plan.md
            <Chip className="ml-auto text-[15px]">Plan</Chip>
          </p>
          <ol className="mt-2 list-decimal space-y-0.5 pl-6 text-[16px] text-zinc-200">
            <li>Map v1 events to v2</li>
            <li>Dual-write behind a flag</li>
            <li>Remove v1 handlers</li>
          </ol>
          {step >= 3 ? (
            <p className="mt-2 flex items-center gap-2 text-[16px] text-zinc-300">
              <History className="size-4" aria-hidden="true" />
              v3 current · v2 · v1 kept in history
            </p>
          ) : null}
        </Pop>
        <Pop show={step >= 2} className="flex items-center gap-2 rounded-xl border border-white/12 bg-[#101115] p-3 text-[17px] text-white">
          <Link className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
          Slack thread · #billing-eng
        </Pop>
        <Pop show={step >= 2} delay={0.15} className="rounded-xl border border-white/12 bg-[#101115] p-3">
          <div className="flex items-center gap-2 text-[17px] font-semibold text-white">
            event-flow.html
            <span className="ml-auto flex rounded-full border border-white/15 p-0.5 text-[15px]">
              {(["source", "preview"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn("kn-focus rounded-full px-2.5 py-0.5 capitalize", view === v ? "bg-white text-zinc-950" : "text-zinc-200")}>
                  {v}
                </button>
              ))}
            </span>
          </div>
          {view === "preview" ? (
            <div className="mt-2 flex items-center gap-2 text-[16px] text-zinc-200">
              <span className="rounded-md bg-white/10 px-2 py-1">v1 event</span>→<span className="rounded-md bg-white/10 px-2 py-1">mapper</span>→<span className="rounded-md bg-[var(--accent-hex)]/30 px-2 py-1">v2 event</span>
            </div>
          ) : (
            <p className="mt-2 font-mono-code text-[15px] text-zinc-300">&lt;svg viewBox="0 0 600 120"&gt;…&lt;/svg&gt;</p>
          )}
        </Pop>
      </Panel>
    </div>
  );
}

/* =================================================================== GitHub CLI --attach */

function CliAttachVisual({ step }: VisualProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <TerminalFrame
        title="Terminal"
        lines={[
          { kind: "cmd", text: `gh issue comment 482 --body "Repro on Safari 18" --attach './checkout.png#Disabled checkout button'` },
          { kind: "ok", text: "Uploaded checkout.png" },
          { kind: "ok", text: "Added a comment to issue #482" },
        ]}
      />
      <Pop show={step >= 1} className="min-h-0 flex-1">
        <Panel title={<span className="flex items-center gap-2"><MessageSquare className="size-5" aria-hidden="true" /> Comment on #482</span>} className="h-full" bodyClassName="flex gap-4 p-4">
          <Avatar initials="LK" hue="#047857" />
          <div className="min-w-0 flex-1">
            <p className="text-[19px] text-white">Repro on Safari 18</p>
            <figure className="mt-3 w-[420px] overflow-hidden rounded-xl border border-white/15">
              <svg viewBox="0 0 420 170" className="block w-full" role="img" aria-labelledby="attach-alt">
                <title id="attach-alt">Disabled checkout button</title>
                <rect width="420" height="170" fill="#f4f4f5" />
                <rect x="20" y="20" width="240" height="14" rx="4" fill="#d4d4d8" />
                <rect x="20" y="46" width="180" height="10" rx="4" fill="#e4e4e7" />
                <rect x="20" y="110" width="160" height="40" rx="10" fill="#a1a1aa" />
                <text x="100" y="136" textAnchor="middle" fontSize="16" fill="#f4f4f5" fontWeight="600">
                  Checkout
                </text>
              </svg>
              <figcaption className="bg-black/60 px-3 py-1.5 text-[16px] text-zinc-200">Disabled checkout button</figcaption>
            </figure>
          </div>
        </Panel>
      </Pop>
    </div>
  );
}

/* =================================================================== Moderate role */

function ModerateRoleVisual({ step }: VisualProps) {
  const roles = ["Read", "Triage", "Moderate", "Write", "Maintain", "Admin"];
  const can = ["Edit issue titles, bodies and comments", "Transfer issues", "Hide comments, lock conversations", "Create and edit labels, milestones, discussion categories"];
  const cannot = ["Push to the repository", "Merge pull requests"];
  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center gap-6">
      <ol className="flex items-end gap-3">
        {roles.map((r, i) => (
          <motion.li
            key={r}
            className={cn(
              "flex flex-1 flex-col items-center justify-end rounded-t-2xl border pb-3 text-[21px] font-semibold",
              r === "Moderate" ? "border-[var(--accent-hex)] bg-[#0b1a14] text-white" : "border-white/12 bg-[#101115] text-zinc-200",
            )}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 70 + i * 26, opacity: 1 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: EASE_OUT }}
          >
            {r === "Moderate" ? <Chip tone="accent" className="mb-2 text-[15px]">New</Chip> : null}
            {r}
          </motion.li>
        ))}
      </ol>
      <Pop show={step >= 1} className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-5">
          <p className="text-[19px] font-semibold text-emerald-200">Moderate can</p>
          <ul className="mt-2 space-y-1.5">
            {can.map((c) => (
              <li key={c} className="flex items-center gap-2 text-[18px] text-zinc-100">
                <Check className="size-5 text-emerald-300" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-400/30 bg-red-500/5 p-5">
          <p className="text-[19px] font-semibold text-red-200">Moderate can't</p>
          <ul className="mt-2 space-y-1.5">
            {cannot.map((c) => (
              <li key={c} className="flex items-center gap-2 text-[18px] text-zinc-100">
                <Lock className="size-5 text-red-300" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Pop>
    </div>
  );
}

/* =================================================================== PR limits */

function PrLimitsVisual({ step }: VisualProps) {
  const people = [
    { h: "new-account", meta: "account 3 days old · 0 merged here", pass: false, why: "Cap reached" },
    { h: "long-timer", meta: "account 4 years old · 0 merged here", pass: true, why: "Exempt: account age" },
    { h: "regular", meta: "account 8 months old · 12 merged here", pass: true, why: "Exempt: merged pull requests" },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Panel title="Interaction limits · pull request cap" bodyClassName="space-y-2 p-4 text-[18px]">
        <p className="flex items-center justify-between text-zinc-100">
          Exempt accounts at least this old
          <span className="rounded-lg border border-white/15 px-3 py-1 font-semibold text-white tabular">90 days</span>
        </p>
        <p className="flex items-center justify-between text-zinc-100">
          Exempt contributors with merged pull requests here
          <span className="rounded-lg border border-white/15 px-3 py-1 font-semibold text-white tabular">5 or more</span>
        </p>
        <p className="text-[16px] text-zinc-300">Meeting any one enabled rule is enough</p>
      </Panel>
      <ul className="min-h-0 flex-1 space-y-3">
        {people.map((p, i) => {
          const ok = step >= 1 && p.pass;
          return (
            <motion.li
              key={p.h}
              className="flex items-center gap-4 rounded-2xl border bg-[#101115] px-5 py-3.5"
              animate={{ borderColor: ok ? "rgba(52,211,153,0.6)" : "rgba(248,113,113,0.45)" }}
              transition={{ delay: i * 0.15 }}
            >
              <Avatar initials={p.h.slice(0, 2).toUpperCase()} hue={["#7c2d12", "#1e3a8a", "#065f46"][i]} />
              <div className="min-w-0 flex-1">
                <p className="text-[19px] font-semibold text-white">@{p.h}</p>
                <p className="text-[16px] text-zinc-300">{p.meta}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-[16px] font-semibold", ok ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200")}>
                {step >= 1 ? p.why : "Cap reached"}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* =================================================================== Replica */

function ReplicaVisual({ step }: VisualProps) {
  return (
    <div className="flex h-full w-full gap-4">
      <Panel title="Your design system" className="w-[300px] shrink-0" bodyClassName="space-y-3 p-4">
        <span className="block w-fit rounded-lg bg-emerald-600 px-4 py-2 text-[16px] font-semibold text-white">Primary button</span>
        <span className="block w-fit rounded-lg border border-white/25 px-4 py-2 text-[16px] text-white">Secondary</span>
        <span className="flex items-center gap-2 text-[16px] text-zinc-100">
          <span className="relative inline-flex h-6 w-10 rounded-full bg-emerald-600">
            <span className="absolute top-1 left-5 size-4 rounded-full bg-white" />
          </span>
          Toggle
        </span>
        <span className="block rounded-xl border border-white/12 p-3 text-[16px] text-zinc-200">Card with title and body</span>
      </Panel>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="self-start rounded-2xl bg-white/[0.08] px-4 py-2.5 text-[18px] text-white">
          <Sparkles className="mr-2 inline size-4 text-[var(--accent-text)]" aria-hidden="true" />
          Notification preferences page with email and push toggles
        </div>
        <WindowFrame title="Prototype" className="min-h-0 flex-1">
          <div className="space-y-3 p-4">
            {["Email: product updates", "Email: weekly digest", "Push: mentions"].map((r, i) => (
              <motion.div key={r} className="flex items-center justify-between rounded-xl border border-white/12 p-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }}>
                <span className="text-[17px] text-zinc-100">{r}</span>
                <span className={cn("relative inline-flex h-6 w-10 rounded-full", i !== 1 ? "bg-emerald-600" : "bg-white/20")}>
                  <span className={cn("absolute top-1 size-4 rounded-full bg-white", i !== 1 ? "left-5" : "left-1")} />
                </span>
              </motion.div>
            ))}
            <motion.span className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-[16px] font-semibold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              Save preferences
            </motion.span>
          </div>
        </WindowFrame>
        <Pop show={step >= 1} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-[#101115] px-4 py-3 text-[17px] text-zinc-100">
          <MessageSquare className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
          Published to your Replica Hub · 2 comments from the team
        </Pop>
      </div>
    </div>
  );
}

/* =================================================================== Router */

export default function WorkflowVisuals(props: VisualProps): ReactNode {
  const { id, part } = props;
  switch (id) {
    case "stacked-prs":
      return part === "problem" ? <StackedProblem /> : <StackedDemo {...props} />;
    case "pr-list":
      return <PrListVisual {...props} />;
    case "code-review-max":
      return <CodeReviewVisual {...props} />;
    case "agent-merge":
      return <AgentMergeVisual {...props} />;
    case "issue-artifacts":
      return <IssueArtifactsVisual {...props} />;
    case "cli-attach":
      return <CliAttachVisual {...props} />;
    case "moderate-role":
      return <ModerateRoleVisual {...props} />;
    case "pr-limits":
      return <PrLimitsVisual {...props} />;
    case "replica":
      return <ReplicaVisual {...props} />;
    default:
      return (
        <div className="flex h-full items-center justify-center gap-3 text-[22px] text-zinc-300">
          <ShieldAlert className="size-6" aria-hidden="true" />
          {id}
        </div>
      );
  }
}

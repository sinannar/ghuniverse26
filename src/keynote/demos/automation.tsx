import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Bot,
  Check,
  Clock,
  Cloud,
  CloudCog,
  FileCode,
  GitPullRequest,
  History,
  Laptop,
  Lock,
  Moon,
  Plug,
  Server,
  Shield,
  Smartphone,
  Terminal,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisualProps } from "@/scenes/scene-types";
import { EASE_OUT, TypeText, usePhase, useProgress } from "@/kit/motion";
import { Bar, Glyph, Panel, Pop } from "@/kit/bits";
import { Chip } from "@/kit/ui";
import { CodeLines, WindowFrame } from "@/kit/frames";

/* =================================================================== Copilot Automations */

function AutomationsProblem() {
  const issues = [
    { n: 488, t: "Export button times out on large carts", age: "opened 25 minutes ago" },
    { n: 487, t: "Login loop after password reset", age: "opened 3 hours ago" },
    { n: 485, t: "Typo in onboarding email", age: "opened 9 hours ago" },
    { n: 482, t: "Checkout button does nothing on Safari 18", age: "opened 1 day ago" },
  ];
  return (
    <div className="flex h-full items-start gap-14">
      <div className="w-[880px] space-y-3">
        {issues.map((i, k) => (
          <motion.div
            key={i.n}
            className="flex items-center gap-4 rounded-2xl border border-white/12 bg-[#121318] px-6 py-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + k * 0.1 }}
          >
            <Clock className="size-6 shrink-0 text-amber-300" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[23px] font-semibold text-white">
              #{i.n} {i.t}
            </span>
            <span className="shrink-0 text-[18px] text-zinc-300">{i.age}</span>
          </motion.div>
        ))}
        <p className="pt-2 text-[22px] text-zinc-300">Waiting for someone to triage</p>
      </div>
      <motion.div
        className="mt-6 w-[620px] rounded-[24px] border border-white/12 bg-[#101115] p-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="flex items-center gap-3 text-[24px] font-semibold text-white">
          <Lock className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
          A personal automation
        </p>
        <ul className="mt-4 space-y-2 text-[21px] text-zinc-200">
          <li>Only its creator can see and edit it</li>
          <li>Runs with the creator's identity</li>
          <li>Spends the creator's AI credits</li>
        </ul>
      </motion.div>
    </div>
  );
}

const RUN_LOG = [
  "Cloud agent session started",
  "Reproduced the bug in Safari 18",
  "Added the bug label",
  "Commented with findings and a screenshot",
];

function AutomationsDemo({ step }: VisualProps) {
  const runPhase = usePhase(step, [0, 700, 1500, 2300, 3100], step === 3);
  const ran = step >= 4 ? RUN_LOG.length : step === 3 ? runPhase : 0;
  const credits = step >= 4 ? 38 : step === 3 ? Math.round((runPhase / 4) * 38) : 0;
  return (
    <div className="flex h-full gap-8">
      <Panel
        title="Reproduce new bug reports"
        right={
          <span className="flex items-center gap-1 rounded-full border border-white/12 p-1 text-[16px] font-semibold">
            <span className="rounded-full px-3 py-1 text-zinc-300">Personal</span>
            <span className="rounded-full bg-white px-3 py-1 text-zinc-950">Shared</span>
          </span>
        }
        className="h-full w-[760px] shrink-0"
        bodyClassName="space-y-4 p-5"
      >
        <section>
          <p className="text-[16px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">Trigger</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone="accent">
              <Bell className="size-4" aria-hidden="true" />
              Issue opened
            </Chip>
            {["Schedule", "Manual", "REST API", "Another automation finished"].map((t) => (
              <Chip key={t} className="opacity-70">
                {t}
              </Chip>
            ))}
          </div>
        </section>
        <Pop show={step >= 1}>
          <p className="text-[16px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">Prompt</p>
          <p className="mt-2 min-h-[96px] rounded-xl border border-white/12 bg-black/30 p-3 text-[19px] leading-snug text-zinc-100">
            <TypeText
              play={step >= 1}
              text="Try to reproduce the bug in the new issue. Add the bug or needs-info label, then comment with what you found, including a screenshot."
              speed={14}
            />
          </p>
        </Pop>
        <Pop show={step >= 2} className="grid grid-cols-[1fr_250px] gap-4">
          <div>
            <p className="text-[16px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">Tools</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Read issues", "Add labels", "Comment", "Upload image attachments"].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[16px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">Credit limits</p>
            <dl className="mt-2 space-y-1 text-[18px]">
              <div className="flex justify-between">
                <dt className="text-zinc-300">Per run</dt>
                <dd className="font-semibold text-white tabular">60</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-300">Monthly</dt>
                <dd className="font-semibold text-white tabular">4,000</dd>
              </div>
            </dl>
          </div>
        </Pop>
      </Panel>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <Panel title="Runs" className="min-h-0 flex-1" bodyClassName="p-5">
          {step < 3 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-300">
              <span className="relative inline-flex size-4">
                <span className="kn-pulse-ring absolute inset-0 rounded-full bg-[var(--accent-hex)]" />
                <span className="relative size-4 rounded-full bg-[var(--accent-hex)]" />
              </span>
              <p className="text-[20px]">Waiting for a trigger</p>
            </div>
          ) : (
            <div>
              <motion.div
                className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.04] p-3"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Bell className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
                <span className="text-[19px] font-semibold text-white">#482 Checkout button does nothing on Safari 18</span>
                <span className="ml-auto text-[16px] text-zinc-300">issue opened</span>
              </motion.div>
              <ol className="mt-4 space-y-2.5">
                {RUN_LOG.map((l, i) => (
                  <Pop key={l} show={ran > i} className="flex items-center gap-3 text-[19px] text-zinc-100">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    {l}
                  </Pop>
                ))}
              </ol>
              <div className="mt-5">
                <div className="flex justify-between text-[17px] text-zinc-300">
                  <span>AI credits this run</span>
                  <span className="font-semibold text-white tabular">{credits} of 60</span>
                </div>
                <Bar value={credits / 60} className="mt-2" label="Credits used this run" />
              </div>
            </div>
          )}
        </Panel>
        <Pop show={step >= 4} className="grid grid-cols-2 gap-3">
          {[
            { i: Users, t: "Readers view it; writers edit it" },
            { i: Bot, t: "Actions are attributed to Copilot" },
            { i: Workflow, t: "Belongs to the repository" },
            { i: History, t: "Change history for tools, triggers, prompt" },
          ].map(({ i: Icon, t }) => (
            <div key={t} className="flex items-center gap-3 rounded-xl border border-white/12 bg-[#101115] px-4 py-3 text-[18px] text-zinc-100">
              <Icon className="size-5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
              {t}
            </div>
          ))}
        </Pop>
      </div>
    </div>
  );
}

/* =================================================================== Automations that learn */

const COMMENTS = [
  { t: "Possible null dereference in parseCart", ok: true },
  { t: "Timeout path never releases the lock", ok: true },
  { t: "Prefer const over let", ok: false },
  { t: "Line is longer than 100 characters", ok: false },
];

function LearningVisual({ step, setStep, preview }: VisualProps) {
  const [decision, setDecision] = useState<"none" | "accepted" | "rejected">("none");
  // Node boxes are 200 wide; x is the left edge inside a 540-wide loop area.
  const nodes = [
    { t: "Review automation", x: 170, y: 20 },
    { t: "Developer signals", x: 340, y: 210 },
    { t: "Weekly improvement run", x: 170, y: 400 },
    { t: "Your approval", x: 0, y: 210 },
  ];
  return (
    <div className="flex h-full gap-6">
      <div className="relative h-[520px] w-[540px] shrink-0">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 520" aria-hidden="true">
          <ellipse cx="270" cy="255" rx="170" ry="190" fill="none" stroke="var(--accent-hex)" strokeOpacity={0.5} strokeWidth={3} className="kn-dash-flow" />
        </svg>
        {nodes.map((n, i) => (
          <motion.div
            key={n.t}
            className="absolute flex h-[86px] w-[200px] items-center justify-center rounded-2xl border px-3 text-center text-[19px] leading-tight font-semibold text-white"
            style={{ left: n.x, top: n.y }}
            animate={{
              borderColor: step === i ? "var(--accent-hex)" : "rgba(255,255,255,0.15)",
              backgroundColor: step === i ? "rgba(34,211,238,0.16)" : "rgba(16,17,21,0.95)",
              scale: step === i ? 1.05 : 1,
            }}
          >
            {n.t}
          </motion.div>
        ))}
      </div>
      <Panel title={nodes[Math.min(step, 3)].t} className="h-[520px] min-w-0 flex-1" bodyClassName="p-5">
        {step === 0 || step === 1 ? (
          <div>
            <p className="flex items-center gap-2 text-[18px] text-zinc-300">
              <GitPullRequest className="size-5" aria-hidden="true" />
              PR #731 · 4 review comments
            </p>
            <ul className="mt-3 space-y-2.5">
              {COMMENTS.map((c) => (
                <li key={c.t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[18px] text-zinc-100">
                  {step === 1 ? (
                    <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-full", c.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-500/25 text-zinc-200")}>
                      {c.ok ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
                      <span className="sr-only">{c.ok ? "accepted" : "resolved without changes"}</span>
                    </span>
                  ) : (
                    <Bot className="size-5 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
                  )}
                  {c.t}
                </li>
              ))}
            </ul>
            {step === 1 ? <p className="mt-4 text-[18px] text-zinc-200">2 accepted · 2 resolved without changes</p> : null}
          </div>
        ) : step === 2 ? (
          <div className="space-y-3 text-[19px] leading-snug text-zinc-100">
            <p className="flex items-center gap-2 text-zinc-300">
              <Clock className="size-5" aria-hidden="true" />
              Runs weekly
            </p>
            <p>Correctness comments were accepted. Style comments were resolved without changes.</p>
            <p className="text-zinc-300">Other signals automations learn from: label changes after triage, and merged pull requests.</p>
          </div>
        ) : (
          <div>
            <p className="flex items-center gap-2 text-[18px] text-amber-100">
              <Bell className="size-5" aria-hidden="true" />
              GitHub notified you about a proposed change
            </p>
            <CodeLines
              className="mt-3 rounded-xl border border-white/10 bg-black/40 py-2 text-[17px]"
              numbers={false}
              lines={[
                { text: "Comment on style and formatting issues.", mark: "del" },
                { text: "Skip formatting: the linter enforces it.", mark: "add" },
                { text: "Prioritize null handling and error paths.", mark: "add" },
              ]}
            />
            {decision === "none" ? (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={preview}
                  onClick={() => {
                    setDecision("accepted");
                    setStep(4);
                  }}
                  className="kn-focus rounded-full bg-white px-5 py-2 text-[18px] font-semibold text-zinc-950"
                >
                  Accept change
                </button>
                <button
                  type="button"
                  disabled={preview}
                  onClick={() => setDecision("rejected")}
                  className="kn-focus rounded-full border border-white/20 px-5 py-2 text-[18px] font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className="mt-4 text-[19px] font-semibold text-white">
                {decision === "accepted" ? "Applied after your approval." : "Rejected. Nothing changed."}
              </p>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* =================================================================== Automations in VS Code */

function AutomationsVsCodeVisual({ step }: VisualProps) {
  const rows = [
    { t: "Nightly dependency digest", trig: "Schedule · daily", type: "Personal" },
    { t: "Triage issues assigned to me", trig: "Issue assigned", type: "Personal" },
    { t: "Reproduce new bug reports", trig: "Issue opened", type: "Shared" },
  ];
  const log = ["02:00 Nightly dependency digest · completed", "07:42 Triage issue #491 · completed", "08:05 Reproduce bug #492 · completed"];
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <WindowFrame title="Agents window · Automations" right={<Chip className="font-mono-code text-[16px]">chat.automations.cloud.enabled</Chip>}>
        <ul className="divide-y divide-white/10">
          {rows.map((r) => (
            <li key={r.t} className="flex items-center gap-3 px-5 py-3.5 text-[18px]">
              <Cloud className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate font-semibold text-white">{r.t}</span>
              <span className="text-zinc-300">{r.trig}</span>
              <Chip tone={r.type === "Shared" ? "accent" : "neutral"} className="text-[16px]">
                {r.type}
              </Chip>
            </li>
          ))}
        </ul>
      </WindowFrame>
      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex w-[300px] shrink-0 flex-col items-center justify-center rounded-[20px] border border-white/12 bg-[#0b0c0f]">
          <Laptop className="size-16 text-zinc-400" aria-hidden="true" />
          <p className="mt-2 flex items-center gap-2 text-[19px] text-zinc-300">
            <Moon className="size-5" aria-hidden="true" />
            Laptop asleep
          </p>
        </div>
        <Panel title="Cloud runs" className="min-w-0 flex-1" bodyClassName="p-4">
          <ul className="space-y-2">
            {log.map((l, i) => (
              <Pop key={l} show={step >= 1} delay={i * 0.25} className="flex items-center gap-2 text-[18px] text-zinc-100">
                <Check className="size-5 text-emerald-300" aria-hidden="true" />
                {l}
              </Pop>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* =================================================================== Copilot connectors */

const SERVICES = [
  { n: "Sentry", g: "Se", c: "#6d28d9" },
  { n: "Vercel", g: "Ve", c: "#3f3f46" },
  { n: "Cloudflare", g: "Cf", c: "#c2410c" },
  { n: "Slack", g: "Sl", c: "#9d174d" },
  { n: "Figma", g: "Fi", c: "#0e7490" },
  { n: "Linear", g: "Li", c: "#4338ca" },
];
const SURFACES = [
  { n: "Copilot app", i: Bot },
  { n: "Copilot CLI", i: Terminal },
  { n: "VS Code", i: FileCode },
  { n: "Copilot in the cloud", i: Cloud },
  { n: "GitHub Mobile", i: Smartphone },
];

function ConnectorsDemo({ step }: VisualProps) {
  const linked = usePhase(step, [0, 250, 500, 750, 1000, 1250, 1500], step >= 1);
  const svcLinked = (i: number) => step >= 2 || (step === 1 && linked > i);
  const packet = useProgress(step, 2200, step >= 4);
  const svcPos = (i: number) => ({ x: (i % 2) * 220, y: 40 + Math.floor(i / 2) * 190 });
  const hub = { x: 640, y: 215, w: 400, h: 190 };
  const surfPos = (i: number) => ({ x: 1250, y: 8 + i * 124 });
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1696 650" aria-hidden="true">
        {SERVICES.map((_, i) => {
          const p = svcPos(i);
          const d = `M ${p.x + 200} ${p.y + 45} C ${520} ${p.y + 45}, ${560} ${hub.y + hub.h / 2}, ${hub.x} ${hub.y + hub.h / 2}`;
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="var(--accent-hex)"
              strokeWidth={2.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: svcLinked(i) ? 1 : 0, opacity: svcLinked(i) ? 0.8 : 0 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
        {SURFACES.map((_, i) => {
          const p = surfPos(i);
          const d = `M ${hub.x + hub.w} ${hub.y + hub.h / 2} C ${1140} ${hub.y + hub.h / 2}, ${1160} ${p.y + 44}, ${p.x} ${p.y + 44}`;
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth={2.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: step >= 3 ? 1 : 0, opacity: step >= 3 ? 0.85 : 0 }}
              transition={{ duration: 0.5, delay: step >= 3 ? i * 0.08 : 0 }}
            />
          );
        })}
      </svg>
      {SERVICES.map((s, i) => {
        const p = svcPos(i);
        return (
          <motion.div
            key={s.n}
            className="absolute flex h-[90px] w-[200px] items-center gap-3 rounded-2xl border bg-[#101115] px-4"
            style={{ left: p.x, top: p.y }}
            animate={{
              borderColor: svcLinked(i) ? "var(--accent-hex)" : "rgba(255,255,255,0.12)",
              opacity: svcLinked(i) || step === 0 ? 1 : 0.6,
            }}
          >
            <Glyph text={s.g} color={s.c} />
            <span className="text-[20px] font-semibold text-white">{s.n}</span>
          </motion.div>
        );
      })}
      <motion.div
        className="absolute flex flex-col items-center justify-center rounded-[26px] border text-center"
        style={{ left: hub.x, top: hub.y, width: hub.w, height: hub.h }}
        animate={{
          borderColor: step >= 2 ? "var(--accent-hex)" : "rgba(255,255,255,0.15)",
          backgroundColor: step >= 2 ? "rgba(14,116,144,0.35)" : "rgba(16,17,21,0.95)",
          boxShadow: step >= 2 ? "0 0 80px -10px var(--accent-hex)" : "0 0 0 0 transparent",
        }}
      >
        <Plug className="size-9 text-[var(--accent-text)]" aria-hidden="true" />
        <p className="mt-2 text-[24px] font-semibold text-white">GitHub-managed MCP connection</p>
        <p className="mt-1 text-[17px] text-zinc-200">{step >= 2 ? "Configured, signed in, kept signed in" : "Not connected yet"}</p>
      </motion.div>
      <Pop show={step === 1} className="absolute top-[440px] left-[660px] w-[360px] rounded-2xl border border-white/15 bg-[#14151a] p-4">
        <p className="flex items-center gap-2 text-[19px] font-semibold text-white">
          <Lock className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
          Connect Sentry
        </p>
        <p className="mt-1 text-[16px] text-zinc-300">Sign in once. No server to find, nothing to install.</p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[16px] font-semibold text-emerald-200">
          <Check className="size-4" aria-hidden="true" />
          Connected
        </p>
      </Pop>
      {SURFACES.map((s, i) => {
        const p = surfPos(i);
        const Icon = s.i;
        const target = i === 0 && step >= 4 && packet >= 1;
        return (
          <motion.div
            key={s.n}
            className="absolute flex w-[446px] items-center gap-3 rounded-2xl border bg-[#101115] px-5"
            style={{ left: p.x, top: p.y, height: 88 }}
            animate={{ borderColor: step >= 3 ? "var(--accent-2)" : "rgba(255,255,255,0.12)", opacity: step >= 3 ? 1 : 0.55 }}
            transition={{ delay: step >= 3 ? i * 0.08 : 0 }}
          >
            <Icon className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
            <span className="text-[20px] font-semibold text-white">{s.n}</span>
            {target ? <span className="ml-auto text-[16px] text-emerald-200">Investigating the error</span> : null}
          </motion.div>
        );
      })}
      {step >= 4 && packet < 1 ? (
        <div
          className="absolute z-10 w-[330px] rounded-xl border border-[var(--accent-hex)] bg-[#06181d] px-4 py-2.5 text-[16px] text-white shadow-[0_0_40px_-6px_var(--accent-hex)]"
          style={{
            left: packet < 0.5 ? packet * 2 * 640 : 640 + (packet - 0.5) * 2 * 600,
            top: packet < 0.5 ? 130 + packet * 2 * 160 : 290 - (packet - 0.5) * 2 * 280,
          }}
        >
          <b>Sentry</b> · TypeError in checkout.ts:88 · 412 events
        </div>
      ) : null}
      {step >= 4 && packet >= 1 ? (
        <motion.div
          className="absolute top-[110px] left-[1250px] w-[446px] rounded-2xl border border-emerald-400/40 bg-[#0b1a14] p-4 text-[17px] text-emerald-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Copilot pulled the stack trace and event count into the session as context.
        </motion.div>
      ) : null}
    </div>
  );
}

function ConnectorsProblem() {
  const tools = ["VS Code", "Copilot CLI", "Copilot app", "Cloud session", "GitHub Mobile"];
  return (
    <div className="relative h-full w-full">
      {tools.map((t, i) => (
        <motion.div
          key={t}
          className="absolute w-[400px] rounded-2xl border border-white/12 bg-[#0b0c0f] p-4"
          style={{ left: i * 300, top: 30 + (i % 2) * 120, rotate: i % 2 ? 2 : -2 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.1 }}
        >
          <p className="text-[18px] font-semibold text-zinc-200">{t}</p>
          <pre className="mt-2 font-mono-code text-[16px] leading-relaxed text-zinc-300">
            {`"sentry": {\n  "url": "find the server…",\n  "auth": "••••••••"\n}`}
          </pre>
        </motion.div>
      ))}
      <p className="absolute right-0 bottom-0 text-[26px] text-zinc-300">Find a server. Configure sign-in. Repeat for every tool.</p>
    </div>
  );
}

const CONNECTOR_LIST = [
  "Airtable", "Amplitude", "Apify", "Atlassian Rovo", "Azure Data Explorer", "Bitly", "Canva", "Cloudflare", "Composio",
  "Figma", "Grafana Cloud", "LaunchDarkly", "Linear", "Lucid", "Microsoft Learn Docs", "Miro", "Neon", "Netlify", "Notion",
  "Port", "Postman", "Sentry", "Slack", "Statsig", "Vercel", "Work IQ",
];

function ConnectorsImpact() {
  return (
    <figure className="h-full rounded-[24px] border border-white/12 bg-[#0f1015]/90 p-6">
      <figcaption className="text-[22px] font-semibold text-white">The 26 launch services</figcaption>
      <ul className="mt-4 grid grid-cols-5 gap-2.5">
        {CONNECTOR_LIST.map((n, i) => (
          <motion.li
            key={n}
            className="truncate rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[16px] text-zinc-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.03 * i }}
          >
            {n}
          </motion.li>
        ))}
      </ul>
    </figure>
  );
}

/* =================================================================== Agentic Workflows */

function AgenticWorkflowsVisual({ step }: VisualProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex gap-4">
        <WindowFrame title=".github/workflows/issue-triage.md" className="w-[520px] shrink-0">
          <CodeLines
            className="py-2 text-[16px]"
            lines={[
              { text: "---" },
              { text: "on:" },
              { text: "  issues:" },
              { text: "    types: [opened]" },
              { text: "safe-outputs:" },
              { text: "  add-comment:" },
              { text: "---" },
              { text: "# Triage new issues" },
              { text: "Read the issue, suggest labels and" },
              { text: "reply with clear next steps." },
            ]}
          />
        </WindowFrame>
        <div className="flex min-w-0 flex-1 flex-col">
          <Pop show={step >= 1} className="flex items-center gap-2 text-[18px] font-semibold text-[var(--accent-text)]">
            <Terminal className="size-5" aria-hidden="true" />
            gh aw compile
          </Pop>
          <Pop show={step >= 1} className="mt-3 min-h-0 flex-1">
            <WindowFrame title="issue-triage.lock.yml" className="h-full">
              <div className="space-y-1.5 p-4 font-mono-code text-[16px] text-zinc-200">
                <p className="text-zinc-400"># Generated by gh aw compile</p>
                <p>name: Triage new issues</p>
                <p>on:</p>
                <p className="whitespace-pre">{"  issues:"}</p>
                <p className="whitespace-pre">{"    types: [opened]"}</p>
                <p className="text-zinc-400"># Standard GitHub Actions YAML</p>
              </div>
            </WindowFrame>
          </Pop>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center gap-3">
        <div className="rounded-2xl border border-white/12 bg-[#101115] px-4 py-3 text-[18px] text-white">Issue opened</div>
        <span aria-hidden="true" className="h-0.5 w-8 bg-white/30" />
        <Pop show={step >= 2} className="flex flex-1 items-center gap-4 rounded-2xl border-2 border-dashed border-[var(--accent-hex)] bg-[#06181d] px-5 py-4">
          <Shield className="size-8 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
          <div>
            <p className="text-[19px] font-semibold text-white">Agent in a sandboxed container</p>
            <p className="text-[16px] text-zinc-200">Read-only by default · behind the Agent Workflow Firewall</p>
          </div>
        </Pop>
        <span aria-hidden="true" className="h-0.5 w-8 bg-white/30" />
        <Pop show={step >= 3} className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-[18px] text-emerald-100">
          Safe output: comment posted
        </Pop>
      </div>
    </div>
  );
}

/* =================================================================== Actions lockfiles */

function LockfilesVisual({ step }: VisualProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] items-center gap-6">
      <WindowFrame title="ci.yml" className="w-[420px] shrink-0">
        <CodeLines numbers={false} className="py-3 text-[18px]" lines={[{ text: "steps:" }, { text: "  - uses: example/deploy-action@v3", mark: "focus" }]} />
      </WindowFrame>
      <div className="relative h-[260px] min-w-0 flex-1 rounded-[22px] border border-white/12 bg-[#0b0c0f] p-5">
        <p className="text-[17px] font-semibold tracking-[0.12em] text-zinc-300 uppercase">Where tag v3 points</p>
        <div className="mt-14 flex items-center gap-4">
          <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-center">
            <p className="font-mono-code text-[18px] text-white">a41c9e2</p>
            <p className="text-[16px] text-emerald-200">reviewed</p>
          </div>
          <span aria-hidden="true" className="h-0.5 w-16 bg-white/30" />
          <div className="rounded-xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-center">
            <p className="font-mono-code text-[18px] text-white">9f03b7d</p>
            <p className="text-[16px] text-red-200">tag moved here</p>
          </div>
        </div>
        <motion.span
          className="absolute top-[70px] rounded-full bg-amber-300 px-3 py-0.5 text-[16px] font-bold text-zinc-950"
          initial={{ left: 40 }}
          animate={{ left: 268 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE_OUT }}
        >
          v3
        </motion.span>
      </div>
      <Pop show={step >= 1} className="w-[460px] shrink-0">
        <WindowFrame title=".github/workflows/actions.lock">
          <div className="space-y-2 p-4 text-[18px]">
            <p className="font-mono-code text-zinc-200">example/deploy-action · ref v3</p>
            <p className="font-mono-code text-white">locked to a41c9e2</p>
            <p className="flex items-center gap-2 text-emerald-200">
              <Check className="size-5" aria-hidden="true" />
              Actions runs the locked commit
            </p>
          </div>
        </WindowFrame>
      </Pop>
    </div>
  );
}

/* =================================================================== Multi-cloud */

function MultiCloudVisual({ step }: VisualProps) {
  const jobs = Array.from({ length: 10 }, (_, i) => ["build", "test", "lint", "e2e", "docs"][i % 5] + ` #${i + 1}`);
  const spread = step >= 1;
  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div>
        <p className="text-[17px] font-semibold tracking-[0.12em] text-zinc-300 uppercase">{spread ? "Queue draining" : "Peak-hour queue"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {jobs.map((j, i) => (
            <motion.span
              key={j}
              className="rounded-lg border border-white/12 bg-white/[0.05] px-3 py-1.5 font-mono-code text-[16px] text-zinc-100"
              animate={{ opacity: spread && i < 8 ? 0.3 : 1 }}
              transition={{ delay: spread ? i * 0.08 : 0 }}
            >
              {j}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex items-center gap-3 rounded-2xl border border-white/15 bg-[#101115] px-5 py-3">
        <CloudCog className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
        <span className="text-[19px] font-semibold text-white">Actions scheduler</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
        {[
          { n: "Microsoft Azure", on: true },
          { n: "Amazon Web Services", on: spread },
        ].map((pool, k) => (
          <motion.div
            key={pool.n}
            className="rounded-[20px] border bg-[#0b0c0f] p-5"
            animate={{ opacity: pool.on ? 1 : 0.35, borderColor: pool.on ? "var(--accent-hex)" : "rgba(255,255,255,0.1)" }}
          >
            <p className="flex items-center gap-2 text-[20px] font-semibold text-white">
              <Server className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
              {pool.n}
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className={cn("h-8 rounded-md", pool.on && (k === 0 || i < 5) ? "bg-cyan-500/70" : "bg-white/10")} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-[18px] text-zinc-300">Linux 2-core and 4-core runners · same labels, same workflow syntax</p>
    </div>
  );
}

/* =================================================================== Plugin controls */

function PluginControlsVisual({ step }: VisualProps) {
  const layers = [
    { t: "Enterprise managed settings", s: "require, block, approve", strong: true },
    { t: "Repository defaults", s: ".github/copilot/settings.json" },
    { t: "Your choices", s: "optional plugins" },
  ];
  const plugins = [
    { n: "github-security@awesome-copilot", state: "Required", on: true, locked: true },
    { n: "docs-style@team-tools", state: "Repository default", on: true, locked: false },
    { n: "unvetted-tool@unknown-market", state: "Blocked", on: false, locked: true },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <ol className="space-y-2">
        {layers.map((l, i) => (
          <li key={l.t} className={cn("flex items-baseline gap-3 rounded-2xl border px-5 py-3", l.strong ? "border-[var(--accent-hex)] bg-[#06181d]" : "border-white/12 bg-[#101115]")}>
            <span className="text-[17px] font-bold text-[var(--accent-text)] tabular">{i + 1}</span>
            <span className="text-[20px] font-semibold text-white">{l.t}</span>
            <span className="ml-auto font-mono-code text-[16px] text-zinc-300">{l.s}</span>
          </li>
        ))}
      </ol>
      <Pop show={step >= 1} className="min-h-0 flex-1">
        <ul className="space-y-2.5">
          {plugins.map((p) => (
            <li key={p.n} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-[#0b0c0f] px-5 py-3">
              <span className="min-w-0 flex-1 truncate font-mono-code text-[17px] text-white">{p.n}</span>
              <Chip tone={p.state === "Blocked" ? "bad" : p.state === "Required" ? "good" : "neutral"} className="text-[16px]">
                {p.state}
              </Chip>
              <span className={cn("relative inline-flex h-7 w-12 shrink-0 rounded-full", p.on ? "bg-emerald-500/70" : "bg-white/15")}>
                <span className={cn("absolute top-1 size-5 rounded-full bg-white", p.on ? "left-6" : "left-1")} />
                <span className="sr-only">{p.on ? "On" : "Off"}</span>
              </span>
              {p.locked ? <Lock className="size-5 text-zinc-300" aria-label="Locked by policy" /> : <span className="size-5" aria-hidden="true" />}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[17px] text-zinc-300">Managed settings take precedence over repository and personal choices.</p>
      </Pop>
    </div>
  );
}

/* =================================================================== SDK */

function SdkVisual({ step }: VisualProps) {
  const langs = ["Python", "TypeScript", "Go", ".NET", "Java", "Rust"];
  return (
    <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col items-center justify-center gap-6">
      {step === 0 ? (
        <div className="text-center">
          <p className="relative h-[80px] text-[64px] leading-[80px] font-bold tracking-tight text-white">
            <motion.span className="absolute inset-0 whitespace-nowrap" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
              GitHub Copilot SDK
            </motion.span>
            <motion.span className="whitespace-nowrap text-[var(--accent-text)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
              Microsoft Copilot SDK
            </motion.span>
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {langs.map((l) => (
              <Chip key={l}>{l}</Chip>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center gap-4">
          {[
            { t: "Your agent app", s: "Python · TypeScript · Go · .NET · Java · Rust" },
            { t: "Microsoft Copilot SDK", s: "Programmable interface to the harness", hi: true },
            { t: "Copilot agent runtime", s: "Talks to the SDK over JSON-RPC" },
          ].map((b, i) => (
            <div key={b.t} className="flex items-center gap-4">
              <motion.div
                className={cn("w-[400px] rounded-[22px] border p-5", b.hi ? "border-[var(--accent-hex)] bg-[#06181d]" : "border-white/12 bg-[#101115]")}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-[24px] font-semibold text-white">{b.t}</p>
                <p className="mt-1 text-[17px] text-zinc-300">{b.s}</p>
              </motion.div>
              {i < 2 ? <span aria-hidden="true" className="h-0.5 w-10 bg-white/30" /> : null}
            </div>
          ))}
        </div>
      )}
      <p className="text-[19px] text-zinc-300">Existing package names may keep the GitHub name during the move. No changes required yet.</p>
    </div>
  );
}

/* =================================================================== Router */

export default function AutomationVisuals(props: VisualProps): ReactNode {
  const { id, part } = props;
  switch (id) {
    case "copilot-automations":
      return part === "problem" ? <AutomationsProblem /> : <AutomationsDemo {...props} />;
    case "automations-learning":
      return <LearningVisual {...props} />;
    case "automations-vscode":
      return <AutomationsVsCodeVisual {...props} />;
    case "copilot-connectors":
      if (part === "problem") return <ConnectorsProblem />;
      if (part === "impact") return <ConnectorsImpact />;
      return <ConnectorsDemo {...props} />;
    case "agentic-workflows":
      return <AgenticWorkflowsVisual {...props} />;
    case "actions-lockfiles":
      return <LockfilesVisual {...props} />;
    case "actions-multicloud":
      return <MultiCloudVisual {...props} />;
    case "plugin-controls":
      return <PluginControlsVisual {...props} />;
    case "copilot-sdk":
      return <SdkVisual {...props} />;
    default:
      return <div className="flex h-full items-center justify-center text-[22px] text-zinc-300">{id}</div>;
  }
}

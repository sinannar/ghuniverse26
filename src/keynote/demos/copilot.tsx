import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  Bot,
  Brain,
  Check,
  Cloud,
  Cpu,
  FileText,
  GitMerge,
  GitPullRequest,
  Image,
  Laptop,
  Layers,
  ChartLine,
  Lock,
  MessageSquare,
  Monitor,
  Moon,
  MousePointer2,
  Shield,
  Smartphone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisualProps } from "@/scenes/scene-types";
import { EASE_OUT, TypeText, usePhase, useProgress } from "@/kit/motion";
import { Bar, Glyph, Panel, Pop } from "@/kit/bits";
import { Chip, StatusBadge } from "@/kit/ui";
import { WindowFrame } from "@/kit/frames";

/* =================================================================== Copilot app */

function CopilotAppVisual({ step }: VisualProps) {
  const flow = [
    { icon: FileText, label: "Issue #482", sub: "Checkout fails on Safari" },
    { icon: Sparkles, label: "Plan", sub: "Agent drafts the approach" },
    { icon: Bot, label: "3 sessions", sub: "Agents implement and verify" },
    { icon: GitPullRequest, label: "PR #913", sub: "Ready for your review" },
    { icon: GitMerge, label: "Merged", sub: "Completed work" },
  ];
  const lit = usePhase(step, [0, 500, 1000, 1500, 2000, 2500], step >= 2);
  return (
    <WindowFrame title="GitHub Copilot app" className="h-full">
      <div className="flex h-full">
        <nav aria-label="App sections" className="w-[190px] shrink-0 border-r border-white/10 p-4">
          {[
            { i: Layers, l: "Projects" },
            { i: Bot, l: "Sessions" },
            { i: Sparkles, l: "Automations" },
            { i: Shield, l: "Security" },
          ].map(({ i: Icon, l }, k) => (
            <div key={l} className={cn("mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[18px]", k === 0 ? "bg-white/10 text-white" : "text-zinc-300")}>
              <Icon className="size-5" aria-hidden="true" />
              {l}
            </div>
          ))}
        </nav>
        <div className="relative min-w-0 flex-1 p-6">
          <p className="text-[18px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">From issue to merge</p>
          <ol className="mt-5 flex items-stretch gap-3">
            {flow.map((f, i) => {
              const Icon = f.icon;
              const on = step < 2 ? i === 0 : lit >= i + 1;
              return (
                <li key={f.label} className="relative flex-1">
                  <motion.div
                    className="flex h-full min-h-[150px] flex-col rounded-2xl border p-4"
                    animate={{
                      borderColor: on ? "var(--accent-hex)" : "rgba(255,255,255,0.12)",
                      backgroundColor: on ? "rgba(167,139,250,0.14)" : "rgba(255,255,255,0.03)",
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className={cn("size-7", on ? "text-[var(--accent-text)]" : "text-zinc-400")} aria-hidden="true" />
                    <span className="mt-3 text-[20px] font-semibold text-white">{f.label}</span>
                    <span className="mt-1 text-[16px] leading-snug text-zinc-300">{f.sub}</span>
                  </motion.div>
                  {i < flow.length - 1 ? (
                    <span aria-hidden="true" className="absolute top-1/2 -right-3 z-10 h-0.5 w-3 bg-white/30" />
                  ) : null}
                </li>
              );
            })}
          </ol>
          <Pop show={step >= 1} className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-4">
              <FileText className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
              <p className="mt-2 text-[19px] font-semibold text-white">Spec draft</p>
              <p className="text-[16px] text-zinc-300">Saved searches v2</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-4">
              <Image className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
              <p className="mt-2 text-[19px] font-semibold text-white">Design discussion</p>
              <p className="text-[16px] text-zinc-300">Frames from the design file</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-4">
              <ChartLine className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
              <p className="mt-2 text-[19px] font-semibold text-white">Telemetry</p>
              <svg viewBox="0 0 160 36" className="mt-1 h-8 w-full" aria-hidden="true">
                <polyline points="0,28 20,24 40,26 60,14 80,18 100,8 120,12 140,6 160,9" fill="none" stroke="var(--accent-text)" strokeWidth="3" />
              </svg>
            </div>
          </Pop>
          <Pop show={step >= 2} className="absolute right-6 bottom-6 flex items-center gap-3 rounded-full border border-white/15 bg-black/60 px-5 py-2.5">
            <UserRound className="size-5 text-white" aria-hidden="true" />
            <span className="text-[18px] text-zinc-100">You direct and approve. Agents carry each handoff.</span>
          </Pop>
        </div>
      </div>
    </WindowFrame>
  );
}

/* =================================================================== Copilot Fusion */

type Effort = "standard" | "high" | "max";
type Task = "rename" | "bugfix" | "plan";
type Pattern = "single" | "cascade" | "critique";

const TASKS: { id: Task; label: string }[] = [
  { id: "rename", label: "Rename a variable" },
  { id: "bugfix", label: "Fix a flaky test across 6 files" },
  { id: "plan", label: "Plan a service split" },
];
const EFFORTS: { id: Effort; label: string; sub: string }[] = [
  { id: "standard", label: "Standard", sub: "Everyday work" },
  { id: "high", label: "High", sub: "Substantial coding tasks" },
  { id: "max", label: "Max", sub: "Deepest reasoning" },
];

/** Illustrative routing that respects the documented rules: Standard selects one model per task,
 *  and Fusion only adds model calls when the task warrants them. */
function patternFor(task: Task, effort: Effort): Pattern {
  if (effort === "standard" || task === "rename") return "single";
  return effort === "high" ? "cascade" : "critique";
}

const PRESETS: { task: Task; effort: Effort }[] = [
  { task: "bugfix", effort: "standard" },
  { task: "bugfix", effort: "high" },
  { task: "bugfix", effort: "max" },
  { task: "rename", effort: "max" },
];

interface FNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  kind: "io" | "model" | "judge" | "agg";
}

const LAYOUTS: Record<Pattern, { nodes: FNode[]; edges: [string, string, string?][]; calls: number }> = {
  single: {
    calls: 1,
    nodes: [
      { id: "p", x: 0, y: 190, w: 210, h: 110, title: "Prompt", sub: "Your request", kind: "io" },
      { id: "m", x: 480, y: 175, w: 320, h: 140, title: "Selected model", sub: "Completes the task", kind: "model" },
      { id: "r", x: 1070, y: 190, w: 210, h: 110, title: "Response", sub: "One answer", kind: "io" },
    ],
    edges: [
      ["p", "m"],
      ["m", "r"],
    ],
  },
  cascade: {
    calls: 3,
    nodes: [
      { id: "p", x: 0, y: 200, w: 190, h: 110, title: "Prompt", sub: "Your request", kind: "io" },
      { id: "e", x: 250, y: 190, w: 240, h: 130, title: "Efficient model", sub: "Drafts a solution", kind: "model" },
      { id: "j", x: 560, y: 190, w: 220, h: 130, title: "Judge", sub: "Accept or escalate?", kind: "judge" },
      { id: "s", x: 830, y: 20, w: 240, h: 130, title: "Stronger model", sub: "Takes the escalation", kind: "model" },
      { id: "r", x: 1090, y: 200, w: 190, h: 110, title: "Response", sub: "One answer", kind: "io" },
    ],
    edges: [
      ["p", "e"],
      ["e", "j"],
      ["j", "s", "escalate"],
      ["s", "r"],
    ],
  },
  critique: {
    calls: 5,
    nodes: [
      { id: "p", x: 0, y: 200, w: 160, h: 110, title: "Prompt", sub: "Your request", kind: "io" },
      { id: "d", x: 200, y: 190, w: 210, h: 130, title: "Drafting model", sub: "Writes a draft", kind: "model" },
      { id: "c1", x: 460, y: 20, w: 200, h: 110, title: "Critic", sub: "Reviews in parallel", kind: "judge" },
      { id: "c2", x: 460, y: 200, w: 200, h: 110, title: "Critic", sub: "Reviews in parallel", kind: "judge" },
      { id: "c3", x: 460, y: 380, w: 200, h: 110, title: "Critic", sub: "Reviews in parallel", kind: "judge" },
      { id: "a", x: 710, y: 190, w: 170, h: 130, title: "Aggregate", sub: "Combine feedback", kind: "agg" },
      { id: "v", x: 920, y: 190, w: 190, h: 130, title: "Revise", sub: "Drafter revises", kind: "model" },
      { id: "r", x: 1140, y: 200, w: 140, h: 110, title: "Response", sub: "Final only", kind: "io" },
    ],
    edges: [
      ["p", "d"],
      ["d", "c1"],
      ["d", "c2"],
      ["d", "c3"],
      ["c1", "a"],
      ["c2", "a"],
      ["c3", "a"],
      ["a", "v"],
      ["v", "r"],
    ],
  },
};

const PATTERN_TEXT: Record<Pattern, { name: string; body: string }> = {
  single: { name: "Single", body: "One model completes the task. It behaves like a request to one model." },
  cascade: { name: "Cascade", body: "An efficient model drafts; a judge accepts it or escalates to a stronger model." },
  critique: { name: "Critique", body: "One model drafts while several models critique it in parallel; the feedback is combined and the draft revised." },
};

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { id: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-2 rounded-full border border-white/12 bg-black/40 p-1.5">
      <span className="px-3 text-[17px] font-semibold tracking-[0.12em] text-zinc-300 uppercase">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          disabled={disabled}
          onClick={() => onChange(o.id)}
          className={cn(
            "kn-focus rounded-full px-5 py-2 text-[19px] font-semibold transition",
            value === o.id ? "bg-white text-zinc-950" : "text-zinc-200 hover:bg-white/10",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FusionDemo({ step, preview }: VisualProps) {
  const preset = PRESETS[Math.min(step, PRESETS.length - 1)];
  const [task, setTask] = useState<Task>(preset.task);
  const [effort, setEffort] = useState<Effort>(preset.effort);
  useEffect(() => {
    setTask(preset.task);
    setEffort(preset.effort);
  }, [preset.task, preset.effort]);
  const pattern = patternFor(task, effort);
  const layout = LAYOUTS[pattern];
  const order = layout.nodes.map((n) => n.id);
  const phase = usePhase(`${pattern}-${task}-${effort}`, order.map((_, i) => i * 420));
  const byId = Object.fromEntries(layout.nodes.map((n) => [n.id, n]));
  const isOn = (id: string) => order.indexOf(id) <= phase;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented label="Task" options={TASKS} value={task} onChange={setTask} disabled={preview} />
        <Segmented label="Effort" options={EFFORTS} value={effort} onChange={setEffort} disabled={preview} />
      </div>
      <div className="relative mt-6 flex min-h-0 flex-1 gap-8">
        <div className="relative h-[510px] w-[1290px] shrink-0">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1290 510" aria-hidden="true">
            {layout.edges.map(([a, b, label]) => {
              const A = byId[a];
              const B = byId[b];
              const x1 = A.x + A.w;
              const y1 = A.y + A.h / 2;
              const x2 = B.x;
              const y2 = B.y + B.h / 2;
              const mx = (x1 + x2) / 2;
              const on = isOn(b);
              return (
                <g key={`${a}-${b}`}>
                  <path d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={3} />
                  <motion.path
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="var(--accent-hex)"
                    strokeWidth={3.5}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: on ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                  />
                  {label && on ? (
                    <text x={mx + 10} y={(y1 + y2) / 2} fill="#e9d5ff" fontSize="20" fontWeight="600">
                      {label}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {pattern === "cascade" ? (
              <path
                d={`M ${byId.j.x + byId.j.w} ${byId.j.y + 90} C ${byId.j.x + 280} ${byId.j.y + 90}, ${byId.r.x - 60} ${byId.r.y + 70}, ${byId.r.x} ${byId.r.y + 70}`}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={2.5}
                strokeDasharray="8 10"
              />
            ) : null}
            {pattern === "cascade" ? (
              <text x={byId.j.x + byId.j.w + 40} y={byId.j.y + 150} fill="#d4d4d8" fontSize="18">
                accept (not taken here)
              </text>
            ) : null}
          </svg>
          {layout.nodes.map((n) => {
            const on = isOn(n.id);
            return (
              <motion.div
                key={`${pattern}-${n.id}`}
                className={cn(
                  "absolute flex flex-col justify-center rounded-[18px] border px-4",
                  n.kind === "io" ? "border-white/20 bg-[#14151a]" : "border-white/15 bg-[#14121c]",
                )}
                style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: on ? 1 : 0.25,
                  scale: on ? 1 : 0.96,
                  boxShadow: on && n.kind !== "io" ? "0 0 40px -8px var(--accent-hex)" : "0 0 0 0 transparent",
                }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <span className="flex items-center gap-2 text-[21px] font-semibold text-white">
                  {n.kind === "model" ? <Cpu className="size-5 text-[var(--accent-text)]" aria-hidden="true" /> : null}
                  {n.kind === "judge" ? <Check className="size-5 text-[var(--accent-text)]" aria-hidden="true" /> : null}
                  {n.title}
                </span>
                <span className="mt-1 text-[16px] leading-snug text-zinc-300">{n.sub}</span>
              </motion.div>
            );
          })}
        </div>
        <Panel title="Fusion picked" className="h-[510px] min-w-0 flex-1" bodyClassName="p-6">
          <motion.p key={pattern} className="text-[54px] leading-none font-bold text-[var(--accent-text)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {PATTERN_TEXT[pattern].name}
          </motion.p>
          <p className="mt-4 text-[20px] leading-snug text-zinc-100">{PATTERN_TEXT[pattern].body}</p>
          <dl className="mt-6 space-y-3 text-[19px]">
            <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
              <dt className="text-zinc-300">Model calls</dt>
              <dd className="font-semibold text-white tabular">{layout.calls}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
              <dt className="text-zinc-300">Effort level</dt>
              <dd className="font-semibold text-white">Fusion {EFFORTS.find((e) => e.id === effort)?.label}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
              <dt className="text-zinc-300">You see</dt>
              <dd className="font-semibold text-white">The final response</dd>
            </div>
          </dl>
          {task === "rename" && effort !== "standard" ? (
            <p className="mt-5 rounded-xl border border-white/15 bg-white/[0.05] p-3 text-[18px] leading-snug text-zinc-100">
              A simple task stays Single: Fusion only adds model calls when a task warrants them.
            </p>
          ) : (
            <p className="mt-5 text-[17px] leading-snug text-zinc-300">Fusion chooses the pattern per prompt at runtime.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function FusionProblem() {
  const tasks = ["Rename a variable", "Fix a flaky test", "Plan a service split"];
  const models = ["Model A", "Model B", "Model C", "Model D", "Model E", "Model F"];
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1696 470" aria-hidden="true">
        {tasks.map((_, i) =>
          models.map((__, j) => (
            <path
              key={`${i}-${j}`}
              d={`M 420 ${90 + i * 145} C 800 ${90 + i * 145}, 900 ${29 + j * 70}, 1240 ${29 + j * 70}`}
              fill="none"
              stroke="#a78bfa"
              strokeOpacity={0.22}
              strokeWidth={2}
              strokeDasharray="6 8"
            />
          )),
        )}
      </svg>
      {tasks.map((t, i) => (
        <motion.div
          key={t}
          className="absolute left-0 flex h-[100px] w-[400px] items-center rounded-2xl border border-white/15 bg-[#121318] px-6 text-[26px] font-semibold text-white"
          style={{ top: 40 + i * 145 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
        >
          {t}
        </motion.div>
      ))}
      {models.map((m, j) => (
        <motion.div
          key={m}
          className="absolute right-[160px] flex h-[58px] w-[290px] items-center justify-between rounded-xl border border-white/12 bg-[#101116] px-5 text-[22px] text-zinc-100"
          style={{ top: j * 70 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + j * 0.06, duration: 0.6 }}
        >
          {m}
          <span className="text-[26px] font-bold text-[var(--accent-text)]">?</span>
        </motion.div>
      ))}
      <p className="absolute right-0 bottom-0 max-w-[560px] text-right text-[26px] text-zinc-300">
        Which model, for which step, at what price?
      </p>
    </div>
  );
}

function FusionImpact({ step }: VisualProps) {
  const rows = [
    { label: "Average API cost per task", fusion: 0.5, note: "about half" },
    { label: "Tokens used", fusion: 0.5, note: "about half" },
    { label: "Time per task", fusion: 0.6, note: "about 40% less" },
  ];
  const t = useProgress(step >= 1, 900, step >= 1);
  return (
    <figure className="flex h-full flex-col rounded-[24px] border border-white/12 bg-[#0f1015]/90 p-7">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-[24px] font-semibold text-white">Fusion Max vs Claude Code with Opus 5.5 Max</span>
        <span className="text-[18px] text-zinc-300">Artificial Analysis Coding Agent Index v2.0</span>
      </figcaption>
      <div className="mt-5 flex items-end gap-4">
        <span className="text-[84px] leading-none font-bold text-[var(--accent-text)]">60</span>
        <span className="pb-3 text-[22px] text-zinc-200">score, within two points of the comparison</span>
      </div>
      <ul className="mt-6 space-y-5">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between text-[19px] text-zinc-200">
              <span>{r.label}</span>
              <span className="font-semibold text-white">Fusion Max: {r.note}</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-3 rounded-full bg-white/25" style={{ width: "100%" }} aria-hidden="true" />
              <div className="h-3 rounded-full bg-[var(--accent-hex)]" style={{ width: `${r.fusion * 100 * t}%` }} aria-hidden="true" />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-4 text-[17px] text-zinc-300">Grey: comparison set to 100%. Colour: Fusion Max, as reported by GitHub.</p>
    </figure>
  );
}

/* =================================================================== Local models */

function LocalModelsVisual({ step }: VisualProps) {
  const prompts = [
    { text: "Explain this regex", to: "local" as const },
    { text: "Refactor auth across 12 files", to: "cloud" as const },
    { text: "Write a test for parseDate", to: "local" as const },
  ];
  const phase = usePhase(step, [0, 500, 1100, 1700], step >= 1);
  const lane = { local: 0, cloud: 0 };
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-[540px] w-[1000px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 540" aria-hidden="true">
          <path d="M 500 96 C 500 220, 200 230, 200 372" fill="none" stroke="var(--accent-hex)" strokeWidth={3} className="kn-dash-flow" />
          <path d="M 500 96 C 500 220, 800 230, 800 372" fill="none" stroke="#7dd3fc" strokeWidth={3} className="kn-dash-flow" />
        </svg>
        <div className="absolute top-0 left-1/2 flex w-[460px] -translate-x-1/2 items-center gap-4 rounded-2xl border border-white/15 bg-[#14121c] px-6 py-4">
          <Cloud className="size-8 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
          <div>
            <p className="text-[24px] font-semibold text-white">Fusion router</p>
            <p className="text-[18px] text-zinc-300">Routing decisions happen in the cloud</p>
          </div>
        </div>
        <div className="absolute top-[372px] left-0 w-[400px] rounded-2xl border border-[color-mix(in_oklab,var(--accent-hex)_55%,transparent)] bg-[#121318] p-5">
          <div className="flex items-center gap-3">
            <Laptop className="size-7 text-[var(--accent-text)]" aria-hidden="true" />
            <p className="text-[24px] font-semibold text-white">On your device</p>
          </div>
          <p className="mt-2 text-[19px] text-zinc-200">MAI Code 1.1 Flash</p>
          <Chip tone="accent" className="mt-3">
            Fusion Standard only
          </Chip>
        </div>
        <div className="absolute top-[372px] right-0 w-[400px] rounded-2xl border border-sky-300/40 bg-[#121318] p-5">
          <div className="flex items-center gap-3">
            <Cloud className="size-7 text-sky-300" aria-hidden="true" />
            <p className="text-[24px] font-semibold text-white">Cloud models</p>
          </div>
          <p className="mt-2 text-[19px] text-zinc-200">Copilot-provided models</p>
        </div>
        {prompts.map((p, i) => {
          const shown = phase >= i + 1;
          const k = lane[p.to]++;
          return (
            <motion.div
              key={p.text}
              className={cn(
                "absolute rounded-full border bg-[#0b0c10] px-4 py-2 text-[19px] font-medium whitespace-nowrap text-white",
                p.to === "local" ? "border-[color-mix(in_oklab,var(--accent-hex)_60%,transparent)]" : "border-sky-300/50",
              )}
              initial={false}
              animate={
                shown
                  ? { left: p.to === "local" ? 0 : 1000 - 420, top: 214 + k * 56, opacity: 1 }
                  : { left: 330, top: 104, opacity: 0 }
              }
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              {p.text}
              <span className={cn("ml-2", p.to === "local" ? "text-[var(--accent-text)]" : "text-sky-200")}>to {p.to}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* =================================================================== Copilot Projects */

type Col = "input" | "open" | "working" | "done";
const COLS: { id: Col; label: string }[] = [
  { id: "input", label: "Needs input" },
  { id: "open", label: "Open" },
  { id: "working", label: "Working" },
  { id: "done", label: "Done" },
];
const SESSIONS = [
  { id: "web", repo: "portal-web", task: "Theme switch and dark styles", pr: "#219" },
  { id: "tokens", repo: "design-tokens", task: "Dark palette tokens", pr: "#88" },
  { id: "docs", repo: "docs-site", task: "Dark mode docs and screenshots", pr: "#145" },
];

// Overview columns follow the docs: Working while sessions run, Needs input when
// Copilot asks, Open once a pull request is open for review. Done is merged work.
function colFor(id: string, step: number): Col | null {
  if (step < 2) return null;
  if (step === 2) return "working";
  if (step === 3) return id === "web" ? "input" : "working";
  return "open";
}

function ProjectsDemo({ step, setStep, preview }: VisualProps) {
  const context = [
    { g: "R", c: "#6d28d9", t: "portal-web" },
    { g: "R", c: "#6d28d9", t: "design-tokens" },
    { g: "R", c: "#6d28d9", t: "docs-site" },
    { g: "F", c: "#be185d", t: "Figma: Dark palette v3" },
    { g: "S", c: "#0f766e", t: "Slack: #portal-design" },
    { g: "N", c: "#3f3f46", t: "Notes: design review" },
  ];
  const work = useProgress(step, 2600, step === 2 || step === 3);
  const colX = (c: Col) => 600 + COLS.findIndex((x) => x.id === c) * 276;
  return (
    <div className="relative h-full w-full">
      <Panel title="Project" right={<Chip tone="accent">Public preview</Chip>} className="absolute top-0 left-0 h-[630px] w-[560px]" bodyClassName="p-6">
        <p className="text-[17px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">Goal</p>
        <p className="mt-2 min-h-[64px] text-[27px] leading-snug font-semibold text-white">
          <TypeText text="Ship dark mode across the customer portal and docs" play />
        </p>
        <p className="mt-6 text-[17px] font-semibold tracking-[0.14em] text-zinc-300 uppercase">Context</p>
        <ul className="mt-3 grid grid-cols-2 gap-2.5">
          {context.map((c, i) => (
            <li key={c.t}>
              <Pop show={step >= 1} delay={i * 0.08} className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.04] p-2">
                <Glyph text={c.g} color={c.c} className="size-9 text-[16px]" />
                <span className="truncate text-[17px] text-zinc-100">{c.t}</span>
              </Pop>
            </li>
          ))}
        </ul>
        <Pop show={step >= 1} delay={0.5} className="mt-6 rounded-xl border border-white/12 bg-white/[0.03] p-4">
          <p className="text-[17px] text-zinc-300">Models and tools</p>
          <p className="mt-1 text-[19px] font-semibold text-white">Copilot Fusion · High · Figma and Slack connectors</p>
        </Pop>
      </Panel>
      {COLS.map((c) => (
        <div key={c.id} className="absolute top-0 h-[630px] w-[262px] rounded-[18px] border border-white/10 bg-white/[0.02]" style={{ left: colX(c.id) }}>
          <p className={cn("px-4 pt-4 text-[19px] font-semibold", c.id === "input" ? "text-amber-200" : "text-zinc-200")}>{c.label}</p>
        </div>
      ))}
      {SESSIONS.map((s, i) => {
        const col = colFor(s.id, step);
        const inCol = col ? SESSIONS.filter((x, k) => colFor(x.id, step) === col && k < i).length : 0;
        const needsInput = col === "input";
        return (
          <motion.div
            key={s.id}
            className={cn(
              "absolute w-[246px] rounded-2xl border p-4",
              needsInput ? "border-amber-300/60 bg-[#211a0b]" : col === "open" ? "border-emerald-400/45 bg-[#0b1a14]" : "border-white/15 bg-[#14151a]",
            )}
            initial={false}
            animate={{
              left: col ? colX(col) + 8 : colX("working") + 8,
              top: col ? 56 + inCol * (col === "open" ? 178 : 152) : 56 + i * 152,
              opacity: col ? 1 : 0,
            }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <p className="flex items-center gap-2 text-[16px] font-semibold text-zinc-300">
              <Bot className="size-4" aria-hidden="true" />
              {s.repo}
            </p>
            <p className="mt-1.5 text-[18px] leading-snug font-semibold text-white">{s.task}</p>
            {col === "working" ? <Bar value={Math.min(1, work * (0.7 + i * 0.12))} className="mt-3" label={`${s.repo} progress`} /> : null}
            {col === "open" ? (
              <p className="mt-3 flex items-center gap-2 text-[17px] font-semibold text-emerald-200">
                <GitPullRequest className="size-4" aria-hidden="true" />
                PR {s.pr} · ready for review
              </p>
            ) : null}
            {needsInput ? (
              <div className="mt-3">
                <p className="text-[16px] leading-snug text-amber-100">Chart colours fail contrast in dark mode. Use the new contrast tokens?</p>
                <button
                  type="button"
                  disabled={preview}
                  onClick={() => setStep(4)}
                  className="kn-focus mt-3 rounded-full bg-amber-300 px-4 py-1.5 text-[16px] font-semibold text-zinc-950"
                >
                  Approve
                </button>
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}

function ProjectsProblem() {
  const items: { icon: typeof Bot; t: string; x: number; y: number; r: number }[] = [
    { icon: Layers, t: "portal-web", x: 40, y: 30, r: -4 },
    { icon: Layers, t: "design-tokens", x: 300, y: 250, r: 3 },
    { icon: Layers, t: "docs-site", x: 610, y: 40, r: -2 },
    { icon: Image, t: "Figma frames", x: 930, y: 260, r: 4 },
    { icon: MessageSquare, t: "Slack thread", x: 1210, y: 30, r: -3 },
    { icon: FileText, t: "Meeting notes", x: 1380, y: 250, r: 2 },
    { icon: Bot, t: "Session 1", x: 140, y: 340, r: 2 },
    { icon: Bot, t: "Session 2", x: 760, y: 360, r: -3 },
  ];
  return (
    <div className="relative h-full w-full">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <motion.div
            key={it.t}
            className="absolute flex items-center gap-3 rounded-2xl border border-white/15 bg-[#121318] px-5 py-4 text-[22px] font-medium text-zinc-100"
            style={{ left: it.x, top: it.y, rotate: it.r }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.6 }}
          >
            <Icon className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
            {it.t}
          </motion.div>
        );
      })}
      <p className="absolute right-0 bottom-0 text-[26px] text-zinc-300">Goals, context, sessions and results, all in different places.</p>
    </div>
  );
}

function ProjectsImpact() {
  const inputs = ["Goal", "Context", "Sessions", "Results"];
  return (
    <div className="relative h-full w-full rounded-[24px] border border-white/12 bg-[#0f1015]/90">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1028 420" aria-hidden="true">
        {inputs.map((_, i) => (
          <path key={i} d={`M 250 ${70 + i * 95} C 450 ${70 + i * 95}, 500 210, 640 210`} fill="none" stroke="var(--accent-hex)" strokeWidth={3} className="kn-dash-flow" />
        ))}
      </svg>
      {inputs.map((t, i) => (
        <div key={t} className="absolute left-8 flex h-[64px] w-[210px] items-center rounded-xl border border-white/15 bg-white/[0.05] px-5 text-[24px] font-semibold text-white" style={{ top: 38 + i * 95 }}>
          {t}
        </div>
      ))}
      <div className="absolute top-[130px] left-[640px] flex h-[160px] w-[330px] flex-col justify-center rounded-[22px] bg-[var(--accent-deep)] px-7 shadow-[0_0_80px_-10px_var(--accent-hex)]">
        <p className="text-[32px] font-bold text-white">One project</p>
        <p className="text-[20px] text-violet-100">in the GitHub Copilot app</p>
      </div>
    </div>
  );
}

/* =================================================================== Computer use */

function ComputerUseVisual({ step }: VisualProps) {
  const fields = [
    { l: "Merchant", v: "Fort Mason Café" },
    { l: "Amount", v: "18.40" },
    { l: "Category", v: "Meals" },
    { l: "Receipt", v: "receipt-1028.png" },
  ];
  const phase = usePhase(step, [0, 600, 1200, 1800, 2400, 3000], step >= 1);
  const filled = step >= 1 ? phase : 0;
  const cursor = step >= 1 ? Math.min(filled, fields.length) : 0;
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[1500px] items-stretch gap-6">
      <WindowFrame title="Expenses" className="relative h-full min-w-0 flex-1">
        <div className="grid grid-cols-2 gap-4 p-6">
          {fields.map((f, i) => (
            <div key={f.l}>
              <p className="text-[16px] text-zinc-300">{f.l}</p>
              <div className={cn("mt-1 h-12 rounded-xl border px-4 text-[19px] leading-[48px]", filled > i ? "border-[var(--accent-hex)] text-white" : "border-white/15 text-transparent")}>
                {filled > i ? f.v : "."}
              </div>
            </div>
          ))}
        </div>
        <Pop show={step >= 1 && filled >= 5} className="absolute right-6 bottom-6 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-[17px] font-semibold text-emerald-100">
          Draft saved. You review and submit.
        </Pop>
        {step >= 1 ? (
          <motion.div
            aria-hidden="true"
            className="absolute"
            initial={false}
            animate={{ left: 60 + (cursor % 2) * 330, top: 110 + Math.floor(cursor / 2) * 90 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <MousePointer2 className="size-8 fill-white text-zinc-900" />
          </motion.div>
        ) : null}
      </WindowFrame>
      <Panel title="Copilot" className="w-[420px] shrink-0" bodyClassName="p-5">
        <p className="rounded-2xl bg-white/[0.06] p-3 text-[18px] text-zinc-100">File my lunch receipt from the Universe trip as an expense.</p>
        <div className="mt-4 rounded-2xl border border-amber-300/50 bg-amber-300/10 p-4">
          <p className="flex items-center gap-2 text-[18px] font-semibold text-amber-100">
            <Lock className="size-5" aria-hidden="true" />
            Allow Copilot to control Expenses?
          </p>
          <div className="mt-3 flex gap-2">
            <span className={cn("rounded-full px-3 py-1 text-[16px] font-semibold", step >= 1 ? "bg-amber-300 text-zinc-950" : "bg-white/10 text-white")}>Allow</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[16px] font-semibold text-white">Always allow</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[16px] font-semibold text-white">Deny</span>
          </div>
        </div>
        {step >= 1 ? <p className="mt-4 text-[17px] text-zinc-200">Working in Expenses… Press Stop or Esc to take over.</p> : null}
      </Panel>
    </div>
  );
}

/* =================================================================== Session continuity */

function CloudSessionsVisual({ step }: VisualProps) {
  const surfaces = [
    { icon: Smartphone, label: "GitHub Mobile", time: "09:30" },
    { icon: Monitor, label: "VS Code", time: "11:00" },
    { icon: Cloud, label: "github.com", time: "13:00" },
  ];
  const at = Math.min(step, 2);
  const progress = [0.18, 0.55, 0.86, 1][Math.min(step, 3)];
  return (
    <div className="relative h-full w-full">
      <div className="grid grid-cols-3 gap-5">
        {surfaces.map((s, i) => {
          const Icon = s.icon;
          const on = i === at;
          return (
            <motion.div
              key={s.label}
              className="relative flex h-[300px] flex-col rounded-[22px] border p-5"
              animate={{ borderColor: on ? "var(--accent-hex)" : "rgba(255,255,255,0.12)", opacity: on ? 1 : 0.55 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[18px] font-semibold text-zinc-300 tabular">{s.time}</p>
              <div className="mt-2 flex items-center gap-3">
                <Icon className="size-8 text-[var(--accent-text)]" aria-hidden="true" />
                <p className="text-[24px] font-semibold text-white">{s.label}</p>
              </div>
              <ul className="mt-4 space-y-2 text-[16px] text-zinc-300">
                <li className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-white">Fix flaky checkout test</li>
                <li className="rounded-lg px-3 py-1.5">Add saved searches API</li>
                <li className="rounded-lg px-3 py-1.5">Docs: dark mode</li>
              </ul>
              {on ? (
                <motion.div className="absolute inset-x-4 bottom-4 rounded-xl border border-[var(--accent-hex)] bg-[#17121f] p-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-[17px] font-semibold text-white">Same session, picked up here</p>
                  <Bar value={progress} className="mt-2" label="Session progress" />
                </motion.div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-5 rounded-[22px] border border-white/12 bg-[#0f1015]/90 p-5">
        <Cloud className="size-10 shrink-0 text-[var(--accent-text)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-[22px] font-semibold text-white">Cloud sandbox keeps working between check-ins</p>
          <Bar value={progress} className="mt-3" label="Agent progress in the cloud" />
        </div>
        <Pop show={step >= 3} className="shrink-0 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-[17px] font-semibold text-emerald-100">
          Snapshot saved · resume anywhere
        </Pop>
      </div>
    </div>
  );
}

/* =================================================================== GitHub intelligence */

function IntelligenceVisual({ step }: VisualProps) {
  const clients = ["Copilot app", "Copilot CLI", "VS Code", "Code review", "Slack", "Teams", "GitHub Mobile"];
  const cx = 520;
  const cy = 286;
  const ry = 196;
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1040 620" aria-hidden="true">
        {clients.map((_, i) => {
          const a = (i / clients.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * 250;
          const y = cy + Math.sin(a) * ry;
          return (
            <motion.line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--accent-hex)"
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 0.8 : 0 }}
              transition={{ duration: 0.5, delay: step >= 1 ? i * 0.07 : 0 }}
            />
          );
        })}
      </svg>
      {clients.map((c, i) => {
        const a = (i / clients.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span
            key={c}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[#14151a] px-4 py-2 text-[17px] font-medium whitespace-nowrap text-zinc-100"
            style={{ left: cx + Math.cos(a) * 250, top: cy + Math.sin(a) * ry }}
            animate={{ opacity: step >= 1 ? 1 : 0.3 }}
          >
            {c}
          </motion.span>
        );
      })}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[22px] bg-[var(--accent-deep)] px-6 py-5 text-center shadow-[0_0_70px_-10px_var(--accent-hex)]" style={{ left: cx, top: cy }}>
        <Brain className="mx-auto size-8 text-white" aria-hidden="true" />
        <p className="mt-1 text-[20px] font-semibold text-white">Copilot Memory</p>
        <motion.p
          className="mt-2 rounded-lg bg-black/30 px-3 py-1.5 text-[16px] text-violet-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          PR descriptions start with a TL;DR
        </motion.p>
      </div>
      <div className="absolute top-0 left-0 max-w-[330px] rounded-2xl border border-white/15 bg-black/60 p-4">
        <p className="text-[16px] text-zinc-300">You, in a session</p>
        <p className="mt-1 text-[18px] text-white">“Remember to start my pull request descriptions with a TL;DR”</p>
      </div>
      <Pop show={step >= 2} className="absolute right-0 bottom-0 w-[352px] rounded-2xl border border-white/15 bg-[#121018] p-4">
        <p className="flex items-center gap-2 text-[18px] font-semibold text-white">
          <Moon className="size-5 text-[var(--accent-text)]" aria-hidden="true" />
          Copilot dreaming proposes an update
        </p>
        <p className="mt-2 font-mono-code text-[16px] text-emerald-200">.github/copilot-instructions.md</p>
        <p className="mt-1 text-[16px] text-zinc-200">Opened as a pull request for review</p>
      </Pop>
      <Pop show={step >= 2} delay={0.2} className="absolute bottom-0 left-0 w-[640px]">
        <p className="mb-2 text-[16px] text-zinc-300">Copilot CLI sessions reviewed in the preview that used memory:</p>
        <div className="flex gap-3">
          <span className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-[16px] text-zinc-100">
            <b className="block text-[30px] leading-tight text-[var(--accent-text)]">93%</b>showed better adherence to preferences
          </span>
          <span className="rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-[16px] text-zinc-100">
            <b className="block text-[30px] leading-tight text-[var(--accent-text)]">42%</b>showed more efficient workflows
          </span>
        </div>
      </Pop>
    </div>
  );
}

/* =================================================================== Image generation */

function ImageGenVisual({ step }: VisualProps) {
  const warm = step >= 1;
  return (
    <div className="mx-auto flex h-full w-full max-w-[1000px] flex-col gap-4">
      <div className="self-end rounded-2xl bg-white/[0.08] px-5 py-3 text-[19px] text-white">
        Create an empty-state illustration for search: a telescope under a starry grid
      </div>
      <div className="flex items-center gap-2 text-[16px] text-zinc-300">
        <Sparkles className="size-4 text-[var(--accent-text)]" aria-hidden="true" />
        Image tool · GPT Image 2.5 Flare
      </div>
      <figure className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15">
        <svg viewBox="0 0 600 300" className="h-full w-full" role="img" aria-labelledby="imggen-title">
          <title id="imggen-title">Generated illustration of a telescope under a starry grid</title>
          <motion.rect width="600" height="300" initial={false} animate={{ fill: warm ? "#2a1430" : "#0d1630" }} transition={{ duration: 1 }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 75} y1="0" x2={i * 75} y2="300" stroke="#ffffff" strokeOpacity="0.07" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 75} x2="600" y2={i * 75} stroke="#ffffff" strokeOpacity="0.07" />
          ))}
          {[
            [80, 50],
            [190, 90],
            [320, 40],
            [450, 80],
            [530, 30],
            [260, 120],
          ].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r={i % 2 ? 3 : 4.5} initial={false} animate={{ fill: warm ? "#fde68a" : "#e0f2fe" }} />
          ))}
          <motion.g initial={false} animate={{ rotate: warm ? -4 : 0 }} style={{ transformOrigin: "300px 230px" }}>
            <rect x="250" y="150" width="140" height="34" rx="12" transform="rotate(-24 320 167)" fill={warm ? "#a78bfa" : "#93c5fd"} />
            <line x1="300" y1="190" x2="270" y2="270" stroke="#e4e4e7" strokeWidth="6" />
            <line x1="310" y1="190" x2="340" y2="270" stroke="#e4e4e7" strokeWidth="6" />
          </motion.g>
          <motion.ellipse cx="300" cy="280" rx="200" ry="16" initial={false} animate={{ fill: warm ? "#4c1d95" : "#1e293b" }} />
        </svg>
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[16px] text-zinc-100">
          Saved to assets/empty-search.png
        </figcaption>
      </figure>
      <Pop show={step >= 1} className="self-end rounded-2xl bg-white/[0.08] px-5 py-3 text-[19px] text-white">
        Make it warmer and use our violet accent
      </Pop>
    </div>
  );
}

/* =================================================================== VS Code */

function VsCodeVisual({ step }: VisualProps) {
  const tiles: { t: string; s: string; status?: { label: string; tone: "preview" | "experimental" } }[] = [
    { t: "Agent Host", s: "Sessions keep running after the window closes" },
    { t: "Phone control", s: "code agent host --github-environment" },
    { t: "Compare models", s: "Judge or Synthesize parallel attempts", status: { label: "Preview", tone: "preview" } },
    { t: "Computer use", s: "Agents use desktop apps, with approval", status: { label: "Experimental", tone: "experimental" } },
    { t: "Customization Marketplace", s: "Discover customizations", status: { label: "Preview", tone: "preview" } },
    { t: "Connectors", s: "Slack, Notion, Microsoft Learn and more", status: { label: "Preview", tone: "preview" } },
  ];
  return (
    <div className="relative h-full w-full">
      {step === 0 ? (
        <div className="flex h-full items-center justify-center gap-10">
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0.25, scale: 0.85 }}
            transition={{ duration: 1.4, delay: 0.6 }}
            className="w-[380px]"
          >
            <WindowFrame title="checkout-service · VS Code">
              <div className="h-[220px] p-5 text-[18px] text-zinc-300">Window closing…</div>
            </WindowFrame>
          </motion.div>
          <div className="w-[420px] rounded-[22px] border border-[var(--accent-hex)] bg-[#14121c] p-6 shadow-[0_0_60px_-12px_var(--accent-hex)]">
            <p className="flex items-center gap-3 text-[24px] font-semibold text-white">
              <Bot className="size-7 text-[var(--accent-text)]" aria-hidden="true" />
              Agent Host
            </p>
            <p className="mt-3 text-[19px] text-zinc-200">Session keeps running in the background</p>
            <Bar value={0.62} className="mt-4" label="Session progress" />
          </div>
        </div>
      ) : (
        <ul className="grid h-full grid-cols-2 gap-4">
          {tiles.map((t, i) => (
            <motion.li
              key={t.t}
              className="flex flex-col rounded-[20px] border border-white/12 bg-[#101115] p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-[22px] font-semibold text-white">{t.t}</span>
                {t.status ? <StatusBadge label={t.status.label} tone={t.status.tone} size="md" /> : null}
              </span>
              <span className={cn("mt-2 text-[17px] text-zinc-300", t.s.startsWith("code ") && "font-mono-code text-[16px] text-zinc-200")}>{t.s}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* =================================================================== JetBrains */

function JetBrainsVisual({ step }: VisualProps) {
  const resources = [
    { t: "Project files", ok: true, note: "read and write" },
    { t: "Network", ok: false, note: "blocked by policy" },
    { t: "Credentials", ok: false, note: "not exposed" },
    { t: "System settings", ok: false, note: "restricted" },
  ];
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[1500px] items-center gap-8">
      <div className="w-[440px] shrink-0 rounded-[20px] border border-white/12 bg-[#0b0c0f] p-5 font-mono-code text-[19px]">
        <p className="text-zinc-300"># agent tool calls</p>
        <p className="mt-2 text-white">
          <span className="text-[var(--accent-text)]">$</span> ./gradlew test
        </p>
        <p className="mt-1 text-white">
          <span className="text-[var(--accent-text)]">$</span> curl upload.example.com
        </p>
      </div>
      <div className="relative flex h-[300px] w-[300px] shrink-0 flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[var(--accent-hex)] bg-[#14121c]">
        <Shield className="size-14 text-[var(--accent-text)]" aria-hidden="true" />
        <p className="mt-3 text-[24px] font-semibold text-white">Local sandbox</p>
        <p className="mt-1 text-[17px] text-zinc-300">Policy-defined boundary</p>
      </div>
      <ul className="min-w-0 flex-1 space-y-3">
        {resources.map((r, i) => (
          <Pop key={r.t} show={step >= 1} delay={i * 0.12} className="flex items-center gap-4 rounded-2xl border border-white/12 bg-[#101115] px-5 py-3">
            <span className={cn("inline-flex size-9 items-center justify-center rounded-full text-[18px] font-bold", r.ok ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200")}>
              {r.ok ? "✓" : "✕"}
            </span>
            <span className="text-[21px] font-semibold text-white">{r.t}</span>
            <span className="ml-auto text-[17px] text-zinc-300">{r.note}</span>
          </Pop>
        ))}
      </ul>
    </div>
  );
}

/* =================================================================== Router */

function NotFound({ id }: { id: string }) {
  return <div className="flex h-full items-center justify-center text-[22px] text-zinc-300">Visual for {id} is not available.</div>;
}

export default function CopilotVisuals(props: VisualProps): ReactNode {
  const { id, part } = props;
  switch (id) {
    case "copilot-app":
      return <CopilotAppVisual {...props} />;
    case "copilot-fusion":
      if (part === "problem") return <FusionProblem />;
      if (part === "impact") return <FusionImpact {...props} />;
      return <FusionDemo {...props} />;
    case "fusion-local-models":
      return <LocalModelsVisual {...props} />;
    case "copilot-projects":
      if (part === "problem") return <ProjectsProblem />;
      if (part === "impact") return <ProjectsImpact />;
      return <ProjectsDemo {...props} />;
    case "computer-use":
      return <ComputerUseVisual {...props} />;
    case "cloud-sessions":
      return <CloudSessionsVisual {...props} />;
    case "github-intelligence":
      return <IntelligenceVisual {...props} />;
    case "image-generation":
      return <ImageGenVisual {...props} />;
    case "vscode-releases":
      return <VsCodeVisual {...props} />;
    case "jetbrains-releases":
      return <JetBrainsVisual {...props} />;
    default:
      return <NotFound id={id} />;
  }
}

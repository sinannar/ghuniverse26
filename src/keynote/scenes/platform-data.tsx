import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpFromLine,
  BookMarked,
  Cpu,
  Database,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  Network,
  Timer,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Source } from "@/deck/types";
import { ANNOUNCEMENT_BY_ID } from "@/data/announcements";
import { SECTION_BY_ID } from "@/data/sections";
import {
  AGENTIC_FEATURES,
  AGENT_SEPTEMBER_VOLUME,
  AGENT_SHARE,
  CAPACITY_ADDED,
  DEVELOPERS,
  DEVELOPERS_NOTE,
  MERGED_IN_TWO_WEEKS,
  MULTIPLIERS,
  MULTIPLIERS_NOTE,
  RATES,
  SCALE_MILESTONES,
  SINGLE_REPO,
  TREND_SOURCES,
  YEAR_TOTALS,
} from "@/data/platform-trends";
import { DATA_BEATS, DATA_TAKEAWAY } from "@/deck/data-scenes";
import { CountUp, EASE_OUT, usePhase, useProgress } from "@/kit/motion";
import { Kicker } from "@/kit/ui";
import { DemoControls, Recede, WhyItMatters } from "@/scenes/announcement-scenes";
import type { SceneProps } from "@/scenes/scene-types";

// Section 5's full-screen data scenes. Charts are drawn from the stated figures
// in src/data/platform-trends.ts; anything illustrative says so on screen.

const ACC = SECTION_BY_ID.platform.accent;
const W = 1696; // content width on the 1920x1080 stage
const H = 680; // content height below the scene header

/* ================================================================== Frame */

function DataFrame({
  scene,
  step,
  setStep,
  onReset,
  preview,
  kicker,
  title,
  sub,
  source,
  children,
}: SceneProps & { kicker: string; title: string; sub: string; source?: Source; children: ReactNode }) {
  const a = ANNOUNCEMENT_BY_ID[scene.announcementId as string];
  const beats = DATA_BEATS[scene.id];
  const takeaway = DATA_TAKEAWAY[scene.id];
  const last = beats.length - 1;
  const banner = takeaway && step >= last;
  return (
    <div className="absolute inset-0 px-[112px] pt-[60px]">
      <header className="flex items-start justify-between gap-10">
        <div className="min-w-0">
          <Kicker>{kicker}</Kicker>
          <h2 className="mt-3 text-[72px] leading-none font-semibold tracking-[-0.035em] text-white">{title}</h2>
          <p className="mt-4 max-w-[980px] text-[24px] leading-snug text-zinc-300">{sub}</p>
        </div>
        <DemoControls steps={beats} step={step} setStep={setStep} onReset={onReset} preview={preview} takeaway={takeaway} />
      </header>
      <Recede active={banner} className="mt-7">
        <div className={cn("relative", banner && "[&_[data-footnote]]:opacity-0")} style={{ width: W, height: H }}>
          {children}
        </div>
      </Recede>
      {takeaway ? <WhyItMatters show={banner} text={a.benefit} source={source ?? a.sources[0]} preview={preview} /> : null}
    </div>
  );
}

/** Cross-fades between the beats of a data scene. */
function Beat({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn("absolute inset-0", className)}
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function Footnote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p data-footnote="" className={cn("absolute right-0 bottom-0 left-0 text-[20px] leading-snug text-zinc-400 transition-opacity duration-300", className)}>
      {children}
    </p>
  );
}

/* ================================================================== Octoverse: growth */

const PL = { left: 110, right: 1400, top: 90, bottom: 560 };
const T0 = 2019;
const T1 = 2027;
const YMAX = 250;
const xOf = (t: number) => PL.left + ((t - T0) / (T1 - T0)) * (PL.right - PL.left);
const yOf = (m: number) => PL.bottom - (m / YMAX) * (PL.bottom - PL.top);
const DRAW = 2.2; // seconds for the line to cross the chart
/** Which side of its point each value label sits on, so close points never collide. */
const LABEL_BELOW = new Set(["94M"]);

function DeveloperChart({ playKey }: { playKey: string }) {
  const uid = useId().replace(/:/g, "");
  const phase = usePhase(playKey, [0, (DRAW + 0.1) * 1000]);
  const pts = DEVELOPERS.map((d) => ({ ...d, x: xOf(d.t), y: yOf(d.millions) }));
  const lastPt = pts[pts.length - 1];
  const area = `M${pts[0].x} ${PL.bottom} ${pts.map((p) => `L${p.x} ${p.y}`).join(" ")} L${lastPt.x} ${PL.bottom} Z`;
  const years = Array.from({ length: T1 - T0 }, (_, i) => T0 + i);
  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-line`} gradientUnits="userSpaceOnUse" x1={PL.left} y1="0" x2={PL.right} y2="0">
            <stop offset="0%" stopColor={ACC.hex} />
            <stop offset="100%" stopColor={ACC.hex2} />
          </linearGradient>
          <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACC.hex} stopOpacity="0.38" />
            <stop offset="100%" stopColor={ACC.hex} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <motion.rect
              x={0}
              y={0}
              height={H}
              initial={{ width: 0 }}
              animate={{ width: W }}
              transition={{ duration: DRAW, ease: [0.45, 0, 0.3, 1] }}
            />
          </clipPath>
        </defs>
        {/* Year bands and value grid */}
        {years.map((y) => (
          <g key={y}>
            <line x1={xOf(y)} x2={xOf(y)} y1={PL.top - 20} y2={PL.bottom} stroke="rgba(255,255,255,0.06)" />
            <text x={xOf(y + 0.5)} y={PL.bottom + 46} textAnchor="middle" fontSize={22} fill="#d4d4d8">
              {y}
            </text>
          </g>
        ))}
        {[50, 100, 150, 200, 250].map((m) => (
          <g key={m}>
            <line x1={PL.left} x2={PL.right} y1={yOf(m)} y2={yOf(m)} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
            <text x={PL.left - 18} y={yOf(m) + 7} textAnchor="end" fontSize={20} fill="#a1a1aa">
              {m}M
            </text>
          </g>
        ))}
        <line x1={PL.left} x2={PL.right} y1={PL.bottom} y2={PL.bottom} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
        {/* The curve, revealed left to right */}
        <g clipPath={`url(#${uid}-clip)`}>
          <path d={area} fill={`url(#${uid}-area)`} />
          <g style={{ filter: `drop-shadow(0 0 10px ${ACC.hex}99)` }}>
            {pts.slice(0, -1).map((p, i) => {
              const q = pts[i + 1];
              const gap = q.t - p.t > 1.15;
              return (
                <line
                  key={p.display}
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  stroke={`url(#${uid}-line)`}
                  strokeWidth={gap ? 4 : 6}
                  strokeLinecap="round"
                  strokeDasharray={gap ? "4 14" : undefined}
                />
              );
            })}
          </g>
        </g>
        {pts.map((p, i) => {
          const delay = 0.1 + DRAW * ((p.x - PL.left) / (PL.right - PL.left)) * 0.92;
          const final = i === pts.length - 1;
          const below = LABEL_BELOW.has(p.display);
          return (
            <motion.g
              key={p.display}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay, ease: EASE_OUT }}
            >
              <circle cx={p.x} cy={p.y} r={final ? 20 : 14} fill={final ? ACC.hex2 : ACC.hex} fillOpacity={0.28} />
              <circle cx={p.x} cy={p.y} r={final ? 9 : 7} fill="#ffffff" />
              {final ? null : (
                <text
                  x={p.x}
                  y={below ? p.y + 46 : p.y - 26}
                  textAnchor="middle"
                  fontSize={28}
                  fontWeight={650}
                  fill="#ffffff"
                >
                  {p.display}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
      {/* The headline number lands when the line arrives */}
      <span
        aria-hidden="true"
        className={cn("absolute rounded-full border-2", phase >= 1 && "kn-pulse-ring")}
        style={{
          left: lastPt.x - 32,
          top: lastPt.y - 32,
          width: 64,
          height: 64,
          borderColor: ACC.hex2,
          opacity: phase >= 1 ? undefined : 0,
          animationIterationCount: 4,
        }}
      />
      <motion.div
        className="absolute"
        style={{ left: lastPt.x + 34, top: lastPt.y - 66 }}
        initial={{ opacity: 0, x: -16 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <p className="bg-[linear-gradient(100deg,#ffffff_10%,#bae6fd_45%,#f9a8d4_90%)] bg-clip-text text-[92px] leading-none font-bold tracking-[-0.04em] text-transparent">
          <CountUp value={lastPt.millions} suffix="M+" show={phase >= 1} duration={1.1} />
        </p>
        <p className="mt-2 text-[26px] font-semibold text-white">developers on GitHub</p>
        <p className="text-[20px] text-zinc-300">Octoverse 2026</p>
      </motion.div>
      <p className="sr-only">
        Developers on GitHub: {DEVELOPERS.map((d) => `${d.when}, ${d.display}`).join("; ")}.
      </p>
      <Footnote>{DEVELOPERS_NOTE}</Footnote>
    </div>
  );
}

const TOTAL_ICONS: LucideIcon[] = [ArrowUpFromLine, GitCommitHorizontal, GitMerge, Workflow];

/** One "then" block against `times` lit "now" blocks and a plus: "more than N times". */
function TimesGlyph({ times, delay }: { times: number; delay: number }) {
  return (
    <div className="flex items-end gap-3" aria-hidden="true">
      <div className="flex flex-col items-center gap-2">
        <span className="block size-[46px] rounded-[10px] border-2 border-dashed border-white/35" />
        <span className="text-[17px] text-zinc-400">then</span>
      </div>
      <span className="mb-9 text-[26px] text-zinc-400">→</span>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-1.5">
          {Array.from({ length: times }, (_, i) => (
            <motion.span
              key={i}
              className="block size-[46px] rounded-[10px]"
              style={{ background: `linear-gradient(135deg, ${ACC.hex}, ${ACC.hex2})`, boxShadow: `0 0 26px -6px ${ACC.hex}` }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: delay + i * 0.14, ease: EASE_OUT }}
            />
          ))}
          <motion.span
            className="mb-1 ml-1 text-[34px] leading-none font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + times * 0.14 + 0.1 }}
          >
            +
          </motion.span>
        </div>
        <span className="text-[17px] text-zinc-300">now</span>
      </div>
    </div>
  );
}

function CombinedGlyph({ delay }: { delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-2 text-[20px] font-semibold"
      aria-hidden="true"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
    >
      <span className="rounded-lg border border-white/25 px-3 py-2 text-zinc-300">2024</span>
      <span className="text-zinc-400">+</span>
      <span className="rounded-lg border border-white/25 px-3 py-2 text-zinc-300">2025</span>
      <span className="px-1 text-[30px] text-white">&lt;</span>
      <span
        className="rounded-lg px-3 py-2 text-zinc-950"
        style={{ background: `linear-gradient(135deg, ${ACC.hex}, ${ACC.hex2})`, boxShadow: `0 0 26px -6px ${ACC.hex}` }}
      >
        2026
      </span>
    </motion.div>
  );
}

function YearTotals() {
  return (
    <div className="absolute inset-0">
      <p className="text-[26px] font-semibold text-white">
        The Octoverse year <span className="font-normal text-zinc-300">· October 2025 to September 2026 · public and private repositories</span>
      </p>
      <ol className="mt-6 grid grid-cols-4 gap-6">
        {YEAR_TOTALS.map((t, i) => {
          const Icon = TOTAL_ICONS[i];
          return (
            <motion.li
              key={t.label}
              className="relative flex h-[520px] flex-col overflow-hidden rounded-[26px] border border-white/12 bg-[#0b0d12]/90 p-8"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT }}
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, ${ACC.hex}, ${ACC.hex2})` }} />
              <span
                aria-hidden="true"
                className="absolute -top-24 -right-20 size-64 rounded-full opacity-25 blur-3xl"
                style={{ background: i % 2 ? ACC.hex2 : ACC.hex }}
              />
              <Icon className="size-9 text-[var(--accent-text)]" aria-hidden="true" />
              <p className="mt-5 text-[92px] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-white">
                <CountUp value={t.value} decimals={t.decimals} suffix={t.suffix} duration={1.5} />
              </p>
              <p className="mt-3 text-[30px] leading-tight font-semibold text-[var(--accent-text)]">{t.label}</p>
              <div className="mt-auto">
                {t.times ? <TimesGlyph times={t.times} delay={0.5 + i * 0.1} /> : <CombinedGlyph delay={0.5 + i * 0.1} />}
                <p className="mt-5 min-h-[58px] text-[22px] leading-snug text-zinc-200">{t.compare}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
      <Footnote>Octoverse 2026. 2024 and 2025 figures are GitHub's recalculated values on the same definitions and window.</Footnote>
    </div>
  );
}

const RACE = { x0: 470, unit: 990 / 5.2, row: 98, top: 86, bar: 50 };

function splitDisplay(display: string): { prefix: string; value: string } {
  const at = display.lastIndexOf(" ");
  return at < 0 ? { prefix: "", value: display } : { prefix: display.slice(0, at), value: display.slice(at + 1) };
}

function MultiplierRace() {
  const oneX = RACE.x0 + RACE.unit;
  const plotH = MULTIPLIERS.length * RACE.row;
  return (
    <div className="absolute inset-0">
      <div className="flex items-baseline justify-between">
        <p className="text-[26px] font-semibold text-white">
          Monthly activity <span className="font-normal text-zinc-300">against the same work a year earlier</span>
        </p>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-l-2 border-dashed border-white/35"
        style={{ left: oneX, top: RACE.top - 14, height: plotH + 10 }}
      />
      <p className="absolute text-[19px] whitespace-nowrap text-zinc-300" style={{ left: oneX - 110, top: RACE.top + plotH + 2, width: 220, textAlign: "center" }}>
        1× = a year earlier
      </p>
      <ol>
        {MULTIPLIERS.map((m, i) => {
          const y = RACE.top + i * RACE.row;
          const width = RACE.unit * m.times;
          const { prefix, value } = splitDisplay(m.display);
          const delay = 0.35 + i * 0.16;
          return (
            <li key={m.label} className="absolute inset-x-0" style={{ top: y, height: RACE.row }}>
              <p className="absolute left-0 w-[440px] text-[30px] leading-tight font-semibold text-white" style={{ top: 2 }}>
                {m.label}
              </p>
              <p className="absolute left-0 w-[440px] text-[20px] text-zinc-400" style={{ top: 42 }}>
                {m.detail}
              </p>
              <span
                aria-hidden="true"
                className="absolute rounded-full bg-white/12"
                style={{ left: RACE.x0, top: 12, height: RACE.bar, width: RACE.unit }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute rounded-full"
                style={{
                  left: RACE.x0,
                  top: 12,
                  height: RACE.bar,
                  background: `linear-gradient(90deg, ${ACC.deep}, ${ACC.hex} 45%, ${ACC.hex2})`,
                  boxShadow: `0 0 34px -8px ${ACC.hex}`,
                }}
                initial={{ width: RACE.unit * 0.4, opacity: 0 }}
                animate={{ width, opacity: 1 }}
                transition={{ duration: 1.3, delay, ease: EASE_OUT }}
              />
              <motion.p
                className="absolute flex items-baseline gap-2 whitespace-nowrap"
                style={{ left: RACE.x0 + width + 18, top: 10 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: delay + 1.05, ease: EASE_OUT }}
              >
                {prefix ? <span className="text-[20px] text-zinc-300">{prefix}</span> : null}
                <span className="text-[40px] leading-none font-bold text-white">{value}</span>
              </motion.p>
            </li>
          );
        })}
      </ol>
      <Footnote>{MULTIPLIERS_NOTE}</Footnote>
    </div>
  );
}

function GrowthScene(props: SceneProps) {
  const { step, resetKey } = props;
  return (
    <DataFrame
      {...props}
      kicker="Octoverse 2026 · the numbers"
      title="More of everything"
      sub="Developers, code and automation on GitHub, from GitHub's own reporting."
      source={TREND_SOURCES.octoverse2026}
    >
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <Beat key="developers">
            <DeveloperChart playKey={`${resetKey}`} />
          </Beat>
        ) : step === 1 ? (
          <Beat key="totals">
            <YearTotals />
          </Beat>
        ) : (
          <Beat key="race">
            <MultiplierRace />
          </Beat>
        )}
      </AnimatePresence>
    </DataFrame>
  );
}

/* ================================================================== Octoverse: agents */

const CELL = 54;
const GAP = 8;

/** Cell k fills bottom-up, left to right, so the grid "fills" like a level. */
function cellPos(k: number) {
  const row = 9 - Math.floor(k / 10);
  const col = k % 10;
  return { left: col * (CELL + GAP), top: row * (CELL + GAP) };
}

function AgentWaffle({ playKey }: { playKey: string }) {
  const phase = usePhase(playKey, [0, 2300]);
  const lit = phase >= 1 ? AGENT_SHARE.september : AGENT_SHARE.march;
  const size = 10 * CELL + 9 * GAP;
  return (
    <div className="absolute inset-0">
      <div className="absolute top-[6px] left-0" style={{ width: size, height: size }} aria-hidden="true">
        {Array.from({ length: 100 }, (_, k) => {
          const on = k < lit;
          const wave = k < AGENT_SHARE.march ? k * 0.035 : 0.15 + (k - AGENT_SHARE.march) * 0.045;
          return (
            <div key={k} className="absolute overflow-hidden rounded-[12px]" style={{ ...cellPos(k), width: CELL, height: CELL }}>
              <span className="absolute inset-0 rounded-[12px] border border-white/10 bg-white/[0.035]" />
              <motion.span
                className="absolute inset-0 rounded-[12px]"
                style={{ background: `linear-gradient(135deg, ${ACC.hex}, ${ACC.hex2})`, boxShadow: `0 0 22px -4px ${ACC.hex}` }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }}
                transition={{ duration: 0.35, delay: on ? wave : 0, ease: EASE_OUT }}
              />
              <GitPullRequest
                className={cn("absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 transition-colors duration-500", on ? "text-white" : "text-white/20")}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute top-0 right-0 left-[700px]">
        <div className="flex items-center gap-3 text-[22px] font-semibold">
          <span className={cn("rounded-full px-5 py-2 transition-colors duration-500", phase === 0 ? "bg-white text-zinc-950" : "text-zinc-400")}>
            March 2026
          </span>
          <span className="text-zinc-500">→</span>
          <span className={cn("rounded-full px-5 py-2 transition-colors duration-500", phase >= 1 ? "bg-white text-zinc-950" : "text-zinc-400")}>
            September 2026
          </span>
        </div>
        <div className="relative mt-6 h-[170px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={phase >= 1 ? "sep" : "mar"}
              className="absolute bg-[linear-gradient(100deg,#ffffff_10%,#bae6fd_45%,#f9a8d4_90%)] bg-clip-text text-[176px] leading-none font-bold tracking-[-0.05em] text-transparent"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              {phase >= 1 ? `${AGENT_SHARE.september}%+` : `${AGENT_SHARE.march}%`}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[32px] leading-snug font-semibold text-white">of pull requests started with an agent&apos;s first draft</p>
        <motion.div
          className="mt-10"
          initial={false}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 16 }}
          transition={{ duration: 0.6, delay: phase >= 1 ? 0.9 : 0, ease: EASE_OUT }}
        >
          <p className="text-[28px] text-zinc-100">
            <span className="font-bold text-white">{AGENT_SEPTEMBER_VOLUME.value} million</span> in September alone
          </p>
          <div className="mt-4 space-y-3" aria-hidden="true">
            {[
              { l: "March", w: 1, c: "bg-white/30" },
              { l: "September", w: AGENT_SEPTEMBER_VOLUME.multiple, c: "" },
            ].map((b) => (
              <div key={b.l} className="flex items-center gap-4">
                <span className="w-[140px] text-[20px] text-zinc-300">{b.l}</span>
                <motion.span
                  className={cn("block h-[30px] rounded-full", b.c)}
                  style={b.c ? undefined : { background: `linear-gradient(90deg, ${ACC.hex}, ${ACC.hex2})`, boxShadow: `0 0 28px -6px ${ACC.hex}` }}
                  initial={false}
                  animate={{ width: phase >= 1 ? b.w * 82 : 0 }}
                  transition={{ duration: 1, delay: phase >= 1 ? 1.1 : 0, ease: EASE_OUT }}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[22px] font-semibold text-[var(--accent-text)]">about {AGENT_SEPTEMBER_VOLUME.multiple}× March&apos;s volume</p>
        </motion.div>
      </div>
      <p className="sr-only">
        Share of pull requests started with an agent: {AGENT_SHARE.march}% in March 2026, more than {AGENT_SHARE.september}% in September 2026;
        {AGENT_SEPTEMBER_VOLUME.value} million in September, about {AGENT_SEPTEMBER_VOLUME.multiple} times March&apos;s volume.
      </p>
      <Footnote>An agent-started pull request is one whose first draft came from a coding agent GitHub can detect, so these figures are a floor. Octoverse 2026.</Footnote>
    </div>
  );
}

const SLOPE = { x1: 150, x2: 640, top: 70, bottom: 440, min: 70, max: 100 };
const slopeY = (v: number) => SLOPE.bottom - ((v - SLOPE.min) / (SLOPE.max - SLOPE.min)) * (SLOPE.bottom - SLOPE.top);

function Ring({ value, label, bright, delay }: { value: number; label: string; bright: boolean; delay: number }) {
  const r = 104;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-[260px]">
        <svg viewBox="0 0 260 260" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx={130} cy={130} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={22} />
          <motion.circle
            cx={130}
            cy={130}
            r={r}
            fill="none"
            stroke={bright ? ACC.hex : "rgba(255,255,255,0.45)"}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - value / 100) }}
            transition={{ duration: 1.3, delay, ease: EASE_OUT }}
            style={bright ? { filter: `drop-shadow(0 0 12px ${ACC.hex})` } : undefined}
          />
        </svg>
        <p className={cn("absolute inset-0 flex items-center justify-center text-[64px] font-bold tabular", bright ? "text-white" : "text-zinc-300")}>
          <CountUp value={value} suffix="%" duration={1.3} />
        </p>
      </div>
      <p className={cn("mt-3 text-[24px] font-semibold", bright ? "text-[var(--accent-text)]" : "text-zinc-300")}>{label}</p>
    </div>
  );
}

function AgentsLand() {
  const a = MERGED_IN_TWO_WEEKS.agent;
  const o = MERGED_IN_TWO_WEEKS.other;
  return (
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-[800px]">
        <p className="text-[30px] font-semibold text-white">Pull requests merged within two weeks</p>
        <div className="mt-3 flex items-center gap-8 text-[20px] text-zinc-200">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full" style={{ background: ACC.hex }} aria-hidden="true" />
            Agent-involved
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-zinc-400" aria-hidden="true" />
            No detected agent involvement
          </span>
        </div>
        <svg width={800} height={500} viewBox="0 0 800 500" className="mt-2" aria-hidden="true">
          {[70, 80, 90, 100].map((v) => (
            <g key={v}>
              <line x1={SLOPE.x1 - 50} x2={SLOPE.x2 + 50} y1={slopeY(v)} y2={slopeY(v)} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
              <text x={SLOPE.x1 - 62} y={slopeY(v) + 7} textAnchor="end" fontSize={20} fill="#a1a1aa">
                {v}%
              </text>
            </g>
          ))}
          <text x={SLOPE.x1} y={SLOPE.bottom + 48} textAnchor="middle" fontSize={22} fill="#d4d4d8">
            February
          </text>
          <text x={SLOPE.x2} y={SLOPE.bottom + 48} textAnchor="middle" fontSize={22} fill="#d4d4d8">
            September
          </text>
          <motion.line
            x1={SLOPE.x1}
            y1={slopeY(o.february)}
            x2={SLOPE.x2}
            y2={slopeY(o.september)}
            stroke="#a1a1aa"
            strokeWidth={4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.line
            x1={SLOPE.x1}
            y1={slopeY(a.february)}
            x2={SLOPE.x2}
            y2={slopeY(a.september)}
            stroke={ACC.hex}
            strokeWidth={7}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.5 }}
            style={{ filter: `drop-shadow(0 0 10px ${ACC.hex})` }}
          />
          {[
            { x: SLOPE.x1, v: a.february, t: `${a.february}%`, c: ACC.text, side: "left", d: 0.5 },
            { x: SLOPE.x2, v: a.september, t: `${a.september}%`, c: ACC.text, side: "right", d: 1.5 },
            { x: SLOPE.x1, v: o.february, t: `~${o.february}%`, c: "#d4d4d8", side: "left", d: 0.3 },
            { x: SLOPE.x2, v: o.september, t: `~${o.september}%`, c: "#d4d4d8", side: "right", d: 1.3 },
          ].map((p) => (
            <motion.g key={`${p.x}-${p.t}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: p.d, duration: 0.4 }}>
              <circle cx={p.x} cy={slopeY(p.v)} r={9} fill={p.c} />
              <text
                x={p.side === "left" ? p.x - 22 : p.x + 22}
                y={slopeY(p.v) + 10}
                textAnchor={p.side === "left" ? "end" : "start"}
                fontSize={30}
                fontWeight={700}
                fill={p.c}
              >
                {p.t}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[800px]">
        <p className="text-[30px] font-semibold text-white">Copilot users working with agents</p>
        <p className="mt-3 text-[20px] text-zinc-200">Share of Copilot monthly active users who use agentic features</p>
        <div className="mt-12 flex items-start justify-center gap-16">
          <Ring value={AGENTIC_FEATURES.before} label="A year ago" bright={false} delay={0.4} />
          <Ring value={AGENTIC_FEATURES.now} label="Now" bright delay={0.8} />
        </div>
      </div>
      <p className="sr-only">
        Merged within two weeks: agent-involved pull requests {a.february}% in February and {a.september}% in September, against about {o.september}%
        without detected agent involvement. Copilot monthly active users using agentic features: {AGENTIC_FEATURES.before}% a year ago,{" "}
        {AGENTIC_FEATURES.now}% now.
      </p>
      <Footnote>Octoverse 2026. The comparison group held at about 86% in both months.</Footnote>
    </div>
  );
}

/** Milliseconds since `key` last changed while `active`; ticks a few times a second. */
function useElapsed(key: unknown, active: boolean) {
  const reduced = useReducedMotion();
  const [ms, setMs] = useState(0);
  useEffect(() => {
    setMs(0);
    if (!active) return;
    const start = performance.now();
    const id = window.setInterval(() => setMs(performance.now() - start), reduced ? 1000 : 50);
    return () => window.clearInterval(id);
  }, [key, active, reduced]);
  return ms;
}

function LiveCounters({ playKey, active }: { playKey: string; active: boolean }) {
  const ms = useElapsed(playKey, active);
  const seconds = ms / 1000;
  const prs = Math.floor((seconds * RATES.mergedPrsPerDay) / 86_400);
  const jobs = Math.floor(seconds * RATES.actionsJobsPerSecond);
  const clock = `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  const cards = [
    { icon: GitMerge, value: prs, label: "pull requests merged", rate: "about 3.5 million a day", hue: ACC.hex },
    { icon: Workflow, value: jobs, label: "GitHub Actions jobs run", rate: "1,440 every second", hue: ACC.hex2 },
  ];
  return (
    <div className="absolute inset-0">
      <div className="flex items-center gap-5">
        <p className="text-[34px] font-semibold text-white">On GitHub, since this appeared on screen</p>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-[24px] font-semibold text-white tabular">
          <Timer className="size-6 text-[var(--accent-text)]" aria-hidden="true" />
          {clock}
        </span>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              className="relative h-[400px] overflow-hidden rounded-[28px] border border-white/12 bg-[#0b0d12]/90 p-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_OUT }}
            >
              <span aria-hidden="true" className="absolute -top-28 -left-20 size-72 rounded-full opacity-30 blur-3xl" style={{ background: c.hue }} />
              <Icon className="relative size-11" style={{ color: c.hue }} aria-hidden="true" />
              <p className="relative mt-6 text-[120px] leading-none font-bold tracking-[-0.04em] text-white tabular" aria-hidden="true">
                {c.value.toLocaleString("en-US")}
              </p>
              <p className="relative mt-4 text-[32px] font-semibold text-white">{c.label}</p>
              <p className="relative mt-1 text-[24px] text-zinc-300">at {c.rate}</p>
              <span
                aria-hidden="true"
                className="kn-shimmer absolute inset-x-0 bottom-0 h-2"
                style={{ backgroundImage: `linear-gradient(90deg, transparent, ${c.hue}, transparent)` }}
              />
            </motion.div>
          );
        })}
      </div>
      <p className="sr-only">
        At the Octoverse 2026 averages, GitHub merges about 3.5 million pull requests a day and runs 1,440 GitHub Actions jobs every second.
      </p>
      <Footnote>An illustration counted at the Octoverse 2026 averages, not live data.</Footnote>
    </div>
  );
}

function AgentsScene(props: SceneProps) {
  const { step, resetKey } = props;
  const view = Math.min(step, 2);
  return (
    <DataFrame
      {...props}
      kicker="Octoverse 2026 · agents"
      title="Agents start the work"
      sub="As of September, developers start more than 40% of pull requests with an agent. In March it was 17%."
      source={TREND_SOURCES.octoverse2026}
    >
      <AnimatePresence mode="wait" initial={false}>
        {view === 0 ? (
          <Beat key="share">
            <AgentWaffle playKey={`${resetKey}`} />
          </Beat>
        ) : view === 1 ? (
          <Beat key="land">
            <AgentsLand />
          </Beat>
        ) : (
          <Beat key="live">
            <LiveCounters playKey={`${resetKey}`} active={!props.preview} />
          </Beat>
        )}
      </AnimatePresence>
    </DataFrame>
  );
}

/* ================================================================== Infrastructure: capacity */

function CoresVisual({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 480 280" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={`${uid}-dots`} width={12} height={12} patternUnits="userSpaceOnUse">
          <circle cx={6} cy={6} r={2.6} fill={ACC.hex} />
        </pattern>
        <clipPath id={`${uid}-sweep`}>
          <motion.rect x={0} y={0} height={280} initial={{ width: 0 }} animate={{ width: 480 }} transition={{ duration: 1.6, ease: [0.45, 0, 0.3, 1] }} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={480} height={280} rx={14} fill="rgba(255,255,255,0.03)" />
      <rect x={0} y={0} width={480} height={280} fill={`url(#${uid}-dots)`} opacity={0.14} />
      <g clipPath={`url(#${uid}-sweep)`} style={{ filter: `drop-shadow(0 0 6px ${ACC.hex})` }}>
        <rect x={0} y={0} width={480} height={280} fill={`url(#${uid}-dots)`} />
      </g>
    </svg>
  );
}

function StorageVisual() {
  const slabs = 13;
  return (
    <div className="flex h-full w-full flex-col-reverse justify-start gap-[7px] px-6" aria-hidden="true">
      {Array.from({ length: slabs }, (_, i) => (
        <motion.div
          key={i}
          className="relative h-[14px] w-full rounded-[6px]"
          style={{ background: `linear-gradient(90deg, ${ACC.deep}, ${ACC.hex} 70%, ${ACC.hex2})`, boxShadow: `0 0 16px -6px ${ACC.hex}` }}
          initial={{ opacity: 0, y: 18, scaleX: 0.85 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: EASE_OUT }}
        >
          <span className="absolute top-1/2 right-3 size-[6px] -translate-y-1/2 rounded-full bg-white" />
        </motion.div>
      ))}
    </div>
  );
}

const LANES = [0.75, 1.05, 0.6, 0.9, 0.7, 1.2, 0.8, 0.65, 1.0, 0.85];

function NetworkVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[17px] px-3" aria-hidden="true">
      {LANES.map((speed, i) => {
        const hue = i % 3 === 1 ? ACC.hex2 : ACC.hex;
        return (
          <motion.div
            key={i}
            className="relative h-[6px] overflow-hidden rounded-full bg-white/[0.07]"
            style={{ boxShadow: `0 0 14px -2px ${hue}66` }}
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: EASE_OUT }}
          >
            <span
              className="kn-lane absolute inset-y-0 -left-[26px] w-[calc(100%+52px)]"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${hue} 0 13px, transparent 13px 26px)`,
                animationDuration: `${speed}s`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function CapacityTrio() {
  const uid = useId().replace(/:/g, "");
  const visuals = [<CoresVisual key="c" uid={uid} />, <StorageVisual key="s" />, <NetworkVisual key="n" />];
  const icons: LucideIcon[] = [Cpu, Database, Network];
  return (
    <div className="absolute inset-0">
      <p className="text-[26px] font-semibold text-white">
        Added so far this year <span className="font-normal text-zinc-300">· Universe 2026 keynote</span>
      </p>
      <ol className="mt-6 grid grid-cols-3 gap-6">
        {CAPACITY_ADDED.map((c, i) => {
          const Icon = icons[i];
          return (
            <motion.li
              key={c.label}
              className="relative flex h-[540px] flex-col overflow-hidden rounded-[26px] border border-white/12 bg-[#0b0d12]/90 p-8"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_OUT }}
            >
              <span aria-hidden="true" className="absolute -top-24 -right-16 size-64 rounded-full opacity-25 blur-3xl" style={{ background: i === 1 ? ACC.hex2 : ACC.hex }} />
              <Icon className="relative size-9 text-[var(--accent-text)]" aria-hidden="true" />
              <div className="relative mt-4 h-[250px]">{visuals[i]}</div>
              <p className="relative mt-auto text-[100px] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-white">
                <CountUp value={c.value} suffix={c.suffix} duration={1.4} />
              </p>
              <p className="relative mt-2 text-[30px] font-semibold text-[var(--accent-text)]">{c.label}</p>
            </motion.li>
          );
        })}
      </ol>
      <Footnote>From the Universe 2026 keynote. These are additions in 2026 so far, not GitHub&apos;s total capacity.</Footnote>
    </div>
  );
}

const RINGS = [
  { k: 1, label: "Today", sub: "1×", color: "#ffffff" },
  { k: 10, label: "10×", sub: "October 2025 plan", color: ACC.hex },
  { k: 30, label: "30×", sub: "February 2026 design target", color: ACC.hex2 },
];

function ScaleTargets() {
  const base = 44; // radius of 1x; area grows with scale, so radius grows with its square root
  const cx = 330;
  const cy = 320;
  return (
    <div className="absolute inset-0">
      <svg width={700} height={640} viewBox="0 0 700 640" className="absolute top-0 left-0" aria-hidden="true">
        {[...RINGS].reverse().map((r, i) => {
          const radius = base * Math.sqrt(r.k);
          const delay = 0.2 + (RINGS.length - 1 - i) * 0.45;
          return (
            <motion.g
              key={r.k}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay, ease: EASE_OUT }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={r.color}
                fillOpacity={r.k === 1 ? 0.85 : 0.07}
                stroke={r.color}
                strokeWidth={r.k === 1 ? 0 : 3}
                strokeDasharray={r.k === 30 ? "10 10" : undefined}
                style={r.k === 1 ? { filter: "drop-shadow(0 0 18px rgba(255,255,255,0.8))" } : undefined}
              />
              {r.k === 1 ? (
                <text x={cx} y={cy + 9} textAnchor="middle" fontSize={26} fontWeight={700} fill="#09090b">
                  1×
                </text>
              ) : (
                <>
                  <text x={cx} y={cy - radius + 44} textAnchor="middle" fontSize={40} fontWeight={700} fill={r.color}>
                    {r.label}
                  </text>
                  <text x={cx} y={cy - radius + 74} textAnchor="middle" fontSize={20} fill="#e4e4e7">
                    {r.sub}
                  </text>
                </>
              )}
            </motion.g>
          );
        })}
        <text x={cx} y={cy + base + 34} textAnchor="middle" fontSize={20} fill="#e4e4e7">
          today&apos;s scale
        </text>
      </svg>
      <ol className="absolute top-[10px] right-0 w-[900px]">
        {SCALE_MILESTONES.map((m, i) => (
          <motion.li
            key={m.when}
            className="relative pb-9 pl-12"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.5 + i * 0.35, ease: EASE_OUT }}
          >
            {i < SCALE_MILESTONES.length - 1 ? (
              <span aria-hidden="true" className="absolute top-6 bottom-0 left-[9px] w-0.5 bg-white/15" />
            ) : null}
            <span
              aria-hidden="true"
              className="absolute top-[8px] left-0 size-5 rounded-full"
              style={{ background: i === SCALE_MILESTONES.length - 1 ? "transparent" : ACC.hex, border: `3px solid ${ACC.hex}`, boxShadow: `0 0 18px ${ACC.hex}` }}
            />
            <p className="text-[20px] font-semibold tracking-[0.16em] text-[var(--accent-text)] uppercase">{m.when}</p>
            <p className="mt-1 text-[30px] leading-snug font-semibold text-white">{m.text}</p>
          </motion.li>
        ))}
      </ol>
      <p className="sr-only">Capacity targets: 10 times today&apos;s scale planned in October 2025, then a design target of 30 times in February 2026.</p>
      <Footnote>10× and 30× are GitHub&apos;s planning targets, not achieved scale (GitHub CTO, April 28, 2026). Azure figures: GitHub Engineering, October 21, 2026.</Footnote>
    </div>
  );
}

function CapacityScene(props: SceneProps) {
  const { step } = props;
  return (
    <DataFrame
      {...props}
      kicker="Infrastructure · scaling GitHub"
      title="Capacity for agent scale"
      sub="Agents are changing the volume and shape of software development, and capacity alone won't keep up."
      source={TREND_SOURCES.availability}
    >
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <Beat key="added">
            <CapacityTrio />
          </Beat>
        ) : (
          <Beat key="targets">
            <ScaleTargets />
          </Beat>
        )}
      </AnimatePresence>
    </DataFrame>
  );
}

/* ================================================================== Infrastructure: one repository */

const SW = 1040; // swarm canvas size on the stage
const SH = 680;
const DISC_IN = 96;
const DISC_OUT = 318;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DISC = Math.ceil(DISC_OUT * 2 + 8);
const SPIN_SECONDS = 90; // one turn of the agent disc (CSS), matched by the pushes

/** 5,000 agents on a sunflower disc around one repository; pushes stream to the centre. Deterministic. */
function Swarm({ rate, animate }: { rate: number; animate: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const discRef = useRef<HTMLCanvasElement>(null);
  const rateRef = useRef(rate);
  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const disc = discRef.current;
    if (!disc) return;
    const dctx = disc.getContext("2d");
    if (!dctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = Math.min(2, Math.max(0.5, (rect.width / SW) * dpr));
    canvas.width = Math.round(SW * scale);
    canvas.height = Math.round(SH * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    disc.width = Math.round(DISC * scale);
    disc.height = Math.round(DISC * scale);
    dctx.setTransform(scale, 0, 0, scale, 0, 0);

    const cx = SW / 2;
    const cy = SH / 2;
    const n = SINGLE_REPO.agents;
    const rand = mulberry32(5000);
    const angles = new Float32Array(n);
    const radii = new Float32Array(n);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const r = DISC_IN + (DISC_OUT - DISC_IN) * Math.sqrt((i + 0.5) / n);
      const th = i * golden;
      angles[i] = th;
      radii[i] = r;
      const pick = rand();
      dctx.fillStyle = pick < 0.6 ? `${ACC.hex}a8` : pick < 0.8 ? `${ACC.hex2}98` : "rgba(255,255,255,0.6)";
      dctx.fillRect(DISC / 2 + Math.cos(th) * r - 1.1, DISC / 2 + Math.sin(th) * r - 1.1, 2.2, 2.2);
    }

    type P = { i: number; born: number; life: number };
    const parts: P[] = [];
    let carry = 0;
    let last = performance.now();
    const t0 = last;
    let raf = 0;

    const draw = (now: number, dt: number, spin: number) => {
      const r = rateRef.current / SINGLE_REPO.pushesPerSecond;
      ctx.clearRect(0, 0, SW, SH);
      // pushes in flight, each a short streak of small fills heading for the repository
      carry += dt * (60 + 420 * r);
      while (carry >= 1) {
        carry -= 1;
        parts.push({ i: Math.floor(rand() * n), born: now, life: 520 + rand() * 380 });
      }
      for (let k = parts.length - 1; k >= 0; k--) {
        const p = parts[k];
        const t = (now - p.born) / p.life;
        if (t >= 1) {
          parts.splice(k, 1);
          continue;
        }
        const th = angles[p.i] + spin;
        const r0 = radii[p.i];
        const cos = Math.cos(th);
        const sin = Math.sin(th);
        for (let seg = 0; seg < 8; seg++) {
          const u = Math.max(0, t - seg * 0.022);
          const rr = r0 * (1 - u * u);
          const size = seg === 0 ? 3.2 : 2.4;
          ctx.fillStyle = seg === 0 ? `rgba(255,255,255,${1 - t * 0.3})` : `rgba(186,230,253,${(0.85 - seg * 0.1) * (1 - t * 0.35)})`;
          ctx.fillRect(cx + cos * rr - size / 2, cy + sin * rr - size / 2, size, size);
        }
      }
    };

    if (!animate) {
      // One still frame: a scatter of pushes mid-flight.
      for (let k = 0; k < 140; k++) parts.push({ i: Math.floor(rand() * n), born: -rand() * 800, life: 900 });
      draw(0, 0, 0);
      return;
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt, (((now - t0) / 1000) * 2 * Math.PI) / SPIN_SECONDS);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animate]);

  const glow = rate / SINGLE_REPO.pushesPerSecond;
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          opacity: 0.45 + 0.55 * glow,
          background: `radial-gradient(circle at 50% 50%, rgba(56,189,248,0.32) 0%, rgba(56,189,248,0.07) 34%, rgba(56,189,248,0) 56%)`,
        }}
      />
      <canvas
        ref={discRef}
        aria-hidden="true"
        className={cn("absolute block", animate && "kn-swarm-spin")}
        style={{ left: SW / 2 - DISC / 2, top: SH / 2 - DISC / 2, width: DISC, height: DISC, animationDuration: `${SPIN_SECONDS}s` }}
      />
      <canvas
        ref={ref}
        aria-hidden="true"
        className="absolute inset-0 block"
        style={{ width: SW, height: SH }}
      />
    </>
  );
}

function RepoScene(props: SceneProps) {
  const { step, resetKey, preview } = props;
  const reduced = useReducedMotion();
  const live = !preview && !reduced;
  const t = useProgress(`${resetKey}`, 2800, live);
  const eased = live ? 1 - Math.pow(1 - t, 3) : 1;
  const rate = Math.round(SINGLE_REPO.pushesPerSecond * eased);
  const view = Math.min(step, 1);
  return (
    <DataFrame
      {...props}
      kicker="Infrastructure · new Git storage architecture"
      title="5,000 agents, one repo"
      sub="Built so thousands of agents can push to a single repository at once, with reads that scale on demand."
      source={TREND_SOURCES.gitStorage}
    >
      <div className="absolute top-0 right-[-40px]" style={{ width: SW, height: SH }}>
        <Swarm key={resetKey} rate={rate} animate={live} />
        <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: SW / 2, top: SH / 2 }}>
          <span
            className="absolute rounded-full"
            style={{
              left: -78,
              top: -78,
              width: 156,
              height: 156,
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(125,211,252,0.75) 32%, rgba(56,189,248,0) 70%)",
            }}
          />
          {live ? <span className="kn-pulse-ring absolute rounded-full border-2" style={{ left: -50, top: -50, width: 100, height: 100, borderColor: ACC.text }} /> : null}
          <span
            className="absolute flex items-center justify-center rounded-full border-[3px] border-white bg-[#0b0d12]"
            style={{ left: -36, top: -36, width: 72, height: 72 }}
          >
            <BookMarked className="size-8 text-white" />
          </span>
          <span
            className="absolute rounded-full bg-[#050608]/85 px-4 py-1.5 text-[20px] font-semibold whitespace-nowrap text-white"
            style={{ left: 0, top: 50, transform: "translateX(-50%)" }}
          >
            one repository
          </span>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {view === 0 ? (
          <Beat key="swarm" className="right-auto w-[700px]">
            <p className="text-[22px] font-semibold tracking-[0.16em] text-[var(--accent-text)] uppercase">Internal testing</p>
            <p className="mt-6 text-[120px] leading-none font-bold tracking-[-0.045em] text-white">
              <CountUp value={SINGLE_REPO.agents} duration={1.2} />
            </p>
            <p className="mt-2 text-[30px] font-semibold text-zinc-200">concurrent agents on one repository</p>
            <p className="mt-12 bg-[linear-gradient(100deg,#ffffff_10%,#bae6fd_45%,#f9a8d4_90%)] bg-clip-text text-[120px] leading-none font-bold tracking-[-0.045em] text-transparent tabular" aria-hidden="true">
              {rate.toLocaleString("en-US")}
            </p>
            <p className="mt-2 text-[30px] font-semibold text-zinc-200">pushes a second</p>
            <p className="mt-6 max-w-[620px] text-[22px] leading-snug text-zinc-300">All while serving read traffic with consistently low latency.</p>
            <p className="sr-only">
              In internal testing, the new Git storage architecture supported {SINGLE_REPO.agents.toLocaleString("en-US")} concurrent agents sending{" "}
              {SINGLE_REPO.pushesPerSecond.toLocaleString("en-US")} pushes per second to one repository.
            </p>
          </Beat>
        ) : (
          <Beat key="jump" className="right-auto w-[720px]">
            <div className="space-y-6">
              <div>
                <p className="text-[20px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">Busiest repositories today</p>
                <p className="mt-1 text-[38px] leading-tight font-semibold text-white">At most dozens of writes a second</p>
              </div>
              <div>
                <p className="text-[20px] font-semibold tracking-[0.14em] text-[var(--accent-text)] uppercase">New architecture, internal testing</p>
                <p className="mt-1 text-[38px] leading-tight font-semibold text-[var(--accent-text)]">7,200 pushes a second</p>
              </div>
            </div>
            <motion.p
              className="mt-8 bg-[linear-gradient(100deg,#ffffff_10%,#bae6fd_45%,#f9a8d4_90%)] bg-clip-text text-[180px] leading-[0.95] font-bold tracking-[-0.05em] text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}
              style={{ transformOrigin: "0% 50%" }}
            >
              ~{SINGLE_REPO.keynoteMultiple}×
            </motion.p>
            <p className="mt-1 max-w-[680px] text-[24px] leading-snug text-zinc-200">
              single-repository write throughput, as GitHub presented it in the keynote
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-[20px] font-semibold text-white">
              <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2">Designed for at least two orders of magnitude more scale</span>
              <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2">Limited private preview now</span>
              <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2">Broader rollout early next year</span>
            </div>
          </Beat>
        )}
      </AnimatePresence>
    </DataFrame>
  );
}

/* ================================================================== Router */

export default function PlatformDataScene(props: SceneProps) {
  switch (props.scene.kind) {
    case "data-growth":
      return <GrowthScene {...props} />;
    case "data-agents":
      return <AgentsScene {...props} />;
    case "data-capacity":
      return <CapacityScene {...props} />;
    case "data-repo":
      return <RepoScene {...props} />;
    default:
      return null;
  }
}

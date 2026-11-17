import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Announcement, Source } from "@/deck/types";
import { ANNOUNCEMENT_BY_ID, announcementsIn } from "@/data/announcements";
import { SECTION_BY_ID } from "@/data/sections";
import { CountUp, EASE_OUT, Reveal } from "@/kit/motion";
import { Kicker, StatusBadge } from "@/kit/ui";
import type { SceneProps } from "@/scenes/scene-types";
import { SectionVisual } from "@/scenes/visual-registry";

/**
 * Visuals that are sparse at their natural size render larger so they fill the
 * stage area. Scaling is uniform, so the mock UI keeps its proportions.
 */
const VISUAL_SCALE: Record<string, number> = {
  "actions-lockfiles": 1.3,
  "copilot-sdk": 1.3,
  "plugin-controls": 1.25,
  "moderate-role": 1.2,
  "agentic-autofix": 1.2,
  "public-monitoring": 1.15,
  "actions-multicloud": 1.12,
  "jetbrains-releases": 1.12,
};

function Scaled({ id, children }: { id: string; children: ReactNode }) {
  const k = VISUAL_SCALE[id];
  if (!k) return <>{children}</>;
  return (
    <div
      className="absolute top-0 left-0"
      style={{ width: `${100 / k}%`, height: `${100 / k}%`, transform: `scale(${k})`, transformOrigin: "0 0" }}
    >
      {children}
    </div>
  );
}

function statSize(s: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const text = `${s.prefix ?? ""}${s.value.toLocaleString("en-US", { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 })}${s.suffix ?? ""}`;
  if (text.length >= 7) return "text-[62px]";
  if (text.length >= 5) return "text-[76px]";
  return "text-[88px]";
}

/** Headlines whose impact scene has a bespoke visual in their section module. */
const CUSTOM_IMPACT = new Set(["copilot-fusion", "copilot-projects", "ai-scan", "copilot-connectors"]);

function announcementOf(scene: SceneProps["scene"]): Announcement {
  return ANNOUNCEMENT_BY_ID[scene.announcementId as string];
}

export function Badges({ a, size = "md", className }: { a: Announcement; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <StatusBadge label={a.status.label} tone={a.status.tone} size={size} />
      {a.extraStatus?.map((s) => <StatusBadge key={s.label} label={s.label} tone={s.tone} size={size} />)}
    </div>
  );
}

function hostOf(url: string) {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

export function SourceLinks({ sources, preview, className }: { sources: Source[]; preview?: boolean; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {sources.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={preview ? -1 : undefined}
            title={hostOf(s.url)}
            className="kn-focus inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-[19px] font-medium text-zinc-100 transition hover:border-white/35 hover:text-white"
          >
            {s.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Step caption, pips and the Next / Reset controls shown on every demo. */
export function DemoControls({
  steps,
  step,
  setStep,
  onReset,
  preview,
  className,
  takeaway = true,
}: {
  steps: string[];
  step: number;
  setStep: (n: number) => void;
  onReset: () => void;
  preview?: boolean;
  className?: string;
  /** The last step is the "Why it matters" banner (true for every demo except the data scenes that hand on to the next scene). */
  takeaway?: boolean;
}) {
  const last = steps.length - 1;
  return (
    <div className={cn("flex w-[640px] shrink-0 flex-col items-end gap-3", className)}>
      <div className="flex items-center gap-2" role="group" aria-label="Demo steps">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            disabled={preview}
            onClick={() => setStep(i)}
            aria-label={`Step ${i + 1}: ${label}`}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "kn-focus h-3 rounded-full transition-all duration-500",
              i === step ? "w-12 bg-[var(--accent-hex)]" : i < step ? "w-3 bg-[var(--accent-text)]" : "w-3 bg-white/25",
            )}
          />
        ))}
      </div>
      <p className="text-right text-[20px] font-semibold tracking-[0.16em] text-zinc-300 uppercase tabular">
        {takeaway ? (step >= last ? "The takeaway" : `Step ${step + 1} of ${last}`) : `Step ${step + 1} of ${steps.length}`}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={step}
          className="min-h-[76px] text-right text-[30px] leading-tight font-semibold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {steps[Math.min(step, last)]}
        </motion.p>
      </AnimatePresence>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={preview || step === 0}
          onClick={() => setStep(step - 1)}
          aria-label="Previous step"
          className="kn-focus inline-flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 disabled:opacity-40"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled={preview || step >= last}
          onClick={() => setStep(step + 1)}
          className="kn-focus inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[20px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-40"
        >
          Next step
          <kbd className="rounded bg-zinc-200 px-2 text-[17px] font-semibold text-zinc-700">→</kbd>
        </button>
        <button
          type="button"
          disabled={preview}
          onClick={onReset}
          className="kn-focus inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-[20px] font-semibold text-white transition hover:bg-white/10"
        >
          <RotateCcw className="size-5" aria-hidden="true" />
          Reset demo
          <kbd className="rounded border border-white/25 px-1.5 text-[15px] font-semibold text-zinc-200">R</kbd>
        </button>
      </div>
    </div>
  );
}

/** The closing beat of every demo, with the primary source one click away. */
export function WhyItMatters({
  show,
  text,
  source,
  preview,
  className,
}: {
  show: boolean;
  text: string;
  source?: Source;
  preview?: boolean;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="scrim"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[300px] bg-gradient-to-t from-[#050608] via-[#050608]/85 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      ) : null}
      {show ? (
        <motion.div
          key="banner"
          data-kn="takeaway"
          className={cn(
            "absolute right-[112px] bottom-[60px] left-[112px] z-20 flex items-center gap-8 overflow-hidden rounded-[26px] border border-[color-mix(in_oklab,var(--accent-hex)_60%,transparent)] bg-[#07080b] px-10 py-7 shadow-[0_0_80px_-20px_var(--accent-hex)]",
            className,
          )}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-[var(--accent-hex)]" />
          <p className="shrink-0 text-[22px] font-semibold tracking-[0.2em] text-[var(--accent-text)] uppercase">Why it matters</p>
          <p className="min-w-0 flex-1 text-[36px] leading-tight font-semibold text-white">{text}</p>
          {source ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={preview ? -1 : undefined}
              className="kn-focus inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-[20px] font-semibold text-white transition hover:bg-white/[0.14]"
            >
              Learn more
              <ArrowUpRight className="size-5" aria-hidden="true" />
              <span className="sr-only"> about this announcement: {source.label} (opens in a new tab)</span>
            </a>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Holds a demo's visual. When the takeaway banner arrives the visual steps back
 * (scaled from its top edge) so the banner never covers the demo's end state.
 */
export function Recede({ active, className, children }: { active: boolean; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={cn("relative", className)}
      style={{ transformOrigin: "50% 0%" }}
      initial={false}
      animate={active ? { scale: 0.86, opacity: 0.94 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ Headline: reveal */

export function RevealScene({ scene, step, setStep, preview }: SceneProps) {
  const a = announcementOf(scene);
  return (
    <div className="absolute inset-0 px-[112px] pt-[88px]">
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <motion.div
            key="problem"
            className="absolute inset-x-[112px] top-[88px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, filter: "blur(12px)" }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <Kicker>The problem</Kicker>
            <p className="mt-7 max-w-[1560px] text-[58px] leading-[1.12] font-semibold tracking-[-0.02em] text-white text-balance">
              {a.problem}
            </p>
            <div className="relative mt-12 h-[470px]">
              <SectionVisual section={a.section} id={a.id} part="problem" step={0} setStep={setStep} preview={preview} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="announced"
            className="absolute inset-x-[112px] top-[88px]"
            initial={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <Kicker>What GitHub announced</Kicker>
            <h2 className="mt-6 text-[156px] leading-[0.92] font-bold tracking-[-0.055em] text-white">{a.name}</h2>
            <p className="mt-7 text-[54px] leading-tight font-semibold text-[var(--accent-text)]">{a.oneLiner}</p>
            <Badges a={a} size="lg" className="mt-9" />
            <Reveal show={step >= 2} className="mt-14">
              <ol className="grid grid-cols-4 gap-6">
                {a.how.map((h, i) => (
                  <li key={h} className="relative rounded-[22px] border border-white/12 bg-[#0f1015]/90 p-7">
                    <span className="text-[22px] font-bold text-[var(--accent-text)] tabular">0{i + 1}</span>
                    <p className="mt-3 text-[25px] leading-snug text-zinc-100">{h}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ Headline: demo */

export function DemoScene({ scene, step, setStep, resetKey, onReset, preview }: SceneProps) {
  const a = announcementOf(scene);
  const last = a.steps.length - 1;
  return (
    <div className="absolute inset-0 px-[112px] pt-[64px]">
      <header className="flex items-start justify-between gap-10">
        <div className="min-w-0">
          <Kicker>Simulated demo · Watch it in action</Kicker>
          <h2 className="mt-3 text-[72px] leading-none font-semibold tracking-[-0.035em] text-white">{a.name}</h2>
          {scene.tourIndex ? (
            <p className="mt-4 text-[24px] text-zinc-300">Moment {scene.tourIndex} of 5 · {a.oneLiner}</p>
          ) : (
            <p className="mt-4 text-[24px] text-zinc-300">{a.oneLiner}</p>
          )}
        </div>
        <DemoControls steps={a.steps} step={step} setStep={setStep} onReset={onReset} preview={preview} />
      </header>
      <Recede active={step >= last} className="mt-6 h-[650px]">
        <SectionVisual
          key={resetKey}
          section={a.section}
          id={a.id}
          part="demo"
          step={Math.min(step, last - 1)}
          setStep={setStep}
          preview={preview}
        />
      </Recede>
      <WhyItMatters show={step >= last} text={a.benefit} source={a.sources[0]} preview={preview} />
    </div>
  );
}

/* ------------------------------------------------------------------ Headline: impact */

export function ImpactScene({ scene, step, setStep, preview }: SceneProps) {
  const a = announcementOf(scene);
  const stats = a.impact?.stats ?? [];
  const points = a.impact?.points ?? [];
  const custom = CUSTOM_IMPACT.has(a.id);
  return (
    <div className="absolute inset-0 px-[112px] pt-[88px]">
      <Kicker>Why it matters · {a.name}</Kicker>
      <Reveal>
        <p className="mt-6 max-w-[1600px] text-[76px] leading-[1.02] font-semibold tracking-[-0.035em] text-white text-balance">
          {a.benefit}
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-[1fr_620px] gap-12">
        <Reveal show={step >= 1}>
          {custom ? (
            <div className="relative h-[420px]">
              <SectionVisual section={a.section} id={a.id} part="impact" step={step} setStep={setStep} preview={preview} />
            </div>
          ) : stats.length ? (
            <dl className={cn("grid gap-6", stats.length >= 3 ? "grid-cols-3" : "grid-cols-2")}>
              {stats.map((s) => (
                <div key={s.label} className="rounded-[24px] border border-white/12 bg-[#0f1015]/90 p-7">
                  <dd className={cn(statSize(s), "leading-none font-bold tracking-tight whitespace-nowrap text-[var(--accent-text)]")}>
                    <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} show={step >= 1} />
                  </dd>
                  <dt className="mt-4 text-[24px] leading-snug text-zinc-200">{s.label}</dt>
                </div>
              ))}
            </dl>
          ) : (
            <div />
          )}
        </Reveal>
        <Reveal show={step >= 2} delay={0.1}>
          <div className="flex h-full flex-col gap-6">
            {points.length ? (
              <ul className="space-y-4">
                {points.map((p) => (
                  <li key={p} className="flex gap-4 text-[27px] leading-snug text-zinc-100">
                    <span aria-hidden="true" className="mt-3 size-2.5 shrink-0 rounded-full bg-[var(--accent-hex)]" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto space-y-4">
              <Badges a={a} />
              <SourceLinks sources={a.sources} preview={preview} />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Feature scene */

export function FeatureScene({ scene, step, setStep, resetKey, onReset, preview }: SceneProps) {
  const a = announcementOf(scene);
  const last = a.steps.length - 1;
  const section = SECTION_BY_ID[a.section];
  return (
    <div className="absolute inset-0 px-[112px] pt-[80px]">
      <div className="grid h-[880px] grid-cols-[640px_1fr] gap-14">
        <div className="flex min-w-0 flex-col">
          <Kicker>{section.title} · Simulated demo</Kicker>
          <h2
            className={cn(
              a.name.length > 30 ? "text-[58px]" : "text-[66px]",
              "mt-5 leading-[0.98] font-semibold tracking-[-0.035em] text-white text-balance",
            )}
          >
            {a.name}
          </h2>
          <Badges a={a} className="mt-6" />
          <p className="mt-5 text-[28px] leading-snug font-medium text-[var(--accent-text)]">{a.oneLiner}</p>
          <div className="relative mt-7 min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 ? (
                <motion.div key="problem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                  <p className="text-[20px] font-semibold tracking-[0.18em] text-zinc-300 uppercase">The problem</p>
                  <p className="mt-3 text-[28px] leading-snug text-zinc-100">{a.problem}</p>
                </motion.div>
              ) : (
                <motion.div key="how" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                  <p className="text-[20px] font-semibold tracking-[0.18em] text-zinc-300 uppercase">How it works</p>
                  <ul className="mt-3 space-y-2.5">
                    {a.how.map((h) => (
                      <li key={h} className="flex gap-3 text-[23px] leading-snug text-zinc-100">
                        <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-[var(--accent-hex)]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <DemoControls steps={a.steps} step={step} setStep={setStep} onReset={onReset} preview={preview} className="self-end" />
          <Recede active={step >= last} className="mt-5 min-h-0 flex-1">
            <Scaled id={a.id}>
              <SectionVisual
                key={resetKey}
                section={a.section}
                id={a.id}
                part="visual"
                step={Math.min(step, last - 1)}
                setStep={setStep}
                preview={preview}
              />
            </Scaled>
          </Recede>
        </div>
      </div>
      <WhyItMatters show={step >= last} text={a.benefit} source={a.sources[0]} preview={preview} />
    </div>
  );
}

/* ------------------------------------------------------------------ Brief scene */

type BriefLayout = "stacked" | "right" | "left";

function briefLayout(a: Announcement): BriefLayout {
  const briefs = announcementsIn(a.section).filter((x) => x.tier === "brief");
  const i = briefs.findIndex((x) => x.id === a.id);
  return (["right", "stacked", "left"] as const)[Math.max(0, i) % 3];
}

export function BriefScene({ scene, step, setStep, resetKey, onReset, preview }: SceneProps) {
  const a = announcementOf(scene);
  const last = a.steps.length - 1;
  const layout = briefLayout(a);
  const section = SECTION_BY_ID[a.section];
  const visual = (
    <Scaled id={a.id}>
      <SectionVisual
        key={resetKey}
        section={a.section}
        id={a.id}
        part="visual"
        step={Math.min(step, last - 1)}
        setStep={setStep}
        preview={preview}
      />
    </Scaled>
  );
  const text = (
    <div className="flex min-w-0 flex-col">
      <Kicker>{section.title} · Simulated demo</Kicker>
      <h2 className="mt-5 text-[64px] leading-[0.98] font-semibold tracking-[-0.035em] text-white text-balance">{a.name}</h2>
      <Badges a={a} className="mt-6" />
      <p className="mt-6 text-[30px] leading-snug font-medium text-[var(--accent-text)]">{a.oneLiner}</p>
      <ul className="mt-7 space-y-3">
        {a.how.map((h, i) => (
          <Reveal as="li" key={h} show={step >= 1 || i === 0} y={10} className="flex gap-3 text-[24px] leading-snug text-zinc-100">
            <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-[var(--accent-hex)]" />
            {h}
          </Reveal>
        ))}
      </ul>
    </div>
  );

  if (layout === "stacked") {
    const long = a.name.length > 30;
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 flex h-[996px] flex-col px-[112px] pt-[72px]">
          <div className="flex shrink-0 items-start justify-between gap-12">
            <div className="min-w-0">
              <Kicker>{section.title} · Simulated demo</Kicker>
              <h2
                className={cn(
                  long ? "text-[58px]" : "text-[72px]",
                  "mt-4 leading-[1.02] font-semibold tracking-[-0.035em] text-white text-balance",
                )}
              >
                {a.name}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Badges a={a} />
                <p className="text-[28px] leading-snug font-medium text-[var(--accent-text)]">{a.oneLiner}</p>
              </div>
            </div>
            <DemoControls steps={a.steps} step={step} setStep={setStep} onReset={onReset} preview={preview} className="shrink-0" />
          </div>
          <div className="relative mt-6 min-h-0 flex-1">{visual}</div>
          <motion.ol
            className="mt-6 grid shrink-0 grid-cols-3 gap-6"
            initial={false}
            animate={{ opacity: step >= last ? 0 : 1 }}
            transition={{ duration: 0.35 }}
          >
            {a.how.slice(0, 3).map((h, i) => (
              <Reveal
                as="li"
                key={h}
                show={step >= 1 || i === 0}
                y={10}
                className="h-full rounded-[20px] border border-white/10 bg-[#0f1015]/90 px-6 py-5 text-[22px] leading-snug text-zinc-100"
              >
                <span className="mr-2 font-bold text-[var(--accent-text)] tabular">0{i + 1}</span>
                {h}
              </Reveal>
            ))}
          </motion.ol>
        </div>
        <WhyItMatters show={step >= last} text={a.benefit} source={a.sources[0]} preview={preview} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 px-[112px] pt-[80px]">
      <div className={cn("grid h-[860px] gap-14", layout === "right" ? "grid-cols-[640px_1fr]" : "grid-cols-[1fr_640px]")}>
        {layout === "right" ? text : null}
        <div className="flex min-w-0 flex-col">
          <DemoControls
            steps={a.steps}
            step={step}
            setStep={setStep}
            onReset={onReset}
            preview={preview}
            className={layout === "right" ? "self-end" : "self-start [&>*]:self-start [&_p]:text-left"}
          />
          <Recede active={step >= last} className="mt-5 min-h-0 flex-1">
            {visual}
          </Recede>
        </div>
        {layout === "left" ? text : null}
      </div>
      <WhyItMatters show={step >= last} text={a.benefit} source={a.sources[0]} preview={preview} />
    </div>
  );
}

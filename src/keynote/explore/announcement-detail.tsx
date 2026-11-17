import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Presentation, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { scenesFor, useDeck } from "@/deck/deck-store";
import { ANNOUNCEMENTS, ANNOUNCEMENT_BY_ID } from "@/data/announcements";
import { SECTION_BY_ID } from "@/data/sections";
import { StatusBadge, accentVars } from "@/kit/ui";
import { SceneView } from "@/scenes/scene-view";
import { ScaledCanvas } from "@/stage/scaled-canvas";

const KIND_TAB: Record<string, string> = {
  reveal: "The reveal",
  demo: "Simulated demo",
  impact: "Why it matters",
  feature: "Interactive simulation",
  brief: "Interactive simulation",
  "data-growth": "Growth",
  "data-agents": "Agents",
  "data-capacity": "Capacity",
  "data-repo": "One repository",
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** One announcement on its own: the story, the interactive scene and the sources. */
export function AnnouncementDetail({ id }: { id: string }) {
  const a = ANNOUNCEMENT_BY_ID[id];
  const sec = SECTION_BY_ID[a.section];
  const setExplore = useDeck((s) => s.setExplore);
  const presentFromExplore = useDeck((s) => s.presentFromExplore);
  const main = scenesFor("main");
  const scenes = useMemo(() => main.map((s, i) => ({ s, i })).filter(({ s }) => s.announcementId === id), [main, id]);
  const [tab, setTab] = useState(() => Math.max(0, scenes.findIndex(({ s }) => s.kind === "demo")));
  const [step, setStep] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const current = scenes[Math.min(tab, scenes.length - 1)];
  const scene = current.s;
  const clamp = (n: number) => Math.max(0, Math.min(scene.steps, n));

  const order = ANNOUNCEMENTS.findIndex((x) => x.id === id);
  const prev = ANNOUNCEMENTS[order - 1];
  const next = ANNOUNCEMENTS[order + 1];

  const present = () => presentFromExplore(current.i);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6" style={accentVars(sec.accent)}>
      <button
        type="button"
        onClick={() => setExplore(true, null)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All announcements
        <kbd className="hidden rounded border border-white/20 px-1 text-xs font-normal text-zinc-300 sm:inline">Esc</kbd>
      </button>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.16em] uppercase" style={{ color: sec.accent.text }}>
          {sec.number}. {sec.title}
        </span>
        <StatusBadge label={a.status.label} tone={a.status.tone} size="sm" />
        {a.extraStatus?.map((s) => <StatusBadge key={s.label} label={s.label} tone={s.tone} size="sm" />)}
        <span className="text-xs text-zinc-400">Announced {formatDate(a.date)}</span>
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{a.name}</h2>
      <p className="mt-3 max-w-3xl text-lg font-medium sm:text-xl" style={{ color: sec.accent.text }}>
        {a.oneLiner}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <article className="order-2 space-y-8 lg:order-1">
          <section>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">The problem</h3>
            <p className="mt-2 text-base leading-relaxed text-zinc-100">{a.problem}</p>
          </section>
          <section>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">What GitHub announced</h3>
            <ul className="mt-2 space-y-2">
              {a.how.map((h) => (
                <li key={h} className="flex gap-3 text-base leading-relaxed text-zinc-100">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full" style={{ background: sec.accent.hex }} />
                  {h}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border p-5" style={{ borderColor: `${sec.accent.hex}66`, background: `${sec.accent.hex}12` }}>
            <h3 className="text-xs font-semibold tracking-[0.16em] uppercase" style={{ color: sec.accent.text }}>
              Why it matters
            </h3>
            <p className="mt-2 text-lg leading-snug font-semibold text-white">{a.benefit}</p>
          </section>
          {a.facts?.length ? (
            <section>
              <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">Details</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-200">
                {a.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {a.availability ? (
            <section>
              <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">Availability</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">{a.availability}</p>
            </section>
          ) : null}
          <section>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">Learn more</h3>
            <ul className="mt-2 space-y-2">
              {a.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-2 text-sm font-semibold text-sky-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <section aria-label="Watch it in action" className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-20">
            {scenes.length > 1 ? (
              <div role="group" aria-label="Scenes" className="mb-3 flex flex-wrap gap-2">
                {scenes.map(({ s }, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={i === tab}
                    onClick={() => {
                      setTab(i);
                      setStep(0);
                      setResetKey((k) => k + 1);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-white",
                      i === tab ? "border-white bg-white text-zinc-950" : "border-white/15 text-zinc-200 hover:border-white/35",
                    )}
                  >
                    {KIND_TAB[s.kind] ?? s.title}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050608]">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 15% 10%, ${sec.accent.hex}30, transparent 55%), radial-gradient(circle at 90% 95%, ${sec.accent.hex2}26, transparent 55%)` }}
              />
              <ScaledCanvas>
                <SceneView
                  key={`${scene.id}-${resetKey}`}
                  scene={scene}
                  step={step}
                  setStep={(n) => setStep(clamp(n))}
                  resetKey={resetKey}
                  onReset={() => {
                    setStep(0);
                    setResetKey((k) => k + 1);
                  }}
                />
              </ScaledCanvas>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => clamp(s - 1))}
                disabled={step === 0}
                aria-label="Previous step"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => clamp(s + 1))}
                disabled={step >= scene.steps}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Next step
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setResetKey((k) => k + 1);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset demo
              </button>
              <span className="text-sm text-zinc-300 tabular" aria-live="polite">
                Step {step + 1} of {scene.steps + 1}
              </span>
              <button
                type="button"
                onClick={present}
                className="ml-auto inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                <Presentation className="size-4" aria-hidden="true" />
                Present this scene
              </button>
            </div>
          </div>
        </section>
      </div>

      <nav aria-label="More announcements" className="mt-14 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6">
        {prev ? (
          <button
            type="button"
            onClick={() => setExplore(true, prev.id)}
            className="inline-flex items-center gap-2 text-left text-sm font-semibold text-zinc-200 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="block text-xs font-normal text-zinc-400">Previous</span>
              {prev.name}
            </span>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => setExplore(true, next.id)}
            className="inline-flex items-center gap-2 text-right text-sm font-semibold text-zinc-200 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>
              <span className="block text-xs font-normal text-zinc-400">Next</span>
              {next.name}
            </span>
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </button>
        ) : null}
      </nav>
    </div>
  );
}

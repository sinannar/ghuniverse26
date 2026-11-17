import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/deck/deck-store";
import { ANNOUNCEMENTS, announcementsIn } from "@/data/announcements";
import { SECTIONS, SECTION_BY_ID } from "@/data/sections";
import { hasProfile, usePresenterProfile } from "@/deck/presenter-profile";
import type { SectionId } from "@/deck/types";
import { CountUp, EASE_OUT, Reveal } from "@/kit/motion";
import { Key, Kicker } from "@/kit/ui";
import type { SceneProps } from "@/scenes/scene-types";
import { SectionMotif } from "@/scenes/section-motifs";

const GA_COUNT = ANNOUNCEMENTS.filter((a) => a.status.tone === "ga").length;
const PREVIEW_COUNT = ANNOUNCEMENTS.filter((a) => a.status.tone === "preview" || a.status.tone === "experimental").length;

/* ------------------------------------------------------------------ Opening */

export function OpeningScene({ step, preview }: SceneProps) {
  const startTour = useDeck((s) => s.startTour);
  const startAnnouncements = useDeck((s) => s.startAnnouncements);
  const profile = usePresenterProfile((s) => s.profile);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-[112px] text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[120px] left-1/2 h-[640px] w-[1700px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, rgba(5,6,8,0.72) 0%, rgba(5,6,8,0.45) 45%, transparent 72%)" }}
      />
      <Reveal y={10}>
        <p className="text-[24px] font-medium tracking-[0.28em] text-zinc-200 uppercase">
          GitHub Universe 2026 · October 28 and 29 · San Francisco
        </p>
      </Reveal>
      <motion.h1
        className="mt-8 bg-[linear-gradient(100deg,#ffffff_20%,#f5d0fe_45%,#a5f3fc_70%,#ffffff_90%)] bg-clip-text pb-4 text-[210px] leading-[0.95] font-bold tracking-[-0.055em] text-transparent"
        initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(16px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.15 }}
      >
        Universe 2026
      </motion.h1>
      <Reveal delay={0.5}>
        <p className="mt-4 text-[40px] font-medium text-zinc-200">Every announcement. Simulated demos. One keynote.</p>
      </Reveal>

      <Reveal delay={0.8} className="mt-14">
        <div className="flex items-center gap-6">
          <button
            type="button"
            disabled={preview}
            onClick={startTour}
            className="kn-focus group relative inline-flex min-w-[340px] items-center justify-center gap-3 rounded-full bg-white px-11 py-5 text-[30px] font-semibold text-zinc-950 shadow-[0_0_60px_-10px_rgba(240,171,252,0.9)] transition hover:shadow-[0_0_90px_-6px_rgba(240,171,252,1)]"
          >
            <Sparkles className="size-7" aria-hidden="true" />
            Highlights
            <span className="sr-only"> (the five biggest announcements with demos, shortcut T)</span>
          </button>
          <button
            type="button"
            disabled={preview}
            onClick={startAnnouncements}
            className="kn-focus inline-flex min-w-[340px] items-center justify-center gap-3 rounded-full border border-white/30 bg-white/[0.07] px-11 py-5 text-[30px] font-semibold text-white transition hover:bg-white/[0.14]"
          >
            Announcements
            <ArrowRight className="size-7" aria-hidden="true" />
            <span className="sr-only"> (all {ANNOUNCEMENTS.length}, section by section)</span>
          </button>
        </div>
      </Reveal>

      <Reveal show={step >= 1} className="mt-12">
        <dl className="flex items-stretch gap-16 rounded-[32px] border border-white/10 bg-[#050608]/80 px-14 py-7">
          {[
            { v: ANNOUNCEMENTS.length, l: "announcements" },
            { v: SECTIONS.length, l: "sections" },
            { v: GA_COUNT, l: "generally available" },
            { v: PREVIEW_COUNT, l: "in preview" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center">
              <dt className="order-2 mt-1 text-[24px] text-zinc-300">{s.l}</dt>
              <dd className="order-1 text-[72px] leading-none font-semibold tracking-tight text-white">
                <CountUp value={s.v} show={step >= 1} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={1.2} className="absolute right-0 bottom-[40px] left-0 flex justify-center">
        <p className="flex items-center justify-center gap-9 rounded-full border border-white/12 bg-[#050608]/90 px-9 py-3 text-[21px] text-zinc-200">
          <span className="flex items-center gap-2.5">
            <Key>→</Key> Next
          </span>
          <span className="flex items-center gap-2.5">
            <Key>←</Key> Back
          </span>
          <span className="flex items-center gap-2.5">
            <Key>G</Key> Map
          </span>
          <span className="flex items-center gap-2.5">
            <Key>?</Key> All keys
          </span>
        </p>
      </Reveal>

      {hasProfile(profile) ? (
        <Reveal delay={1.1} className="absolute bottom-[120px] left-0 right-0">
          <p className="text-[24px] text-zinc-300">
            Presented by <span className="font-semibold text-white">{profile.name}</span>
            {profile.role ? <span> · {profile.role}</span> : null}
            {profile.organization ? <span> · {profile.organization}</span> : null}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Agenda */

export function AgendaScene({ preview }: SceneProps) {
  const goToSection = useDeck((s) => s.goToSection);
  return (
    <div className="absolute inset-0 px-[112px] pt-[88px]">
      <Kicker>The map</Kicker>
      <h2 className="mt-5 text-[88px] leading-none font-semibold tracking-[-0.035em] text-white">
        Five sections, {ANNOUNCEMENTS.length} announcements
      </h2>
      <ol className="mt-14 grid grid-cols-5 gap-6">
        {SECTIONS.map((s, i) => {
          const items = announcementsIn(s.id);
          const headlines = items.filter((a) => a.tier === "headline");
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE_OUT }}
            >
              <button
                type="button"
                disabled={preview}
                onClick={() => goToSection(s.number)}
                className="kn-focus group relative flex h-[620px] w-full flex-col overflow-hidden rounded-[26px] border border-white/12 bg-[#0f1015] p-8 text-left transition hover:border-white/30"
                style={{ ["--kn-focus" as string]: s.accent.text }}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: s.accent.hex }} />
                <span
                  aria-hidden="true"
                  className="absolute -top-20 -left-16 size-60 rounded-full blur-3xl opacity-30 transition-opacity group-hover:opacity-50"
                  style={{ background: s.accent.hex }}
                />
                <span className="text-[96px] leading-none font-bold tracking-tight" style={{ color: s.accent.text }}>
                  0{s.number}
                </span>
                <span className="mt-6 min-h-[84px] text-[34px] leading-[1.2] font-semibold text-white text-balance">{s.title}</span>
                <span className="mt-3 text-[24px] text-zinc-300">{items.length} announcements</span>
                <span className="mt-auto space-y-2">
                  {headlines.map((h) => (
                    <span key={h.id} className="flex items-center gap-2 text-[22px] font-medium text-zinc-100">
                      <span aria-hidden="true" className="size-2 rounded-full" style={{ background: s.accent.hex }} />
                      {h.name}
                    </span>
                  ))}
                  <span className="mt-3 flex items-center gap-2 text-[20px] text-zinc-300">
                    Press <kbd className="rounded border border-white/25 px-2 font-sans text-white">{s.number}</kbd> to jump
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ Section intro */

export function SectionIntroScene({ scene, step }: SceneProps) {
  const section = SECTION_BY_ID[scene.section as SectionId];
  const items = announcementsIn(section.id);
  return (
    <div className="absolute inset-0 px-[112px] pt-[110px]">
      <div className="absolute top-[60px] right-[40px] h-[760px] w-[900px]">
        <SectionMotif section={section.id} />
      </div>
      <motion.p
        aria-hidden="true"
        className="text-[300px] leading-[0.8] font-bold tracking-[-0.06em]"
        style={{ color: "transparent", WebkitTextStroke: `3px ${section.accent.hex}` }}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        0{section.number}
      </motion.p>
      <Reveal delay={0.2}>
        <Kicker className="mt-10">{section.kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.3}>
        <h2 className="mt-4 max-w-[1000px] text-[120px] leading-[0.95] font-semibold tracking-[-0.045em] text-white">{section.title}</h2>
      </Reveal>
      <Reveal delay={0.45}>
        <p className="mt-6 max-w-[900px] text-[36px] leading-snug text-zinc-200">{section.lede}</p>
      </Reveal>
      <Reveal show={step >= 1} className="absolute bottom-[120px] left-[112px] right-[112px]">
        <ul className="flex flex-wrap gap-3">
          {items.map((a) => (
            <li
              key={a.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-5 py-2 font-medium text-white",
                a.tier === "headline" ? "text-[26px]" : "text-[22px]",
              )}
              style={{
                borderColor: a.tier === "headline" ? section.accent.hex : "rgba(255,255,255,0.18)",
                background: a.tier === "headline" ? `${section.accent.hex}26` : "rgba(255,255,255,0.04)",
              }}
            >
              {a.tier === "headline" ? <Sparkles className="size-5 text-[var(--accent-text)]" aria-hidden="true" /> : null}
              {a.short ?? a.name}
              {a.tier === "headline" ? <span className="sr-only"> (headline with simulated demo)</span> : null}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

import { motion } from "motion/react";
import { Compass, Play, RotateCcw } from "lucide-react";
import { useDeck } from "@/deck/deck-store";
import { ANNOUNCEMENTS, ANNOUNCEMENT_BY_ID, TOUR_IDS } from "@/data/announcements";
import { SECTION_BY_ID } from "@/data/sections";
import { EASE_OUT, Reveal } from "@/kit/motion";
import { Kicker } from "@/kit/ui";
import type { SceneProps } from "@/scenes/scene-types";
import { Badges } from "@/scenes/announcement-scenes";

const POINTS = [
  { x: 260, y: 420 },
  { x: 610, y: 250 },
  { x: 960, y: 470 },
  { x: 1310, y: 270 },
  { x: 1660, y: 440 },
];

export function TourIntroScene({ step }: SceneProps) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-x-0 top-[150px] text-center">
        <Reveal>
          <p className="text-[24px] font-semibold tracking-[0.3em] text-zinc-200 uppercase">GitHub Universe 2026</p>
        </Reveal>
        <motion.h2
          className="mt-6 text-[170px] leading-[0.9] font-bold tracking-[-0.055em] text-white"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.3, ease: EASE_OUT }}
        >
          Highlights
        </motion.h2>
        <Reveal delay={0.5}>
          <p className="mt-6 text-[40px] text-zinc-200">Five moments that change how software gets built.</p>
        </Reveal>
      </div>
      <div className="absolute inset-x-0 top-[470px] h-[600px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1920 600" aria-hidden="true">
          {POINTS.slice(0, -1).map((p, i) => (
            <motion.line
              key={i}
              x1={p.x}
              y1={p.y - 200}
              x2={POINTS[i + 1].x}
              y2={POINTS[i + 1].y - 200}
              stroke="#f0abfc"
              strokeOpacity={0.45}
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: step >= 1 ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            />
          ))}
        </svg>
        {TOUR_IDS.map((id, i) => {
          const a = ANNOUNCEMENT_BY_ID[id];
          const sec = SECTION_BY_ID[a.section];
          const p = POINTS[i];
          return (
            <motion.div
              key={id}
              className="absolute flex w-[300px] -translate-x-1/2 flex-col items-center text-center"
              style={{ left: p.x, top: p.y - 214 }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.6 }}
              transition={{ duration: 0.6, delay: 0.12 * i, ease: EASE_OUT }}
            >
              <span
                className="size-7 rounded-full"
                style={{ background: sec.accent.hex, boxShadow: `0 0 40px 8px ${sec.accent.hex}` }}
                aria-hidden="true"
              />
              <span className="mt-5 text-[22px] font-semibold tabular" style={{ color: sec.accent.text }}>
                0{i + 1}
              </span>
              <span className="mt-1 text-[32px] leading-tight font-semibold text-white">{a.name}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function TourCardScene({ scene }: SceneProps) {
  const a = ANNOUNCEMENT_BY_ID[scene.announcementId as string];
  const sec = SECTION_BY_ID[a.section];
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[160px]">
      <motion.p
        aria-hidden="true"
        className="absolute top-[120px] right-[120px] text-[420px] leading-none font-bold tracking-[-0.06em]"
        style={{ color: "transparent", WebkitTextStroke: `3px ${sec.accent.hex}` }}
        initial={{ opacity: 0, x: 120 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        0{scene.tourIndex}
      </motion.p>
      <Reveal>
        <Kicker>
          Moment {scene.tourIndex} of 5 · {sec.title}
        </Kicker>
      </Reveal>
      <motion.h2
        className="mt-8 max-w-[1300px] text-[170px] leading-[0.9] font-bold tracking-[-0.055em] text-white"
        initial={{ opacity: 0, y: 60, filter: "blur(18px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
      >
        {a.name}
      </motion.h2>
      <Reveal delay={0.4}>
        <p className="mt-8 max-w-[1250px] text-[56px] leading-tight font-semibold text-[var(--accent-text)]">{a.oneLiner}</p>
      </Reveal>
      <Reveal delay={0.6}>
        <p className="mt-8 max-w-[1250px] text-[30px] leading-snug text-zinc-200">{a.problem}</p>
      </Reveal>
      <Reveal delay={0.8}>
        <Badges a={a} size="lg" className="mt-10" />
      </Reveal>
    </div>
  );
}

export function TourFinaleScene({ step, preview }: SceneProps) {
  const startTour = useDeck((s) => s.startTour);
  const startAnnouncements = useDeck((s) => s.startAnnouncements);
  const setExplore = useDeck((s) => s.setExplore);
  return (
    <div className="absolute inset-0 px-[112px] pt-[96px]">
      <Kicker>Highlights · recap</Kicker>
      <h2 className="mt-5 text-[96px] leading-none font-semibold tracking-[-0.04em] text-white">You set the goal. Agents carry the work.</h2>
      <ol className="mt-14 grid grid-cols-5 gap-6">
        {TOUR_IDS.map((id, i) => {
          const a = ANNOUNCEMENT_BY_ID[id];
          const sec = SECTION_BY_ID[a.section];
          return (
            <motion.li
              key={id}
              className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0f1015]/90 p-7"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 * i, ease: EASE_OUT }}
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: sec.accent.hex }} />
              <p className="text-[22px] font-bold tabular" style={{ color: sec.accent.text }}>
                0{i + 1}
              </p>
              <p className="mt-3 text-[34px] leading-tight font-semibold text-white">{a.name}</p>
              <p className="mt-3 text-[23px] leading-snug text-zinc-200">{a.oneLiner}</p>
            </motion.li>
          );
        })}
      </ol>
      <Reveal show={step >= 1} className="mt-16">
        <div className="flex items-center gap-5">
          <button
            type="button"
            disabled={preview}
            onClick={startAnnouncements}
            className="kn-focus inline-flex items-center gap-3 rounded-full bg-white px-9 py-5 text-[26px] font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            <Play className="size-6" aria-hidden="true" />
            Go to Announcements
          </button>
          <button
            type="button"
            disabled={preview}
            onClick={() => setExplore(true)}
            className="kn-focus inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/[0.06] px-9 py-5 text-[26px] font-semibold text-white transition hover:bg-white/[0.12]"
          >
            <Compass className="size-6" aria-hidden="true" />
            Explore all {ANNOUNCEMENTS.length} announcements
          </button>
          <button
            type="button"
            disabled={preview}
            onClick={startTour}
            className="kn-focus inline-flex items-center gap-3 rounded-full px-7 py-5 text-[26px] font-semibold text-zinc-200 transition hover:text-white"
          >
            <RotateCcw className="size-6" aria-hidden="true" />
            Replay Highlights
          </button>
        </div>
      </Reveal>
    </div>
  );
}

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { RECAP_URL } from "@/data/announcements";
import { SECTION_BY_ID } from "@/data/sections";
import { RECAP_TAKEAWAYS, RECAP_THESIS, type Takeaway } from "@/data/takeaways";
import { EASE_OUT, Reveal } from "@/kit/motion";
import type { SceneProps } from "@/scenes/scene-types";

// The keynote's last scene: the five takeaways as a constellation, in the same
// visual language as the Highlights opener. Each Next lights one star (its
// section colour), draws the line from the previous star and puts that
// takeaway's detail in the caption. The final Next completes the constellation.

/** Star centres on the 1920x1080 stage. High stars carry their label above, low stars below. */
const STARS = [
  { x: 250, y: 468, high: true },
  { x: 615, y: 628, high: false },
  { x: 960, y: 468, high: true },
  { x: 1305, y: 628, high: false },
  { x: 1670, y: 468, high: true },
] as const;

const STAGE_H = 1080;
const PATH = STARS.map((s, i) => `${i ? "L" : "M"}${s.x} ${s.y}`).join(" ");

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

/** Faint background stars, seeded so the sky is identical every time. */
const DUST = (() => {
  const r = mulberry32(61);
  return Array.from({ length: 70 }, () => ({
    x: Math.round(60 + r() * 1800),
    y: Math.round(300 + r() * 520),
    size: r() < 0.22 ? 3 : 2,
    delay: Math.round(r() * 3200) / 1000,
  }));
})();

function Dust() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {DUST.map((d, i) => (
        <span
          key={i}
          className="kn-twinkle absolute rounded-full bg-white"
          style={{ left: d.x, top: d.y, width: d.size, height: d.size, animationDelay: `${d.delay}s` }}
        />
      ))}
    </div>
  );
}

function box(x: number, y: number, size: number) {
  return { left: x - size / 2, top: y - size / 2, width: size, height: size };
}

function Star({ t, i, step, final, preview }: { t: Takeaway; i: number; step: number; final: boolean; preview?: boolean }) {
  const sec = SECTION_BY_ID[t.section];
  const p = STARS[i];
  const lit = step >= i + 1;
  const active = !final && step === i + 1;
  const hex = sec.accent.hex;
  return (
    <li aria-hidden={lit ? undefined : true} inert={!lit}>
      <span aria-hidden="true">
        {/* One flare when the star lights, and a staggered one when the constellation completes. */}
        {lit && !preview ? (
          <motion.span
            key="flare"
            className="pointer-events-none absolute rounded-full"
            style={{ ...box(p.x, p.y, 30), background: `radial-gradient(circle, ${hex}d9 0%, ${hex}00 70%)` }}
            initial={{ scale: 0.4, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
        ) : null}
        {final && !preview ? (
          <motion.span
            key="flare-final"
            className="pointer-events-none absolute rounded-full"
            style={{ ...box(p.x, p.y, 30), background: `radial-gradient(circle, ${hex}d9 0%, ${hex}00 70%)` }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 8], opacity: [1, 0] }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.25 + i * 0.14 }}
          />
        ) : null}
        {active && !preview ? (
          <span className="kn-pulse-ring absolute rounded-full border-2" style={{ ...box(p.x, p.y, 64), borderColor: hex }} />
        ) : null}
        <span
          className="absolute rounded-full border-2 transition-colors duration-500"
          style={{ ...box(p.x, p.y, 30), borderColor: lit ? hex : "rgba(255,255,255,0.4)" }}
        />
        <motion.span
          className="absolute rounded-full"
          style={{ ...box(p.x, p.y, 30), background: hex, boxShadow: `0 0 44px 10px ${hex}` }}
          initial={false}
          animate={{ opacity: lit ? 1 : 0, scale: lit ? (active ? 1.3 : 1) : 0.3 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
      </span>
      <motion.div
        className="absolute w-[380px] text-center"
        style={{ left: p.x - 190, ...(p.high ? { bottom: STAGE_H - (p.y - 40) } : { top: p.y + 40 }) }}
        initial={false}
        animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : p.high ? 16 : -16 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: lit ? 0.15 : 0 }}
      >
        <p className="text-[21px] font-semibold" style={{ color: sec.accent.text }}>
          <span className="tabular">0{sec.number}</span> · {sec.title}
        </p>
        <p className="mt-2 text-[36px] leading-[1.1] font-semibold tracking-[-0.01em] text-white text-balance">{t.title}</p>
        <span className="sr-only">. {t.body}</span>
      </motion.div>
    </li>
  );
}

export function RecapScene({ step, preview }: SceneProps) {
  const uid = useId().replace(/:/g, "");
  const total = RECAP_TAKEAWAYS.length;
  const final = step > total;
  const active = !final && step >= 1 ? RECAP_TAKEAWAYS[step - 1] : null;
  const activeSec = active ? SECTION_BY_ID[active.section] : null;
  const hexAt = (i: number) => SECTION_BY_ID[RECAP_TAKEAWAYS[i].section].accent.hex;

  return (
    <div className="absolute inset-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[250px] left-1/2 h-[680px] w-[1900px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, rgba(5,6,8,0.72) 0%, rgba(5,6,8,0.42) 50%, transparent 76%)" }}
      />
      {!preview ? <Dust /> : null}

      <header className="absolute inset-x-0 top-[80px] text-center">
        <Reveal y={10}>
          <p className="text-[24px] font-semibold tracking-[0.3em] text-zinc-200 uppercase">GitHub Universe 2026 · Recap</p>
        </Reveal>
        <motion.h2
          className="mt-4 text-[128px] leading-[0.92] font-bold tracking-[-0.05em] text-white"
          initial={{ opacity: 0, scale: 0.92, filter: "blur(18px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          Five takeaways
        </motion.h2>
      </header>

      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          {STARS.slice(0, -1).map((p, i) => (
            <linearGradient
              key={i}
              id={`${uid}-seg-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={p.x}
              y1={p.y}
              x2={STARS[i + 1].x}
              y2={STARS[i + 1].y}
            >
              <stop offset="0%" stopColor={hexAt(i)} />
              <stop offset="100%" stopColor={hexAt(i + 1)} />
            </linearGradient>
          ))}
        </defs>
        <path d={PATH} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray="2 12" strokeLinecap="round" />
        {STARS.slice(0, -1).map((p, i) => (
          <motion.line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={STARS[i + 1].x}
            y2={STARS[i + 1].y}
            stroke={`url(#${uid}-seg-${i})`}
            strokeWidth={final ? 4 : 3}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: step >= i + 2 ? 1 : 0, opacity: step >= i + 2 ? (final ? 1 : 0.8) : 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          />
        ))}
        {final && !preview ? (
          <path
            key="comet"
            className="kn-comet"
            d={PATH}
            pathLength={1}
            fill="none"
            stroke="#ffffff"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="0.07 1.2"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.95))" }}
          />
        ) : null}
      </svg>

      <ol aria-label="Five takeaways">
        {RECAP_TAKEAWAYS.map((t, i) => (
          <Star key={t.section} t={t} i={i} step={step} final={final} preview={preview} />
        ))}
      </ol>

      <div className="absolute inset-x-[150px] top-[838px]">
        <AnimatePresence mode="wait" initial={false}>
          {active && activeSec ? (
            <motion.div
              key={active.section}
              aria-hidden="true"
              className="relative flex items-center gap-9 overflow-hidden rounded-[26px] border bg-[#07080b]/90 px-11 py-6"
              style={{ borderColor: `${activeSec.accent.hex}99`, boxShadow: `0 0 90px -30px ${activeSec.accent.hex}` }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <span className="absolute inset-y-0 left-0 w-2" style={{ background: activeSec.accent.hex }} />
              <span className="shrink-0 text-[64px] leading-none font-bold tabular" style={{ color: activeSec.accent.text }}>
                0{activeSec.number}
              </span>
              <p className="min-w-0 text-[32px] leading-snug text-zinc-100">{active.body}</p>
            </motion.div>
          ) : final ? (
            <motion.div
              key="thesis"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: preview ? 0 : 0.7 }}
            >
              <p className="bg-[linear-gradient(100deg,#ffffff_20%,#f5d0fe_45%,#a5f3fc_70%,#ffffff_90%)] bg-clip-text pb-2 text-[68px] leading-none font-bold tracking-[-0.035em] text-transparent">
                {RECAP_THESIS}
              </p>
              <a
                href={RECAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={preview ? -1 : undefined}
                className="kn-focus mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07080b]/80 px-6 py-2.5 text-[22px] font-semibold text-zinc-100 transition hover:border-white/40 hover:text-white"
              >
                Every announcement: github.com/events/universe/recap
                <ArrowUpRight className="size-5" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

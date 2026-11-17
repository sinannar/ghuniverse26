import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

const Galaxy = lazy(() => import("@/stage/galaxy"));

/** Load the galaxy chunk ahead of time so the opening never waits on it. */
export function preloadGalaxy() {
  return import("@/stage/galaxy");
}

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

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

/**
 * Deterministic drifting starfield on a 2D canvas. `warpNonce` triggers a
 * short hyperspace burst used between Highlights moments.
 */
function Starfield({ warpNonce }: { warpNonce: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warpRef = useRef(0);

  useEffect(() => {
    if (warpNonce > 0) warpRef.current = performance.now();
  }, [warpNonce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(1029);
    const stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    const spawn = (s: Star, fresh: boolean) => {
      s.x = (rand() * 2 - 1) * 1.6;
      s.y = (rand() * 2 - 1) * 1.0;
      s.z = fresh ? 0.15 + rand() * 0.85 : 1;
      s.px = NaN;
      s.py = NaN;
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = Math.round((w * h) / 7000);
      while (stars.length < want) {
        const s = { x: 0, y: 0, z: 1, px: NaN, py: NaN };
        spawn(s, true);
        stars.push(s);
      }
      stars.length = Math.min(stars.length, want);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(48, now - last) / 1000;
      last = now;
      const since = now - warpRef.current;
      const warp = !reduced && warpRef.current > 0 && since < 1100 ? Math.sin((since / 1100) * Math.PI) : 0;
      const speed = reduced ? 0 : 0.018 + warp * 1.9;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const fov = Math.min(w, h) * 0.9;
      for (const s of stars) {
        s.z -= speed * dt;
        if (s.z <= 0.04) spawn(s, false);
        const sx = cx + (s.x / s.z) * fov * 0.5;
        const sy = cy + (s.y / s.z) * fov * 0.5;
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          spawn(s, false);
          continue;
        }
        const depth = 1 - s.z;
        const alpha = Math.min(1, 0.18 + depth * 0.9);
        const size = 0.6 + depth * 1.9;
        if (warp > 0.05 && !Number.isNaN(s.px)) {
          // Streak: a few small fills between the previous and current position.
          ctx.fillStyle = `rgba(220,230,255,${alpha * 0.7})`;
          const segs = 6;
          for (let k = 0; k <= segs; k++) {
            const f = k / segs;
            ctx.fillRect(s.px + (sx - s.px) * f, s.py + (sy - s.py) * f, size * 0.9, size * 0.9);
          }
        } else {
          ctx.fillStyle = `rgba(226,232,255,${alpha})`;
          ctx.fillRect(sx, sy, size, size);
        }
        s.px = sx;
        s.py = sy;
      }
      raf = requestAnimationFrame(draw);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    if (reduced) {
      draw(performance.now());
      cancelAnimationFrame(raf);
    } else start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}

/** Full-viewport stage backdrop: stars, the current accent glow, and the galaxy on cinematic scenes. */
export function Backdrop({
  accent,
  accent2,
  galaxy,
  warpNonce,
}: {
  accent: string;
  accent2: string;
  galaxy: boolean;
  warpNonce: number;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050608]">
      <AnimatePresence initial={false}>
        <motion.div
          key={`${accent}-${accent2}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <div
            className="absolute -left-[18vmax] -top-[22vmax] h-[70vmax] w-[70vmax] rounded-full"
            style={{ background: `radial-gradient(circle, ${accent}38 0%, ${accent}10 38%, transparent 68%)` }}
          />
          <div
            className="absolute -right-[20vmax] -bottom-[26vmax] h-[72vmax] w-[72vmax] rounded-full"
            style={{ background: `radial-gradient(circle, ${accent2}2e 0%, ${accent2}0c 40%, transparent 70%)` }}
          />
        </motion.div>
      </AnimatePresence>
      <Starfield warpNonce={warpNonce} />
      <AnimatePresence>
        {galaxy ? (
          <motion.div
            key="galaxy"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Suspense fallback={null}>
              <Galaxy />
            </Suspense>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
      />
    </div>
  );
}

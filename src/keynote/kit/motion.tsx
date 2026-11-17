import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/deck/deck-store";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Progressive-reveal wrapper. Content keeps its layout space while hidden so a
 * reveal never shifts what is already on screen; hidden content is inert and
 * hidden from assistive tech until it appears.
 */
export function Reveal({
  show = true,
  children,
  delay = 0,
  y = 22,
  x = 0,
  scale = 1,
  blur = true,
  className,
  duration = 0.7,
  as = "div",
}: {
  show?: boolean;
  /** Render as a list item when the reveal sits directly inside a list. */
  as?: "div" | "li";
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  className?: string;
  duration?: number;
}) {
  const hidden = { opacity: 0, y, x, scale, filter: blur ? "blur(8px)" : "blur(0px)" };
  const visible = { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" };
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={hidden}
      animate={show ? visible : hidden}
      transition={{ duration, ease: EASE_OUT, delay: show ? delay : 0 }}
      aria-hidden={show ? undefined : true}
      inert={!show}
    >
      {children}
    </Tag>
  );
}

/** Increments every time the presenter presses S (skip). */
function useSkipNonce(): number {
  return useDeck((s) => s.instantNonce);
}

/** Runs `onSkip` whenever the presenter skips while this component is mounted. */
function useOnSkip(onSkip: () => void) {
  const nonce = useSkipNonce();
  const seen = useRef(nonce);
  const cb = useRef(onSkip);
  cb.current = onSkip;
  useEffect(() => {
    if (nonce === seen.current) return;
    seen.current = nonce;
    cb.current();
  }, [nonce]);
}

/**
 * Time-based phase for an in-scene sequence. Restarts whenever `key` changes;
 * completes at once under reduced motion or when the presenter presses S.
 * `marks` are cumulative milliseconds at which each phase begins (first is 0).
 */
export function usePhase(key: unknown, marks: number[], active = true): number {
  const reduced = useReducedMotion();
  const last = marks.length - 1;
  const [phase, setPhase] = useState(0);
  const marksKey = marks.join(",");
  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    if (reduced) {
      setPhase(last);
      return;
    }
    setPhase(0);
    const at = marksKey.split(",").map(Number);
    const timers = at
      .slice(1)
      .map((ms, i) => window.setTimeout(() => setPhase((p) => Math.max(p, i + 1)), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [key, marksKey, reduced, active, last]);
  useOnSkip(() => {
    if (active) setPhase(last);
  });
  return phase;
}

/** Smooth 0..1 progress over `duration` ms, restarting when `key` changes. */
export function useProgress(key: unknown, duration: number, active = true): number {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);
  useEffect(() => {
    if (!active) {
      setT(0);
      return;
    }
    if (reduced) {
      setT(1);
      return;
    }
    setT(0);
    const c = animate(0, 1, { duration: duration / 1000, ease: "linear", onUpdate: (v) => setT(v) });
    ctrl.current = c;
    return () => c.stop();
  }, [key, duration, reduced, active]);
  useOnSkip(() => {
    if (!active) return;
    ctrl.current?.stop();
    setT(1);
  });
  return t;
}

/** Animated number for big stats. The final value is always exposed to assistive tech. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  show = true,
  duration = 1.4,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  show?: boolean;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);
  useEffect(() => {
    if (!show) {
      setDisplay(0);
      return;
    }
    if (reduced) {
      setDisplay(value);
      return;
    }
    const c = animate(0, value, { duration, ease: EASE_OUT, onUpdate: (v) => setDisplay(v) });
    ctrl.current = c;
    return () => c.stop();
  }, [show, value, duration, reduced]);
  useOnSkip(() => {
    if (!show) return;
    ctrl.current?.stop();
    setDisplay(value);
  });
  const fmt = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  return (
    <span className={cn("tabular", className)}>
      <span aria-hidden="true">{fmt(display)}</span>
      <span className="sr-only">{fmt(value)}</span>
    </span>
  );
}

/** Typewriter text for terminal and prompt moments; the full text is always available to AT. */
export function TypeText({
  text,
  play = true,
  speed = 26,
  className,
  caret = true,
}: {
  text: string;
  play?: boolean;
  speed?: number;
  className?: string;
  caret?: boolean;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!play) {
      setCount(0);
      return;
    }
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, play, speed, reduced]);
  useOnSkip(() => {
    if (play) setCount(text.length);
  });
  const done = count >= text.length;
  return (
    <span className={className}>
      <span aria-hidden="true">
        {play ? text.slice(0, count) : ""}
        {caret && play && !done ? <span className="kn-caret">▍</span> : null}
      </span>
      <span className="sr-only">{play ? text : ""}</span>
    </span>
  );
}

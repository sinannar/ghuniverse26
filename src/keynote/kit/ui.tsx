import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SectionAccent, StatusTone } from "@/deck/types";

/** CSS variables that theme a subtree with a section accent. */
export function accentVars(accent: SectionAccent): CSSProperties {
  return {
    "--accent-hex": accent.hex,
    "--accent-text": accent.text,
    "--accent-deep": accent.deep,
    "--accent-2": accent.hex2,
    "--kn-focus": accent.text,
  } as CSSProperties;
}

/** Story-beat label: THE PROBLEM, WHAT GITHUB ANNOUNCED, WATCH IT IN ACTION, WHY IT MATTERS. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[22px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-text)]",
        className,
      )}
    >
      <span aria-hidden="true" className="h-[3px] w-10 rounded-full bg-[var(--accent-hex)]" />
      {children}
    </p>
  );
}

const TONE: Record<StatusTone, { dot: string; chip: string }> = {
  ga: { dot: "bg-emerald-400", chip: "border-emerald-400/45 bg-emerald-400/12 text-emerald-200" },
  preview: { dot: "bg-sky-400", chip: "border-sky-400/45 bg-sky-400/12 text-sky-200" },
  experimental: { dot: "bg-amber-400", chip: "border-amber-400/45 bg-amber-400/12 text-amber-200" },
  rolling: { dot: "bg-violet-400", chip: "border-violet-400/45 bg-violet-400/12 text-violet-200" },
  info: { dot: "bg-zinc-300", chip: "border-zinc-400/45 bg-zinc-400/12 text-zinc-100" },
};

/** Availability badge: labelled text plus a tinted dot; colour is never the only cue. */
export function StatusBadge({
  label,
  tone,
  size = "lg",
  className,
}: {
  label: string;
  tone: StatusTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold whitespace-nowrap kn-forced-border",
        t.chip,
        size === "lg" && "px-5 py-2 text-[24px]",
        size === "md" && "px-3.5 py-1.5 text-[18px]",
        size === "sm" && "px-2.5 py-0.5 text-xs",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("rounded-full", t.dot, size === "sm" ? "size-1.5" : "size-2.5")}
      />
      {label}
    </span>
  );
}

/** Neutral pill used for tags, file names and labels inside mock interfaces. */
export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "accent" | "good" | "warn" | "bad" | "info";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[18px] font-medium whitespace-nowrap",
        tone === "neutral" && "border-white/15 bg-white/[0.06] text-zinc-100",
        tone === "accent" &&
          "border-[color-mix(in_oklab,var(--accent-hex)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent-hex)_14%,transparent)] text-[var(--accent-text)]",
        tone === "good" && "border-emerald-400/45 bg-emerald-400/12 text-emerald-200",
        tone === "warn" && "border-amber-400/45 bg-amber-400/12 text-amber-200",
        tone === "bad" && "border-red-400/45 bg-red-400/12 text-red-200",
        tone === "info" && "border-sky-400/45 bg-sky-400/12 text-sky-200",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Initials avatar for fictional teammates and agents in the mock interfaces. */
export function Avatar({ initials, hue, className }: { initials: string; hue: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white ring-2 ring-black/40",
        className,
      )}
      style={{ background: hue }}
    >
      {initials}
    </span>
  );
}

/** Soft accent glow used as depth behind hero visuals. Decorative. */
export function Glow({ className, color, opacity = 0.35 }: { className?: string; color?: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ background: color ?? "var(--accent-hex)", opacity }}
    />
  );
}

/** Large stage heading sized for projection. */
export function StageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-[88px] leading-[0.98] font-semibold tracking-[-0.035em] text-white text-balance", className)}>
      {children}
    </h2>
  );
}

/** Keyboard key glyph sized for the stage. */
export function Key({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-9 items-center justify-center rounded-md border border-white/25 bg-white/10 px-2 py-0.5 font-sans text-[0.8em] font-semibold text-white",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

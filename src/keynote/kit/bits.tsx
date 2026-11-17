import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/kit/motion";

/** Dark panel with an optional header used inside demos. */
export function Panel({
  title,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-[20px] border border-white/12 bg-[#101115] kn-forced-border", className)}>
      {title || right ? (
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
          {title ? <div className="min-w-0 truncate text-[19px] font-semibold text-zinc-100">{title}</div> : null}
          {right ? <div className="ml-auto flex items-center gap-2">{right}</div> : null}
        </div>
      ) : null}
      <div className={cn("relative min-h-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}

/** Horizontal progress bar driven by a 0..1 value. */
export function Bar({ value, className, color = "var(--accent-hex)", label }: { value: number; className?: string; color?: string; label?: string }) {
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-white/10", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
    >
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={false} animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

/** Pass / fail glyph with a text label for screen readers. */
export function Verdict({ ok, label, className }: { ok: boolean; label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
        ok ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300",
        className,
      )}
    >
      {ok ? <Check className="size-5" aria-hidden="true" /> : <X className="size-5" aria-hidden="true" />}
      <span className="sr-only">{label ?? (ok ? "Passed" : "Blocked")}</span>
    </span>
  );
}

/** Severity badge for security findings: text plus tint, never colour alone. */
export function Severity({ level }: { level: "Critical" | "High" | "Medium" | "Low" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[16px] font-semibold whitespace-nowrap",
        level === "Critical" && "border-red-400/50 bg-red-500/15 text-red-200",
        level === "High" && "border-orange-400/50 bg-orange-500/15 text-orange-200",
        level === "Medium" && "border-amber-400/50 bg-amber-400/12 text-amber-100",
        level === "Low" && "border-zinc-400/40 bg-zinc-400/10 text-zinc-200",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          level === "Critical" && "bg-red-400",
          level === "High" && "bg-orange-400",
          level === "Medium" && "bg-amber-300",
          level === "Low" && "bg-zinc-300",
        )}
      />
      {level}
    </span>
  );
}

/** Appears with a spring when `show` turns true; used for items that pop into a demo. */
export function Pop({ show, children, className, delay = 0 }: { show: boolean; children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
      transition={{ duration: 0.45, ease: EASE_OUT, delay: show ? delay : 0 }}
      aria-hidden={show ? undefined : true}
      inert={!show}
    >
      {children}
    </motion.div>
  );
}

/** Small square service or tool glyph built from initials (no third-party logos). */
export function Glyph({ text, color, className }: { text: string; color: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-[18px] font-bold text-white", className)}
      style={{ background: color }}
    >
      {text}
    </span>
  );
}

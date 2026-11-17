import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Original mock application window used throughout the demos. */
export function WindowFrame({
  title,
  children,
  className,
  bodyClassName,
  right,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  right?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[22px] border border-white/12 bg-[#101114] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] kn-forced-border",
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5">
        <span aria-hidden="true" className="flex gap-2">
          <span className="size-3 rounded-full bg-white/20" />
          <span className="size-3 rounded-full bg-white/20" />
          <span className="size-3 rounded-full bg-white/20" />
        </span>
        {title ? <span className="min-w-0 truncate text-[17px] font-medium text-zinc-300">{title}</span> : null}
        {right ? <span className="ml-auto flex items-center gap-2">{right}</span> : null}
      </div>
      <div className={cn("relative min-h-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}

export interface TermLine {
  kind: "cmd" | "out" | "ok" | "err" | "warn" | "dim";
  text: string;
}

const LINE_CLASS: Record<TermLine["kind"], string> = {
  cmd: "text-white",
  out: "text-zinc-300",
  ok: "text-emerald-300",
  err: "text-red-300",
  warn: "text-amber-200",
  dim: "text-zinc-400",
};

/** Terminal window. Lines beyond `visible` are not rendered. */
export function TerminalFrame({
  title = "Terminal",
  lines,
  visible,
  className,
  children,
  prompt = "$",
}: {
  title?: string;
  lines: TermLine[];
  visible?: number;
  className?: string;
  children?: ReactNode;
  prompt?: string;
}) {
  const shown = lines.slice(0, visible ?? lines.length);
  const scroller = useRef<HTMLDivElement>(null);
  // Like a real terminal: keep the newest output in view once it outgrows the window.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [shown.length]);
  return (
    <WindowFrame title={title} className={cn("bg-[#0b0c0f]", className)}>
      <div ref={scroller} className="h-full overflow-hidden">
        <div className="font-mono-code space-y-1.5 px-6 py-5 text-[21px] leading-[1.45]">
          {shown.map((l, i) => (
            <div key={i} className={cn("whitespace-pre-wrap break-words", LINE_CLASS[l.kind])}>
              {l.kind === "cmd" ? <span className="mr-3 text-[var(--accent-text)]">{prompt}</span> : null}
              {l.text}
            </div>
          ))}
          {children}
        </div>
      </div>
    </WindowFrame>
  );
}

/** Very small highlighter for hand-written snippets: strings, comments, keywords. */
const KEYWORDS =
  /\b(const|let|var|function|return|import|from|export|if|else|await|async|new|true|false|null|SELECT|FROM|WHERE|on|jobs|steps|uses|with|run|name|permissions|safe-outputs|engine|tools|RUN|FROM|COPY|resource|echo|curl|password|query)\b/g;

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const commentAt = line.search(/(\/\/|#(?![{\w-]*\})\s)/);
  const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const comment = commentAt >= 0 ? line.slice(commentAt) : "";
  const parts = code.split(/("[^"]*"|'[^']*'|`[^`]*`)/g);
  parts.forEach((part, i) => {
    if (/^["'`]/.test(part)) {
      out.push(
        <span key={`s${i}`} className="text-emerald-300">
          {part}
        </span>,
      );
    } else {
      const segs = part.split(KEYWORDS);
      segs.forEach((seg, j) => {
        if (j % 2 === 1)
          out.push(
            <span key={`k${i}-${j}`} className="text-violet-300">
              {seg}
            </span>,
          );
        else if (seg) out.push(<span key={`p${i}-${j}`}>{seg}</span>);
      });
    }
  });
  if (comment)
    out.push(
      <span key="c" className="text-zinc-400 italic">
        {comment}
      </span>,
    );
  return out;
}

export interface CodeLine {
  text: string;
  /** Diff or annotation marker for the line. */
  mark?: "add" | "del" | "hit" | "focus";
}

/** Code listing with optional line numbers and diff marks. */
export function CodeLines({
  lines,
  start = 1,
  className,
  numbers = true,
}: {
  lines: CodeLine[];
  start?: number;
  className?: string;
  numbers?: boolean;
}) {
  return (
    <div className={cn("font-mono-code text-[20px] text-zinc-200", className, "leading-[1.6]")}>
      {lines.map((l, i) => (
        <div
          key={i}
          className={cn(
            "flex gap-4 px-4",
            l.mark === "add" && "bg-emerald-400/12",
            l.mark === "del" && "bg-red-400/12",
            l.mark === "hit" && "bg-amber-400/15 shadow-[inset_4px_0_0_0_#fbbf24]",
            l.mark === "focus" && "bg-[color-mix(in_oklab,var(--accent-hex)_14%,transparent)]",
          )}
        >
          {numbers ? (
            <span aria-hidden="true" className="w-8 shrink-0 text-right text-zinc-500 select-none tabular">
              {start + i}
            </span>
          ) : null}
          <span aria-hidden="true" className="w-4 shrink-0 text-zinc-400 select-none">
            {l.mark === "add" ? "+" : l.mark === "del" ? "-" : ""}
          </span>
          <span className="min-w-0 whitespace-pre-wrap break-words">{highlight(l.text)}</span>
        </div>
      ))}
    </div>
  );
}

/** Phone outline for mobile moments. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[44px] border-[6px] border-zinc-700 bg-[#0d0e11] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] kn-forced-border",
        className,
      )}
    >
      <div aria-hidden="true" className="mx-auto mt-3 h-6 w-28 rounded-full bg-black" />
      {children}
    </div>
  );
}

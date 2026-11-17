import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  FastForward,
  House,
  ListTree,
  Monitor,
  NotebookText,
  RotateCcw,
  Sparkles,
  Square,
  TimerReset,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppShortcut, useShortcutScope } from "@/components/shortcut-provider";
import { scenesFor, useDeck } from "@/deck/deck-store";
import { readSync, sendCommand, usePresenterSync } from "@/deck/sync";
import { nextAction, placeText, prevAction, sceneLabel, sceneText } from "@/deck/nav-labels";
import { sectionStartIndex } from "@/deck/scenes";
import type { DeckId } from "@/deck/types";
import { applyDocumentMeta } from "@/stage/document-meta";
import { SECTION_BY_ID, KEYNOTE_ACCENT } from "@/data/sections";
import { accentVars } from "@/kit/ui";
import { SceneView } from "@/scenes/scene-view";
import { ScaledCanvas } from "@/stage/scaled-canvas";
import { NotesContent } from "@/stage/notes-content";
import { focusElement } from "@/kit/focus";

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function Preview({ deck, index, step, label }: { deck: DeckId; index: number; step: number; label: string }) {
  const list = scenesFor(deck);
  const scene = list[index];
  if (!scene) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-[#050608] text-sm text-zinc-300">
        End of the deck
      </div>
    );
  }
  const accent = scene.section ? SECTION_BY_ID[scene.section].accent : KEYNOTE_ACCENT;
  return (
    <figure className="w-full">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#050608]"
        style={accentVars(accent)}
        aria-hidden="true"
        inert
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 10% 0%, ${accent.hex}33, transparent 60%)` }}
        />
        <ScaledCanvas>
          <SceneView scene={scene} step={step} setStep={() => undefined} resetKey={0} onReset={() => undefined} preview />
        </ScaledCanvas>
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-zinc-200">{label}</span>
        <span className="truncate text-zinc-300">{sceneText(scene)}</span>
      </figcaption>
    </figure>
  );
}

function Dots({ step, steps }: { step: number; steps: number }) {
  if (steps <= 0) return <span className="text-sm text-zinc-400">No steps on this screen</span>;
  return (
    <span className="flex items-center gap-2" role="img" aria-label={`Step ${step + 1} of ${steps + 1}`}>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: steps + 1 }).map((_, i) => (
          <span
            key={i}
            className={cn("h-2 rounded-full", i === step ? "w-5 bg-white" : i < step ? "w-2 bg-white/80" : "w-2 bg-white/25")}
          />
        ))}
      </span>
      <span className="text-sm text-zinc-300 tabular" aria-hidden="true">
        Step {step + 1} of {steps + 1}
      </span>
    </span>
  );
}

function Btn({
  onClick,
  children,
  primary,
  label,
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  primary?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40",
        primary ? "bg-white px-6 py-3 text-base text-zinc-950 hover:bg-zinc-200" : "border border-white/15 px-4 py-2 text-white hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

/** Every scene, grouped like the audience map; click one to send the keynote there. */
function Outline({ deck, index }: { deck: DeckId; index: number }) {
  const main = scenesFor("main");
  const future = scenesFor("future");
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll only the panel, never the window, so the header stays put.
    const item = listRef.current?.querySelector<HTMLElement>('[aria-current="location"]');
    const panel = listRef.current?.parentElement;
    if (!item || !panel) return;
    const top = item.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
    panel.scrollTop = Math.max(0, top - panel.clientHeight / 2);
  }, [deck, index]);
  const groups = useMemo(() => {
    const out: { key: string; title: string; color: string; items: { deck: DeckId; i: number }[] }[] = [];
    const group = (key: string, title: string, color: string) => {
      let g = out.find((x) => x.key === key);
      if (!g) {
        g = { key, title, color, items: [] };
        out.push(g);
      }
      return g;
    };
    let seenSection = false;
    for (const [i, s] of main.entries()) {
      if (s.section) {
        seenSection = true;
        const sec = SECTION_BY_ID[s.section];
        group(sec.id, `${sec.number}. ${sec.title}`, sec.accent.hex).items.push({ deck: "main", i });
      } else if (seenSection) {
        group("close", "Wrap-up", KEYNOTE_ACCENT.hex).items.push({ deck: "main", i });
      } else {
        group("open", "Start", KEYNOTE_ACCENT.hex).items.push({ deck: "main", i });
      }
    }
    const tour = group("tour", "Highlights", KEYNOTE_ACCENT.hex);
    future.forEach((_, i) => tour.items.push({ deck: "future", i }));
    return out;
  }, [main, future]);
  return (
    <div ref={listRef} className="space-y-5">
      {groups.map((g) => (
        <section key={g.key} aria-label={g.title}>
          <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ background: g.color }} />
            {g.title}
          </h3>
          <ul className="space-y-0.5">
            {g.items.map(({ deck: dk, i }) => {
              const s = scenesFor(dk)[i];
              const cur = dk === deck && i === index;
              return (
                <li key={`${dk}-${s.id}`}>
                  <button
                    type="button"
                    aria-current={cur ? "location" : undefined}
                    onClick={() => sendCommand({ cmd: "goto", deck: dk, index: i })}
                    className={cn(
                      "flex w-full items-baseline gap-3 rounded-md px-2 py-1.5 text-left text-[15px] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white",
                      cur ? "bg-white text-zinc-950" : "text-zinc-100",
                    )}
                  >
                    <span className={cn("w-7 shrink-0 text-right text-xs tabular", cur ? "text-zinc-600" : "text-zinc-400")}>{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{sceneText(s)}</span>
                    {cur ? <span className="shrink-0 text-xs font-bold uppercase">On screen</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Opened with P: what Next will do, notes, a map, the timer and remote controls. */
export function PresenterView() {
  usePresenterSync();
  const rootRef = useRef<HTMLDivElement>(null);
  const scope = useShortcutScope("presenter-window");
  const deck = useDeck((s) => s.deck);
  const index = useDeck((s) => s.index);
  const step = useDeck((s) => s.step);
  const startedAt = useDeck((s) => s.startedAt);
  const list = scenesFor(deck);
  const scene = list[index];
  const [now, setNow] = useState(() => Date.now());
  const [connected, setConnected] = useState(() => readSync() !== null);
  const [tab, setTab] = useState<"notes" | "map">("notes");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    applyDocumentMeta("Presenter view · GitHub Universe 2026");
    focusElement(rootRef.current);
    const id = window.setInterval(() => {
      setNow(Date.now());
      setConnected(readSync() !== null);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const opts = { scope };
  useAppShortcut(["right", "space", "pagedown", "down", "enter"], () => sendCommand({ cmd: "advance" }), opts);
  useAppShortcut(["left", "shift+space", "pageup", "up", "backspace"], () => sendCommand({ cmd: "retreat" }), opts);
  useAppShortcut("shift+right", () => sendCommand({ cmd: "next" }), opts);
  useAppShortcut("shift+left", () => sendCommand({ cmd: "prev" }), opts);
  useAppShortcut(["home", "0"], () => sendCommand({ cmd: "home" }), opts);
  useAppShortcut("r", () => sendCommand({ cmd: "reset" }), opts);
  useAppShortcut("s", () => sendCommand({ cmd: "skip" }), opts);
  useAppShortcut(["b", "."], () => sendCommand({ cmd: "blackout" }), opts);
  useAppShortcut(["g", "m"], () => setTab((t) => (t === "map" ? "notes" : "map")), opts);
  useAppShortcut("n", () => setTab("notes"), opts);
  const section = (n: number) => () => sendCommand({ cmd: "goto", deck: "main", index: sectionStartIndex(n) });
  useAppShortcut("1", section(1), opts);
  useAppShortcut("2", section(2), opts);
  useAppShortcut("3", section(3), opts);
  useAppShortcut("4", section(4), opts);
  useAppShortcut("5", section(5), opts);

  const accent = scene.section ? SECTION_BY_ID[scene.section].accent : KEYNOTE_ACCENT;
  const next = nextAction(deck, index, step);
  const prev = prevAction(deck, index, step);
  const nextIndex = next.kind === "step" ? index : index + 1;
  const nextStep = next.kind === "step" ? next.to : 0;
  const label = sceneLabel(scene);
  const clock = new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Clicking a control leaves focus on it; hand focus back so Space and the
  // arrows keep driving the keynote rather than re-pressing that button.
  const reclaim = () => window.requestAnimationFrame(() => focusElement(rootRef.current));

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      {...scope.bindings}
      onPointerUp={reclaim}
      className="min-h-full bg-[#07080b] text-white outline-none"
      style={accentVars(accent)}
    >
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/10 px-5 py-3">
        <h1 className="text-base font-semibold">Presenter view</h1>
        <span className="flex min-w-0 items-center gap-2 text-sm text-zinc-300">
          {deck === "future" ? (
            <Sparkles className="size-4 text-fuchsia-300" aria-hidden="true" />
          ) : (
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: accent.hex }} />
          )}
          <span className="truncate">
            {placeText(deck, scene)} <span className="text-zinc-500">/</span>{" "}
            <span className="font-semibold text-white">{label.title}</span>
            {label.beat ? ` · ${label.beat}` : ""}
          </span>
          <span className="shrink-0 text-zinc-400 tabular">
            {index + 1} of {list.length}
          </span>
        </span>
        <span className="ml-auto flex items-center gap-2 text-sm" aria-live="off">
          <span className="text-zinc-400">Elapsed</span>
          <span className="text-2xl font-semibold tabular">{startedAt ? fmt(now - startedAt) : "00:00"}</span>
        </span>
        <Btn onClick={() => sendCommand({ cmd: "timer-reset" })}>
          <TimerReset className="size-4" aria-hidden="true" />
          Restart timer
        </Btn>
        <span className="text-2xl font-semibold text-zinc-200 tabular">{clock}</span>
      </header>

      {!connected ? (
        <p role="status" className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <Monitor className="size-4" aria-hidden="true" />
          Waiting for the keynote window. Keep it open in this browser; this view follows it and sends your controls to it.
        </p>
      ) : null}

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Preview deck={deck} index={index} step={step} label="Now on screen" />
          <Dots step={step} steps={scene.steps} />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <section
              aria-label="What Next does"
              className="rounded-2xl border p-4"
              style={{ borderColor: `${accent.hex}66`, background: `${accent.hex}14` }}
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-zinc-300 uppercase">When you press Next</p>
              <p className="mt-1.5 text-xl leading-snug font-semibold text-white" aria-live="polite">
                {next.kind === "step"
                  ? `Reveals step ${next.to + 1} of ${next.total} on this screen`
                  : next.kind === "scene"
                    ? `Moves to ${sceneText(next.scene)}`
                    : "Nothing: this is the last screen"}
              </p>
              {next.kind === "step" && next.caption ? <p className="mt-1 text-base text-zinc-200">“{next.caption}”</p> : null}
              {next.kind === "scene" ? <p className="mt-1 text-base text-zinc-300">{placeText(deck, next.scene)}</p> : null}
              <p className="mt-2 text-sm text-zinc-400">
                Back {prev.kind === "step" ? "steps back on this screen" : prev.kind === "scene" ? `returns to ${sceneText(prev.scene)}` : "is at the start"}.
              </p>
            </section>
            <Preview deck={deck} index={nextIndex} step={nextStep} label={next.kind === "step" ? "After Next" : "Up next"} />
          </div>

          <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Remote controls">
            <Btn onClick={() => sendCommand({ cmd: "retreat" })} disabled={prev.kind === "start"}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Btn>
            <Btn primary onClick={() => sendCommand({ cmd: "advance" })} disabled={next.kind === "end"}>
              Next
              <ArrowRight className="size-5" aria-hidden="true" />
            </Btn>
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-white/15" />
            <Btn onClick={() => sendCommand({ cmd: "prev" })} label="Previous screen (Shift+Left)" disabled={index === 0}>
              <ChevronsLeft className="size-4" aria-hidden="true" />
              Screen
            </Btn>
            <Btn onClick={() => sendCommand({ cmd: "next" })} label="Next screen (Shift+Right)" disabled={index >= list.length - 1}>
              Screen
              <ChevronsRight className="size-4" aria-hidden="true" />
            </Btn>
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-white/15" />
            <Btn onClick={() => sendCommand({ cmd: "home" })}>
              <House className="size-4" aria-hidden="true" />
              Home
            </Btn>
            <Btn onClick={() => sendCommand({ cmd: "reset" })}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset demo
            </Btn>
            <Btn onClick={() => sendCommand({ cmd: "skip" })}>
              <FastForward className="size-4" aria-hidden="true" />
              Skip animation
            </Btn>
            <Btn onClick={() => sendCommand({ cmd: "blackout" })}>
              <Square className="size-4" aria-hidden="true" />
              Black screen
            </Btn>
          </div>

        </div>

        <aside className="flex flex-col rounded-2xl border border-white/10 bg-[#0d0e12] lg:max-h-[calc(100dvh-7rem)]">
          <div className="flex items-center gap-2 border-b border-white/10 p-3" role="group" aria-label="Side panel">
            {(
              [
                { id: "notes", label: "Notes", icon: NotebookText, key: "N" },
                { id: "map", label: "Map", icon: ListTree, key: "G" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-white",
                  tab === t.id ? "bg-white text-zinc-950" : "text-zinc-200 hover:bg-white/10",
                )}
              >
                <t.icon className="size-4" aria-hidden="true" />
                {t.label}
                <kbd className={cn("rounded px-1 text-xs", tab === t.id ? "bg-zinc-200 text-zinc-700" : "border border-white/20 text-zinc-300")}>
                  {t.key}
                </kbd>
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {tab === "notes" ? (
              <>
                <h2 className="text-xl font-semibold">{scene.title}</h2>
                <div className="mt-4">
                  <NotesContent scene={scene} step={step} large />
                </div>
              </>
            ) : (
              <Outline deck={deck} index={index} />
            )}
          </div>
          <p className="border-t border-white/10 px-5 py-3 text-xs leading-relaxed text-zinc-400">
            Keys here drive the keynote window: → or Space next, ← back, Shift+arrows a whole screen, Home, 1 to 5, R, S, B.
          </p>
        </aside>
      </div>
    </div>
  );
}

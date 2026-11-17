import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  EyeOff,
  House,
  Keyboard,
  LayoutGrid,
  Maximize,
  MoreHorizontal,
  NotebookText,
  Presentation,
  RotateCcw,
  Sparkles,
  Square,
  UserPen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scenesFor, useDeck } from "@/deck/deck-store";
import { nextAction, nextText, placeText, prevAction, sceneLabel } from "@/deck/nav-labels";
import { toggleFullscreen } from "@/deck/fullscreen";
import { KEYNOTE_ACCENT, SECTION_BY_ID } from "@/data/sections";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { href } from "../../lib/navigation";

/** Height of the docked bar in CSS pixels; the stage sits above it when docked. */
export const NAV_BAR_HEIGHT = 64;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Hint({ label, keys, children }: { label: string; keys?: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="text-sm">
        {label}
        {keys ? <span className="ml-1.5 rounded bg-background/20 px-1.5 font-semibold">{keys}</span> : null}
      </TooltipContent>
    </Tooltip>
  );
}

/** Section-coloured strip showing how far through the deck we are. */
function ProgressLine({ className }: { className?: string }) {
  const deck = useDeck((s) => s.deck);
  const index = useDeck((s) => s.index);
  const step = useDeck((s) => s.step);
  const list = scenesFor(deck);
  const scene = list[index];
  const segments = useMemo(() => {
    const out: { color: string; count: number }[] = [];
    for (const s of list) {
      const color = s.section ? SECTION_BY_ID[s.section].accent.hex : KEYNOTE_ACCENT.hex;
      const last = out[out.length - 1];
      if (last && last.color === color) last.count += 1;
      else out.push({ color, count: 1 });
    }
    return out;
  }, [list]);
  const pct = ((index + (scene.steps ? step / (scene.steps + 1) : 0) + 1) / list.length) * 100;
  return (
    <div className={cn("relative h-[3px] w-full", className)} aria-hidden="true">
      <div className="absolute inset-0 flex">
        {segments.map((seg, i) => (
          <div key={i} style={{ flexGrow: seg.count, background: seg.color, opacity: 0.3 }} />
        ))}
      </div>
      <motion.div
        className="absolute inset-y-0 left-0 bg-white"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </div>
  );
}

/** Dots for the reveals on the current screen: filled = shown. */
function StepDots({ step, steps, className }: { step: number; steps: number; className?: string }) {
  if (steps <= 0) return null;
  return (
    <span
      role="img"
      aria-label={`Step ${step + 1} of ${steps + 1} on this screen`}
      className={cn("flex shrink-0 items-center gap-1.5", className)}
    >
      {Array.from({ length: steps + 1 }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === step ? "w-4 bg-white" : i < step ? "w-1.5 bg-white/80" : "w-1.5 bg-white/25",
          )}
        />
      ))}
    </span>
  );
}

/**
 * The keynote's navigation bar. Docked (always visible) in a window; in
 * fullscreen it folds down to a slim position strip until the pointer moves.
 */
export function NavBar({
  expanded,
  onHoverChange,
  onPresenterWindow,
  refocusStage,
}: {
  expanded: boolean;
  onHoverChange: (hovering: boolean) => void;
  onPresenterWindow: () => void;
  refocusStage: () => void;
}) {
  const deck = useDeck((s) => s.deck);
  const index = useDeck((s) => s.index);
  const step = useDeck((s) => s.step);
  const notes = useDeck((s) => s.notes);
  const returnTo = useDeck((s) => s.returnTo);
  const d = useDeck.getState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const list = scenesFor(deck);
  const scene = list[index];
  const section = scene.section ? SECTION_BY_ID[scene.section] : null;
  const dot = section?.accent.hex ?? KEYNOTE_ACCENT.hex;
  const label = sceneLabel(scene);
  const place = placeText(deck, scene);
  const next = nextAction(deck, index, step);
  const prev = prevAction(deck, index, step);
  const atHome = deck === "main" && index === 0;
  const tour = deck === "future";
  const showFull = expanded || menuOpen || focusWithin;
  const position =
    tour && scene.tourIndex ? `Moment ${scene.tourIndex} of 5` : `${index + 1} / ${list.length}`;
  const where = `${place}: ${label.title}${label.beat ? `, ${label.beat}` : ""}`;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <motion.nav
        aria-label="Keynote navigation"
        className={cn(
          "relative border-t border-white/10 bg-[#08090c]/95 backdrop-blur-md",
          showFull ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={{ height: NAV_BAR_HEIGHT }}
        initial={false}
        animate={showFull ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
        }}
      >
            <ProgressLine className="absolute inset-x-0 -top-px" />
            <div className="flex h-full items-center gap-1.5 px-2 sm:gap-2 sm:px-3">
              <Hint label="Home screen" keys="Home">
                <button
                  type="button"
                  onClick={d.goHome}
                  aria-label="Home screen"
                  aria-current={atHome ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-zinc-100 transition hover:bg-white/10",
                    atHome && "bg-white/10 text-white",
                    FOCUS,
                  )}
                >
                  <House className="size-[18px]" aria-hidden="true" />
                  <span className="hidden sm:inline">Home</span>
                </button>
              </Hint>

              {returnTo ? (
                <button
                  type="button"
                  onClick={d.backToExplore}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 px-3 text-[14px] font-semibold text-white transition hover:bg-white/10",
                    FOCUS,
                  )}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  <span>
                    Back<span className="hidden md:inline"> to Explore</span>
                  </span>
                </button>
              ) : null}

              {tour ? (
                <button
                  type="button"
                  onClick={d.exitTour}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-fuchsia-300/40 px-3 text-[14px] font-semibold text-fuchsia-100 transition hover:bg-fuchsia-300/10",
                    FOCUS,
                  )}
                >
                  <X className="size-4" aria-hidden="true" />
                  <span>
                    Exit<span className="hidden md:inline"> Highlights</span>
                  </span>
                </button>
              ) : null}

              <span aria-hidden="true" className="mx-0.5 hidden h-6 w-px shrink-0 bg-white/15 sm:block" />

              <Hint label="Open the map to jump anywhere" keys="G">
                <button
                  type="button"
                  onClick={() => d.setJump(true)}
                  aria-label={`You are at ${where}. Open the map`}
                  className={cn(
                    "group flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-full px-3 text-left transition hover:bg-white/[0.07]",
                    FOCUS,
                  )}
                >
                  {tour ? (
                    <Sparkles className="size-4 shrink-0 text-fuchsia-300" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: dot }} />
                  )}
                  <span className="hidden shrink-0 text-[14px] text-zinc-300 lg:inline">{place}</span>
                  <span aria-hidden="true" className="hidden shrink-0 text-zinc-500 lg:inline">
                    /
                  </span>
                  <span className="min-w-0 truncate text-[15px] font-semibold text-white">
                    {label.title}
                    {label.beat ? <span className="font-normal text-zinc-300"> · {label.beat}</span> : null}
                  </span>
                  <span className="hidden shrink-0 text-[13px] text-zinc-400 tabular md:inline">{position}</span>
                </button>
              </Hint>

              <StepDots step={step} steps={scene.steps} className="hidden px-1 sm:flex" />

              <Hint label={prev.kind === "step" ? "Back one step" : "Previous screen"} keys="←">
                <button
                  type="button"
                  onClick={d.retreat}
                  disabled={prev.kind === "start"}
                  aria-label="Back"
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 px-3 text-[14px] font-semibold text-white transition hover:bg-white/10 disabled:opacity-35 sm:px-4",
                    FOCUS,
                  )}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              </Hint>

              <Hint label={next.kind === "step" ? "Reveal the next step" : "Next screen"} keys="→ or Space">
                <button
                  type="button"
                  onClick={d.advance}
                  disabled={next.kind === "end"}
                  aria-label={`Next: ${nextText(next)}`}
                  className={cn(
                    "inline-flex h-10 max-w-[360px] shrink-0 items-center gap-2 rounded-full bg-white pr-3 pl-4 text-[14px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-40",
                    FOCUS,
                  )}
                >
                  <span className="shrink-0">Next</span>
                  <span className="hidden min-w-0 truncate font-medium text-zinc-600 md:inline">{nextText(next)}</span>
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </button>
              </Hint>

              <Hint label="Map: every section and announcement" keys="G">
                <button
                  type="button"
                  onClick={() => d.setJump(true)}
                  aria-label="Map"
                  className={cn(
                    "hidden h-10 shrink-0 items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-zinc-100 transition hover:bg-white/10 sm:inline-flex",
                    FOCUS,
                  )}
                >
                  <LayoutGrid className="size-[18px]" aria-hidden="true" />
                  <span className="hidden xl:inline">Map</span>
                </button>
              </Hint>

              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="More controls"
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-100 transition hover:bg-white/10",
                      FOCUS,
                    )}
                  >
                    <MoreHorizontal className="size-5" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  sideOffset={10}
                  className="dark w-72 border-white/15 bg-[#0d0e12] text-zinc-100"
                  onCloseAutoFocus={(e) => {
                    e.preventDefault();
                    refocusStage();
                  }}
                >
                  <DropdownMenuItem onSelect={tour ? d.exitTour : d.startTour}>
                    <Sparkles aria-hidden="true" />
                    {tour ? "Leave Highlights" : "Highlights"}
                    <DropdownMenuShortcut>T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => d.setExplore(true)}>
                    <Compass aria-hidden="true" />
                    Explore all announcements
                    <DropdownMenuShortcut>O</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={onPresenterWindow}>
                    <Presentation aria-hidden="true" />
                    Presenter window
                    <DropdownMenuShortcut>P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={d.toggleNotes}>
                    <NotebookText aria-hidden="true" />
                    {notes ? "Hide presenter notes" : "Show presenter notes"}
                    <DropdownMenuShortcut>N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={toggleFullscreen}>
                    <Maximize aria-hidden="true" />
                    Fullscreen
                    <DropdownMenuShortcut>F</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={d.toggleBlackout}>
                    <Square aria-hidden="true" />
                    Black screen
                    <DropdownMenuShortcut>B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={d.resetDemo}>
                    <RotateCcw aria-hidden="true" />
                    Reset this screen
                    <DropdownMenuShortcut>R</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={d.openProfile}>
                    <UserPen aria-hidden="true" />
                    Your presenter details
                    <DropdownMenuShortcut>E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => d.setHelp(true)}>
                    <Keyboard aria-hidden="true" />
                    Keys and navigation help
                    <DropdownMenuShortcut>?</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href={href("octoverse/momentum/")}>
                      <Presentation aria-hidden="true" />
                      Original presentation
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={href("making-of/")}>
                      <NotebookText aria-hidden="true" />
                      How this was built
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={d.toggleHud}>
                    <EyeOff aria-hidden="true" />
                    Hide these controls
                    <DropdownMenuShortcut>H</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
      </motion.nav>
      <AnimatePresence initial={false}>
        {!showFull ? (
          <motion.div
            key="strip"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2.5 px-5 pb-3 text-[13px] font-medium text-white/65">
              {tour ? (
                <Sparkles className="size-3.5 text-fuchsia-300" aria-hidden="true" />
              ) : (
                <span aria-hidden="true" className="size-2 rounded-full" style={{ background: dot }} />
              )}
              <span>
                {label.title}
                {label.beat ? ` · ${label.beat}` : ""}
              </span>
              <StepDots step={step} steps={scene.steps} className="opacity-80" />
            </div>
            <ProgressLine />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

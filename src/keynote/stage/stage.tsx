import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useAppShortcut, useShortcutScope } from "@/components/shortcut-provider";
import { LiveStatus } from "@/components/live-status";
import { TooltipProvider } from "@/components/ui/tooltip";
import { scenesFor, useDeck } from "@/deck/deck-store";
import { toggleFullscreen, useIsFullscreen } from "@/deck/fullscreen";
import { useAudienceSync } from "@/deck/sync";
import { subscribeProfileStorage } from "@/deck/presenter-profile";
import type { DeckId, Scene } from "@/deck/types";
import { KEYNOTE_ACCENT, SECTION_BY_ID } from "@/data/sections";
import { EASE_OUT } from "@/kit/motion";
import { accentVars } from "@/kit/ui";
import { focusElement } from "@/kit/focus";
import { SceneView } from "@/scenes/scene-view";
import { preloadVisuals } from "@/scenes/visual-registry";
import { Backdrop, preloadGalaxy } from "@/stage/backdrop";
import { NAV_BAR_HEIGHT, NavBar } from "@/stage/nav-bar";
import { NotesPanel } from "@/stage/notes-panel";
import { MapDialog } from "@/stage/map-dialog";
import { HelpDialog } from "@/stage/help-dialog";
import { ProfileDialog } from "@/stage/profile-dialog";
import { ScaledCanvas } from "@/stage/scaled-canvas";
import { ExploreView } from "@/explore/explore-view";
import { applyDocumentMeta } from "@/stage/document-meta";

const GALAXY_KINDS = new Set(["opening", "recap", "tour-intro", "tour-finale"]);

export function accentForScene(scene: Scene) {
  return scene.section ? SECTION_BY_ID[scene.section].accent : KEYNOTE_ACCENT;
}

/** Restore a deep link (#scene=<id> or #tour=<id>) on load. */
function readHash(): { deck: DeckId; index: number } | null {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const tourId = params.get("tour");
  const sceneId = params.get("scene");
  if (tourId) {
    const i = scenesFor("future").findIndex((s) => s.id === tourId);
    if (i >= 0) return { deck: "future", index: i };
  }
  if (sceneId) {
    const i = scenesFor("main").findIndex((s) => s.id === sceneId);
    if (i >= 0) return { deck: "main", index: i };
  }
  return null;
}

export function openPresenterWindow() {
  const url = new URL(window.location.href);
  url.searchParams.set("presenter", "1");
  url.hash = "";
  const w = window.open(url.toString(), "universe-presenter", "popup=yes,width=1360,height=860");
  if (!w) {
    toast("The presenter window was blocked", {
      description: "Allow pop-ups for this page, or open the app in its own browser tab and press P again. Notes are also available here with N.",
    });
  }
}

type SceneLayer = { key: string; scene: Scene; step: number; resetKey: number };
type LayerState = { cur: SceneLayer; prev: SceneLayer | null; exitDir: number; navigated: boolean };
const noop = () => undefined;

/**
 * Scene transitions with at most two layers: the scene on screen and the one
 * leaving. Navigating again before an exit finishes drops the older layer at
 * once, so holding an arrow key never stacks up mounted scenes.
 */
function SceneLayers({
  deck,
  scene,
  step,
  direction,
  resetNonce,
  setStep,
  onReset,
}: {
  deck: DeckId;
  scene: Scene;
  step: number;
  direction: number;
  resetNonce: number;
  setStep: (n: number) => void;
  onReset: () => void;
}) {
  const key = `${deck}-${scene.id}`;
  const [state, setState] = useState<LayerState>(() => ({
    cur: { key, scene, step, resetKey: resetNonce },
    prev: null,
    exitDir: direction,
    navigated: false,
  }));
  // Derived state: keep a record of what the current layer last rendered so the
  // outgoing scene keeps its revealed state while it animates away.
  let view = state;
  if (state.cur.key !== key) {
    view = { cur: { key, scene, step, resetKey: resetNonce }, prev: state.cur, exitDir: direction, navigated: true };
    setState(view);
  } else if (state.cur.step !== step || state.cur.resetKey !== resetNonce || state.cur.scene !== scene) {
    view = { ...state, cur: { key, scene, step, resetKey: resetNonce } };
    setState(view);
  }

  const tour = deck === "future";
  const duration = tour ? 0.75 : 0.55;
  const prevKey = view.prev?.key;
  useEffect(() => {
    if (!prevKey) return;
    const t = window.setTimeout(
      () => setState((s) => (s.prev?.key === prevKey ? { ...s, prev: null } : s)),
      duration * 1000 + 150,
    );
    return () => window.clearTimeout(t);
  }, [prevKey, duration]);

  const variants = {
    enter: (dir: number) =>
      tour ? { opacity: 0, scale: 0.86, filter: "blur(14px)" } : { opacity: 0, x: dir * 90, scale: 0.985 },
    center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) =>
      tour ? { opacity: 0, scale: 1.14, filter: "blur(14px)" } : { opacity: 0, x: dir * -90, scale: 0.985 },
  };
  const transition = { duration, ease: EASE_OUT };

  return (
    <>
      {view.prev ? (
        <motion.div
          key={view.prev.key}
          custom={view.exitDir}
          variants={variants}
          initial={false}
          animate="exit"
          transition={transition}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          inert
          data-exiting="true"
        >
          <SceneView
            scene={view.prev.scene}
            step={view.prev.step}
            setStep={noop}
            resetKey={view.prev.resetKey}
            onReset={noop}
          />
        </motion.div>
      ) : null}
      <motion.div
        key={view.cur.key}
        custom={direction}
        variants={variants}
        initial={view.navigated ? "enter" : false}
        animate="center"
        transition={transition}
        className="absolute inset-0"
      >
        <SceneView scene={scene} step={step} setStep={setStep} resetKey={resetNonce} onReset={onReset} />
      </motion.div>
    </>
  );
}

export function Stage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scope = useShortcutScope("keynote-stage");
  const deck = useDeck((s) => s.deck);
  const index = useDeck((s) => s.index);
  const step = useDeck((s) => s.step);
  const direction = useDeck((s) => s.direction);
  const hud = useDeck((s) => s.hud);
  const notes = useDeck((s) => s.notes);
  const explore = useDeck((s) => s.explore);
  const blackout = useDeck((s) => s.blackout);
  const instant = useDeck((s) => s.instant);
  const resetNonce = useDeck((s) => s.resetNonce);
  const warpNonce = useDeck((s) => s.warpNonce);
  const d = useDeck.getState();
  const list = scenesFor(deck);
  const scene = list[index];
  const accent = accentForScene(scene);

  useAudienceSync();
  useEffect(() => subscribeProfileStorage(), []);
  useEffect(() => applyDocumentMeta("GitHub Universe 2026 · Interactive keynote"), []);

  // Deep link in, then keep the hash in step with the current scene (no history entries).
  useLayoutEffect(() => {
    const target = readHash();
    if (target) useDeck.getState().goTo(target.deck, target.index, 0);
  }, []);
  useEffect(() => {
    const hash = deck === "future" ? `#tour=${scene.id}` : index === 0 ? "" : `#scene=${scene.id}`;
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    try {
      window.history.replaceState(window.history.state, "", url);
    } catch {
      // Some hosts disallow history updates; deep links are a convenience.
    }
  }, [deck, index, scene.id]);

  // Force the dark stage regardless of OS theme.
  useLayoutEffect(() => {
    const el = document.documentElement;
    const had = el.classList.contains("dark");
    el.classList.add("dark");
    return () => {
      if (!had) el.classList.remove("dark");
    };
  }, []);

  // Keyboard focus lives on the stage so the presenter never has to click first.
  useEffect(() => {
    focusElement(rootRef.current);
    const t = window.setTimeout(() => {
      void preloadVisuals();
      void preloadGalaxy();
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  const refocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"][data-state="open"], [aria-modal="true"]')) return;
      if (useDeck.getState().explore) return;
      const el = rootRef.current;
      if (!el) return;
      // Keep focus inside the stage; only reclaim it from elsewhere or to re-arm the scope.
      if (!el.contains(document.activeElement) || document.activeElement === document.body) focusElement(el);
      else if (document.activeElement !== el) el.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (!explore) refocus();
  }, [explore, refocus]);

  // In a window the navigation bar is docked and always visible. In fullscreen it
  // tucks away into a slim position strip and returns when the pointer moves.
  const fullscreen = useIsFullscreen();
  const [active, setActive] = useState(true);
  const [barHover, setBarHover] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const poke = useCallback(() => {
    setActive(true);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setActive(false), 3000);
  }, []);
  useEffect(() => {
    poke();
    return () => window.clearTimeout(idleTimer.current);
  }, [poke]);
  const docked = hud && !fullscreen;
  const barExpanded = !fullscreen || active || barHover || notes;

  // Touch: a horizontal swipe on the stage moves Next / Back.
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    poke();
    const t = e.target as HTMLElement;
    swipe.current =
      e.pointerType === "touch" && !t.closest("button, a, input, textarea, select, nav, [role='slider'], [role='dialog']")
        ? { x: e.clientX, y: e.clientY, t: performance.now() }
        : null;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (explore) return;
    if (start && e.pointerType === "touch") {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && performance.now() - start.t < 700) {
        if (dx < 0) d.advance();
        else d.retreat();
      }
    }
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
    refocus();
  };

  // ---------------------------------------------------------------- shortcuts
  const opts = { scope, enabled: !explore };
  // One forward key model, like a slide deck: Next reveals what is left on this
  // screen, then moves on. Clickers send Page Down / Page Up or the arrows.
  useAppShortcut(["right", "space", "pagedown", "down", "enter"], () => d.advance(), opts);
  useAppShortcut(["left", "shift+space", "pageup", "up", "backspace"], () => d.retreat(), opts);
  useAppShortcut("shift+right", () => d.nextScene(), opts);
  useAppShortcut("shift+left", () => d.prevScene(), opts);
  useAppShortcut("home", () => d.goHome(), opts);
  useAppShortcut("end", () => {
    const st = useDeck.getState();
    d.goTo(st.deck, scenesFor(st.deck).length - 1, 0);
  }, opts);
  useAppShortcut("f", () => toggleFullscreen(), opts);
  useAppShortcut("h", () => d.toggleHud(), opts);
  useAppShortcut("n", () => d.toggleNotes(), opts);
  useAppShortcut(["g", "m"], () => d.setJump(true), opts);
  useAppShortcut("r", () => d.resetDemo(), opts);
  useAppShortcut("s", () => d.skip(), opts);
  useAppShortcut("p", () => openPresenterWindow(), opts);
  useAppShortcut("o", () => d.setExplore(true), opts);
  useAppShortcut("e", () => d.openProfile(), opts);
  useAppShortcut("?", () => d.setHelp(true), opts);
  useAppShortcut(["b", "."], () => d.toggleBlackout(), opts);
  useAppShortcut("t", () => (useDeck.getState().deck === "future" ? d.exitTour() : d.startTour()), opts);
  useAppShortcut("0", () => d.goHome(), opts);
  useAppShortcut("1", () => d.goToSection(1), opts);
  useAppShortcut("2", () => d.goToSection(2), opts);
  useAppShortcut("3", () => d.goToSection(3), opts);
  useAppShortcut("4", () => d.goToSection(4), opts);
  useAppShortcut("5", () => d.goToSection(5), opts);
  useAppShortcut("6", () => d.goToSceneId("recap", "main"), opts);
  useAppShortcut(
    "escape",
    () => {
      const st = useDeck.getState();
      if (st.blackout) return st.toggleBlackout();
      if (st.notes) return st.toggleNotes();
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    },
    opts,
  );

  // Announce scene changes for screen reader users (not on first load).
  const sceneKey = `${deck}-${index}`;
  const [firstKey] = useState(sceneKey);
  const [moved, setMoved] = useState(false);
  if (!moved && sceneKey !== firstKey) setMoved(true);
  const announce = moved ? `Scene ${index + 1} of ${list.length}: ${scene.title}` : "";

  // If focus was inside the scene that just left, bring it back to the stage so
  // the keyboard keeps driving the deck.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const el = rootRef.current;
      if (!el || useDeck.getState().explore) return;
      if (document.querySelector('[role="dialog"][data-state="open"], [aria-modal="true"]')) return;
      const a = document.activeElement;
      if (!a || a === document.body || !el.contains(a) || a.closest('[data-exiting="true"]')) focusElement(el);
    });
    return () => window.cancelAnimationFrame(id);
  }, [deck, index]);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        ref={rootRef}
        tabIndex={-1}
        data-stage-root=""
        {...scope.bindings}
        onPointerMove={poke}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        data-instant={instant ? "true" : undefined}
        aria-label="GitHub Universe 2026 interactive keynote"
        className={`fixed inset-0 overflow-hidden bg-[#050608] text-white outline-none ${fullscreen && !active && !explore ? "cursor-none" : ""}`}
        style={{ ...accentVars(accent), touchAction: "pan-y pinch-zoom" }}
      >
        <a
          href="#stage-slide"
          className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to the current scene
        </a>
        <Backdrop accent={accent.hex} accent2={accent.hex2} galaxy={GALAXY_KINDS.has(scene.kind)} warpNonce={warpNonce} />
        <div className="absolute inset-x-0 top-0" style={{ bottom: docked ? NAV_BAR_HEIGHT : 0 }}>
        <ScaledCanvas canvasClassName="select-none">
          <section
            id="stage-slide"
            tabIndex={-1}
            aria-roledescription="slide"
            aria-label={`${scene.title}, scene ${index + 1} of ${list.length}`}
            className="absolute inset-0 outline-none"
          >
            <SceneLayers
              deck={deck}
              scene={scene}
              step={step}
              direction={direction}
              resetNonce={resetNonce}
              setStep={d.setStep}
              onReset={d.resetDemo}
            />
          </section>
        </ScaledCanvas>
        </div>
        {hud ? (
          <NavBar
            expanded={barExpanded}
            onHoverChange={setBarHover}
            onPresenterWindow={openPresenterWindow}
            refocusStage={refocus}
          />
        ) : (
          <AnimatePresence>
            {active && !explore ? (
              <motion.button
                key="show-controls"
                type="button"
                onClick={() => d.toggleHud()}
                className="fixed right-3 bottom-3 z-30 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#08090c]/90 px-4 py-2 text-[14px] font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Show controls
                <kbd className="rounded border border-white/25 px-1.5 text-xs text-zinc-200">H</kbd>
              </motion.button>
            ) : null}
          </AnimatePresence>
        )}
        <NotesPanel />
        <MapDialog />
        <HelpDialog />
        <ProfileDialog />
        {explore ? <ExploreView /> : null}
        <AnimatePresence>
          {blackout ? (
            <motion.button
              type="button"
              key="blackout"
              aria-label="Black screen. Press B or Escape to return"
              className="fixed inset-0 z-[60] cursor-none bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => d.toggleBlackout()}
            />
          ) : null}
        </AnimatePresence>
        <LiveStatus>{announce}</LiveStatus>
      </div>
    </TooltipProvider>
  );
}

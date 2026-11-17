import { create } from "zustand";
import { MotionGlobalConfig } from "motion/react";
import type { DeckId, Scene } from "@/deck/types";
import { ANNOUNCEMENTS_START_INDEX, DECKS, sectionStartIndex } from "@/deck/scenes";

export interface DeckState {
  deck: DeckId;
  index: number;
  step: number;
  direction: 1 | -1;
  /** Presenter HUD (progress + controls). */
  hud: boolean;
  notes: boolean;
  jump: boolean;
  help: boolean;
  explore: boolean;
  /** Announcement open in the explore detail view. */
  exploreFocus: string | null;
  blackout: boolean;
  /** Presenter details editor. */
  profileOpen: boolean;
  resetNonce: number;
  /** Increments on every skip (S); in-scene sequences jump to their end state. */
  instantNonce: number;
  /** Short-lived flag while motion settles after a skip. */
  instant: boolean;
  /** Increments when a dramatic (warp) transition should play. */
  warpNonce: number;
  startedAt: number | null;
  /** Set when a scene was opened from Explore: the bar offers a way back. */
  returnTo: { focus: string | null } | null;
  advance: () => void;
  retreat: () => void;
  nextScene: () => void;
  prevScene: () => void;
  goTo: (deck: DeckId, index: number, step?: number) => void;
  goToSceneId: (id: string, deck?: DeckId) => void;
  goToSection: (n: number) => void;
  /** Home screen: the opening scene of the keynote, with every overlay closed. */
  goHome: () => void;
  /** Announcements: the "Five sections" overview at the start of the full keynote. */
  startAnnouncements: () => void;
  /** Open a keynote scene from Explore and remember the way back. */
  presentFromExplore: (index: number) => void;
  /** Reopen Explore where the presenter left it. */
  backToExplore: () => void;
  setStep: (step: number) => void;
  resetDemo: () => void;
  skip: () => void;
  startTour: () => void;
  exitTour: () => void;
  toggleHud: () => void;
  toggleNotes: () => void;
  setJump: (open: boolean) => void;
  setHelp: (open: boolean) => void;
  setExplore: (open: boolean, focus?: string | null) => void;
  toggleBlackout: () => void;
  openProfile: () => void;
  setProfileOpen: (open: boolean) => void;
  resetTimer: () => void;
  /** Applies a position received from another window without side effects. */
  applyRemote: (deck: DeckId, index: number, step: number) => void;
}

export function scenesFor(deck: DeckId): Scene[] {
  return DECKS[deck];
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

let skipTimer: number | undefined;

export const useDeck = create<DeckState>((set, get) => {
  const move = (deck: DeckId, index: number, step: number, direction: 1 | -1) => {
    const list = scenesFor(deck);
    const i = clamp(index, 0, list.length - 1);
    const s = clamp(step, 0, list[i].steps);
    const warp = deck === "future" && (get().deck !== deck || get().index !== i);
    set((st) => ({
      deck,
      index: i,
      step: s,
      direction,
      warpNonce: warp ? st.warpNonce + 1 : st.warpNonce,
      startedAt: st.startedAt ?? (i > 0 || deck === "future" ? Date.now() : null),
    }));
  };

  return {
    deck: "main",
    index: 0,
    step: 0,
    direction: 1,
    hud: true,
    notes: false,
    jump: false,
    help: false,
    explore: false,
    exploreFocus: null,
    blackout: false,
    profileOpen: false,
    resetNonce: 0,
    instantNonce: 0,
    instant: false,
    warpNonce: 0,
    startedAt: null,
    returnTo: null,

    advance: () => {
      const { deck, index, step } = get();
      const scene = scenesFor(deck)[index];
      if (step < scene.steps) set({ step: step + 1, direction: 1 });
      else get().nextScene();
    },
    retreat: () => {
      const { step } = get();
      if (step > 0) set({ step: step - 1, direction: -1 });
      else get().prevScene();
    },
    nextScene: () => {
      const { deck, index } = get();
      const list = scenesFor(deck);
      if (index < list.length - 1) move(deck, index + 1, 0, 1);
    },
    prevScene: () => {
      const { deck, index } = get();
      if (index > 0) {
        const prev = scenesFor(deck)[index - 1];
        move(deck, index - 1, prev.steps, -1);
      }
    },
    goTo: (deck, index, step = 0) => {
      const cur = get();
      move(deck, index, step, deck === cur.deck && index < cur.index ? -1 : 1);
    },
    goToSceneId: (id, deck) => {
      const target = deck ?? get().deck;
      let i = scenesFor(target).findIndex((s) => s.id === id);
      if (i >= 0) return get().goTo(target, i, 0);
      i = scenesFor("main").findIndex((s) => s.id === id);
      if (i >= 0) get().goTo("main", i, 0);
    },
    goToSection: (n) => {
      const i = sectionStartIndex(n);
      if (i >= 0) get().goTo("main", i, 0);
    },
    setStep: (step) => {
      const { deck, index } = get();
      const scene = scenesFor(deck)[index];
      const s = clamp(step, 0, scene.steps);
      set((st) => ({ step: s, direction: s >= st.step ? 1 : -1 }));
    },
    resetDemo: () => set((st) => ({ step: 0, resetNonce: st.resetNonce + 1, direction: -1 })),
    skip: () => {
      MotionGlobalConfig.instantAnimations = true;
      set((st) => ({ instant: true, instantNonce: st.instantNonce + 1 }));
      window.clearTimeout(skipTimer);
      skipTimer = window.setTimeout(() => {
        MotionGlobalConfig.instantAnimations = false;
        set({ instant: false });
      }, 450);
    },
    goHome: () => {
      set({ explore: false, exploreFocus: null, returnTo: null, jump: false, help: false, blackout: false });
      const { deck, index } = get();
      if (deck !== "main" || index !== 0) move("main", 0, 0, -1);
      else set({ step: 0 });
    },
    startAnnouncements: () => {
      set({ explore: false, exploreFocus: null, returnTo: null, jump: false, help: false, blackout: false });
      move("main", ANNOUNCEMENTS_START_INDEX, 0, 1);
    },
    presentFromExplore: (index) => {
      const focus = get().exploreFocus;
      set({ explore: false, exploreFocus: null, returnTo: { focus } });
      move("main", index, 0, 1);
    },
    backToExplore: () => {
      const r = get().returnTo;
      set({ explore: true, exploreFocus: r?.focus ?? null, returnTo: null });
    },
    startTour: () => {
      set({ explore: false, exploreFocus: null, returnTo: null });
      move("future", 0, 0, 1);
      set((st) => ({ warpNonce: st.warpNonce + 1 }));
    },
    exitTour: () => move("main", 0, 0, -1),
    toggleHud: () => set((st) => ({ hud: !st.hud })),
    toggleNotes: () => set((st) => ({ notes: !st.notes })),
    setJump: (open) => set({ jump: open }),
    setHelp: (open) => set({ help: open }),
    setExplore: (open, focus = null) =>
      set((st) => ({ explore: open, exploreFocus: open ? focus : null, returnTo: open ? null : st.returnTo })),
    toggleBlackout: () => set((st) => ({ blackout: !st.blackout })),
    openProfile: () => set({ profileOpen: true }),
    setProfileOpen: (open) => set({ profileOpen: open }),
    resetTimer: () => set({ startedAt: Date.now() }),
    applyRemote: (deck, index, step) => {
      const list = scenesFor(deck);
      const i = clamp(index, 0, list.length - 1);
      const s = clamp(step, 0, list[i].steps);
      const cur = get();
      if (cur.deck === deck && cur.index === i && cur.step === s) return;
      set({ deck, index: i, step: s, direction: i >= cur.index ? 1 : -1 });
    },
  };
});

/** Current scene selector helper. */
export function useCurrentScene(): Scene {
  return useDeck((s) => scenesFor(s.deck)[s.index]);
}

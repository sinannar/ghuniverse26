import { useEffect } from "react";
import type { DeckId } from "@/deck/types";
import { useDeck } from "@/deck/deck-store";
import { COMMAND_KEY, SYNC_KEY } from "@/deck/storage-keys";

// Same-origin windows share localStorage, and the `storage` event fires in every
// other window when a value changes. That is the whole sync channel: no network,
// no parent-frame messaging. Both directions degrade silently when storage is
// unavailable; the audience window never depends on the presenter window.

export interface SyncState {
  deck: DeckId;
  index: number;
  step: number;
  startedAt: number | null;
  resetNonce: number;
  at: number;
}

export type RemoteCommand =
  | { cmd: "advance" | "retreat" | "next" | "prev" | "reset" | "skip" | "notes" | "blackout" | "home" }
  | { cmd: "goto"; deck: DeckId; index: number }
  | { cmd: "timer-reset" };

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: presenter sync is a convenience, never a dependency.
  }
}

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function isDeckId(v: unknown): v is DeckId {
  return v === "main" || v === "future";
}

/** Audience window: publish position changes and obey presenter-window commands. */
export function useAudienceSync() {
  useEffect(() => {
    const publish = () => {
      const s = useDeck.getState();
      const payload: SyncState = {
        deck: s.deck,
        index: s.index,
        step: s.step,
        startedAt: s.startedAt,
        resetNonce: s.resetNonce,
        at: Date.now(),
      };
      write(SYNC_KEY, payload);
    };
    publish();
    const unsub = useDeck.subscribe((s, prev) => {
      if (
        s.deck !== prev.deck ||
        s.index !== prev.index ||
        s.step !== prev.step ||
        s.startedAt !== prev.startedAt ||
        s.resetNonce !== prev.resetNonce
      )
        publish();
    });
    const onStorage = (e: StorageEvent) => {
      if (e.key !== COMMAND_KEY || !e.newValue) return;
      let c: (RemoteCommand & { nonce?: number }) | null = null;
      try {
        c = JSON.parse(e.newValue);
      } catch {
        return;
      }
      if (!c || typeof c !== "object") return;
      const d = useDeck.getState();
      switch (c.cmd) {
        case "advance":
          return d.advance();
        case "retreat":
          return d.retreat();
        case "next":
          return d.nextScene();
        case "prev":
          return d.prevScene();
        case "reset":
          return d.resetDemo();
        case "skip":
          return d.skip();
        case "notes":
          return d.toggleNotes();
        case "blackout":
          return d.toggleBlackout();
        case "timer-reset":
          return d.resetTimer();
        case "home":
          return d.goHome();
        case "goto":
          if (isDeckId(c.deck) && Number.isInteger(c.index)) d.goTo(c.deck, c.index, 0);
          return;
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsub();
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}

/** Presenter window: mirror the audience position. */
export function usePresenterSync() {
  useEffect(() => {
    const apply = (s: SyncState | null) => {
      if (!s || !isDeckId(s.deck)) return;
      const d = useDeck.getState();
      d.applyRemote(s.deck, s.index, s.step);
      if (s.startedAt !== d.startedAt) useDeck.setState({ startedAt: s.startedAt });
      if (s.resetNonce !== d.resetNonce) useDeck.setState({ resetNonce: s.resetNonce });
    };
    apply(read<SyncState>(SYNC_KEY));
    const onStorage = (e: StorageEvent) => {
      if (e.key !== SYNC_KEY || !e.newValue) return;
      try {
        apply(JSON.parse(e.newValue) as SyncState);
      } catch {
        // ignore malformed payloads
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}

let commandNonce = 0;
/** Presenter window: send a command to the audience window. */
export function sendCommand(command: RemoteCommand) {
  commandNonce += 1;
  write(COMMAND_KEY, { ...command, nonce: `${Date.now()}-${commandNonce}` });
}

/** True when the audience window has published a position in the last few seconds. */
export function readSync(): SyncState | null {
  return read<SyncState>(SYNC_KEY);
}

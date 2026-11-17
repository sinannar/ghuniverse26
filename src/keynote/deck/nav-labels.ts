import type { DeckId, Scene, SceneKind } from "@/deck/types";
import { ANNOUNCEMENT_BY_ID } from "@/data/announcements";
import { SECTION_BY_ID } from "@/data/sections";
import { scenesFor } from "@/deck/deck-store";
import { DATA_BEATS } from "@/deck/data-scenes";

// Plain-language labels for where the presenter is and what the next key press
// will do. Shared by the navigation bar, the map and the presenter window so
// every surface describes a scene the same way.

const BEAT: Partial<Record<SceneKind, string>> = {
  reveal: "Reveal",
  demo: "Demo",
  impact: "Why it matters",
  section: "Section intro",
  "tour-card": "Intro",
  "data-growth": "Growth",
  "data-agents": "Agents",
  "data-capacity": "Capacity",
  "data-repo": "One repository",
};

export interface SceneLabel {
  /** Announcement or scene name, e.g. "Copilot Fusion" or "The takeaways". */
  title: string;
  /** Which part of a multi-scene announcement this is, when it has parts. */
  beat?: string;
}

export function sceneLabel(scene: Scene): SceneLabel {
  if (scene.kind === "opening") return { title: "Home" };
  if (scene.kind === "tour-intro") return { title: "The five moments" };
  if (scene.kind === "tour-finale") return { title: "Recap" };
  if (scene.kind === "section" && scene.section) {
    return { title: SECTION_BY_ID[scene.section].title, beat: BEAT.section };
  }
  if (scene.announcementId) {
    const a = ANNOUNCEMENT_BY_ID[scene.announcementId];
    return { title: a.short ?? a.name, beat: BEAT[scene.kind] };
  }
  return { title: scene.title };
}

/** "Copilot Fusion · Demo" */
export function sceneText(scene: Scene): string {
  const l = sceneLabel(scene);
  return l.beat ? `${l.title} · ${l.beat}` : l.title;
}

/** The place a scene belongs to: a numbered section, Announcements (the full keynote) or Highlights. */
export function placeText(deck: DeckId, scene: Scene): string {
  if (deck === "future") return "Highlights";
  if (scene.section) {
    const s = SECTION_BY_ID[scene.section];
    return `${s.number}. ${s.title}`;
  }
  return scene.kind === "opening" ? "Universe 2026" : "Announcements";
}

export type NextAction =
  | { kind: "step"; to: number; total: number; caption?: string }
  | { kind: "scene"; index: number; scene: Scene }
  | { kind: "end" };

export type PrevAction =
  | { kind: "step"; to: number; total: number }
  | { kind: "scene"; index: number; scene: Scene }
  | { kind: "start" };

/** Step captions exist for scenes that play an announcement's demo beats. */
function captionFor(scene: Scene, step: number): string | undefined {
  if (!scene.announcementId) return undefined;
  const beats = DATA_BEATS[scene.id];
  if (beats) return beats[step];
  if (scene.kind !== "demo" && scene.kind !== "feature" && scene.kind !== "brief") return undefined;
  const a = ANNOUNCEMENT_BY_ID[scene.announcementId];
  return a.steps[step];
}

/** What Next (→, Space, clicker forward) does from this position. */
export function nextAction(deck: DeckId, index: number, step: number): NextAction {
  const list = scenesFor(deck);
  const scene = list[index];
  if (step < scene.steps) {
    return { kind: "step", to: step + 1, total: scene.steps + 1, caption: captionFor(scene, step + 1) };
  }
  const next = list[index + 1];
  return next ? { kind: "scene", index: index + 1, scene: next } : { kind: "end" };
}

/** What Back (←, clicker back) does from this position. */
export function prevAction(deck: DeckId, index: number, step: number): PrevAction {
  const list = scenesFor(deck);
  const scene = list[index];
  if (step > 0) return { kind: "step", to: step - 1, total: scene.steps + 1 };
  const prev = list[index - 1];
  return prev ? { kind: "scene", index: index - 1, scene: prev } : { kind: "start" };
}

/** Short description of the next press: the demo beat it plays, "Step 3 of 4", or the next scene. */
export function nextText(action: NextAction): string {
  if (action.kind === "step") return action.caption ?? `Step ${action.to + 1} of ${action.total}`;
  if (action.kind === "scene") return sceneText(action.scene);
  return "End of the deck";
}

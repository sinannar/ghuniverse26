// Browser storage keys, namespaced so other sites on the same origin (for example
// other GitHub Pages projects under one account) never collide with them.
const NS = "github-universe-2026-keynote";

/** Presenter details the speaker fills in (browser-saved record). */
export const RECORDS_KEY = `${NS}:records`;
/** Live position broadcast from the audience window to the presenter window. */
export const SYNC_KEY = `${NS}:deck-sync`;
/** Remote commands from the presenter window to the audience window. */
export const COMMAND_KEY = `${NS}:deck-command`;

export function isPresenterWindow(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("presenter") === "1";
  } catch {
    return false;
  }
}

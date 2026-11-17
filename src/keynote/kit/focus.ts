/**
 * Focus an element so its shortcut scope activates. Re-focusing an element that
 * already has focus fires no focus event (React StrictMode re-runs effects), so
 * blur it first.
 */
export function focusElement(el: HTMLElement | null | undefined) {
  if (!el) return;
  if (document.activeElement === el) el.blur();
  el.focus({ preventScroll: true });
}

/**
 * Hand keyboard focus back to the keynote stage after a dialog or menu closes.
 * Dialogs opened by a shortcut have no trigger to return to, and focus left on
 * the page body would leave the presenter's keys with nowhere to go. Explore
 * manages its own focus, so it is left alone while open.
 */
export function focusStage(isExploreOpen: boolean) {
  if (isExploreOpen) return;
  window.requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>("[data-stage-root]");
    if (!el) return;
    if (document.querySelector('[role="dialog"][data-state="open"]')) return;
    if (el.contains(document.activeElement) && document.activeElement !== document.body) return;
    focusElement(el);
  });
}

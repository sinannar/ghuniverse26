import { useSyncExternalStore } from "react";
import { toast } from "sonner";

/** Toggle fullscreen; explains the fallback when the host frame does not allow it. */
export function toggleFullscreen() {
  const doc = document;
  if (doc.fullscreenElement) {
    doc.exitFullscreen().catch(() => undefined);
    return;
  }
  if (!doc.fullscreenEnabled) {
    toast("Fullscreen isn't available inside this frame", {
      description: "Use your browser's own fullscreen (F11), or open the app in its own tab.",
    });
    return;
  }
  doc.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {
    toast("Fullscreen was blocked", {
      description: "Use your browser's own fullscreen (F11), or open the app in its own tab.",
    });
  });
}

function subscribeFullscreen(onChange: () => void) {
  const mq = window.matchMedia("(display-mode: fullscreen)");
  document.addEventListener("fullscreenchange", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    document.removeEventListener("fullscreenchange", onChange);
    mq.removeEventListener("change", onChange);
  };
}

function isFullscreenNow() {
  return !!document.fullscreenElement || window.matchMedia("(display-mode: fullscreen)").matches;
}

/** True while the app fills the screen (F, or the browser's own F11 fullscreen). */
export function useIsFullscreen(): boolean {
  return useSyncExternalStore(subscribeFullscreen, isFullscreenNow, () => false);
}

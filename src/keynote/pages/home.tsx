import { useMemo } from "react";
import { isPresenterWindow } from "@/deck/storage-keys";
import { Stage } from "@/stage/stage";
import { PresenterView } from "@/stage/presenter-view";
import { applyDocumentMeta } from "@/stage/document-meta";

// Set the tab title and icon before the first render so the browser never
// falls back to requesting /favicon.ico from the host.
applyDocumentMeta(isPresenterWindow() ? "Presenter view · GitHub Universe 2026" : "GitHub Universe 2026 · Interactive keynote");

/**
 * GitHub Universe 2026 interactive keynote. The audience window renders the
 * scaled stage; `?presenter=1` renders the synced presenter window.
 */
export function HomePage() {
  const presenter = useMemo(() => isPresenterWindow(), []);
  return presenter ? <PresenterView /> : <Stage />;
}

import { lazy, Suspense, type ComponentType } from "react";
import type { SectionId } from "@/deck/types";
import type { SceneProps, VisualProps } from "@/scenes/scene-types";

// Demos are split into one chunk per section and preloaded right after the
// first paint, so navigation never waits on the network once the app is open.
const loaders: Record<SectionId, () => Promise<{ default: ComponentType<VisualProps> }>> = {
  copilot: () => import("@/demos/copilot"),
  automation: () => import("@/demos/automation"),
  workflow: () => import("@/demos/workflow"),
  security: () => import("@/demos/security"),
  platform: () => import("@/demos/platform"),
};

const LAZY: Record<SectionId, ComponentType<VisualProps>> = {
  copilot: lazy(loaders.copilot),
  automation: lazy(loaders.automation),
  workflow: lazy(loaders.workflow),
  security: lazy(loaders.security),
  platform: lazy(loaders.platform),
};

// Section 5's full-screen data scenes (charts and the agent swarm) load the same way.
const loadDataScenes = () => import("@/scenes/platform-data");
const LazyDataScene = lazy(loadDataScenes);

export function preloadVisuals() {
  return Promise.all([...Object.values(loaders), loadDataScenes].map((load) => load().catch(() => undefined)));
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="kn-shimmer h-full w-full bg-[linear-gradient(90deg,transparent,var(--accent-hex),transparent)]" />
      </div>
    </div>
  );
}

export function SectionVisual({ section, ...props }: VisualProps & { section: SectionId }) {
  const Visual = LAZY[section];
  return (
    <Suspense fallback={<Fallback />}>
      <Visual {...props} />
    </Suspense>
  );
}

export function DataScene(props: SceneProps) {
  return (
    <Suspense fallback={<Fallback />}>
      <LazyDataScene {...props} />
    </Suspense>
  );
}

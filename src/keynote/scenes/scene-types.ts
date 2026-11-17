import type { Scene } from "@/deck/types";

export interface SceneProps {
  scene: Scene;
  step: number;
  setStep: (step: number) => void;
  /** Changes when the presenter resets the demo; demos key their local state on it. */
  resetKey: number;
  /** Resets the current demo (step 0 and fresh local state). */
  onReset: () => void;
  /** Rendered as a small preview (presenter window): no heavy effects. */
  preview?: boolean;
}

/** Which part of an announcement a section visual should render. */
export type VisualPart = "demo" | "problem" | "impact" | "visual";

export interface VisualProps {
  id: string;
  part: VisualPart;
  step: number;
  setStep: (step: number) => void;
  preview?: boolean;
}

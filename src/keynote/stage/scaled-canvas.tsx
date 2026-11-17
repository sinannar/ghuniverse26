import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/**
 * Renders a fixed 1920x1080 canvas scaled uniformly to fit its parent, centred
 * and letterboxed. Layout inside never reflows, so a scene looks identical on a
 * projector, a laptop or a presenter preview.
 */
export function ScaledCanvas({
  children,
  className,
  canvasClassName,
}: {
  children: ReactNode;
  className?: string;
  canvasClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ s: 0, x: 0, y: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const s = Math.min(w / STAGE_W, h / STAGE_H);
      setBox({ s, x: (w - STAGE_W * s) / 2, y: (h - STAGE_H * s) / 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className={cn("kn-stage-canvas", canvasClassName)}
        style={{
          transform: `translate(${box.x}px, ${box.y}px) scale(${box.s})`,
          visibility: box.s ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Keep mounted before the first update; only change its children after a commit.
export function LiveStatus({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {children}
    </p>
  );
}

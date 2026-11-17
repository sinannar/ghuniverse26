import { MotionConfig } from "motion/react";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppShortcutProvider } from "@/components/shortcut-provider";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "@/pages/home";

// The keynote is a single screen: the audience stage, or the presenter window when
// the URL carries ?presenter=1. Scene deep links live in the URL hash (#scene=...),
// so there is no router and any static host, GitHub Pages included, can serve it.
export function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AppShortcutProvider>
          <div className="flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col">
              <div className="flex-1">
                <HomePage />
              </div>
            </main>
            <Toaster />
          </div>
        </AppShortcutProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

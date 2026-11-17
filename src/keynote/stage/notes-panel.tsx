import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useCurrentScene, useDeck } from "@/deck/deck-store";
import { NotesContent } from "@/stage/notes-content";

/** In-window presenter notes. Hidden by default; N toggles it. */
export function NotesPanel() {
  const open = useDeck((s) => s.notes);
  const step = useDeck((s) => s.step);
  const toggle = useDeck((s) => s.toggleNotes);
  const scene = useCurrentScene();
  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="notes"
          aria-label="Presenter notes"
          className="fixed top-4 right-4 bottom-20 z-40 flex w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b0c10]/95 shadow-2xl"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">Presenter notes</p>
              <p className="truncate text-sm font-semibold text-white">{scene.title}</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Close presenter notes (N)"
              className="inline-flex size-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <NotesContent scene={scene} step={step} />
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

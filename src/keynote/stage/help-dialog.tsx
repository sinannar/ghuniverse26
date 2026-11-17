import { ArrowRight } from "lucide-react";
import { useDeck } from "@/deck/deck-store";
import { focusStage } from "@/kit/focus";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Row = { keys: string[][]; joiner?: "or" | "to"; text: string };

// Each inner array is one way to press it; keys inside it are pressed together.
const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Move",
    rows: [
      { keys: [["→"], ["Space"]], text: "Next: reveals the next step, then the next screen" },
      { keys: [["←"]], text: "Back one step" },
      { keys: [["Shift", "→"], ["Shift", "←"]], text: "Skip a whole screen forward or back" },
      { keys: [["Home"]], text: "Home screen" },
      { keys: [["G"]], text: "Map: see everything and jump anywhere" },
      { keys: [["1"], ["5"]], joiner: "to", text: "Jump straight to a section" },
    ],
  },
  {
    title: "Present",
    rows: [
      { keys: [["F"]], text: "Fullscreen. The controls tuck away until you move the mouse" },
      { keys: [["P"]], text: "Presenter window: notes, timer and what Next will do" },
      { keys: [["N"]], text: "Notes on this screen" },
      { keys: [["H"]], text: "Hide or show the controls" },
      { keys: [["B"]], text: "Black screen" },
      { keys: [["R"]], text: "Reset the demo" },
      { keys: [["S"]], text: "Skip the animation" },
    ],
  },
  {
    title: "Explore",
    rows: [
      { keys: [["T"]], text: "Highlights: five announcements, five demos" },
      { keys: [["O"]], text: "Explore all announcements" },
      { keys: [["E"]], text: "Your presenter details" },
      { keys: [["Esc"]], text: "Close what's open, or leave fullscreen" },
      { keys: [["?"]], text: "This help" },
    ],
  },
];

function Keycap({ k }: { k: string }) {
  return (
    <kbd className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-white/25 border-b-[3px] bg-white/10 px-2 font-sans text-[14px] font-semibold text-white">
      {k}
    </kbd>
  );
}

function Keys({ keys, joiner = "or" }: { keys: string[][]; joiner?: "or" | "to" }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {keys.map((combo, i) => (
        <span key={combo.join("+")} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-xs text-zinc-400">{joiner}</span> : null}
          {combo.map((k, j) => (
            <span key={k} className="flex items-center gap-1">
              {j > 0 ? <span className="text-xs text-zinc-400">+</span> : null}
              <Keycap k={k} />
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/** How Next works, drawn: the dots on a screen fill in, then the next screen arrives. */
function NextDiagram() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3" aria-hidden="true">
        {[0, 1, 2].map((filled) => (
          <span key={filled} className="flex items-center gap-4">
            <span className="flex h-12 w-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-[#13151b]">
              <span className="text-[11px] font-semibold text-zinc-300">This screen</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={i <= filled ? "size-1.5 rounded-full bg-white" : "size-1.5 rounded-full bg-white/25"} />
                ))}
              </span>
            </span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Keycap k="→" />
              <ArrowRight className="size-4" />
            </span>
          </span>
        ))}
        <span className="flex h-12 w-24 items-center justify-center rounded-lg border border-white/40 bg-white/10 text-[11px] font-semibold text-white">
          Next screen
        </span>
      </div>
      <figcaption className="mt-3 text-sm text-zinc-300">
        The dots in the bottom bar show what's left on a screen. Keep pressing Next; it never skips anything. A presentation
        clicker's forward and back buttons do the same, and on a touch screen you can swipe.
      </figcaption>
    </figure>
  );
}

export function HelpDialog() {
  const open = useDeck((s) => s.help);
  const setHelp = useDeck((s) => s.setHelp);
  return (
    <Dialog open={open} onOpenChange={setHelp}>
      <DialogContent
        className="dark max-w-5xl border-white/15 bg-[#0d0e12] text-zinc-100 sm:max-w-5xl"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          focusStage(useDeck.getState().explore);
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Getting around</DialogTitle>
          <DialogDescription className="text-base text-zinc-300">
            One key does almost everything: Next. Nothing moves on its own.
          </DialogDescription>
        </DialogHeader>
        <NextDiagram />
        <div className="grid gap-8 md:grid-cols-3">
          {GROUPS.map((g) => (
            <section key={g.title}>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">{g.title}</h3>
              <dl className="space-y-3">
                {g.rows.map((r) => (
                  <div key={r.text} className="flex flex-col gap-1.5">
                    <dt>
                      <Keys keys={r.keys} joiner={r.joiner} />
                    </dt>
                    <dd className="text-[15px] leading-snug text-zinc-200">{r.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

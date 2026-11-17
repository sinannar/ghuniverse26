import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Compass, House, LayoutGrid, MapPin, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppShortcut, useShortcutScope } from "@/components/shortcut-provider";
import { scenesFor, useDeck } from "@/deck/deck-store";
import { ANNOUNCEMENTS_START_INDEX } from "@/deck/scenes";
import { sceneLabel, sceneText } from "@/deck/nav-labels";
import type { DeckId, Scene } from "@/deck/types";
import { ANNOUNCEMENTS, ANNOUNCEMENT_BY_ID, announcementsIn } from "@/data/announcements";
import { SECTIONS } from "@/data/sections";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { focusStage } from "@/kit/focus";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const BEAT_SHORT: Record<string, string> = {
  reveal: "Reveal",
  demo: "Demo",
  impact: "Why it matters",
  "data-growth": "Growth",
  "data-agents": "Agents",
  "data-capacity": "Capacity",
  "data-repo": "One repository",
};
// Words that name a part of an announcement rather than the announcement itself.
const BEAT_WORDS: Record<string, "reveal" | "demo" | "impact"> = {
  reveal: "reveal",
  demo: "demo",
  impact: "impact",
  why: "impact",
  matters: "impact",
};

type Pos = { deck: DeckId; index: number };

function matches(hay: string, q: string) {
  if (!q) return true;
  const h = hay.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => h.includes(w));
}

/**
 * Spatial arrow-key movement between the map's buttons: the nearest button in
 * the pressed direction wins, so arrows walk down a section column, across to
 * the next column, and between the bands above and below it.
 */
function moveFocus(container: HTMLElement, from: HTMLElement, dir: "up" | "down" | "left" | "right"): HTMLElement | null {
  const items = Array.from(container.querySelectorAll<HTMLElement>("[data-map-item]"));
  const r = from.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of items) {
    if (el === from) continue;
    const b = el.getBoundingClientRect();
    if (!b.width && !b.height) continue;
    const bx = b.left + b.width / 2;
    const by = b.top + b.height / 2;
    let primary: number;
    let secondary: number;
    if (dir === "down") {
      if (b.top < r.bottom - 4) continue;
      primary = b.top - r.bottom;
      secondary = Math.max(0, Math.max(b.left - r.right, r.left - b.right)) || Math.abs(b.left - r.left) * 0.25;
    } else if (dir === "up") {
      if (b.bottom > r.top + 4) continue;
      primary = r.top - b.bottom;
      secondary = Math.max(0, Math.max(b.left - r.right, r.left - b.right)) || Math.abs(b.left - r.left) * 0.25;
    } else if (dir === "right") {
      if (b.left < r.right - 4) continue;
      primary = b.left - r.right;
      secondary = Math.abs(by - cy);
    } else {
      if (b.right > r.left + 4) continue;
      primary = r.left - b.right;
      secondary = Math.abs(by - cy);
    }
    const score = primary + secondary * 2 + (dir === "left" || dir === "right" ? 0 : Math.abs(bx - cx) * 0.01);
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }
  return best;
}

function Item({
  pos,
  current,
  onGo,
  className,
  children,
  label,
}: {
  pos: Pos;
  current: boolean;
  onGo: (p: Pos) => void;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      data-map-item=""
      data-current={current ? "true" : undefined}
      aria-current={current ? "location" : undefined}
      aria-label={label ? `${label}${current ? " (you are here)" : ""}` : undefined}
      onClick={() => onGo(pos)}
      className={cn(
        "relative rounded-lg text-left transition hover:bg-white/[0.08]",
        current && "bg-white/[0.1] ring-2 ring-[var(--map-accent)]",
        FOCUS,
        className,
      )}
    >
      {children}
    </button>
  );
}

function HereTag() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 align-middle text-[11px] font-bold tracking-wide text-zinc-950 uppercase">
      <MapPin className="size-3" aria-hidden="true" />
      You are here
    </span>
  );
}

/** G: the whole keynote on one screen. Search it, or arrow to any scene and press Enter. */
export function MapDialog() {
  const open = useDeck((s) => s.jump);
  const setJump = useDeck((s) => s.setJump);
  const deck = useDeck((s) => s.deck);
  const index = useDeck((s) => s.index);
  const d = useDeck.getState();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const main = scenesFor("main");
  const future = scenesFor("future");
  const q = query.trim();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const id = window.requestAnimationFrame(() => {
      bodyRef.current?.querySelector<HTMLElement>('[data-current="true"]')?.scrollIntoView({ block: "center" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const isCurrent = (p: Pos) => p.deck === deck && p.index === index;
  const go = (p: Pos) => {
    setJump(false);
    if (p.deck === "future" && deck !== "future") {
      d.startTour();
      if (p.index > 0) d.goTo("future", p.index, 0);
      return;
    }
    d.goTo(p.deck, p.index, 0);
  };

  const framing = useMemo(() => {
    const at = (id: string) => main.findIndex((s) => s.id === id);
    return {
      before: ["agenda"].map(at).filter((i) => i >= 0),
      after: ["recap"].map(at).filter((i) => i >= 0),
    };
  }, [main]);

  const sections = useMemo(
    () =>
      SECTIONS.map((sec) => {
        const intro = main.findIndex((s) => s.id === `section-${sec.id}`);
        const context = main.map((s, i) => ({ s, i })).filter(
          ({ s }) => s.section === sec.id && !s.announcementId && s.kind !== "section",
        );
        const items = announcementsIn(sec.id).map((a) => ({
          a,
          scenes: main.map((s, i) => ({ s, i })).filter(({ s }) => s.announcementId === a.id),
        }));
        return { sec, intro, context, items };
      }),
    [main],
  );

  const sceneHay = (s: Scene) => `${s.title} ${sceneText(s)}${s.kind === "agenda" ? " announcements overview agenda" : ""}`;
  const visibleFraming = (list: number[]) => list.filter((i) => matches(sceneHay(main[i]), q));
  const before = visibleFraming(framing.before);
  const after = visibleFraming(framing.after);
  const tourItems = future.map((s, i) => ({ s, i })).filter(({ s }) => matches(`${s.title} ${sceneText(s)} highlights tour`, q));
  const sectionView = sections
    .map(({ sec, intro, context, items }) => {
      const secHit = matches(`${sec.title} section ${sec.number}`, q);
      const shownContext = context.filter(({ s }) => secHit || matches(sceneHay(s), q));
      // Every announcement has a demo; headline ones also have a reveal and an impact scene.
      const shown = items.filter(
        ({ a, scenes }) =>
          secHit ||
          matches(`${a.name} ${a.short ?? ""} ${a.oneLiner} demo ${scenes.length > 1 ? "reveal impact why it matters" : ""}`, q),
      );
      return { sec, intro, context: shownContext, items: shown, showIntro: secHit || shownContext.length > 0 || shown.length > 0 };
    })
    .filter((s) => s.showIntro);
  const total =
    before.length + after.length + tourItems.length + sectionView.reduce((n, s) => n + s.context.length + s.items.length + 1, 0);

  const bodyScope = useShortcutScope("map-body");
  const searchScope = useShortcutScope("map-search");
  const DIRS: Record<string, "up" | "down" | "left" | "right"> = {
    ArrowDown: "down",
    ArrowUp: "up",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  useAppShortcut(
    ["up", "down", "left", "right"],
    (e) => {
      const dir = DIRS[e.key];
      const from = document.activeElement as HTMLElement | null;
      if (!dir || !from?.hasAttribute("data-map-item") || !bodyRef.current) return;
      const target = moveFocus(bodyRef.current, from, dir);
      if (target) target.focus();
      else if (dir === "up") inputRef.current?.focus();
    },
    { scope: bodyScope, allowRepeat: true },
  );
  useAppShortcut(
    "down",
    () => {
      const body = bodyRef.current;
      if (!body) return;
      const target =
        (!q && body.querySelector<HTMLElement>('[data-current="true"]')) || body.querySelector<HTMLElement>("[data-map-item]");
      target?.focus();
    },
    { scope: searchScope, enableOnFormTags: true },
  );
  useAppShortcut(
    "enter",
    () => {
      const body = bodyRef.current;
      if (!body) return;
      const first = (q && body.querySelector<HTMLElement>("[data-match-first]")) || body.querySelector<HTMLElement>("[data-map-item]");
      (first?.closest("[data-map-item]") as HTMLElement | null)?.click();
    },
    { scope: searchScope, enableOnFormTags: true },
  );

  // First search hit for Enter: prefer an announcement (and the part the query
  // names, such as "fusion demo"), then anything else.
  const wantBeat = q
    .toLowerCase()
    .split(/\s+/)
    .map((w) => BEAT_WORDS[w])
    .find(Boolean);
  const firstItem = q ? sectionView.flatMap((s) => s.items)[0] : undefined;
  const firstContext = q ? sectionView.flatMap((s) => s.context)[0] : undefined;
  const firstHitId = q
    ? ((firstItem && (firstItem.scenes.find(({ s }) => s.kind === wantBeat) ?? firstItem.scenes[0]).s.id) ??
      firstContext?.s.id ??
      (before[0] !== undefined ? main[before[0]].id : undefined))
    : undefined;

  const bandTitle = "mb-3 text-[12px] font-semibold tracking-[0.18em] text-zinc-400 uppercase";

  return (
    <Dialog open={open} onOpenChange={setJump}>
      <DialogContent
        className="dark flex h-[calc(100dvh-2rem)] w-[min(1560px,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden border-white/15 bg-[#0b0c10] p-0 text-zinc-100 sm:max-w-none"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          focusStage(useDeck.getState().explore);
        }}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/10 py-4 pr-14 pl-5 sm:pl-6">
          <div className="min-w-0">
            <DialogTitle className="text-xl font-semibold text-white">Map</DialogTitle>
            <DialogDescription className="text-sm text-zinc-300">
              {ANNOUNCEMENTS.length} announcements in {SECTIONS.length} sections. Type to search, or use the arrow keys and Enter.
            </DialogDescription>
          </div>
          <div {...searchScope.bindings} className="relative ml-auto w-full sm:w-96">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <label htmlFor="map-search" className="sr-only">
              Search the keynote
            </label>
            <input
              id="map-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements and scenes"
              autoComplete="off"
              className="h-11 w-full rounded-full border border-white/15 bg-white/5 pr-9 pl-9 text-[15px] text-white placeholder:text-zinc-400 focus-visible:border-white/40 focus-visible:outline-2 focus-visible:outline-white"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        <div ref={bodyRef} {...bodyScope.bindings} className="min-h-0 flex-1 space-y-8 overflow-y-auto px-5 py-6 sm:px-6">
          {!q ? (
            <section aria-label="Places">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Item
                  pos={{ deck: "main", index: 0 }}
                  current={isCurrent({ deck: "main", index: 0 })}
                  onGo={() => {
                    setJump(false);
                    d.goHome();
                  }}
                  className="flex items-center gap-3 border border-white/12 px-4 py-3.5 [--map-accent:#f0abfc]"
                  label="Home screen"
                >
                  <House className="size-5 text-zinc-200" aria-hidden="true" />
                  <span className="text-[16px] font-semibold text-white">Home</span>
                  {isCurrent({ deck: "main", index: 0 }) ? <HereTag /> : null}
                </Item>
                <Item
                  pos={{ deck: "main", index: ANNOUNCEMENTS_START_INDEX }}
                  current={isCurrent({ deck: "main", index: ANNOUNCEMENTS_START_INDEX })}
                  onGo={() => {
                    setJump(false);
                    d.startAnnouncements();
                  }}
                  className="flex items-center gap-3 border border-white/12 px-4 py-3.5 [--map-accent:#f0abfc]"
                  label={`Announcements: five sections, all ${ANNOUNCEMENTS.length}`}
                >
                  <LayoutGrid className="size-5 text-zinc-200" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold text-white">Announcements</span>
                    <span className="block truncate text-[13px] text-zinc-300">Five sections, all {ANNOUNCEMENTS.length}</span>
                  </span>
                  {isCurrent({ deck: "main", index: ANNOUNCEMENTS_START_INDEX }) ? <HereTag /> : null}
                </Item>
                <Item
                  pos={{ deck: "future", index: 0 }}
                  current={isCurrent({ deck: "future", index: 0 })}
                  onGo={() => {
                    setJump(false);
                    d.startTour();
                  }}
                  className="flex items-center gap-3 border border-fuchsia-300/30 px-4 py-3.5 [--map-accent:#f0abfc]"
                  label="Highlights: five announcements, five demos"
                >
                  <Sparkles className="size-5 text-fuchsia-300" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold text-white">Highlights</span>
                    <span className="block truncate text-[13px] text-zinc-300">Five announcements, five demos</span>
                  </span>
                  {isCurrent({ deck: "future", index: 0 }) ? <HereTag /> : null}
                </Item>
                <Item
                  pos={{ deck: "main", index: 0 }}
                  current={false}
                  onGo={() => {
                    setJump(false);
                    d.setExplore(true);
                  }}
                  className="flex items-center gap-3 border border-white/12 px-4 py-3.5"
                  label="Explore all announcements"
                >
                  <Compass className="size-5 text-zinc-200" aria-hidden="true" />
                  <span>
                    <span className="block text-[16px] font-semibold text-white">Explore</span>
                    <span className="block text-[13px] text-zinc-300">Browse and search all {ANNOUNCEMENTS.length}</span>
                  </span>
                </Item>
              </div>
            </section>
          ) : null}

          {q && before.length ? (
            <section aria-labelledby="map-opening">
              <h3 id="map-opening" className={bandTitle}>
                Announcements
              </h3>
              <div className="flex flex-wrap gap-2 [--map-accent:#f0abfc]">
                {before.map((i) => (
                  <Item
                    key={main[i].id}
                    pos={{ deck: "main", index: i }}
                    current={isCurrent({ deck: "main", index: i })}
                    onGo={go}
                    className="border border-white/12 px-4 py-2.5 text-[15px] font-semibold text-white"
                  >
                    <span data-match-first={firstHitId === main[i].id ? "" : undefined}>{main[i].title}</span>
                    {isCurrent({ deck: "main", index: i }) ? <HereTag /> : null}
                  </Item>
                ))}
              </div>
            </section>
          ) : null}

          {sectionView.length ? (
            <section aria-label="Sections">
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {sectionView.map(({ sec, intro, context, items }) => (
                  <div key={sec.id} style={{ ["--map-accent" as string]: sec.accent.hex }} className="min-w-0">
                    <Item
                      pos={{ deck: "main", index: intro }}
                      current={isCurrent({ deck: "main", index: intro })}
                      onGo={go}
                      className="mb-2 block w-full px-2 py-1.5"
                      label={`Section ${sec.number}: ${sec.title}`}
                    >
                      <span className="block text-[13px] font-bold tabular" style={{ color: sec.accent.text }}>
                        0{sec.number}
                        {isCurrent({ deck: "main", index: intro }) ? <HereTag /> : null}
                      </span>
                      <span className="block text-[17px] leading-snug font-semibold text-white">{sec.title}</span>
                      <span aria-hidden="true" className="mt-2 block h-0.5 w-full rounded-full" style={{ background: sec.accent.hex }} />
                    </Item>
                    <ul className="space-y-1">
                      {context.map(({ s, i }) => (
                        <li key={s.id}>
                          <Item
                            pos={{ deck: "main", index: i }}
                            current={isCurrent({ deck: "main", index: i })}
                            onGo={go}
                            className="block w-full px-2 py-1.5"
                          >
                            <span data-match-first={firstHitId === s.id ? "" : undefined} className="block text-[15px] leading-snug text-zinc-100">
                              {s.title}
                              {isCurrent({ deck: "main", index: i }) ? <HereTag /> : null}
                            </span>
                          </Item>
                        </li>
                      ))}
                      {items.map(({ a, scenes }) => {
                        const headline = scenes.length > 1;
                        const here = scenes.some(({ i }) => isCurrent({ deck: "main", index: i }));
                        return (
                          <li key={a.id}>
                            <Item
                              pos={{ deck: "main", index: scenes[0].i }}
                              current={!headline && here}
                              onGo={go}
                              className={cn("block w-full px-2 py-1.5", headline && here && "bg-white/[0.06]")}
                            >
                              <span
                                data-match-first={firstHitId === scenes[0].s.id ? "" : undefined}
                                className={cn("block text-[15px] leading-snug text-zinc-100", headline && "font-semibold text-white")}
                              >
                                {a.name}
                                {!headline && here ? <HereTag /> : null}
                              </span>
                            </Item>
                            {headline ? (
                              <div className="mt-1 mb-1.5 flex flex-wrap gap-1.5 pl-2">
                                {scenes.map(({ s, i }) => {
                                  const cur = isCurrent({ deck: "main", index: i });
                                  return (
                                    <Item
                                      key={s.id}
                                      pos={{ deck: "main", index: i }}
                                      current={cur}
                                      onGo={go}
                                      label={`${a.name}: ${BEAT_SHORT[s.kind] ?? s.title}`}
                                      className={cn(
                                        "rounded-full border px-2.5 py-1 text-[13px] font-semibold",
                                        cur ? "border-transparent text-white" : "border-white/15 text-zinc-200",
                                      )}
                                    >
                                      <span data-match-first={firstHitId === s.id && s.id !== scenes[0].s.id ? "" : undefined}>
                                        {BEAT_SHORT[s.kind] ?? s.title}
                                      </span>
                                    </Item>
                                  );
                                })}
                                {here ? <HereTag /> : null}
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {after.length ? (
            <section aria-labelledby="map-close">
              <h3 id="map-close" className={bandTitle}>
                Wrap-up
              </h3>
              <div className="flex flex-wrap gap-2 [--map-accent:#f0abfc]">
                {after.map((i) => (
                  <Item
                    key={main[i].id}
                    pos={{ deck: "main", index: i }}
                    current={isCurrent({ deck: "main", index: i })}
                    onGo={go}
                    className="border border-white/12 px-4 py-2.5 text-[15px] font-semibold text-white"
                  >
                    {main[i].title}
                    {isCurrent({ deck: "main", index: i }) ? <HereTag /> : null}
                  </Item>
                ))}
              </div>
            </section>
          ) : null}

          {tourItems.length ? (
            <section aria-labelledby="map-tour">
              <h3 id="map-tour" className={cn(bandTitle, "flex items-center gap-2")}>
                <Sparkles className="size-3.5 text-fuchsia-300" aria-hidden="true" />
                Highlights
              </h3>
              <div className="flex flex-wrap gap-2 [--map-accent:#f0abfc]">
                {tourItems.map(({ s, i }) => {
                  const a = s.announcementId ? ANNOUNCEMENT_BY_ID[s.announcementId] : null;
                  const text =
                    s.kind === "tour-card" && a ? `${s.tourIndex}. ${a.short ?? a.name}` : s.kind === "demo" && a ? "Demo" : sceneLabel(s).title;
                  return (
                    <Item
                      key={s.id}
                      pos={{ deck: "future", index: i }}
                      current={isCurrent({ deck: "future", index: i })}
                      onGo={go}
                      label={s.kind === "demo" && a ? `${a.name}: demo` : undefined}
                      className={cn(
                        "border border-white/12 px-3.5 py-2 text-[14px] font-semibold",
                        s.kind === "demo" ? "text-zinc-300" : "text-white",
                      )}
                    >
                      {text}
                      {isCurrent({ deck: "future", index: i }) ? <HereTag /> : null}
                    </Item>
                  );
                })}
              </div>
            </section>
          ) : null}

          {q && total === 0 ? (
            <p className="py-10 text-center text-lg text-zinc-300" role="status">
              Nothing matches “{q}”.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

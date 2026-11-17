import { useEffect, useMemo, useRef, useState } from "react";
import { House, Play, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppShortcut, useShortcutScope } from "@/components/shortcut-provider";
import { scenesFor, useDeck } from "@/deck/deck-store";
import { sceneText } from "@/deck/nav-labels";
import type { Announcement, SectionId, StatusTone } from "@/deck/types";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { SECTIONS, SECTION_BY_ID } from "@/data/sections";
import { StatusBadge } from "@/kit/ui";
import { AnnouncementDetail } from "@/explore/announcement-detail";
import { focusElement } from "@/kit/focus";

type StatusFilter = "all" | "ga" | "preview" | "other";

const STATUS_FILTERS: { id: StatusFilter; label: string; tones: StatusTone[] }[] = [
  { id: "all", label: "Any status", tones: [] },
  { id: "ga", label: "Generally available", tones: ["ga"] },
  { id: "preview", label: "Preview", tones: ["preview", "experimental"] },
  { id: "other", label: "Rolling out & other", tones: ["rolling", "info"] },
];

function statusMatches(a: Announcement, f: StatusFilter): boolean {
  if (f === "all") return true;
  const tones = STATUS_FILTERS.find((s) => s.id === f)!.tones;
  return [a.status, ...(a.extraStatus ?? [])].some((s) => tones.includes(s.tone));
}

function textMatches(a: Announcement, q: string): boolean {
  if (!q) return true;
  const hay = [a.name, a.short, a.oneLiner, a.problem, a.benefit, ...a.how, ...(a.facts ?? []), SECTION_BY_ID[a.section].title, a.status.label]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

function Card({ a, onOpen }: { a: Announcement; onOpen: () => void }) {
  const sec = SECTION_BY_ID[a.section];
  return (
    <li className={cn(a.tier === "headline" && "sm:col-span-2")}>
      <button
        type="button"
        onClick={onOpen}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f13] p-5 text-left transition hover:-translate-y-0.5 hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: sec.accent.text }}
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: sec.accent.hex }} />
        {a.tier === "headline" ? (
          <span
            aria-hidden="true"
            className="absolute -top-16 -right-10 size-48 rounded-full opacity-25 blur-3xl transition-opacity group-hover:opacity-40"
            style={{ background: sec.accent.hex }}
          />
        ) : null}
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: sec.accent.text }}>
            {sec.title}
          </span>
          {a.tier === "headline" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
              <Sparkles className="size-3" aria-hidden="true" />
              Headline
            </span>
          ) : null}
        </span>
        <span className={cn("mt-3 font-semibold text-white", a.tier === "headline" ? "text-2xl" : "text-lg")}>{a.name}</span>
        <span className="mt-1.5 text-sm leading-relaxed text-zinc-300">{a.oneLiner}</span>
        <span className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <StatusBadge label={a.status.label} tone={a.status.tone} size="sm" />
          {a.extraStatus?.map((s) => <StatusBadge key={s.label} label={s.label} tone={s.tone} size="sm" />)}
        </span>
      </button>
    </li>
  );
}

/** O: explore every announcement on your own, with search and filters. */
export function ExploreView() {
  const focus = useDeck((s) => s.exploreFocus);
  const setExplore = useDeck((s) => s.setExplore);
  const goHome = useDeck((s) => s.goHome);
  const deck = useDeck((s) => s.deck);
  const index = useDeck((s) => s.index);
  // What sits underneath Explore: closing it returns there.
  const underHome = deck === "main" && index === 0;
  const underText = sceneText(scenesFor(deck)[index]);
  const scope = useShortcutScope("explore");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<SectionId | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  useEffect(() => {
    focusElement(rootRef.current);
  }, []);
  useEffect(() => {
    rootRef.current?.scrollTo({ top: 0 });
  }, [focus]);

  useAppShortcut(
    "escape",
    () => {
      if (useDeck.getState().exploreFocus) setExplore(true, null);
      else setExplore(false);
    },
    { scope, enableOnFormTags: true },
  );
  useAppShortcut("/", () => searchRef.current?.focus(), { scope });

  const results = useMemo(
    () => ANNOUNCEMENTS.filter((a) => (section === "all" || a.section === section) && statusMatches(a, status) && textMatches(a, query.trim())),
    [query, section, status],
  );
  const filtered = query.trim() !== "" || section !== "all" || status !== "all";

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      {...scope.bindings}
      role="region"
      aria-label="Explore announcements"
      className="fixed inset-0 z-[35] overflow-y-auto bg-[#07080b] text-white outline-none"
    >
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#07080b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <House className="size-4" aria-hidden="true" />
            Home
            {underHome && !focus ? (
              <kbd className="hidden rounded border border-white/20 px-1 text-xs text-zinc-300 sm:inline">Esc</kbd>
            ) : null}
          </button>
          {!underHome ? (
            <button
              type="button"
              onClick={() => setExplore(false)}
              className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <Play className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">
                Back to {deck === "future" ? "Highlights" : "the keynote"}
                <span className="hidden font-normal text-zinc-300 md:inline"> · {underText}</span>
              </span>
              {!focus ? <kbd className="hidden shrink-0 rounded border border-white/20 px-1 text-xs text-zinc-300 sm:inline">Esc</kbd> : null}
            </button>
          ) : null}
          <h1 className="mr-auto text-base font-semibold sm:text-lg">
            Explore <span className="font-normal text-zinc-400">· {ANNOUNCEMENTS.length} announcements</span>
          </h1>
          {!focus ? (
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
              <label htmlFor="explore-search" className="sr-only">
                Search announcements
              </label>
              <input
                id="explore-search"
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search announcements  ( / )"
                className="h-10 w-full rounded-full border border-white/15 bg-white/5 pr-9 pl-9 text-sm text-white placeholder:text-zinc-400 focus-visible:border-white/40 focus-visible:outline-2 focus-visible:outline-white"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      {focus ? (
        <AnnouncementDetail key={focus} id={focus} />
      ) : (
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6">
          <div className="space-y-3">
            <div role="group" aria-label="Filter by section" className="flex flex-wrap gap-2">
              {[{ id: "all" as const, title: "All sections", accent: null }, ...SECTIONS.map((s) => ({ id: s.id, title: s.title, accent: s.accent }))].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={section === s.id}
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-white",
                    section === s.id ? "border-white bg-white text-zinc-950" : "border-white/15 text-zinc-200 hover:border-white/35",
                  )}
                >
                  {s.accent ? <span aria-hidden="true" className="size-2 rounded-full" style={{ background: s.accent.hex }} /> : null}
                  {s.title}
                </button>
              ))}
            </div>
            <div role="group" aria-label="Filter by availability" className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={status === f.id}
                  onClick={() => setStatus(f.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-white",
                    status === f.id ? "border-white bg-white text-zinc-950" : "border-white/15 text-zinc-200 hover:border-white/35",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-5 text-sm text-zinc-300" aria-live="polite">
            {filtered ? `${results.length} of ${ANNOUNCEMENTS.length} announcements` : `${ANNOUNCEMENTS.length} announcements across ${SECTIONS.length} sections`}
          </p>
          {results.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center">
              <p className="text-lg font-semibold">No announcements match</p>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-sky-300 underline-offset-4 hover:underline"
                onClick={() => {
                  setQuery("");
                  setSection("all");
                  setStatus("all");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : filtered ? (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((a) => (
                <Card key={a.id} a={a} onOpen={() => setExplore(true, a.id)} />
              ))}
            </ul>
          ) : (
            SECTIONS.map((s) => (
              <section key={s.id} aria-labelledby={`explore-${s.id}`} className="mt-10">
                <h2 id={`explore-${s.id}`} className="flex items-baseline gap-3 text-2xl font-semibold">
                  <span className="text-base font-bold tabular" style={{ color: s.accent.text }}>
                    0{s.number}
                  </span>
                  {s.title}
                </h2>
                <p className="mt-1 max-w-3xl text-sm text-zinc-300">{s.lede}</p>
                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results
                    .filter((a) => a.section === s.id)
                    .map((a) => (
                      <Card key={a.id} a={a} onOpen={() => setExplore(true, a.id)} />
                    ))}
                </ul>
              </section>
            ))
          )}
        </div>
      )}
    </div>
  );
}

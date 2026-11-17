import type { Announcement, DeckId, PresenterNotes, Scene } from "@/deck/types";
import { ANNOUNCEMENTS, ANNOUNCEMENT_BY_ID, TOUR_IDS, announcementsIn } from "@/data/announcements";
import { SECTIONS } from "@/data/sections";
import { RECAP_TAKEAWAYS, RECAP_THESIS } from "@/data/takeaways";
import { DATA_SCENES } from "@/deck/data-scenes";
import { SECURITY_SOURCES } from "@/data/security-context";

// Builds the two decks from the content in src/data: "main" (Announcements, the
// full keynote) and "future" (Highlights, the five-moment tour). Scene components
// live in src/scenes; this module only describes order, step counts and notes.

const TOTAL = ANNOUNCEMENTS.length;

function announcementNotes(a: Announcement, beat: "reveal" | "demo" | "impact" | "single"): PresenterNotes {
  const n = a.notes;
  const demoScript = n.demo ?? a.steps.slice(0, -1).map((c, i) => `Step ${i + 1}: ${c}.`);
  const tech = [...(n.tech ?? []), ...(a.facts ?? [])];
  if (beat === "reveal") {
    return {
      talk: [`The problem: ${a.problem}`, `The announcement: ${a.name}. ${a.oneLiner}`, ...n.talk],
      benefit: n.benefit ?? a.benefit,
      tech,
    };
  }
  if (beat === "demo") {
    return {
      talk: [`Run the demo. Next (→ or Space) plays each beat; R resets it.`, ...n.talk.slice(0, 1)],
      demo: demoScript,
      benefit: n.benefit ?? a.benefit,
      tech,
    };
  }
  if (beat === "impact") {
    return {
      talk: [`Why it matters: ${a.benefit}`, ...(a.availability ? [`Availability: ${a.availability}`] : [])],
      benefit: n.benefit ?? a.benefit,
      tech,
    };
  }
  return {
    talk: [...n.talk, `Status: ${a.status.label}.`],
    demo: demoScript,
    benefit: n.benefit ?? a.benefit,
    tech,
  };
}

function scenesForAnnouncement(a: Announcement): Scene[] {
  const base = { section: a.section, announcementId: a.id };
  const demoSteps = a.steps.length - 1;
  const data = DATA_SCENES[a.id];
  if (data) {
    return data.map((d) => ({
      ...base,
      id: d.id,
      kind: d.kind,
      title: d.title,
      steps: d.beats.length - 1,
      notes: {
        ...d.notes,
        benefit: d.notes.benefit ?? a.notes.benefit ?? a.benefit,
        tech: [...(d.notes.tech ?? []), `Source: ${a.sources.map((s) => s.label).join(", ")}.`],
      },
    }));
  }
  if (a.tier === "headline") {
    return [
      { ...base, id: `${a.id}-reveal`, kind: "reveal", title: `${a.name}: the reveal`, steps: 2, notes: announcementNotes(a, "reveal") },
      { ...base, id: `${a.id}-demo`, kind: "demo", title: `${a.name}: in action`, steps: demoSteps, notes: announcementNotes(a, "demo") },
      { ...base, id: `${a.id}-impact`, kind: "impact", title: `${a.name}: why it matters`, steps: 2, notes: announcementNotes(a, "impact") },
    ];
  }
  return [
    {
      ...base,
      id: a.id,
      kind: a.tier === "feature" ? "feature" : "brief",
      title: a.name,
      steps: demoSteps,
      notes: announcementNotes(a, "single"),
    },
  ];
}

function withTransitions(list: Scene[]): Scene[] {
  return list.map((s, i) => {
    const next = list[i + 1];
    if (s.notes.transition || !next) return s;
    return { ...s, notes: { ...s.notes, transition: `Next: ${next.title}` } };
  });
}

const securityContext: Scene[] = [
  {
    id: "security-cve-growth",
    kind: "security-cves",
    title: "CVE disclosures are rising",
    section: "security",
    steps: 0,
    notes: {
      talk: [
        "GitHub's CVE Numbering Authority published 1,047 CVE records in 2021, rising to 2,903 in 2025—a 35% increase from 2024.",
        "The chart counts only records published by GitHub's CNA, not all CVEs. A published CVE is not proof of exploitation.",
        "Microsoft reported that the ChainDrop npm supply-chain attack affected more than 400 packages. Its self-propagating worm targeted credentials and typically ran during installation.",
      ],
      tech: [
        `GitHub's 2025 advisory and CVE trends: ${SECURITY_SOURCES.cve.url}`,
        `Microsoft's ChainDrop investigation, August 2026: ${SECURITY_SOURCES.chainDrop.url}`,
      ],
    },
  },
  {
    id: "security-supply-chain",
    kind: "security-supply-chain",
    title: "Supply-chain attacks: the time bomb",
    section: "security",
    steps: 0,
    notes: {
      talk: [
        "Verizon's DBIR reports third-party involvement in about 15%, 30%, and 48% of analyzed breaches in the 2024, 2025, and 2026 editions. The samples differ and the category includes vendors and partners, not just software dependencies.",
        "GitHub removed over 500 compromised npm packages in the September 2025 Shai-Hulud response; its install-time worm stole secrets and propagated.",
        "In May 2026, Megalodon placed malicious workflow commits in 5,561 repositories. A targeted workflow variant could be triggered on demand; this does not mean every affected workflow was dormant.",
        "In July 2026, five poisoned AsyncAPI versions across four packages executed their payload when imported, rather than via an install hook.",
      ],
      tech: [
        `Verizon reports: ${SECURITY_SOURCES.dbir2025.url} and ${SECURITY_SOURCES.dbir2026.url}`,
        `Shai-Hulud: ${SECURITY_SOURCES.shaiHulud.url}`,
        `Megalodon: ${SECURITY_SOURCES.megalodon.url}`,
        `AsyncAPI: ${SECURITY_SOURCES.asyncapi.url}`,
      ],
    },
  },
];

const sectionScenes: Scene[] = SECTIONS.flatMap((section) => {
  const items = announcementsIn(section.id);
  const intro: Scene = {
    id: `section-${section.id}`,
    kind: "section",
    title: `${section.number}. ${section.title}`,
    section: section.id,
    steps: 1,
    notes: {
      talk: [
        `Section ${section.number}: ${section.title}. ${section.lede}`,
        `${items.length} announcements in this section, headlined by ${items
          .filter((a) => a.tier === "headline")
          .map((a) => a.name)
          .join(" and ") || items[0].name}.`,
        ...(section.id === "platform"
          ? [
              "After Copilot in GitHub Enterprise come four data scenes: the Octoverse growth curves, agents starting the work, the capacity GitHub added, and 5,000 agents pushing to one repository (the ~180x figure).",
            ]
          : []),
      ],
    },
  };
  return [intro, ...(section.id === "security" ? securityContext : []), ...items.flatMap(scenesForAnnouncement)];
});

const MAIN: Scene[] = withTransitions([
  {
    id: "opening",
    kind: "opening",
    title: "GitHub Universe 2026",
    steps: 1,
    notes: {
      talk: [
        "Welcome. Universe 2026 took place October 28 and 29 at Fort Mason Center in San Francisco.",
        `We'll walk through all ${TOTAL} announcements, grouped into five sections, with a simulated demo for the big ones.`,
        "Press Next to reveal the numbers, then Next again for the five sections.",
        "Two buttons: Announcements opens the five sections; Highlights is the five-minute version with five demos.",
      ],
      tech: ["Keys: → or Space is Next (it reveals each beat, then moves on), ← goes back, G opens the map, Home comes back here, N toggles these notes."],
    },
  },
  {
    id: "agenda",
    kind: "agenda",
    title: "Five sections",
    steps: 0,
    notes: {
      talk: [
        "Here's the map: five sections, every announcement, simulated demos for the headline ones.",
        "Number keys 1 to 5 jump straight to a section. Handy when a different presenter takes each section.",
      ],
    },
  },
  ...sectionScenes,
  {
    id: "recap",
    kind: "recap",
    title: "The takeaways",
    steps: RECAP_TAKEAWAYS.length + 1,
    notes: {
      talk: [
        "The last scene. Five takeaways, one per section: each Next lights the next star and puts its detail in the caption.",
        ...RECAP_TAKEAWAYS.map((t, i) => `${i + 1}. ${t.title}.`),
        `The final Next completes the constellation: "${RECAP_THESIS}"`,
        "If you remember one thing: GitHub is positioning itself as the end-to-end delivery system for developers and their agents.",
      ],
      tech: ["After the session the audience can explore every announcement and its sources (O), or follow the recap link on screen."],
    },
  },
]);

const tourScenes: Scene[] = TOUR_IDS.flatMap((id, i) => {
  const a = ANNOUNCEMENT_BY_ID[id];
  return [
    {
      id: `tour-${id}-card`,
      kind: "tour-card" as const,
      title: `${i + 1}. ${a.name}`,
      section: a.section,
      announcementId: id,
      steps: 0,
      tourIndex: i + 1,
      notes: { talk: [a.oneLiner, a.problem], benefit: a.benefit },
    },
    {
      id: `tour-${id}-demo`,
      kind: "demo" as const,
      title: `${a.name}: in action`,
      section: a.section,
      announcementId: id,
      steps: a.steps.length - 1,
      tourIndex: i + 1,
      notes: announcementNotes(a, "demo"),
    },
  ];
});

const FUTURE: Scene[] = withTransitions([
  {
    id: "tour-intro",
    kind: "tour-intro",
    title: "Highlights",
    steps: 1,
    notes: {
      talk: [
        "Five moments from Universe 2026, each with a simulated demo.",
        "Fusion, Projects, Automations, stacked pull requests and AI Scan.",
      ],
      tech: ["Home, or Exit Highlights in the bar, returns to the home screen at any time."],
    },
  },
  ...tourScenes,
  {
    id: "tour-finale",
    kind: "tour-finale",
    title: "Highlights, recapped",
    steps: 1,
    notes: {
      talk: ["Five moments, one direction: you set the goal and the guardrails; agents carry the work."],
    },
  },
]);

export const DECKS: Record<DeckId, Scene[]> = { main: MAIN, future: FUTURE };

/** Index of the intro scene for section number `n` (1-based) in the main deck, or -1. */
export function sectionStartIndex(n: number): number {
  const section = SECTIONS.find((s) => s.number === n);
  if (!section) return -1;
  return MAIN.findIndex((s) => s.id === `section-${section.id}`);
}

/** Main-deck index of the "Five sections" overview, where Announcements starts. */
export const ANNOUNCEMENTS_START_INDEX = Math.max(0, MAIN.findIndex((s) => s.kind === "agenda"));

/** First main-deck scene for an announcement (its reveal, feature or brief scene). */
export function firstSceneIndexFor(announcementId: string): number {
  return MAIN.findIndex((s) => s.announcementId === announcementId);
}

export const ANNOUNCEMENT_COUNT = TOTAL;

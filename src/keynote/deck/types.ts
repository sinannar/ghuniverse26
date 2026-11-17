// Shared types for the keynote deck. Content lives in src/data; presentation in
// src/scenes, src/demos and src/stage.

export type SectionId = "copilot" | "automation" | "workflow" | "security" | "platform";

/** Availability tone drives the badge colour: green GA, blue preview, amber experimental. */
export type StatusTone = "ga" | "preview" | "experimental" | "rolling" | "info";

export interface Source {
  label: string;
  url: string;
}

export interface PresenterNotes {
  /** Key talking points for the scene. */
  talk: string[];
  /** What to say or do while the demo runs, one line per step where useful. */
  demo?: string[];
  /** The single developer benefit to land. */
  benefit?: string;
  /** Interesting technical details for Q&A. */
  tech?: string[];
  /** Suggested segue into the next scene. */
  transition?: string;
}

export type Tier = "headline" | "feature" | "brief";

export interface Status {
  label: string;
  tone: StatusTone;
}

export interface Stat {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface Announcement {
  id: string;
  name: string;
  section: SectionId;
  tier: Tier;
  /** ISO date of the official announcement. */
  date: string;
  status: Status;
  /** Additional statuses when parts of an announcement differ (e.g. GA + preview). */
  extraStatus?: Status[];
  /** Plans, editions or prerequisites stated in the source. */
  availability?: string;
  oneLiner: string;
  problem: string;
  how: string[];
  benefit: string;
  facts?: string[];
  sources: Source[];
  notes: PresenterNotes;
  /** Short label for chips and the agenda (falls back to name). */
  short?: string;
  /** Demo captions, one per step; the last one is always the "Why it matters" beat. */
  steps: string[];
  /** Headline-only impact scene content. */
  impact?: { stats: Stat[]; points: string[] };
}

export interface Section {
  id: SectionId;
  number: number;
  title: string;
  kicker: string;
  /** One-sentence framing used on the section intro. */
  lede: string;
  accent: SectionAccent;
}

export interface SectionAccent {
  /** Main accent used for glows, marks and focus (hex). */
  hex: string;
  /** Lighter tint for text on the dark stage (>= 4.5:1 on the stage background). */
  text: string;
  /** Deep shade for filled marks that carry white text (>= 4.5:1). */
  deep: string;
  /** Secondary hue for gradients and paired marks. */
  hex2: string;
}

export type SceneKind =
  | "opening"
  | "agenda"
  | "section"
  | "reveal"
  | "demo"
  | "impact"
  | "feature"
  | "brief"
  | "security-cves"
  | "security-supply-chain"
  /** Section 5 data scenes (see deck/data-scenes.ts). */
  | "data-growth"
  | "data-agents"
  | "data-capacity"
  | "data-repo"
  | "recap"
  | "tour-intro"
  | "tour-card"
  | "tour-finale";

export interface Scene {
  id: string;
  kind: SceneKind;
  title: string;
  section?: SectionId;
  announcementId?: string;
  /** Number of progressive reveal steps after the initial state (0 = static). */
  steps: number;
  notes: PresenterNotes;
  /** Position within the Highlights tour, 1-based. */
  tourIndex?: number;
}

export type DeckId = "main" | "future";

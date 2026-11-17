import type { Source } from "@/deck/types";

// Figures behind section 5's data scenes (Octoverse 2026 and Infrastructure).
// Every number below is stated in the linked GitHub source; nothing is
// estimated, interpolated or projected. Labels keep the scope each source gives
// (period, public or private, test conditions), because mixing scopes in one
// chart would mislead. Checked November 17, 2026.

const GH = (path: string) => `https://github.blog/${path}/`;

export const TREND_SOURCES = {
  octoverse2026: {
    label: "Octoverse 2026",
    url: GH("news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents"),
  },
  octoverse2025: {
    label: "Octoverse 2025",
    url: GH("news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1"),
  },
  octoverse2023: { label: "Octoverse 2023", url: GH("news-insights/research/the-state-of-open-source-and-ai") },
  octoverse2022: { label: "Octoverse 2022", url: "https://octoverse.github.com/2022/developer-community.html" },
  octoverse2020: { label: "Octoverse 2020", url: "https://octoverse.github.com/2020/" },
  octoverse2019: { label: "Octoverse 2019", url: "https://octoverse.github.com/2019/" },
  agentScaleGit: {
    label: "Building Git infrastructure for agent-scale development",
    url: GH("engineering/architecture-optimization/building-git-infrastructure-for-agent-scale-development"),
  },
  gitBridge: {
    label: "The bridge to agent-scale Git infrastructure",
    url: GH("engineering/architecture-optimization/the-bridge-to-agent-scale-git-infrastructure"),
  },
  gitStorage: {
    label: "Inside GitHub's new Git storage architecture",
    url: GH("engineering/architecture-optimization/inside-githubs-new-git-storage-architecture"),
  },
  availability: { label: "An update on GitHub availability", url: GH("news-insights/company-news/an-update-on-github-availability") },
  keynoteVideo: {
    label: "Universe 2026 keynote video (31:25)",
    url: "https://www.youtube.com/watch?v=AArI948SDz8&t=1885s",
  },
} satisfies Record<string, Source>;

/* ------------------------------------------------------------------ Developers */

export interface DeveloperPoint {
  /** Position on the time axis, in fractional years. */
  t: number;
  /** Developers on GitHub, in millions (the stated figure; "+" means "more than"). */
  millions: number;
  display: string;
  when: string;
}

/** Developer totals as GitHub stated them. Years without a stated total are left out, not filled in. */
export const DEVELOPERS: DeveloperPoint[] = [
  { t: 2019.75, millions: 40, display: "40M+", when: "2019" }, // Octoverse 2019: accounts as of September 30, 2019
  { t: 2020.75, millions: 56, display: "56M+", when: "2020" }, // Octoverse 2020
  { t: 2022.75, millions: 94, display: "94M", when: "2022" }, // Octoverse 2022
  { t: 2023.12, millions: 100, display: "100M+", when: "Early 2023" }, // the "more than 100 million" milestone
  { t: 2025.66, millions: 180, display: "180M+", when: "2025" }, // Octoverse 2025: "180 million-plus"
  { t: 2026.75, millions: 225, display: "225M+", when: "2026" }, // Octoverse 2026: "more than 225 million"
];

export const DEVELOPERS_NOTE =
  "Totals as stated by GitHub: Octoverse 2019, 2020, 2022, 2025 and 2026, plus the 100 million milestone in early 2023. Dashed lines bridge years with no stated total.";

/* ------------------------------------------------------------------ The Octoverse year */

export interface YearTotal {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
  /** How much bigger than the comparison period, as the source words it. */
  compare: string;
  /** Lit "now" blocks against one "then" block: 3 means "more than three times". */
  times?: number;
}

/** Octoverse year (October 1, 2025 to September 30, 2026), public and private repositories. */
export const YEAR_TOTALS: YearTotal[] = [
  { value: 17.9, decimals: 1, suffix: "B", label: "pushes", compare: "More than 2024 and 2025 combined" },
  { value: 34.3, decimals: 1, suffix: "B", label: "commits", compare: "More than 3× two years ago", times: 3 },
  { value: 1.3, decimals: 1, suffix: "B", label: "merged pull requests", compare: "More than tripled over two years · 3.5M a day", times: 3 },
  { value: 124, suffix: "M", label: "GitHub Actions jobs a day", compare: "1,440 a second · more than 3× last year", times: 3 },
];

/* ------------------------------------------------------------------ A year apart */

export interface Multiplier {
  label: string;
  /** Bar length in "times a year earlier". */
  times: number;
  /** The multiplier as the source words it. */
  display: string;
  detail: string;
}

/** Monthly activity against a year earlier (GitHub Engineering, October 6, 2026). Sorted for the bar race. */
export const MULTIPLIERS: Multiplier[] = [
  { label: "Commits", times: 5, display: "more than 5×", detail: "7.38B in September 2026" },
  { label: "Pushes", times: 3.35 / 0.69, display: "4.9×", detail: "0.69B → 3.35B a month" },
  { label: "GitHub Actions runs", times: 4, display: "more than 4×", detail: "3.26B in September 2026" },
  { label: "Pull request merges", times: 4, display: "nearly 4×", detail: "Volume against a year earlier" },
  { label: "Git events", times: 473.3 / 218.2, display: "more than 2×", detail: "218.2B → 473.3B a month" },
];

export const MULTIPLIERS_NOTE =
  "GitHub Engineering, October 6, 2026. Commits and Actions compare September 2026 with September 2025; Git events compare September 2025 with August 2026.";

/* ------------------------------------------------------------------ Agents */

export const AGENT_SHARE = { march: 17, september: 40 } as const;
export const AGENT_SEPTEMBER_VOLUME = { value: 110, multiple: 6 } as const;
/** Merged within two weeks: agent-involved pull requests vs those without detected agent involvement. */
export const MERGED_IN_TWO_WEEKS = {
  agent: { february: 83, september: 90 },
  other: { february: 86, september: 86 },
} as const;
/** Copilot monthly active users using agentic features, a year apart. */
export const AGENTIC_FEATURES = { before: 35, now: 55 } as const;
/** Octoverse 2026 averages, used by the live counters. */
export const RATES = { mergedPrsPerDay: 3_500_000, actionsJobsPerSecond: 1440 } as const;

/* ------------------------------------------------------------------ Infrastructure */

export const CAPACITY_ADDED = [
  { value: 4, suffix: "M", label: "CPU cores" },
  { value: 160, suffix: " PB", label: "high-speed storage" },
  { value: 50, suffix: " Tb/s", label: "network capacity" },
] as const;

export const SCALE_MILESTONES = [
  { when: "October 2025", text: "Plan to increase GitHub's capacity 10×" },
  { when: "February 2026", text: "Design for a future that needs 30× today's scale" },
  { when: "October 2026", text: "Azure serves about half of Git traffic; 99.99999% of repositories have a copy there" },
  { when: "Early next year", text: "Multi-region Azure deployment expected to complete" },
] as const;

export const SINGLE_REPO = {
  agents: 5000,
  pushesPerSecond: 7200,
  /** Keynote slide figure (single-repository write throughput, internal testing). Not in the written posts. */
  keynoteMultiple: 180,
} as const;

import type { PresenterNotes, SceneKind } from "@/deck/types";

// Section 5's data scenes. Octoverse 2026 and Infrastructure are told with
// full-screen charts instead of the standard feature and brief templates, two
// scenes each: the demand (Octoverse), then how GitHub is scaling for it.
// Figures live in src/data/platform-trends.ts; scene components in
// src/scenes/platform-data.tsx.

export interface DataSceneDef {
  id: string;
  kind: SceneKind;
  title: string;
  /** One caption per step, shown in the scene controls and the navigation bar. */
  beats: string[];
  /** The last beat is the "Why it matters" banner. */
  takeaway: boolean;
  notes: PresenterNotes;
}

export const DATA_SCENES: Record<string, DataSceneDef[]> = {
  "octoverse-2026": [
    {
      id: "octoverse-2026-growth",
      kind: "data-growth",
      title: "Octoverse 2026: more of everything",
      beats: ["225 million developers and counting", "A record year of activity", "A year apart: how fast it grew"],
      takeaway: false,
      notes: {
        talk: [
          "Octoverse 2026 covers October 1, 2025 to September 30, 2026, public and private repositories.",
          "GitHub now serves more than 225 million developers. A year earlier it was more than 180 million.",
        ],
        demo: [
          "Beat 1: the developer curve. More than 40 million in 2019, the 100 million milestone in early 2023, 180 million-plus in 2025, 225 million-plus now.",
          "Beat 2: the year in totals. 17.9 billion pushes, more than 2024 and 2025 combined. 34.3 billion commits. 1.3 billion merged pull requests, about 3.5 million a day. 124 million GitHub Actions jobs a day.",
          "Beat 3: a year apart. Pushes 4.9x, commits more than 5x in September, Actions more than 4x, pull request merges nearly 4x, Git events more than 2x.",
        ],
        benefit: "Activity bent sharply upward partway through the year, just as agents became something developers work alongside.",
        tech: [
          "The 2024 and 2025 comparisons are GitHub's recalculated figures. Don't set them against older Octoverse reports, which counted public activity only.",
          "The multipliers come from GitHub Engineering's October 6 post. They compare monthly volumes, so they differ from the annual Octoverse totals.",
          "Developer totals are lower bounds. Years without a confirmed total (2021, 2024) are left out rather than estimated.",
        ],
      },
    },
    {
      id: "octoverse-2026-agents",
      kind: "data-agents",
      title: "Octoverse 2026: agents start the work",
      beats: ["More than 40% of pull requests start with an agent", "Agent pull requests land", "Right now on GitHub", "Why it matters"],
      takeaway: true,
      notes: {
        talk: [
          "By September, more than 40% of pull requests started with an agent's first draft, up from 17% in March. That's 110 million in September alone, about 6x March's volume.",
          "An agent-started pull request is one whose first draft came from a coding agent GitHub can detect, so this is a floor.",
        ],
        demo: [
          "Beat 1: watch the grid go from 17 in a hundred to more than 40.",
          "Beat 2: they land. 83% of agent-involved pull requests merged within two weeks in February and 90% by September, against about 86% for the rest. 55% of Copilot monthly active users now use agentic features, up from 35% a year ago.",
          "Beat 3: the counters run at the Octoverse averages: about 3.5 million merged pull requests a day and 1,440 Actions jobs a second.",
        ],
        tech: [
          "Copilot cloud agent grew 230% year over year, against 85% for agent chat.",
          "The counters are illustrations computed from the published averages, not live data.",
        ],
      },
    },
  ],
  infrastructure: [
    {
      id: "infrastructure-capacity",
      kind: "data-capacity",
      title: "Infrastructure: capacity for the agentic era",
      beats: ["Added so far this year", "Designing for 30× today's scale"],
      takeaway: false,
      notes: {
        talk: [
          "From the keynote: so far this year GitHub added 4 million CPU cores, 160 PB of high-speed storage and 50 Tb/s of network capacity. These are additions, not totals.",
          "The plan changed fast. A 10x capacity plan started in October 2025; by February 2026 GitHub was designing for 30x today's scale (CTO Vlad Fedorov, April 28).",
        ],
        demo: [
          "Beat 1: the three capacity numbers.",
          "Beat 2: the targets and the move to Azure. Azure now serves about half of Git traffic, and 99.99999% of repositories have a copy there. The multi-region migration is expected to complete early next year.",
        ],
        benefit: "A faster, more reliable foundation for agent-driven development.",
        tech: [
          "10x and 30x are planning targets, not achieved scale.",
          "Since the second half of December 2025, agentic development workflows have accelerated sharply (April 28 post).",
        ],
      },
    },
    {
      id: "infrastructure-repo",
      kind: "data-repo",
      title: "Infrastructure: one repository, 5,000 agents",
      beats: ["5,000 agents, one repository", "From dozens of writes a second to 7,200", "Why it matters"],
      takeaway: true,
      notes: {
        talk: [
          "The new Git storage architecture, in internal testing: 5,000 concurrent agents sending 7,200 pushes a second to one repository, with consistently low read latency.",
          "Today the busiest repositories on GitHub receive at most dozens of writes a second, usually in short bursts.",
        ],
        demo: [
          "Beat 1: the swarm. Every dot is an agent; the counter climbs to 7,200 pushes a second.",
          "Beat 2: the jump. On stage GitHub put this at about 180x the write throughput of a single repository today.",
          "Beat 3: why it matters.",
        ],
        tech: [
          "Be precise about 180x: it's single-repository write throughput in internal testing, from the keynote slide (31:25 in the video). It isn't a platform-wide figure, and the written posts give 5,000 agents and 7,200 pushes a second rather than the multiplier.",
          "An earlier post (October 6) reported up to 35x higher write throughput in internal benchmarks; the November 5 post has the 7,200 figure.",
          "Limited private preview now, broader rollout early next year. Internal name: Project Rubicon.",
        ],
      },
    },
  ],
};

/** Captions for every data scene's steps, keyed by scene id. */
export const DATA_BEATS: Record<string, string[]> = Object.fromEntries(
  Object.values(DATA_SCENES)
    .flat()
    .map((d) => [d.id, d.beats]),
);

export const DATA_TAKEAWAY: Record<string, boolean> = Object.fromEntries(
  Object.values(DATA_SCENES)
    .flat()
    .map((d) => [d.id, d.takeaway]),
);

import type { SectionId } from "@/deck/types";
import { SECTION_BY_ID } from "@/data/sections";

// The recap's five takeaways, one per section. Copy is checked against the same
// sources as the announcements; keep each body to one or two lines on stage.

export interface Takeaway {
  section: SectionId;
  title: string;
  body: string;
}

const TAKEAWAYS: Takeaway[] = [
  {
    section: "copilot",
    title: "Choose the effort, not the model",
    body: "Copilot Fusion routes and orchestrates models per prompt, and Projects turn a goal into parallel, coordinated agent work.",
  },
  {
    section: "automation",
    title: "Automations your whole team owns",
    body: "Shared Copilot Automations run on events, schedules or the API, within credit limits, and propose their own improvements for approval.",
  },
  {
    section: "workflow",
    title: "Smaller reviews, faster merges",
    body: "Stacked pull requests are GA, Code review Max goes deeper when it counts, and Agent Merge keeps PRs ready to land.",
  },
  {
    section: "security",
    title: "Security that keeps pace with agents",
    body: "AI Scan covers any language, push protection catches unstructured secrets, and the package firewall blocks risky installs.",
  },
  {
    section: "platform",
    title: "Copilot inside GitHub Enterprise",
    body: "Through GitHub Sales today, GitHub Enterprise can include Copilot for every licensed user, with AI usage metered against the enterprise budget.",
  },
];

/** One takeaway per section, in the order the sections are presented. */
export const RECAP_TAKEAWAYS: Takeaway[] = [...TAKEAWAYS].sort(
  (a, b) => SECTION_BY_ID[a.section].number - SECTION_BY_ID[b.section].number,
);

/** The line that lands when the recap constellation completes. */
export const RECAP_THESIS = "You set the goal. Agents carry the work.";

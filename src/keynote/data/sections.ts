import type { Section, SectionId } from "@/deck/types";

// Section order is the presenting order (number keys 1 to 5 follow it). Colours are tuned for the dark
// stage: `text` clears 4.5:1 on the stage background, `deep` carries white text.
export const SECTIONS: Section[] = [
  {
    id: "copilot",
    number: 1,
    title: "Copilot & agents",
    kicker: "Section 01",
    lede: "An agent-first app, smarter model orchestration, and sessions that follow you across every surface.",
    accent: { hex: "#a78bfa", text: "#c4b5fd", deep: "#6d28d9", hex2: "#f0abfc" },
  },
  {
    id: "workflow",
    number: 2,
    title: "Developer workflow",
    kicker: "Section 02",
    lede: "Smaller reviews, clearer plans, and less noise between you and the work that needs you.",
    accent: { hex: "#34d399", text: "#6ee7b7", deep: "#047857", hex2: "#a3e635" },
  },
  {
    id: "automation",
    number: 3,
    title: "Automation & integrations",
    kicker: "Section 03",
    lede: "Reusable AI workflows, connected tools, and the Actions foundations they run on.",
    accent: { hex: "#22d3ee", text: "#67e8f9", deep: "#0e7490", hex2: "#5eead4" },
  },
  {
    id: "security",
    number: 4,
    title: "Security",
    kicker: "Section 04",
    lede: "Find, prioritize and fix risk while you and your agents build, in any language.",
    accent: { hex: "#fb923c", text: "#fdba74", deep: "#c2410c", hex2: "#fbbf24" },
  },
  {
    id: "platform",
    number: 5,
    title: "Enterprise & platform",
    kicker: "Section 05",
    lede: "Copilot inside GitHub Enterprise, the infrastructure underneath, and the state of the Octoverse.",
    accent: { hex: "#38bdf8", text: "#7dd3fc", deep: "#0369a1", hex2: "#f472b6" },
  },
];

export const SECTION_BY_ID: Record<SectionId, Section> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s]),
) as Record<SectionId, Section>;

/** Neutral multi-colour accent used for the opening, overview and recap scenes. */
export const KEYNOTE_ACCENT = { hex: "#f0abfc", text: "#f5d0fe", deep: "#a21caf", hex2: "#67e8f9" };

export const recapUrl = 'https://github.com/events/universe/recap';
export const reportUrl =
  'https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/';
export const changelogUrl = 'https://github.blog/changelog/';

export const categories = [
  {
    id: 'octoverse',
    name: 'Octoverse',
    headline: 'The data behind\na different way to build.',
    description: 'Seven report stories: momentum, global growth, industries, agentic workflows, models, languages, and open source.',
    invitation: 'Choose a story from the report',
  },
  {
    id: 'platform',
    name: 'Platform',
    headline: 'Less friction.\nMore forward.',
    description: 'Smaller changes, richer context, and a clearer path from an idea to a merged pull request.',
    invitation: 'Choose a platform announcement',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    headline: 'From writing code\nto directing work.',
    description: 'Models, projects, automations, and tools that make room for a different way of building.',
    invitation: 'Choose a Copilot announcement',
  },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export interface Source {
  label: string;
  url: string;
}

export interface Chart {
  title: string;
  unit: string;
  rows: { label: string; value: number; display: string; comparison?: boolean }[];
  note: string;
}

export interface Topic {
  id: string;
  category: CategoryId;
  title: string;
  headline: string;
  summary: string;
  takeaway: string;
  points: { title: string; text: string }[];
  flow?: string[];
  demo?: { tool: string; cue: string; optional: boolean };
  creationStory?: string;
  charts?: Chart[];
  examples?: { name: string; description: string; url: string }[];
  caveat?: string;
  sources: Source[];
}

const docs = (path: string): Source => ({
  label: 'Read the documentation',
  url: `https://docs.github.com/${path}`,
});
const report: Source = { label: 'Octoverse 2026 report', url: reportUrl };
const release = (slug: string, label: string): Source => ({
  label,
  url: `https://github.blog/changelog/${slug}/`,
});

const topicContent: Topic[] = [
  {
    id: 'stacked-pull-requests', category: 'platform',
    title: 'Stacked pull requests', headline: 'Big idea.\nReviewable pieces.',
    summary: 'Split connected work into focused pull requests. Review the parts independently, without losing the bigger picture.',
    takeaway: 'The unit of review does not have to be the size of the whole feature.',
    points: [
      { title: 'Keep changes focused', text: 'Separate a foundation, a feature, and its finishing touches into linked changes.' },
      { title: 'Keep the relationship', text: 'A stack makes the dependencies between those pull requests explicit.' },
      { title: 'Bring it together', text: 'Review independently, then merge the full stack when it is ready.' },
    ],
    flow: ['Content model', 'Presentation pages', 'Navigation & polish'],
    demo: { tool: 'GitHub + Git', cue: 'Use real related changes to this website to show a stack of reviewable pull requests.', optional: true },
    sources: [docs('en/pull-requests/how-tos/stacked-pull-requests')],
  },
  {
    id: 'cli-attachments', category: 'platform',
    title: 'CLI attachments', headline: 'Show the change.\nFrom your terminal.',
    summary: 'Add images and videos inline to issues, pull requests, or comments with GitHub CLI’s repeatable --attach flag.',
    takeaway: 'Visual context belongs with the work, even when the work starts in a terminal.',
    points: [
      { title: 'Capture the evidence', text: 'Use a screenshot or recording to explain what changed on the page.' },
      { title: 'Keep your workflow', text: 'Attach that evidence without leaving your command-line workflow.' },
      { title: 'Give reviewers context', text: 'Put the visual result beside the discussion and diff.' },
    ],
    flow: ['Capture the page', 'Attach with gh', 'Review with context'],
    demo: { tool: 'GitHub CLI', cue: 'Capture a real page change and attach the image to its issue or pull request.', optional: true },
    sources: [docs('get-started/writing-on-github/working-with-advanced-formatting/attaching-files')],
  },
  {
    id: 'issue-artifacts', category: 'platform',
    title: 'Issue artifacts', headline: 'Keep the why\nwith the work.',
    summary: 'Attach plans, research, links, and other artifacts to an issue so the thinking stays connected to the implementation.',
    takeaway: 'A useful issue carries the decisions, not just the task.',
    points: [
      { title: 'Capture the thinking', text: 'Keep requirements and research near the problem they explain.' },
      { title: 'Make decisions findable', text: 'Let collaborators discover the context without retracing a conversation.' },
      { title: 'Connect plan to change', text: 'Carry that shared context into implementation and review.' },
    ],
    flow: ['Question', 'Plan & research', 'Implementation'],
    sources: [docs('issues/tracking-your-work-with-issues/using-issues/using-artifacts-with-issues')],
  },
  {
    id: 'pull-request-overview', category: 'platform',
    title: 'Pull request overview', headline: 'Find what\nneeds you next.',
    summary: 'A clearer pull request experience helps you understand open work, spot blockers, and choose the next action.',
    takeaway: 'Start with readiness, then follow the detail that matters.',
    points: [
      { title: 'Read the signals', text: 'Bring checks, approvals, and conversations into a compact readiness summary.' },
      { title: 'Find the blocker', text: 'Move from the summary to the unresolved detail that needs attention.' },
      { title: 'Take the next step', text: 'Review, update, or merge according to the pull request’s state and your permissions.' },
    ],
    flow: ['Readiness', 'Blockers', 'Next action'],
    caveat: 'The detailed Overview page was announced as an opt-in public preview on November 5, 2026. Availability and controls may change.',
    sources: [
      docs('en/pull-requests'),
      release('2026-11-05-new-pull-request-overview-page-in-public-preview', 'Changelog: pull request overview'),
    ],
  },
  {
    id: 'fusion', category: 'copilot',
    title: 'Copilot Fusion', headline: 'Choose the effort.\nNot every model.',
    summary: 'Select Standard, High, or Max. Copilot Fusion handles whether to use one model or combine models for the task.',
    takeaway: 'Direct the work and its tradeoffs; let orchestration handle model choice.',
    points: [
      { title: 'Set the effort', text: 'Choose the level that fits the quality, speed, and cost tradeoff of the task.' },
      { title: 'Let Copilot coordinate', text: 'Fusion determines whether one model or multiple models fit the work.' },
      { title: 'Stay accountable', text: 'Inspect the implementation and decide whether the result meets the brief.' },
    ],
    flow: ['Your goal', 'Effort level', 'Model orchestration', 'Your review'],
    creationStory: 'I used Copilot Fusion in the GitHub Copilot app for the initial creation of this Astro website. The conversation, planning decisions, first attempt, and corrections are the example: directing the work and reviewing what came back.',
    sources: [
      docs('copilot/concepts/models/copilot-fusion'),
      release('2026-09-14-configure-cost-and-quality-in-copilot-auto-model-selection', 'Background: earlier auto-selection tiers'),
    ],
    caveat: 'The September changelog describes earlier auto-selection tiers, not Fusion’s Standard / High / Max controls. They are related history, not interchangeable labels.',
  },
  {
    id: 'projects', category: 'copilot',
    title: 'Copilot Projects', headline: 'One goal.\nCoordinated work.',
    summary: 'Keep goals, context, sessions, and results together while coordinating work across one or more repositories.',
    takeaway: 'A project is the shared context around the sessions, not just another chat.',
    points: [
      { title: 'Describe the outcome', text: 'Give the work a goal and keep the constraints close.' },
      { title: 'Coordinate the parts', text: 'Track parallel sessions and understand how their outputs fit together.' },
      { title: 'Direct what happens next', text: 'Review progress and results before deciding the next move.' },
    ],
    flow: ['Goal & context', 'Parallel sessions', 'Reviewable results'],
    sources: [docs('copilot/how-tos/github-copilot-app/working-with-projects')],
  },
  {
    id: 'automations', category: 'copilot',
    title: 'Copilot Automations', headline: 'Repeat the useful.\nNot the setup.',
    summary: 'Run reusable Copilot tasks on demand, on a schedule, or from triggers, with explicit controls over access, actions, and cost.',
    takeaway: 'Turn a recurring task into a repeatable workflow with boundaries.',
    points: [
      { title: 'Define the job', text: 'Make the expected output and allowed scope specific.' },
      { title: 'Choose the trigger', text: 'Run when needed, on a schedule, or in response to an event.' },
      { title: 'Keep controls visible', text: 'Review permissions, actions, and spending rather than assuming unlimited autonomy.' },
    ],
    flow: ['Reusable task', 'Trigger', 'Controlled execution', 'Review'],
    sources: [docs('en/copilot/how-tos/github-copilot-app/using-automations')],
  },
  {
    id: 'momentum', category: 'octoverse',
    title: 'The year of momentum', headline: 'More pushes than\ntwo years combined.',
    summary: 'Developers pushed code 17.9 billion times in the reporting year. The increase was not limited to one measure of activity.',
    takeaway: 'The scale changed. Understanding what that activity produces is still the human question.',
    points: [
      { title: 'A broad acceleration', text: 'Commits, merged pull requests, and Actions jobs grew alongside pushes.' },
      { title: 'A midyear inflection', text: 'The report describes a sharper rise around June as agent workflows and their underlying tools evolved.' },
    ],
    charts: [
      { title: 'Pushes to GitHub', unit: 'Billions of pushes', rows: [
        { label: '2024', value: 5.2, display: '5.2B', comparison: true },
        { label: '2025', value: 6.7, display: '6.7B', comparison: true },
        { label: '2026', value: 17.9, display: '17.9B' },
      ], note: 'Public and private repositories. Each year is the 12 months ending September 30.' },
      { title: 'Activity, 2024 to 2026', unit: '2026 total / 2024 total', rows: [
        { label: 'Commits', value: 3.43, display: '3.43×' },
        { label: 'Merged PRs', value: 1.3e9 / 402e6, display: '3.23×' },
        { label: 'Actions jobs', value: 45.4 / 8, display: '5.68×' },
      ], note: 'Ratios calculated from report totals: commits 10.0B → 34.3B; merged PRs 402M → 1.3B; Actions jobs 8.0B → 45.4B. Rounded.' },
    ],
    caveat: 'Activity counts are not a direct measure of quality or productivity, and do not establish that agents caused the growth.',
    sources: [report],
  },
  {
    id: 'global-growth', category: 'octoverse',
    title: 'A wider developer world', headline: '225 million builders.\nAnd counting.',
    summary: 'GitHub now serves more than 225 million developers. The United States and India remain its two largest developer communities.',
    takeaway: 'The next wave of software is being built in more places at once.',
    points: [
      { title: 'Growth at scale', text: 'The US and India each added more than 10 million developers during the reporting year.' },
      { title: 'Different local engines', text: 'The report connects regional growth with fintech, industrial AI adoption, digital economies, and investment in skills.' },
    ],
    charts: [{ title: 'Largest developer communities', unit: 'Millions of developers, September 2026', rows: [
      { label: 'United States', value: 38.3, display: '38.3M' },
      { label: 'India', value: 32, display: '32.0M' },
      { label: 'China', value: 12.4, display: '12.4M' },
      { label: 'Brazil', value: 10.2, display: '10.2M' },
      { label: 'Japan', value: 7.15, display: '7.15M' },
    ], note: 'A selected top five from the report’s country table; community size, not activity or population-adjusted participation.' }],
    caveat: 'The report’s forecasts span widely different outcomes. These charts show observed community counts, not a forecast.',
    sources: [report],
  },
  {
    id: 'industries', category: 'octoverse',
    title: 'Beyond the software industry', headline: 'The closest person\nto the problem builds.',
    summary: 'The report looks at public repositories by the industries they serve, including construction, health care, agriculture, and manufacturing.',
    takeaway: '“Developer” is increasingly a description of what someone does, not only their job title.',
    points: [
      { title: 'A broader footprint', text: 'Professional, scientific, and technical services rose from fourth to second by public repository count.' },
      { title: 'AI mentions are not agent use', text: 'A repository discussing AI and a repository receiving an agent-opened pull request are different signals.' },
      { title: 'Small bases matter', text: 'Mining-related repositories grew roughly 65× from a small 2022 starting base. Large multiples do not imply the largest communities.' },
    ],
    examples: [
      { name: 'OpenPinch', description: 'An energy-research toolkit for finding industrial heat-recovery opportunities.', url: 'https://github.com/waikato-ahuora-smart-energy-systems/OpenPinch' },
      { name: 'wsidata', description: 'Tools for working with whole-slide tissue image data in research.', url: 'https://github.com/rendeirolab/wsidata' },
      { name: 'PlayClass', description: 'A research pipeline for classifying chicken play behavior from video.', url: 'https://github.com/sbhattlab/PlayClass' },
    ],
    caveat: 'Industry assignments use language-model classification of random samples of public repositories, based on repository metadata and READMEs. This is not a census of all software work.',
    sources: [report],
  },
  {
    id: 'agentic-workflows', category: 'octoverse',
    title: 'The agentic workflow shift', headline: 'The first draft\nis changing hands.',
    summary: 'By September 2026, more than 40% of pull requests started with an agent’s first draft, compared with 17% in March.',
    takeaway: 'As drafting is delegated, direction and review become more important—not less.',
    points: [
      { title: 'Whole tasks, not just answers', text: '55% of Copilot monthly active users used agentic features, up from 35% a year earlier.' },
      { title: 'Review evolves with creation', text: 'The report also records growth in AI-assisted code review, Advanced Security, and stacked pull requests.' },
    ],
    charts: [
      { title: 'Agent-started pull requests', unit: 'Share of PRs in the specified month', rows: [
        { label: 'March 2026', value: 17, display: '17%', comparison: true },
        { label: 'September 2026', value: 40, display: '>40%' },
      ], note: 'September’s bar uses 40 as a lower bound. The report states more than 40%, not exactly 40%.' },
      { title: 'Copilot users using agentic features', unit: 'Share of monthly active Copilot users', rows: [
        { label: 'A year earlier', value: 35, display: '35%', comparison: true },
        { label: '2026 report', value: 55, display: '55%' },
      ], note: 'This measures Copilot user adoption, not the share of all GitHub users or all code.' },
    ],
    caveat: 'Detected agent signals do not capture every use of AI. Repository activity and merge rates do not by themselves establish code quality.',
    sources: [report],
  },
  {
    id: 'model-choice', category: 'octoverse',
    title: 'Model choice at developer speed', headline: 'Not one model.\nA working mix.',
    summary: 'In September, 61% of Copilot users who explicitly selected models used more than one. Different tasks call for different tradeoffs.',
    takeaway: 'Developers are choosing across capabilities—and increasingly delegating the choice itself.',
    points: [
      { title: 'A growing lineup', text: 'Paid Copilot users used 47 distinct models in September, compared with 29 in May.' },
      { title: 'Choice can also be automatic', text: '63% of paying Copilot developers used auto model selection at least once in September.' },
    ],
    charts: [{ title: 'Out of 100 developer-selected requests', unit: 'Share of requests, September 2026', rows: [
      { label: 'General purpose', value: 38, display: '38%' },
      { label: 'Deep reasoning & planning', value: 37, display: '37%' },
      { label: 'Fast & lightweight', value: 25, display: '25%' },
    ], note: 'Rounded shares. Excludes automatic model selection, staff usage, background utility models, monitoring duplicates, and requests using developers’ own API keys.' }],
    caveat: 'The 61% figure concerns users who selected models themselves. The 63% auto-selection figure concerns paying developers. These are different populations and measures.',
    sources: [report],
  },
  {
    id: 'languages', category: 'octoverse',
    title: 'Language choice has new influence', headline: 'Familiar leaders.\nNew questions.',
    summary: 'TypeScript, Python, and JavaScript retained the top three places by contributors. Rust grew fastest by percentage among the top languages.',
    takeaway: 'Language choice reflects people, ecosystems, existing systems—and potentially agents.',
    points: [
      { title: 'Scale and growth differ', text: 'TypeScript added 3.62 million monthly contributors; Rust had the strongest percentage growth among the leading languages.' },
      { title: 'Avoid a causal shortcut', text: 'Higher AI involvement and faster community growth appear together. The chart does not explain which caused which.' },
    ],
    charts: [{ title: 'AI involvement in merged pull requests', unit: 'Share with detected AI involvement, reporting year', rows: [
      { label: 'TypeScript', value: 44.1, display: '44.1%' },
      { label: 'Python', value: 41.1, display: '41.1%' },
      { label: 'Rust', value: 40.4, display: '40.4%' },
      { label: 'Java', value: 21.2, display: '21.2%' },
    ], note: 'Selected languages from the report’s bubble chart. This is not a language ranking and does not measure the percentage of code written by AI.' }],
    caveat: 'Only observed values are shown. The report’s September 2027 contributor forecasts are projections, not measured 2026 outcomes.',
    sources: [report],
  },
  {
    id: 'open-source', category: 'octoverse',
    title: 'What captures developer attention', headline: 'The foundations.\nAnd the tools on top.',
    summary: 'The report separates community and independent repositories from single-vendor or product-led projects to make their different roles visible.',
    takeaway: 'Developer attention reaches both shared infrastructure and the tools people use directly.',
    points: [
      { title: 'Community and independent', text: 'Inference engines, frameworks, runtimes, and community platforms underpin the ecosystem.' },
      { title: 'Single-vendor and product-led', text: 'Coding agents, editors, and orchestration tools feature prominently in the other group.' },
      { title: 'Two different lists', text: 'Fastest-growing by contributors and most-engaged repositories answer different questions. Do not combine them into one ranking.' },
    ],
    examples: [
      { name: 'llama.cpp', description: 'Community / independent; appears in both the growth and engagement lists.', url: 'https://github.com/ggml-org/llama.cpp' },
      { name: 'Rust', description: 'Community / independent; appears in the most-engaged list.', url: 'https://github.com/rust-lang/rust' },
      { name: 'Copilot CLI', description: 'Single-vendor / product-led; appears in the fastest-growing by contributors list.', url: 'https://github.com/github/copilot-cli' },
    ],
    caveat: 'These are selected examples from separately defined lists, not an overall popularity ranking or an endorsement.',
    sources: [report],
  },
];

export const topics = categories.flatMap((category) =>
  topicContent.filter((topic) => topic.category === category.id),
);

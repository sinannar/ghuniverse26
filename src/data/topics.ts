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
    description: 'Smaller changes, richer context, and a clearer path to merge.',
    invitation: 'Choose a platform announcement',
  },
  {
    id: 'badge',
    name: 'Badge',
    headline: 'A computer\non your lanyard.',
    description: 'Meet the Universe 2026 badge, explore its event apps, and follow a path from interactive hardware to your own code.',
    invitation: 'Follow the badge from event to code',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    headline: 'From writing code\nto directing work.',
    description: 'Models, projects, automations, and tools that make room for a different way of building.',
    invitation: 'Choose a Copilot announcement',
  },
  {
    id: 'sessions',
    name: 'Sessions',
    headline: 'From the stage.\nA closer look.',
    description: 'Five recorded Universe sessions that go deeper on the announcements, and ask what is worth building at all.',
    invitation: 'Choose a session',
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
  source?: Source;
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
  visual?: { src: string; alt: string; caption: string; source: Source };
  session?: {
    speakers: string[];
    format: string;
    steps?: string[];
    related?: { category: CategoryId; id: string; title: string };
  };
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
const sessionPage = (id: string): Source => ({
  label: 'Universe session page (sign-in required for recording)',
  url: `https://reg.githubuniverse.com/flow/github/universe26/attendee-portal/page/sessioncatalog/session/${id}`,
});
const sessionSlides = (path: string): Source => ({
  label: 'Speaker slides (PDF)',
  url: `https://static.rainfocus.com/github/universe26/sess/${path}`,
});
const sessionCaveat = 'Based on the speakers’ published slides and the event’s AI-generated session summary; the recording was not reviewed. Figures are as presented by the session.';
const stackedSlides = sessionSlides('1777610662772001qS4e/sessionppt/BLD1485D_Stop%20waiting%20on%20your%20own%20pull%20requests%3A%20GitHub%20Stacked%20PRs%20in%20practice_presentation_1793312756664001XDWe.pdf');
const stackedSource: Source = { label: 'Sameen Karim’s Universe slides', url: stackedSlides.url };

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
    id: 'universe-badge', category: 'badge',
    title: 'Meet the badge', headline: 'A computer\non your lanyard.',
    summary: 'The Universe 2026 badge is a programmable computer attendees can wear, explore, and build for—not just an event credential.',
    takeaway: 'The badge is both a keepsake and a platform attendees can explore and build for.',
    points: [
      { title: 'Made to explore', text: 'MonaOS and MicroPython apps make this a small computer, ready to use and open to build on.' },
      { title: 'Made to interact', text: 'A color screen, physical and touch controls, motion sensing, Wi-Fi, Bluetooth, and infrared bring apps off the screen.' },
      { title: 'A starting point', text: 'The event apps are open to explore, and the badge’s software and hardware references are published for builders.' },
    ],
    flow: ['Meet the computer', 'See what it can do', 'Make and test an app'],
    caveat: 'Hardware and app details here refer to the Universe 2026 badge; earlier Universe badges differ.',
    visual: {
      src: '/badge-visuals/tufty-platform.png',
      alt: 'Tufty 2350 color-screen badge with its app launcher displayed.',
      caption: 'Tufty 2350 reference device. The Universe 2026 badge is a custom derivative, not this exact enclosure.',
      source: {
        label: 'Badge platform photo on GitHub',
        url: 'https://github.com/badger/home/blob/c095061d3483a2504a67a1f37ed4d7ee71edad5a/badge/assets/tufty.png',
      },
    },
    sources: [
      { label: 'Badger 2026 Field Guide', url: 'https://badger.github.io/' },
      { label: 'About the badge', url: 'https://badger.github.io/about-badge/' },
      { label: 'Universe 2026 badge hardware reference', url: 'https://github.com/badger/home/blob/main/hardware/README.md' },
      { label: 'Badge platform photo on GitHub', url: 'https://github.com/badger/home/blob/c095061d3483a2504a67a1f37ed4d7ee71edad5a/badge/assets/tufty.png' },
      { label: 'Badge hardware and apps on GitHub', url: 'https://github.com/badger/home' },
    ],
  },
  {
    id: 'badge-hardware', category: 'badge',
    title: 'Inside the badge', headline: 'Small board.\nBig possibilities.',
    summary: 'A compact computer pairs a vivid display and interactive controls with wireless connections, a rechargeable battery, and room to expand.',
    takeaway: 'Every spec points to another way to use, connect, or build for the badge.',
    points: [
      { title: 'Compute & storage', text: 'RP2350 dual-core Arm Cortex-M33 at 200 MHz, 512 kB SRAM, and 16 MB QSPI XiP flash run MonaOS and MicroPython apps.' },
      { title: 'See & sense', text: 'A 320 × 240 full-color IPS display with four-zone LED backlight sits alongside five buttons, eight capacitive touch sensors, and an accelerometer.' },
      { title: 'Connect', text: '2.4 GHz Wi-Fi, Bluetooth 5, and infrared transmit and receive support network apps, nearby projects, and beacons.' },
      { title: 'Power through the day', text: 'A rechargeable 1,000 mAh battery is rated for up to 8 hours, with battery-voltage and charge-status monitoring.' },
      { title: 'Built to take along', text: 'USB-C handles charging and programming; Qw/ST adds accessories; SWD supports debugging. A polycarbonate enclosure and lanyard fixings make it wearable.' },
    ],
    flow: ['Compute', 'Display & input', 'Connect', 'Go portable', 'Expand'],
    caveat: 'Battery runtime is an “up to” specification; actual runtime depends on use. Specs describe the Universe 2026 badge, not earlier event badges.',
    sources: [
      { label: 'About the badge: specifications', url: 'https://badger.github.io/about-badge/' },
      { label: 'Universe 2026 badge hardware reference', url: 'https://github.com/badger/home/blob/main/hardware/README.md' },
    ],
  },
  {
    id: 'badge-interactions', category: 'badge',
    title: 'Built to interact', headline: 'Touch, move,\nconnect.',
    summary: 'The Universe badge adds sensors and controls that let developers build beyond a static screen.',
    takeaway: 'The controls and sensors make the badge an input device as well as a display.',
    points: [
      { title: 'Press or touch', text: 'Five physical buttons work alongside capacitive touch controls, including a directional pad and Select, Back, Menu, and Home.' },
      { title: 'Move it', text: 'An accelerometer and gyroscope report motion and help the firmware adapt to badge orientation.' },
      { title: 'Connect nearby', text: 'Infrared transmit and receive hardware supports experiences such as the badge quest, where badges exchange beacons.' },
    ],
    flow: ['Press or touch', 'Move the badge', 'Exchange signals'],
    caveat: 'Hardware details refer to the Universe 2026 badge. Use a physical badge to verify hardware-specific behavior.',
    sources: [
      { label: 'Universe 2026 badge hardware reference', url: 'https://github.com/badger/home/blob/main/hardware/README.md' },
      { label: 'About the badge: hardware and simulator', url: 'https://badger.github.io/about-badge/#badge-simulator' },
      { label: 'Badge quest app', url: 'https://github.com/badger/home/tree/main/badge/apps/quest' },
    ],
  },
  {
    id: 'badge-apps', category: 'badge',
    title: 'Apps for the event', headline: 'The event\nruns on the badge.',
    summary: 'The shipped apps turn the badge into a personal profile, a way to exchange contacts, and a playful quest.',
    takeaway: 'The event experience is a set of small apps, not a single fixed screen.',
    points: [
      { title: 'Show your GitHub', text: 'The Badge app displays a GitHub profile and contribution graph.' },
      { title: 'Share a contact card', text: 'The Contacts app exchanges cards with nearby badges.' },
      { title: 'Play the quest', text: 'The Quest app uses infrared beacons to collect progress.' },
    ],
    flow: ['Show your profile', 'Share a contact', 'Find the next beacon'],
    sources: [
      { label: 'Badge app source', url: 'https://github.com/badger/home/tree/main/badge/apps/badge' },
      { label: 'Contacts app source', url: 'https://github.com/badger/home/tree/main/badge/apps/contacts' },
      { label: 'Quest app source', url: 'https://github.com/badger/home/tree/main/badge/apps/quest' },
    ],
  },
  {
    id: 'build-for-the-badge', category: 'badge',
    title: 'Build for the badge', headline: 'From a browser\ninto your hands.',
    summary: 'Start with the Badger Field Guide, experiment in the browser, then explore the published apps and hardware references.',
    takeaway: 'The badge is designed to invite attendees from using it to making something for it.',
    points: [
      { title: 'Explore the guide', text: 'The Field Guide collects the paths into badge apps, capabilities, and development resources.' },
      { title: 'Try the browser simulator', text: 'Run MonaOS 4.0 and stock apps in the browser. HTTP requests depend on CORS, while socket apps such as Camera and Copilot require a physical badge.' },
      { title: 'Keep building', text: 'The badge repository publishes the shipped apps and hardware references so developers can inspect how it works.' },
    ],
    flow: ['Read the guide', 'Try an app in the browser', 'Test on the badge'],
    caveat: 'The browser simulator is a useful starting point, not a substitute for hardware testing. Its HTTP requests may depend on CORS, and socket-based Camera and Copilot apps require a physical badge.',
    sources: [
      { label: 'Badger 2026 Field Guide', url: 'https://badger.github.io/' },
      { label: 'About the badge and browser simulator', url: 'https://badger.github.io/about-badge/#badge-simulator' },
      { label: 'Browser simulator', url: 'https://badger.github.io/editor' },
      { label: 'Badge hardware and apps on GitHub', url: 'https://github.com/badger/home' },
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
  {
    id: 'stacked-prs-in-practice', category: 'sessions',
    title: 'Stacked PRs in practice', headline: 'Stop waiting on\nyour own pull requests.',
    summary: 'Agents produce larger, more parallel changes. Stacks break them into a chain of focused pull requests that share one merge target, so each layer is reviewed on its own. Stacked PRs are now generally available on all GitHub.com plans.',
    takeaway: 'When agents write more code, the unit of review has to get smaller.',
    points: [
      { title: 'Smaller reviews', text: 'The talk contrasts one +1,200 / -400 pull request taking five days to review with three focused pull requests of about an hour each.' },
      { title: 'Stack-aware tools', text: 'The gh stack CLI handles cascading rebases, supports Git worktrees for parallel agent work, and installs as an agent skill: gh skill install github/gh-stack.' },
      { title: 'Safe merges', text: 'Upstack PRs stay blocked until lower ones pass; merges are atomic and retarget dependent branches. AutoMerge for stacks was also announced.' },
    ],
    flow: ['Build the stack with gh', 'Review each layer', 'Merge atomically'],
    charts: [
      { title: 'One big PR or three focused ones', unit: 'Time to review, hours', rows: [
        { label: 'One PR: schema + API + UI (+1,200 / −400)', value: 120, display: '5 days', comparison: true },
        { label: 'Each focused PR (about +400)', value: 1, display: '~1 hour' },
      ], note: 'Illustrative example from the speaker’s slide, not a measured benchmark. Five days is drawn as 120 hours for scale.', source: stackedSource },
      { title: 'Reported effect of stacking', unit: 'Change reported on the slide, %', rows: [
        { label: 'Merged code, repositories using stacked PRs', value: 9, display: '+9%' },
        { label: 'Time to merge, most active repositories', value: 5, display: '5% faster' },
      ], note: 'As presented by GitHub; the two figures cover different sets of repositories and do not establish cause.', source: stackedSource },
    ],
    session: {
      speakers: ['Sameen Karim, Senior Product Manager, GitHub'],
      format: 'Product demo · October 28',
      related: { category: 'platform', id: 'stacked-pull-requests', title: 'Stacked pull requests' },
    },
    caveat: sessionCaveat,
    sources: [
      sessionPage('1777610662772001qS4e'),
      stackedSlides,
      docs('en/pull-requests/how-tos/stacked-pull-requests'),
    ],
  },
  {
    id: 'custom-review-instructions', category: 'sessions',
    title: 'Custom code review instructions', headline: 'Teach the reviewer\nwhat your team knows.',
    summary: 'Copilot code review already catches real bugs out of the box. GitHub’s Dependabot team added 13 instruction files so it also knows their conventions, failure modes, and domain context.',
    takeaway: 'Teach Copilot how your team thinks about reviews, and keep your own review for the decisions that need judgment.',
    points: [
      { title: 'One topic per file', text: 'Markdown files in .github/instructions, each scoped with applyTo front matter, for example testing rules for spec/**/*.rb.' },
      { title: 'Built from real feedback', text: 'Ask Copilot to mine recently merged PRs and their review comments, then turn recurring explanations into instructions.' },
      { title: 'How the prompt is built', text: 'Each review combines the PR changes, repository-wide guidance, and matching instructions, read from the PR’s head branch so changes can be tested first.' },
    ],
    flow: ['Review history', 'Instruction files', 'Matching by applyTo', 'Copilot code review'],
    session: {
      speakers: ['Nish Sinha, Software Engineer III, GitHub'],
      format: 'Product demo · October 28',
      related: { category: 'octoverse', id: 'agentic-workflows', title: 'The agentic workflow shift' },
    },
    caveat: `${sessionCaveat} The talk contrasts instructions (active context) with Copilot Memories (passive, learned over time); review comments note when custom instructions were used.`,
    sources: [
      sessionPage('1777688857786001ZKKR'),
      sessionSlides('1777688857786001ZKKR/sessionppt/LDR1662D_Supercharge%20Copilot%20code%20review%20with%20custom%20review%20instructions_presentation_1793311598838001HPtE.pdf'),
    ],
  },
  {
    id: 'model-harness', category: 'sessions',
    title: 'Optimizing Copilot for every new model', headline: 'Agent =\nmodel + harness.',
    summary: 'The model supplies reasoning; the harness (prompts, tools, agent loop, context, permissions) turns it into finished tasks. Each harness change is tested in four steps:',
    takeaway: 'Model choice is only real when every model is tuned into the harness, and the tuning never stops.',
    points: [
      { title: 'Every model drop is tuning', text: 'Dropping a stronger model into an untuned harness can still lower quality. With new models every four to six weeks, retuning is a routine discipline.' },
      { title: 'Offline evals', text: 'A curated benchmark portfolio: regression runs per change and every three hours, daily and weekly suites, and on-demand baselines.' },
      { title: 'Online evals', text: 'Each harness change is a hypothesis: benchmarked on the PR, A/B tested with staff, then with customers, measured on task success, latency, tokens, and cost.' },
    ],
    flow: ['New model', 'Tune the harness', 'Offline evals', 'Online A/B'],
    session: {
      speakers: ['Julia Kasper, Product Manager, GitHub'],
      format: 'Product demo · October 29',
      steps: ['Hypothesis in an issue', 'Benchmarks on the PR', 'Staff A/B', 'Customer A/B'],
      related: { category: 'copilot', id: 'fusion', title: 'Copilot Fusion' },
    },
    caveat: sessionCaveat,
    sources: [
      sessionPage('1777584211997001vbxd'),
      sessionSlides('1777584211997001vbxd/sessionppt/LDR1434D_How%20we%20optimize%20GitHub%20Copilot%20for%20every%20new%20model._1794237677335001JPcY.pdf'),
      { label: 'Copilot benchmarks', url: 'https://benchmarks.github.com/' },
    ],
  },
  {
    id: 'factory-mindset', category: 'sessions',
    title: 'The factory mindset', headline: 'Stop translating intent.\nEngineer the process.',
    summary: 'GitHub Agentic Workflows turn Markdown (intent plus guardrails) into GitHub Actions that run agents in a sandbox. Developers become process engineers: agents do the toil, and humans keep intent, judgment, and the merge.',
    takeaway: 'Automate the toil around engineers. Keep the judgment with people.',
    points: [
      { title: 'The factory', text: 'Peli de Halleux (GitHub Next): agent PRs pass parallel reviewers for code, tests, security, and specs before a final agentic step. If every PR needs deep human review, improve the process.' },
      { title: 'At enterprise scale', text: 'Tim Mason (Marks & Spencer): a curated workflow catalogue and agentic control plane. Pick a workflow, click deploy, and it arrives as a reviewable PR in under 30 seconds.' },
      { title: 'In regulated healthcare', text: 'Paul Snider (Provation): lift the trusted developer harness into agentic workflows, make the process produce its own evidence, and instrument with OpenTelemetry before scaling.' },
    ],
    flow: ['Markdown intent', 'GitHub Actions', 'Sandboxed agents', 'Human merge'],
    session: {
      speakers: [
        'Peli de Halleux, Agentic Engineer, GitHub Next, Microsoft',
        'Tim Mason, Principal Engineer, Marks and Spencer',
        'Paul Snider, CTO, Provation / Fortive',
      ],
      format: 'Main stage · October 28',
      related: { category: 'copilot', id: 'automations', title: 'Copilot Automations' },
    },
    caveat: sessionCaveat,
    sources: [
      sessionPage('1785161525956001tBix'),
      sessionSlides('1785161525956001tBix/sessionppt/LDR1786M%20_%20The%20factory%20mindset%3A%20Agentic%20workflows%20in%20production_1793381031548001jNza.pdf'),
    ],
  },
  {
    id: 'worth-building', category: 'sessions',
    title: 'What’s worth building?', headline: 'AI can build anything.\nWhat’s worth building?',
    summary: 'Kent C. Dodds and Sue Black asked what is worth building when one developer and their agents can ship and maintain systems that once needed several teams.',
    takeaway: 'What could you do to make life better for a million people?',
    points: [
      { title: 'Restraint creates value', text: 'Kent describes building with an implementer agent backed by ADRs, CI, AI reviewers, previews, feature flags, and observability. The value still comes from restraint: deleting features and staying close to users.' },
      { title: 'Systems, not syntax', text: 'Sue’s research on the software “ripple effect” asks how far one change reaches. Teaching is shifting toward systems thinking, entrepreneurship, and teamwork; juniors still matter because engineering is problem-solving.' },
      { title: 'Whose values ship?', text: 'AI widens who can build, but a solo builder with agents risks losing diversity of perspective. Collaboration and community still matter.' },
    ],
    flow: ['What to build', 'Who builds it', 'How far it ripples', 'Who benefits'],
    session: {
      speakers: [
        'Sue Black, Professor of Computer Science and Technology Evangelist, Durham University',
        'Kent C. Dodds, Product Engineer, kody.codes',
      ],
      format: 'Main stage conversation · October 29',
    },
    caveat: sessionCaveat,
    sources: [
      sessionPage('1789650872339001QXAF'),
      sessionSlides('1789650872339001QXAF/sessionppt/BLD1886M_What%27s%20worth%20building%20when%20AI%20can%20build%20anything_1793379965498001I6i9.pdf'),
    ],
  },
];

export const topics = categories.flatMap((category) =>
  topicContent.filter((topic) => topic.category === category.id),
);

[![Deploy presentation to GitHub Pages](https://github.com/sinannar/ghuniverse26/actions/workflows/deploy.yml/badge.svg)](https://github.com/sinannar/ghuniverse26/actions/workflows/deploy.yml)

[![Issue labeler](https://github.com/sinannar/ghuniverse26/actions/workflows/issue-labeler.lock.yml/badge.svg)](https://github.com/sinannar/ghuniverse26/actions/workflows/issue-labeler.lock.yml)

[![Pull request reviewer](https://github.com/sinannar/ghuniverse26/actions/workflows/pr-reviewer.lock.yml/badge.svg)](https://github.com/sinannar/ghuniverse26/actions/workflows/pr-reviewer.lock.yml)

# Universe 2026: the presentation

An independent browser-based slide deck built with Astro and TypeScript.
**This website replaces PowerPoint**—it is the presentation, not a recap landing
page. Open it to start directly with Octoverse report data, then present the
selected topics and switch to real tools for live demonstrations.

## Run locally

Use Node.js 22.12+ (or a supported newer even-numbered release).

```sh
npm ci
npm run dev
```

Open the printed local URL at `/`. For a production preview:

```sh
npm run check
npm test
npm run build
npm run test:production
npm run preview
```

For isolated Chromium checks of keyboard navigation, demo handoffs, and slide
layout at desktop, projector, and mobile sizes:

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

The browser suite uses its own production preview on port 4322.

## Present

The opening slide shows the report's 2024–2026 pushes comparison. The default
order is **Octoverse → Platform → Copilot**, with 14 curated topics:

| Chapter | Topics |
| --- | --- |
| Octoverse | Momentum, global growth, industries, agentic workflows, model choice, language trends, open source |
| Platform | Stacked PRs, CLI attachments, issue artifacts, PR overview |
| Copilot | Fusion, Projects, Automations |

Security and Connectors are deliberately outside this talk. Developer trends
remain inside Octoverse rather than becoming a duplicate chapter. Coverage was
chosen during planning; there is no runtime all-or-selected questionnaire.

Use Left/Right, Page Up/Down, or Space to advance. At the end of a topic, Next
continues to the next topic; Previous at its start returns to the previous
topic's last regular slide. Home/End jump within the current topic. Escape
returns to the topic chooser when focus is outside interactive controls.
Escape first closes an open sources popover or leaves native fullscreen.
Use the chapter navigation or topic chooser to jump freely.

The slide dropdown selects a particular slide. Slide hashes such as
`/copilot/fusion/#creation` keep your place across refresh,
browser Back/Forward, and switching to live tools. The desktop presentation
shows one slide at a time; smaller screens can scroll an oversized slide.

The fullscreen button is offered only when the browser supports the Fullscreen
API. Browser-native fullscreen is also fine. Core content and ordinary navigation
work without JavaScript. External sources open in a separate tab.
Astro's client-side router keeps the fullscreen document intact when moving
between topics and reinitializes the controls after each route change.
Printing or saving to PDF includes all slides in the current topic, including
optional demo slides, rather than only the selected slide.

The website is not a simulation of GitHub or Copilot. Stacked PRs and CLI
attachments have **optional** demo pauses, accessible from "Optional demo" or
the slide dropdown. Normal presentation navigation skips these pauses.
Fusion uses the site's actual initial creation as its example. No live demos
are promised for the other topics. Prepare your own authorized demo
repositories and tool state before presenting, and keep secrets and private
data off screen. Direct links let you return to the same topic after switching
to GitHub, Copilot, Git, or Copilot CLI.

## How this was built

Use **How this was built** in the footer, or follow the link on Fusion's creation
slide, to open `/making-of/`. It explains how the first version was created using
Copilot Fusion in the GitHub Copilot app, including the first attempt, feedback,
scope decisions, and the Astro implementation.

The page renders the preserved Markdown in `docs/iteration01/`, with expandable
discovery Q&A and implementation plan. It is a curated public account, not a raw
session export or a claim about unseen models, effort settings, or costs.

This is still **iteration 01**. [The iteration guide](docs/README.md) identifies
the active records. `AGENTS.md`, `.github/copilot-instructions.md`, and
`.github/github-app.yml` direct future agent sessions to read and update those
records without automatically starting another iteration.

The app configuration provides manual **Setup** (`npm ci`) and **Run**
(`npm run dev -- --host 127.0.0.1`) commands. Review and accept the repository
configuration in the GitHub Copilot app before expecting it to take effect.

## Edit the presentation

- `src/data/topics.ts`: chapter order, curated topics, explanations, optional handoff
  cues, official source links, chart data, caveats, and real project examples.
- `src/content.config.ts`: Astro's validated content collection schema.
- `src/pages/index.astro`: the data-first opening, sharing the report slide component.
- `src/pages/[category]/`: generated category overviews and topic presentations.
- `src/components/Presentation.astro`: the shared slide canvas and presentation controls.
- `src/lib/slides.ts`: topic-specific slide composition and keyboard destinations.
- `src/styles/global.css`: layout, category tokens, and responsive styling.
- `docs/iteration01/`: the approved plan and verbatim discovery Q&A.
- `src/pages/making-of.astro`: the public creation story, rendering the iteration records.

To add a topic, add a uniquely named entry to `topics` with its category and
sources. The collection, category page, static route, and Previous/Next order
follow that array. No page template duplication is needed. The selected announcement topics follow the official recap. Octoverse has
seven stories rather than one compressed report slide. Topics with data start
with their charts, followed by a context slide that retains the topic summary;
feature topics have a concise idea slide and talking points.
Do not add a demo property to undecided topics unless their demos are confirmed.

Charts are HTML/CSS with visible labels and values available to assistive
technology. Their decorative bar widths use the largest value within each
individual chart, not a shared scale across charts. Preserve the units, reporting
periods, sample boundaries, and source notes when editing. September's
agent-started PR share is reported as **more than 40%**, so its bar is a labeled
lower bound. Derived ratios are explicitly identified. No forecasts are plotted.

## Deploy to GitHub Pages

Local development and ordinary builds use `/`. The Pages workflow obtains the
production origin and base path from `actions/configure-pages`, so the repository
name is not hardcoded into site routes. Project Pages will still use their
repository path unless a custom domain or root-site configuration changes it.

1. In the repository's **Settings → Pages**, select **GitHub Actions** as the source.
2. Push/merge the site to `main`, or run **Deploy presentation to GitHub Pages**
   from the Actions tab. Repository environment rules may require approval.
3. The workflow checks types and content, runs tests, builds static pages,
   checks generated routes/links and browser presentation behavior, and deploys the `dist/` artifact with the
   Pages deployment action.

No secrets, API tokens, runtime data services, or server rewrites are required.
`astro.config.mjs` reads `ASTRO_SITE` and `ASTRO_BASE` for deployment. Internal
links and assets use `src/lib/navigation.ts` so deep links work at root or under
a Pages base. To reproduce a project-path build locally, use
`ASTRO_BASE=/example npm run build`, and supply the same variable to production
and browser tests. Rebuild without the variable to return to a root preview.

## Sources and attribution

Original presentation summaries and charts are based on:

- [GitHub Universe 2026 recap](https://github.com/events/universe/recap)
- [GitHub Changelog](https://github.blog/changelog/)
- [Octoverse 2026 report](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/)

Relevant changelog entries are curated per topic, not fetched at runtime.
Sources were reviewed November 15, 2026. Announcements describe products whose
availability, permissions, and billing may change; follow the linked official
documentation before a live demo. This is not an official GitHub website.

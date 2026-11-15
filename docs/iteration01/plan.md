# Universe 2026 presentation — revised plan

## Current iteration and follow-up scope

This remains **iteration 01**. The user subsequently requested a public
"How this was built" page covering the GitHub Copilot app / Fusion creation
story, conversation, plan, and session context. Render the existing iteration
Markdown as the source of truth, and link it from the Fusion slide and footer.
Explain how the Astro site works without fabricating a full transcript or model
details.

Add shared agent instructions and Copilot setup pointing to `docs/README.md`.
Keep material decisions and outcomes in this iteration; open another numbered
iteration only at the user's explicit direction.

The hosting refinement supersedes hardcoded local paths elsewhere in this plan:
serve at `/` locally and obtain the production origin and base from
`actions/configure-pages` outputs. Preserve subpath support for project Pages.

## Purpose and correction

Build a presentation site in Astro for GitHub Pages. The browser is the slide
deck, not a reconstruction of the Universe recap website. Use the recap and
official report as information sources, not as the page template.

The presenter chooses a chapter and a topic, presents one slide at a time, and
switches to GitHub, Copilot, Git, or Copilot CLI for selected live demonstrations.
This website and its creation process are themselves demonstration material.

This plan supersedes the earlier scrolling recap layout, automatic inclusion of
every category, and runtime all-or-selected coverage questionnaire. Topic scope
is an editorial decision made with the user during planning, not a new setup
feature that the audience needs to operate.

## Confirmed chapter coverage

| Chapter | Included topics | Explicitly excluded |
| --- | --- | --- |
| Octoverse — opening chapter | Activity and momentum; global developer growth; software across industries; agentic workflows; model choice; language trends; open-source projects and attention | No separate Developer Trends chapter |
| Platform | Stacked pull requests; GitHub CLI attachments; issue artifacts; pull request overview | None of the four recap topics |
| Copilot | Fusion; Projects; Automations | Connectors |

**Skip Security entirely for this presentation.** Do not show a Security
chapter, generate its presentation routes, or leave empty topic slots.

The result is three chapters and 14 selected topics: 7 Octoverse, 4 Platform,
and 3 Copilot. The suggested presentation order is **Octoverse → Platform →
Copilot**, with non-linear topic selection still available.

### Report and developer trends belong together

The report already covers developer trends. The user's latest instruction
supersedes the earlier request to separate them:

- Keep all seven report stories in **Octoverse**.
- Do not create a separate Developer Trends category, route group, or repeated
  set of slides.
- **Start presenting with report data**, rather than a marketing introduction
  or a category-selection questionnaire.

The report provides the context for the product announcements that follow:
how development is changing, then the platform and Copilot features supporting
that work.

## Presentation format

- One viewport-filling slide canvas at desktop/projector sizes.
- The default presentation entry opens on report data, with compact
  three-chapter navigation, not a mandatory title slide, marketing hero,
  announcement feed, or recap-style promotional rows.
- A curated topic chooser for each chapter. The presenter can jump to any
  included topic without following a mandatory global sequence.
- Previous/Next and keyboard controls advance **slides**, not scroll through
  an article. Keep category/topic navigation distinct from slide navigation.
- Topic and slide deep links preserve the exact place when switching to live
  tools, refreshing, or using browser Back/Forward.
- Escape returns to the topic chooser, except when the browser is exiting
  fullscreen or an open control needs the key.
- Optional native fullscreen. Keep all normal browsing functional without it.
- Legible large typography, concise statements, generous spacing, accessible
  contrast, and restrained color coding for chapter wayfinding.
- Source links are available without consuming the presentation canvas.
- Mobile can use an accessible scrolling fallback within an oversized slide.
  Without JavaScript, content and ordinary navigation remain readable.

### Data-first opening

Open with the report's activity/momentum story: a legible 2024–2026 pushes
comparison (5.2B, 6.7B, 17.9B), the takeaway that 2026 exceeds the prior two years
combined, and the reporting period/source. The first screen must contain actual
report evidence, not merely a button promising it.

Continue through the other Octoverse stories, then move to Platform and Copilot.
Keep chapter/topic selection accessible throughout. Reuse the report content
model for the opening so the numbers are not independently duplicated.

Retain category organization as inspiration from the supplied screenshot, but
do not reproduce the recap site's visual composition. Adapt the existing
presentation-first prototype rather than continuing the discarded recap layout.
Use Octoverse's identity for both the report's scale stories and developer trends.

## Topic depth and slide composition

### Platform and Copilot

Keep announcement coverage concise. Each topic needs a clear explanation of
what changed and why it matters, with only the supporting content needed to
present it. Do not mechanically force every topic into the same five-slide
sequence or give every topic a live-demo slide.

- Stacked PRs: connected work split into independently reviewable changes.
- CLI attachments: visual evidence attached from the terminal.
- Issue artifacts: plans, research, and decisions kept with the issue.
- PR overview: readiness, blockers, and the next action.
- Fusion: effort and model orchestration, anchored in the creation of this site.
- Projects: goals, shared context, sessions, and coordinated results.
- Automations: reusable work, triggers, boundaries, and review.

### Octoverse, including developer trends

Give these chapters real substance through focused evidence and discussion:

| Topic | Main material |
| --- | --- |
| Activity and momentum | Pushes, commits, merged PRs, and Actions growth; selected year comparisons |
| Global developer growth | More than 225 million developers, leading communities, and regional context |
| Industries | Software beyond the software sector; a few concrete report examples |
| Agentic workflows | Agent-started PRs, agentic-feature adoption, and the growing importance of review |
| Model choice | Multiple models, request mix, and automatic selection |
| Language trends | TypeScript/Python/JavaScript ordering, Rust growth, observed AI involvement |
| Open-source attention | Community/independent versus product-led projects; growth and engagement are different lists |

Use one visualization or central claim per evidence slide. A story may span
more than one slide where needed; it must not become an article squeezed onto
one screen. No report transcription or separate duplicate trends chapter.

Preserve visible units, reporting periods, population definitions, and caveats.
Activity is not productivity, correlation is not causation, observed agent
signals are incomplete, and forecasts are not actual counts. The report's 61%
multi-model statistic concerns users who explicitly selected models. The
September agent-started PR share is **more than 40%**, not exactly 40%.

## Demo plan and confidence

| Topic | Current decision | Presentation treatment |
| --- | --- | --- |
| Fusion | The user says Fusion is being used for this initial website-creation phase | Use the site's actual creation process as a talking point; do not fabricate transcripts, benchmarks, or results |
| Stacked PRs | Planned live-demo candidate | Prepare an explicit, optional handoff to GitHub/Git using real related website changes |
| CLI attachments | Planned live-demo candidate; user said “probably” about the demo set | Prepare an optional handoff to attach a real screenshot/recording |
| Issue artifacts, PR overview, Projects, Automations | Demo decisions remain open | Cover in slides; do not invent or promise a live demo |
| Octoverse, including developer trends | Evidence-led presentation; opens the talk | Charts, examples, and discussion; no simulated product demos |

The user has not supplied final demo commands, repositories, recordings, or
screenshots. Do not claim those artifacts exist. Keep handoffs easy to enable
or omit, and use only real configured targets. Public slides must not leak
private presenter notes or credentials.

## Existing implementation and required changes

Astro scaffolding, typed content, static routing, Pages configuration, source
links, report charts, and an initial slide engine already exist in the worktree.
The current prototype still has the previous topic set and an unnecessary
all-or-selected runtime form. It is not the final agreed presentation.

### Todos

1. Update `docs/iteration01/plan.md` and `questions-and-answers.md` with the revised
   decisions and verbatim answers, retaining enough history to explain the
   correction. Update product/design records to match the actual chosen format.
2. Curate the content model to the three confirmed chapters and 14 topics.
   Exclude Security and Connectors from active content, route generation,
   navigation, and tests. Keep all seven report stories together in Octoverse.
3. Replace the runtime coverage form with a simple curated topic chooser.
   Make the default entry a report-data slide. Update chapter labels, links,
   ordering, and active states for Octoverse → Platform → Copilot.
4. Refine slide composition and controls around actual presentation use.
   Remove unnecessary article-like sections and repetitive forced slides;
   preserve hash deep links, keyboard controls, and source access.
5. Apply the demo decisions: Fusion creation story, optional stacked-PR and
   attachment handoffs, and no fabricated demos for undecided subjects.
6. Preserve and refine all seven sourced report stories within Octoverse,
   with a meaningful data-first opening and no duplicate trends section.
7. Update README/presenter instructions and verify the resulting static site.

### Main files

- `src/data/topics.ts`, `src/content.config.ts`: chapter scope, content and sources.
- `src/pages/index.astro`, `src/pages/[category]/`: report-data entry, curated choosers, slides.
- `src/components/CategoryNav.astro`, `Chart.astro`, `src/layouts/BaseLayout.astro`.
- `src/scripts/presentation.ts`, `src/lib/slides.ts`, `src/lib/navigation.ts`.
- `src/styles/global.css`, `tests/`, `README.md`, product/design records.
- `docs/iteration01/plan.md`, `docs/iteration01/questions-and-answers.md`.

Use Astro with small browser scripts, not a new client framework or slide
library unless a concrete requirement makes one necessary.

## Hosting and validation

Keep static deployment to `https://sinannar.github.io/ghuniverse26/`, with
subpath-safe links/assets and GitHub Actions Pages deployment. No backend,
account, live feed, or runtime API credentials.

Validate:

- Exact coverage: three chosen chapters and 14 topics; no active Security,
  Connectors, or separate Developer Trends routes.
- The first presentation screen displays report data. The default chapter order
  is Octoverse → Platform → Copilot, with topic jumping still available.
- Slide navigation, boundaries, topic jumps, slide hashes, refresh, browser
  history, source controls, keyboard focus, and fullscreen behavior.
- No unwanted keyboard interception inside interactive controls.
- Desktop/projector viewports display one slide at a time without unintended
  document scrolling; smaller screens remain readable.
- Chart values, units, qualifiers, accessible text, and original source links.
- Astro checks, focused tests, production build, and direct static routes under
  `/ghuniverse26/`.

Repository Pages settings and actual publication are separate from implementing
the deployable site; do not change repository settings or claim deployment
without verifying it.

## Discovery answers to preserve

- Platform: **“All four”**.
- Copilot: **“fusion, project and automations”**.
- Security: **“Skip Security”**.
- Octoverse/report coverage: **“All seven stories”**.
- Demo selection: **“I’ll choose individual demo topics”**.
- Demo detail: **“I am using fusion for this initial phase of the website creation, I will demo stacked PRs, CLI attachments as well probably. not sure about the rest”**.
- Earlier Developer Trends structure and split answers were superseded by:
  **“I think octoverse report might be covering developer trends as is, if so, do not seperate...”**.
- Opening sequence: **“I want to start presenting with report data”**.

Live-demo details beyond the above remain deliberately undecided. They do not
block the curated presentation structure.

## Sources

- https://github.com/events/universe/recap
- https://github.blog/changelog/
- https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/

## Approval boundary

This is a planning-only revision. No repository implementation changes are made
for this revision until approval. Then save the revised plan and Q&A under
`docs/iteration01/` before resuming implementation.

## PR review follow-up within iteration 01

After implementation and PR creation, the user requested applying review
feedback. This continues the same approved iteration and does not change the
chapter scope or the data-first opening.

The review follow-up covers build-job Pages read permissions, visible context
after report charts, fullscreen-preserving topic transitions, source-popover-only
Escape handling, all-slide print visibility, and overflow-safe alignment at
short landscape sizes. Add focused regressions for the browser issues and keep
the public session record aligned with checks actually performed.

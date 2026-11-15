# Built with Fusion, shaped by conversation

I used **Copilot Fusion in the GitHub Copilot app** to create the first version
of this Astro presentation. The website is both the presentation and an example
of working with Copilot: describe the outcome, inspect the result, correct the
direction, and keep the decisions.

## Session context

| Detail | Context |
| --- | --- |
| Session | Universe demo showcase |
| Tool | GitHub Copilot app |
| Creation approach | Copilot Fusion, as selected by the presenter for the initial website-creation phase |
| Starting point | A repository containing a README, before the Astro implementation |
| Deliverable | An Astro static presentation for GitHub Pages |
| Iteration | 01, still active; the corrections and refinements belong to the same iteration |
| Preserved evidence | Discovery questions and answers, the revised implementation plan, and this session record |

This is a curated account of the conversation, not a raw session export.
The record does not claim a particular Fusion effort level, underlying model,
model count, cost, or speed improvement: those details have not been established.

## The first attempt missed the brief

The initial implementation looked too much like a scrolling recap website.
The feedback was direct:

> but you built me github universe recap page from scratch now, I want a presentation site not a rebuild of the same site...

That correction changed the experience to a slide canvas. The recap remained
the information source, not the design to reproduce.

## Planning narrowed the talk

Coverage was chosen chapter by chapter: all four Platform announcements;
Fusion, Projects, and Automations for Copilot; all seven Octoverse stories;
no Security chapter or Connectors.

Developer trends were briefly planned as a separate chapter, then brought back
inside Octoverse at the presenter's request. Another instruction set the opening:

> I want to start presenting with report data

The result starts with the pushes comparison rather than a title screen.

## The creation process became the Fusion example

The presenter described the demo direction during planning:

> I am using fusion for this initial phase of the website creation, I will demo stacked PRs, CLI attachments as well probably. not sure about the rest

Fusion's example is this site's actual initial creation. Stacked PRs and CLI
attachments remain optional live-demo pauses; the other topics do not promise
demonstrations that have not been decided.

## What this demonstrates

The useful story is not a one-shot prompt producing a perfect website.
It is a visible cycle of intent, implementation, review, and correction in the
GitHub Copilot app. The preserved conversation and plan below show how the
presenter kept control of the scope and the result.

## How the website works

Astro builds the presentation into static HTML, CSS, and a small TypeScript
browser script. There is no backend, runtime announcement feed, or slide-library
dependency.

| Part | Implementation |
| --- | --- |
| Presentation content | Typed topic definitions in `src/data/topics.ts`, validated by an Astro content collection |
| Slides | A shared `Presentation.astro` component, with topic-specific slide composition |
| Navigation | Keyboard and button controls, topic jumps, URL hashes, and Astro client-side routing that retains fullscreen between topics |
| Charts | Accessible HTML/CSS bars with visible data, units, reporting periods, and source notes |
| This creation story | Markdown from `docs/iteration01/`, rendered by Astro rather than copied into the page |
| Hosting | A static build deployed by GitHub Actions to GitHub Pages; deployment metadata supplies the URL base |

The implementation was refined after review, including the switch from recap
layout to slides, the report-data opening, and fitting dense charts to projector
viewports. Automated checks cover content, slide destinations, generated links,
keyboard navigation, optional demos, and desktop/mobile layout.

## Keeping the next conversation grounded

The repository's `AGENTS.md`, Copilot instructions, and GitHub Copilot app
configuration direct agents to the iteration guide in `docs/README.md`.
That guide identifies the active iteration and the plan, Q&A, and session record
to read and update. This work remains **iteration 01** until the presenter
explicitly starts another iteration.

The app configuration includes manual Setup and Run commands. Repository
configuration changes need to be reviewed and accepted in the GitHub Copilot app
before the app applies them.

## Implementation checks

The initial implementation passed Astro's type/content checks, six unit/content tests, three
generated-output tests, and six Chromium presentation tests. The production
and browser suites also passed with a supplied `/pages-test` deployment base,
as well as at `/`. The tests cover the creation-story link, the preserved
conversation, returning to the Fusion slide, and responsive presentation layout.

The Copilot app and deployment workflow files were parsed as YAML, and the shared
instruction references were checked locally. Actual GitHub Pages publication
and acceptance of the app configuration remain separate user actions; this
record does not claim either has happened.

## Review feedback and corrections

The pull-request review identified six distinct issues. Browser regressions
reproduced the five presentation issues before the fixes; the missing Pages
permission was confirmed by inspecting the workflow.

| Finding | Correction |
| --- | --- |
| Pages configuration could not be read by the build job | Grant `pages: read` alongside `contents: read` on that job |
| Chart topics omitted their summaries | Follow the charts with a visible context slide, keeping the data-first opening |
| Topic changes ended native fullscreen | Use Astro's built-in client router and reinitialize controls without accumulating event listeners |
| Escape closed an unrelated creation-story disclosure | Limit that handler to the actual source popover |
| Printing showed only the active slide | Override hidden slide visibility inside the reset cascade layer for print |
| Short landscape screens clipped the start of oversized content | Use overflow-safe centering at all widths |

After the fixes, Astro check, seven unit/content tests, three production-output
tests, and eleven Chromium tests passed. The added cases cover visible report
context, real fullscreen across forward/backward/history topic changes,
independent disclosures, print visibility, and landscape scroll reachability.
The deployment permission change was checked locally; an actual Pages deployment
is still not claimed.

## Pages build follow-up

The Pages build job failed in the browser test for interactive controls: Chromium
used the focused slide selector's right-arrow key to select the next option,
contrary to the test's assumption that the first slide would remain visible.
The existing presentation handler already leaves selector keys to the browser.
The regression now checks that the key is not prevented and that the native
selection displays the corresponding slide, before checking the end of the talk.
The original failure was reproduced locally with the Pages base path, and the
corrected focused browser test passed.
Astro check, seven unit tests, the Pages-base build, three production-output
tests, and all eleven Chromium tests also passed locally after the correction.

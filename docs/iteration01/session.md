# How this was built

From the first Copilot app worktree to review, merge, and a repaired Pages build:
this presentation was built through several connected sessions, not one prompt.
This is still **iteration 01**.

The timeline follows the presenter's account, the preserved app records, and
the linked GitHub Actions logs and PR discussions. The CLI and cloud reviews
were parallel review tracks after PR #1 opened and share one process stage,
not sequential timestamps. Expand any step to read its explanation without
leaving this page. Source links are optional.

<ol class="creation-timeline" aria-label="Creation timeline">
<li data-session-type="change">

## Copilot app · create the presentation and PR #1

The presenter used **Copilot Fusion in the GitHub Copilot app** to initialize
the repository content in a worktree and open the first pull request. Conversation
turned the initial recap-like implementation into a data-first slide presentation.

<details>
<summary>Read the original app session story</summary>

### Session context

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

### The first attempt missed the brief

The initial implementation looked too much like a scrolling recap website.
The feedback was direct:

> but you built me github universe recap page from scratch now, I want a presentation site not a rebuild of the same site...

That correction changed the experience to a slide canvas. The recap remained
the information source, not the design to reproduce.

### Planning narrowed the talk

Coverage was chosen chapter by chapter: all four Platform announcements;
Fusion, Projects, and Automations for Copilot; all seven Octoverse stories;
no Security chapter or Connectors.

Developer trends were briefly planned as a separate chapter, then brought back
inside Octoverse at the presenter's request. Another instruction set the opening:

> I want to start presenting with report data

The result starts with the pushes comparison rather than a title screen.

### The creation process became the Fusion example

The presenter described the demo direction during planning:

> I am using fusion for this initial phase of the website creation, I will demo stacked PRs, CLI attachments as well probably. not sure about the rest

Fusion's example is this site's actual initial creation. Stacked PRs and CLI
attachments remain optional live-demo pauses; the other topics do not promise
demonstrations that have not been decided.

### What this demonstrates

The useful story is not a one-shot prompt producing a perfect website.
It is a visible cycle of intent, implementation, review, and correction in the
GitHub Copilot app. The preserved conversation and plan below show how the
presenter kept control of the scope and the result.

### How the website works

Astro builds the presentation into static HTML, CSS, and a small TypeScript
browser script. There is no backend, runtime announcement feed, or slide-library
dependency.

| Part | Implementation |
| --- | --- |
| Presentation content | Typed topic definitions in `src/data/topics.ts`, validated by an Astro content collection |
| Slides | A shared `Presentation.astro` component, with topic-specific slide composition |
| Navigation | Keyboard and button controls, topic jumps, URL hashes, and Astro client-side routing that retains fullscreen between topics |
| Charts | Accessible HTML/CSS bars with visible data, units, reporting periods, and source notes |
| This creation story | Markdown from `docs/iteration01/` and `docs/iteration01-review/`, rendered on one page by Astro |
| Hosting | A static build deployed by GitHub Actions to GitHub Pages; deployment metadata supplies the URL base |

The implementation was refined after review, including the switch from recap
layout to slides, the report-data opening, and fitting dense charts to projector
viewports. Automated checks cover content, slide destinations, generated links,
keyboard navigation, optional demos, and desktop/mobile layout.

### Keeping the next conversation grounded

The repository's `AGENTS.md`, Copilot instructions, and GitHub Copilot app
configuration direct agents to the iteration guide in `docs/README.md`.
That guide identifies the active iteration and the plan, Q&A, and session record
to read and update. This work remains **iteration 01** until the presenter
explicitly starts another iteration.

The app configuration includes manual Setup and Run commands. Repository
configuration changes need to be reviewed and accepted in the GitHub Copilot app
before the app applies them.

### Implementation checks

The initial implementation passed Astro's type/content checks, six unit/content tests, three
generated-output tests, and six Chromium presentation tests. The production
and browser suites also passed with a supplied `/pages-test` deployment base,
as well as at `/`. The tests cover the creation-story link, the preserved
conversation, returning to the Fusion slide, and responsive presentation layout.

The Copilot app and deployment workflow files were parsed as YAML, and the shared
instruction references were checked locally. Actual GitHub Pages publication
and acceptance of the app configuration remained separate user actions at that
point. The later deployment outcome appears below; acceptance of the app
configuration is not established.

</details>
</li>
<li data-session-type="review">

## Parallel reviews · PR #1

These reviews happened around the same time. They share step 02 rather than
implying that one followed the other; an exact CLI timestamp is not established.

<ul class="creation-reviews" aria-label="Parallel reviews">
<li data-session-type="review">

### Copilot CLI · review PR #1 on the side

When the first PR opened, the presenter started a separate **Copilot CLI**
session to review it using **GitHub CLI (`gh`)**. This was a side review,
not part of the app's original creation session and not the cloud code review.

The public-safe CLI session record is included in the expandable records below.
The supplied attachment currently returns HTTP 404, so the record preserves
the issue's account rather than claiming to reproduce an unread transcript.

</li>
<li data-session-type="review">

### Cloud code review · a second review track

On **15 November 2026, 03:31–03:36 UTC**, Copilot Code Review ran against
the first PR. The presenter describes its setting as **“mid”**; this is a
presenter-supplied detail, not an inferred Fusion setting or model identity.

<details>
<summary>What the cloud review found</summary>

The [cloud review job](https://github.com/sinannar/ghuniverse26/actions/runs/43672715559/job/132686090551)
records review comments covering Pages permissions, missing report context,
fullscreen transitions, Escape handling, print visibility, and short-screen
overflow. The [PR #1 discussions](https://github.com/sinannar/ghuniverse26/pull/1/files)
also contain two earlier comments overlapping the permissions and fullscreen
findings. These are six distinct issues, not eight independent bugs.

The job completing successfully means the review ran, not that the PR had no
findings or that the presentation had deployed successfully.

</details>
</li>
</ul>
</li>
<li data-session-type="change">

## Copilot app · apply corrections, then Agent Merge

The existing Copilot app session was reused to fix the review findings.
The presenter reports using **Agent Merge** to merge PR #1. The merge was
followed by a separate Pages workflow, not an automatic guarantee of deployment.

<details>
<summary>Review corrections and their validation</summary>

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
The deployment permission change was checked locally. At this stage, that did
not establish a successful Pages deployment.

</details>
</li>
<li data-session-type="failure">

## Pages · the post-merge build failed

PR #1 merged on **15 November 2026**. The Pages workflow then failed in a
Chromium keyboard test: pressing Right Arrow in a focused native slide selector
changed the selection, while the test incorrectly expected the first slide
to remain visible.

<details>
<summary>Why a merged PR still needed a follow-up</summary>

The [failed Pages build](https://github.com/sinannar/ghuniverse26/actions/runs/43762250561/job/132960129681)
shows the type, unit, build, and generated-output checks completing before the
browser suite reported **10 passing tests and one failure**. A retry also failed.
The failing assertion expected `#idea` to remain visible after the selector's
native keyboard behavior moved to another slide. This was a test assumption,
not a need to intercept the browser's selector keys.

</details>
</li>
<li data-session-type="change">

## Cloud agent · fix the test and deploy

A separate **Copilot cloud agent** session handled the Actions failure in PR #2.
That PR merged at **21:24 UTC** on 15 November; the subsequent Pages deployment
completed successfully at **21:26 UTC**.

<details>
<summary>The repair and the verified outcome</summary>

The [cloud repair job](https://github.com/sinannar/ghuniverse26/actions/runs/43762614333/job/132960560040)
links back to the failed build and records the agent run. Its runner logs alone
are not a full conversation transcript. [PR #2](https://github.com/sinannar/ghuniverse26/pull/2)
identifies the resulting change: fix the selector keyboard regression and update
this iteration record, without changing production slide handling.

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

The [subsequent Pages run](https://github.com/sinannar/ghuniverse26/actions/runs/43763557916)
is recorded as successful. This supersedes the earlier session's “deployment
not yet verified” status; it does not claim a particular model, cost, or speedup.

</details>
</li>
</ol>

## Timeline update validation

For this making-of update, Astro check reported no diagnostics, all seven
unit/content tests passed, and the static build completed. All four
generated-output tests and thirteen Chromium tests passed at both `/` and a
supplied `/pages-test` base. Coverage includes timeline order, evidence links,
keyboard-operated disclosures, responsive width, JavaScript-free access, and
the existing presentation behavior. Manual browser inspection also checked the
timeline and its expandable cloud-review explanation.

Secret scanning found no secrets in the changed files. CodeQL classified the
static content/UI and test changes as trivial and skipped analysis; this is not
a claim that a CodeQL code scan ran. The CLI attachment remained unavailable
(HTTP 404), so the side-review record is an explicitly labeled issue summary.

## Shared review stage and semantic colors — issue #5

The presenter clarified that the CLI and cloud reviews happened around the same
time. They now share numbered step 02, with separate track headings and evidence;
this supersedes their previous sequential numbers without inventing a CLI
timestamp or changing the recorded cloud time.

Session headings and stage numbers now use green for code changes, orange for
reviews, and red for the Pages build failure. Unknown or missing session types
fall back to blue for later review. The main rule stays neutral, and descriptive
labels remain visible independently of color. Shared agent, Copilot, and design
instructions preserve these conventions for subsequent sessions.

Focused validation passed: Astro check with no diagnostics, seven unit/content
tests, four generated-output tests, and both timeline Chromium tests. The
browser regressions check the shared review stage, all six session colors,
unknown and missing type fallbacks, desktop/mobile disclosures, and access
without JavaScript. The static build and generated-link checks also passed.

Final validation at `/` also passed all thirteen Chromium tests. Manual browser
inspection confirmed the shared review stage, semantic heading colors, and
inline cloud-review disclosure, with no horizontal overflow at 390px. A
read-only code review found no significant issues, and secret scanning detected
no secrets. CodeQL classified the static content/UI and test changes as trivial
and skipped analysis; no CodeQL code scan is claimed.

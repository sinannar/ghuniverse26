# Iteration 02: building Agentic Workflows

This public-safe record summarizes the Copilot CLI session that added the
repository's issue-labeling and pull-request review workflows. It is a curated
account, not a raw session export.

The presenter describes installing the **gh-stack** and **gh-aw** skills,
then using Copilot CLI to plan and create two GitHub Agentic Workflows and
open [PR #7](https://github.com/sinannar/ghuniverse26/pull/7). A separate
CLI review and a cloud review provided review tracks; a cloud agent addressed
or commented on the feedback. They share a review stage rather than implying
an exact sequence of sessions.

<ol class="creation-timeline" aria-label="Iteration 02 timeline">
<li data-session-type="change">

## Skills · prepare the tools

The presenter installed the **gh-stack** and **gh-aw** skills. The
agentic-workflows skill was later moved to `.agents/skills` alongside gh-stack.

</li>
<li data-session-type="change">

## Copilot CLI · plan workflows and open PR #7

Copilot CLI planned and created an issue labeler and a pull-request reviewer
using **GitHub Agentic Workflows** and GitHub Actions. Their agent jobs use
read-only access and constrained safe outputs for GitHub writes.

</li>
<li data-session-type="review">

## Parallel reviews · PR #7

The local CLI and cloud reviews are separate tracks in one review stage.
The cloud review covered an earlier revision than the later CLI review; their
records do not establish an exact CLI time.

<ul class="creation-reviews" aria-label="Iteration 02 parallel reviews">
<li data-session-type="review">

### Copilot CLI · local review

The CLI review inspected the PR with GitHub CLI and reported a
[reviewer bootstrap failure](https://github.com/sinannar/ghuniverse26/pull/7#discussion_r4580921412).
It did not modify workflow code.

</li>
<li data-session-type="review">

### Cloud Code Review · issue labeler review

The [cloud review](https://github.com/sinannar/ghuniverse26/pull/7#pullrequestreview-5913526033)
identified reporter admission and label-removal limits in an earlier revision.
The successful [Actions review run](https://github.com/sinannar/ghuniverse26/actions/runs/43775484590)
means the review ran, not that it found no issues.

</li>
</ul>
</li>
<li data-session-type="change">

## Cloud agent · address review feedback

The cloud agent was used to fix or comment on PR feedback. The recorded fixes
include reporter admission, the managed-label removal limit, and the reviewer
bootstrap exception for PR #7. Strict compilation checks configuration; the
records do not establish a successful live workflow run.

</li>
</ol>

<details>
<summary>Read the iteration 02 session record</summary>

## Issue classification

The session designed a workflow to classify an issue from its title and
description on opening and later edits. Existing labels outside the managed set
must survive each recomputation. The repository did not have a `maintenance`
label, so the session created it with the description:

> Repository upkeep, tooling, CI, dependencies, or refactoring

The workflow manages `bug`, `enhancement`, `documentation`, `accessibility`,
`question`, and `maintenance`. It can apply multiple labels where evidence
supports each classification.

### Reporter admission review

The PR review found that the default role gate excluded reporters without
write access. The workflow now explicitly allows all reporter roles while
retaining its constrained safe outputs. Strict compilation with gh-aw v1.2.2
passed; this does not establish a successful live run.

The review also found that the removal limit could truncate a request to
remove multiple managed labels. The limit is now six, matching the managed
set; the allowed labels and triggering-issue restriction remain unchanged.

## Pull-request assessment

The session then added a separate workflow that runs when a same-repository
pull request opens or receives new commits. It reads the pull request's title,
description, changed files, and diff. Its one current comment covers concrete
findings plus description readiness: a compact summary, before-and-after
evidence, and merge danger.

The assessment standards were adapted from the user-requested grilling and
pull-request skills. Those installed skills are not added as runtime
dependencies; their applicable standards are written directly into the
workflow prompt.

### Reviewer bootstrap

The reviewer's activation failed on its introducing pull request because the
trusted base revision did not yet contain the workflow prompt. The reviewer
now skips PR #7 itself; later pull requests continue to load the prompt from
their base revision. This exception does not use PR content as a prompt.

For these review fixes, both strict compilations, the workflow configuration
regressions, Astro check, and unit tests passed. Diagnostic dry-run compilation
passed shellcheck but could not complete its model-inventory check in this
environment. No live workflow test was performed.

## Repository skill relocation (issue #10)

User request summary: keep repository skills under `.agents/skills`, alongside
`gh-stack`, rather than the CLI-created `.github/skills` location.
The agentic-workflows `SKILL.md` moved to
`.agents/skills/agentic-workflows/SKILL.md` with byte-for-byte identical contents.
No references to the old skill path needed updating; generated workflow runtime
skill-directory defaults remain unchanged.

The focused regression test verifies the new location, the absence of the old
file, and the skill's discovery front matter. It passed, as did Astro check
(no diagnostics) and all 10 unit tests. The diff whitespace check passed.
No site build, production-output tests, browser tests, or live workflow runs
were performed for this relocation; these iteration records are not imported
by the site. Dependency installation reported five audit vulnerabilities;
no dependencies were changed.

## Trigger refinement: automatic readiness and explicit commands

The user approved retaining automatic issue classification on opening and
edits, adding `/label` in issue comments, and replacing PR review on every
new commit with review on non-draft opening or draft-to-ready transition.
PR comments containing `/review` request an assessment of the current PR.
This supersedes the original PR trigger described above; later commits do
not automatically refresh the assessment.

Command triggers are scoped to their respective issue or PR comments.
Issue classification still uses only the current title and description, not
comment content. PR #7 remains excluded for both automatic and command events;
automatic draft openings are excluded before activation. Command-triggered
review explicitly checks the current PR's head repository and does not assess
forks. Existing role admission, constrained safe outputs, and hiding of older
assessment comments remain in place. Command status comments are disabled so
the issue labeler does not start posting comments and the reviewer does not
add extra status commentary.

The compiler requires centralized slash-command routing to combine commands
with these automatic events. The generated `agentic_commands.yml` dispatcher
routes `/label` only from issue comments and `/review` only from PR comments;
commands must be the first word. Its lightweight routing job may run on other
comments without starting an AI assessment. It also provides the compiler's
built-in `/help` command. Dispatch context supplies the target item number,
including for the PR #7 exclusion.

Validation for this refinement: the initial inline-command compilation failed
because inline commands conflict with the automatic issue and PR events.
After selecting centralized routing, strict compilation passed for both
workflows and generated the shared dispatcher. Astro check reported no
diagnostics, all 12 unit tests passed, and the diff whitespace check passed.
The regressions cover readiness triggers, comment routing, command target
context, draft exclusion, the PR #7 exception, and existing label bounds.
No live command or automatic workflow run was performed. Site build,
production-output tests, and browser tests were not run; these iteration 02
records are not imported by the site, and no routes, site content, or UI changed.

## Outcomes and validation

Both workflows keep their main agent jobs read-only and route their only GitHub
writes through constrained safe outputs. Strict Agentic Workflows compilation
passed for both workflows. Astro check, unit tests, static build,
production-output tests, and all browser tests passed in this session.

The pull request for the work is [#7](https://github.com/sinannar/ghuniverse26/pull/7).
It is open at the time of this record. No claim is made that either workflow
has completed a production run.

## Making-of page enhancement (issue #9)

The presenter requested that the page include iteration 02's skills,
workflow creation, separate CLI and cloud reviews, and cloud-agent response.
The page now renders this timeline and the iteration 02 plan, discovery, and
review records alongside iteration 01. This supersedes the earlier notes that
the iteration 02 records were not imported by the site.

Astro check reported no diagnostics; all 12 unit tests, four generated-output
tests, and 14 browser tests passed. The static build and generated-link checks
passed. A focused browser test and manual inspection also checked the new
timeline and cloud-review disclosure. Dependency installation reported five
audit vulnerabilities; no dependencies were changed.

## Universe sessions chapter outcome

The session catalog renders in the browser, so a plain page fetch returned
nothing. Loading it in a browser exposed all 55 recorded sessions with
abstracts and speakers. The presenter chose five sessions, which now form a
fourth **Sessions** chapter after Copilot. The talk ends on the
"What's worth building?" conversation.

The first version summarized only the public abstracts. The presenter then
signed in to the Universe portal personally; no credentials passed through the
agent. The signed-in session pages offered each speaker's slide PDF and an
AI-generated session summary. Both were downloaded outside the repository, and
the five topics were rewritten from them. For example, Stacked PRs are now
generally available, the code review talk describes 13 `applyTo`-scoped
instruction files, and the model talk centers on "agent = model + harness".
An abstract claim about lower review time was removed because the slides do
not support it.

The generated-output test now normalizes Windows path separators so it also
runs locally on Windows. The end-of-talk browser test moved to the new final
topic, and a new browser test covers the Sessions byline and related link.

Validation on the branch rebased onto the latest main: Astro check reported no
diagnostics. The static build passed, along with four generated-output tests and
all fifteen Chromium tests, including the projector-fit check for session slides.
Ten of thirteen unit tests passed. The three failures are existing skill and
workflow tests that expect LF line endings, and this Windows checkout has CRLF.
These failures are unrelated to the Sessions change and were not fixed here.

The presenter then asked for LF line endings so CI would pass. `.gitattributes`
now sets `* text=auto eol=lf`, and the working files were refreshed. The
committed content was already LF; the CRLF came from a global `core.autocrlf`
setting at checkout. Afterwards, all thirteen unit tests passed, along with
Astro check, the build, four generated-output tests, and fifteen Chromium tests.

The presenter has a 25-minute slot and agreed to add visuals to the Sessions
chapter. Stacked PRs in practice now opens with two charts from the speaker's
slides. The first shows the illustrative review time of one large PR versus
focused PRs; the second shows the reported +9% merged code and 5% faster merge.
Charts accept a source, so these credit the session slides instead of Octoverse.
The model talk's idea slide shows its four-step change evaluation loop. Its
headline was shortened to fit projector screens. Astro check, thirteen unit
tests, four generated-output tests, and fifteen Chromium tests passed.

## Universe badge outcome (issue #14)

The presentation now includes a Platform topic about the Universe 2026 badge
as a programmable small computer. It describes the built-in apps and how the
Badger Field Guide's browser simulator supports trying code, with links to the
guide, simulator, and badge repository. This adds one topic beyond the
previously scoped four Platform recap announcements; the four chapters remain
unchanged.

This original outcome was superseded by the Badge chapter refinement below.

Astro check reported no diagnostics. All 14 unit tests, the static build, all
four generated-output tests, and all 16 Chromium tests passed. The generated-link
check also verified the topic and exposed records after distinct headings were
used for the plan and outcome.

## Universe badge chapter refinement

The presenter requested a separate Badge tab, a more detailed flow, and event
photos. The badge now has its own chapter with four topics covering the
hardware, interactive controls, shipped apps, and a build path. Platform again
contains only its four recap announcements. The simulator link follows the
current badge repository guide, and the content notes that the browser
simulator does not model every custom 2026 hardware feature.

No badge-specific event photos were found in the repository or the public
sources checked. The presenter was asked for approved image files or source
links. The presenter later directed the work to use available GitHub visuals;
the included reference-device image is distinct from an event photograph.

Validation for the earlier Badge chapter update:

Astro check reported no errors, warnings, or hints. All 14 unit tests, the
static build, all four production-output tests, and all 17 Chromium tests
passed. The production checks verified generated topic routes and links; the
browser test also checked for horizontal overflow at 320px.

## Badge visuals from GitHub

The presenter then asked to use public GitHub visuals. The opening badge slide
now includes the Tufty 2350 reference-device image from `badger/home`, captioned
to distinguish the base platform from the final Universe 2026 enclosure. The
asset is pinned to its upstream commit and the upstream MIT license is included
beside the image.

Astro check reported no errors, warnings, or hints. All 14 unit tests, the
static build, all four production-output tests, and all 18 Chromium tests
passed. The new browser regression confirmed the image loads, its attribution
and caption are visible, and the slide has no horizontal overflow at 320px.

## Badge specification and simulator implementation

The presenter supplied two image links, badge specifications, and a request to
make the Badge chapter more vivid. A fifth topic, “Inside the badge,” now
summarizes the published computer, display/input, connectivity, power, and
expansion specifications. The runtime wording retains “up to” and notes that
actual battery life depends on use.

The simulator explanation now reflects the Badger Field Guide: MonaOS 4.0 and
stock apps run in the browser, HTTP requests may depend on CORS, and socket-based
Camera and Copilot apps require a physical badge. The Guide/about page was
unavailable for direct retrieval in this environment, so its indexed page
content was checked alongside the `badger/home` hardware reference and README.

Both supplied GitHub user-attachment URLs returned HTTP 404 when fetched from
the implementation environment. No broken remote image was added; the
previously licensed Tufty 2350 reference photo remains, captioned as the base
platform rather than the finished Universe badge. The presenter was asked to
provide image files or accessible links before those badge-specific images can
be incorporated.

Validation for this follow-up:

- `npm run check`: no errors, warnings, or hints.
- `npm test`: all 14 tests passed.
- `npm run build`: succeeded; generated the new badge hardware route.
- `npm run test:production`: all 4 tests passed.
- `npm run test:browser`: all 18 tests passed, including the badge flow and
  projector/mobile layout checks.

## Supplied badge image retry

The presenter supplied a new badge-photo attachment after the previous links
were unavailable. This URL also returned HTTP 404 from the implementation
environment, including through GitHub's `raw` and `download` URL variants.
The existing Tufty 2350 reference photo therefore remains; the new badge photo
is not embedded. An accessible file or working URL is needed to continue.

## Supplied interactive keynote integration

The presenter supplied a completed interactive keynote and asked for it to be
the GitHub Pages site after review and merge. The React application now mounts
at the Astro home route; the original presentation, Badge and Sessions
chapters, and making-of page remain available. The supplied demonstrations
are labeled as simulations rather than live GitHub services.

The first development-server check exposed a missing React refresh preamble
in the Astro page shell. The keynote entry now initializes that preamble, and
a browser smoke test exercises development mode as well as the production
preview.

The existing Pages workflow now verifies pull requests without uploading or
deploying a Pages artifact. Pushes to `main` and manual workflow runs retain
the deployment path. The dependency lockfile was regenerated for the combined
applications; the local package mirror lacked the previous Rollup patch, so
the resolved version changed. Lockfile package URLs use the public npm registry.

Validation with Node 22:

- `npm ci` succeeded.
- `npm run check` reported no errors or warnings and three deprecation hints.
- `npm test` passed all 16 unit tests.
- Root-path and `/ghuniverse26/` production builds passed, and each passed all
  four generated-output and link checks.
- The root-path keynote browser scenarios passed; all 24 Chromium tests passed
  at the `/ghuniverse26/` Pages path. These covered keynote navigation, demo
  scenes, Explore, presenter sync, mobile behavior, the no-JavaScript fallback,
  and the preserved presentation.
- `npm run test:dev` passed at both the root and `/ghuniverse26/` paths.

The supplied announcement claims were not independently rechecked in this
integration. No production deployment was run from this branch; deployment
remains dependent on the pull request being merged and the Pages workflow
completing successfully.

</details>

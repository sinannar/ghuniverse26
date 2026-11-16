# Iteration 02: repository Agentic Workflows

## Scope

Add GitHub Agentic Workflows that reduce repository triage effort without
granting the agent direct GitHub write permissions. This iteration began when
the presenter explicitly moved the workflow work out of iteration 01.

## Delivered workflows

### Issue labeler

- Trigger on issue opening and title or body edits, plus `/label` in issue
  comments to request recomputation.
- Recompute the managed labels: `bug`, `enhancement`, `documentation`,
  `accessibility`, `question`, and `maintenance`.
- Remove and add only those managed labels. Preserve maintainer workflow and
  status labels.
- Permit multiple clearly evidenced categories for an issue.
- Use read-only GitHub access and constrained `remove-labels` and `add-labels`
  safe outputs.

### Pull-request reviewer

- Trigger on same-repository non-draft pull request openings and transitions
  from draft to ready, plus `/review` in PR comments for explicit re-review.
  This supersedes the original opening-and-new-commits trigger.
- Read the title, description, changed files, and diff.
- Post one current safe-output comment, replacing the prior workflow comment.
- Assess concrete diff risks and whether the pull-request description explains
  the complete branch with a concise summary, before-and-after evidence, and
  merge danger.
- Embed those assessment standards in the workflow prompt because the source
  Copilot skills used to shape them are not repository runtime dependencies.

## Boundaries

- Fork pull requests remain outside the default trigger scope.
- Neither workflow executes or changes pull-request code.
- The pull-request reviewer does not approve, request changes, or post inline
  comments; it leaves one bounded summary comment.
- Compilation verifies configuration only. It does not prove a production run.

## Repository skill location refinement

Issue [#10](https://github.com/sinannar/ghuniverse26/issues/10) requests that
repository skills live under `.agents/skills`, consistent with `gh-stack`.
Move the CLI-created agentic-workflows skill from `.github/skills` to
`.agents/skills/agentic-workflows/SKILL.md` without changing its guidance.
This changes the repository skill location, not the generated workflows'
runtime skill-directory defaults.

## Validation

- `gh aw compile --strict` also regenerates the shared command dispatcher.
- `gh aw compile issue-labeler --strict`
- `gh aw compile pr-reviewer --strict`
- `npm run check`
- `npm test`
- `npm run build`
- `npm run test:production`
- `npm run test:browser`

## Universe sessions chapter

A co-host for the Auckland Universe recap meetup asked to add selected
Universe 2026 sessions to the presentation. This extends iteration 02 beyond
workflows because it is the active iteration. It supersedes iteration 01's
"three chapters and 14 topics" scope: add a fourth **Sessions** chapter after
Copilot, giving four chapters and 19 topics. Security and Connectors stay
excluded, and the data-first opening does not change.

| Session topic | Speakers | Related existing slide |
| --- | --- | --- |
| Stacked PRs in practice | Sameen Karim | Platform: stacked pull requests |
| Custom code review instructions | Nish Sinha | Octoverse: agentic workflow shift |
| Optimizing Copilot for every new model | Julia Kasper | Copilot: Fusion |
| The factory mindset | Peli de Halleux, Tim Mason, Paul Snider | Copilot: Automations |
| What's worth building? | Sue Black, Kent C. Dodds | None; closing discussion |

Session idea slides add a byline with format, speakers, and a link to the
related announcement slide. They add no demo pauses. Sessions use teal.

Content comes from the speakers' published slide PDFs and the event's
AI-generated session summaries, which are available on the signed-in session
pages. The recordings were not watched. Each topic's caveat names both sources,
and each topic links to its session page and slide PDF. Where the slides and
abstracts differ, follow the slides.

## Universe badge scope (issue #14)

The requested presentation section explains the Universe 2026 badge as a
programmable small computer and points to the Badger Field Guide, browser
simulator, and source repository. This adds one Platform topic beyond the four
recap announcements, bringing the existing four-chapter presentation to 20
topics; the data-first opening and chapter structure do not change.

**Superseded by PR feedback:** The presenter asked for a separate Badge tab with
its own flow and event pictures. The badge is now a fifth chapter with four
topics: hardware, interactive controls, event apps, and a build path. Platform
returns to its four recap announcements, and the presentation has five chapters
and 23 topics. No badge-specific event photos were found in the repository or
the public sources checked; approved photos or a source link are still needed.

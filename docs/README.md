# Iteration guide

**Active iteration: `iteration02`**. This iteration began with repository
Agentic Workflows for issue classification and pull-request assessment and
continues to record later presentation refinements and the supplied keynote
integration. Iteration 01 remains the original presentation redesign,
coverage decisions, and creation story.

## Records for each iteration

| File | Purpose |
| --- | --- |
| `plan.md` | Agreed scope, approach, and subsequent approved changes |
| `questions-and-answers.md` | Discovery questions, user answers, and corrections |
| `session.md` | Public session context, implementation story, outcomes, and validation |

For ongoing work, read the active records first. Update the existing files
when decisions or implementation outcomes materially change. Keep earlier
decisions visible and mark superseded choices rather than rewriting the history.
Use exact quotations only for supplied user text; label summaries as summaries.
Do not treat unfinished work, proposed demos, or checks not run as completed.

## Public presentation

The [first iteration's session story](iteration01/session.md), [discovery
conversation](iteration01/questions-and-answers.md), and [plan](iteration01/plan.md)
remain rendered by `src/pages/making-of.astro`, alongside the
[CLI side-review record](iteration01-review/session.md). That supporting folder
belongs to iteration 01; it is not a new numbered iteration.
The [iteration 02 session](iteration02/session.md), [plan](iteration02/plan.md),
and [discovery conversation](iteration02/questions-and-answers.md) are rendered
on the same page. Its [local CLI review](iteration02-review/localreview.md) and
[cloud Code Review](iteration02-review/cloudreview.md) records document
separate review tracks for PR #7.
The session story is a timeline with inline explanations and expandable records,
not a set of separate reading pages. Edit the Markdown source rather than
maintaining a separate copy of the story in a page template.

Only publish information relevant to this repository's creation. Exclude secrets,
private filesystem paths, raw session exports, hidden instructions, unrelated
workspaces, and unverified model or cost information. If a conversation contains
sensitive material, preserve a clearly labeled safe summary instead.

The shared agent rules live in [AGENTS.md](../AGENTS.md). Copilot's repository
instructions and the GitHub Copilot app configuration point to that same
workflow rather than defining competing iteration rules.

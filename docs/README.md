# Iteration guide

**Active iteration: `iteration01`**. This is still the first iteration, including
the presentation redesign, coverage decisions, and the site's creation story.
A new chat, app session, correction, or code revision does not start another
iteration. Start `iteration02` only when the user explicitly requests it.

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
are rendered by `src/pages/making-of.astro`. Edit the Markdown source rather than
maintaining a separate copy of the story in a page template.

Only publish information relevant to this repository's creation. Exclude secrets,
private filesystem paths, raw session exports, hidden instructions, unrelated
workspaces, and unverified model or cost information. If a conversation contains
sensitive material, preserve a clearly labeled safe summary instead.

The shared agent rules live in [AGENTS.md](../AGENTS.md). Copilot's repository
instructions and the GitHub Copilot app configuration point to that same
workflow rather than defining competing iteration rules.

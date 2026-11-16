# Iteration 02: repository Agentic Workflows

## Scope

Add GitHub Agentic Workflows that reduce repository triage effort without
granting the agent direct GitHub write permissions. This iteration began when
the presenter explicitly moved the workflow work out of iteration 01.

## Delivered workflows

### Issue labeler

- Trigger on issue opening and title or body edits.
- Recompute the managed labels: `bug`, `enhancement`, `documentation`,
  `accessibility`, `question`, and `maintenance`.
- Remove and add only those managed labels. Preserve maintainer workflow and
  status labels.
- Permit multiple clearly evidenced categories for an issue.
- Use read-only GitHub access and constrained `remove-labels` and `add-labels`
  safe outputs.

### Pull-request reviewer

- Trigger on same-repository pull request openings and new commits.
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

## Validation

- `gh aw compile issue-labeler --strict`
- `gh aw compile pr-reviewer --strict`
- `npm run check`
- `npm test`
- `npm run build`
- `npm run test:production`
- `npm run test:browser`

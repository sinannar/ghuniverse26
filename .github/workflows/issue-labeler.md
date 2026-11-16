---
emoji: 🏷️
name: Issue labeler
description: Reclassify issues from their title and description.
intent: Reduce maintainer effort required to consistently categorize actionable repository issues without adding unsupported, duplicate, or speculative labels.
on:
  issues:
    types: [opened, edited]
  roles: all
permissions:
  contents: read
  issues: read
  copilot-requests: write
strict: true
network:
  allowed: []
tools:
  github:
    mode: gh-proxy
    toolsets: [issues]
safe-outputs:
  remove-labels:
    allowed: [bug, enhancement, documentation, accessibility, question, maintenance]
    max: 6
    target: triggering
  add-labels:
    allowed: [bug, enhancement, documentation, accessibility, question, maintenance]
    issues: true
    pull-requests: false
    max: 1
    max-labels: 6
    target: triggering
---

# Issue labeler

Classify the triggering issue from its title and description only. The managed
labels are `bug`, `enhancement`, `documentation`, `accessibility`, and
`question`, and `maintenance`; never add, remove, create, or infer any other
label.

Determine every managed label clearly supported by the issue:

- `bug`: an observed or reported behavior that is not working as expected.
- `enhancement`: a request for a new or improved capability.
- `documentation`: missing, inaccurate, or requested documentation.
- `accessibility`: a barrier affecting people with disabilities.
- `question`: a request for information, help, or clarification.
- `maintenance`: repository upkeep such as dependency updates, CI or tooling
  work, refactoring, configuration, or operational maintenance.

Multiple labels are allowed when each has clear, independent support. For
example, an accessibility defect may be both `bug` and `accessibility`.
Do not classify from assumptions, comments, attachments, or linked content.

On every run, read the issue's current labels. Remove every currently applied
managed label, then add exactly the newly determined managed labels. Preserve
all labels outside the managed set, including maintainer workflow and status
labels. If a managed label is both currently present and newly determined,
remove it before adding it again. If both operations are needed, make the
`add-labels` safe-output call depend on the successful `remove-labels` call.

Use only the configured safe outputs for label changes. Do not make raw GitHub
write calls and do not post a comment. If the issue title and description are
both unavailable, or no managed labels are present and none can be determined,
call `noop` with a brief reason.

# Iteration 02: Agentic Workflow session

This public-safe record summarizes the Copilot CLI session that added the
repository's issue-labeling and pull-request review workflows. It is a curated
account, not a raw session export.

## Issue classification

The session designed a workflow to classify an issue from its title and
description on opening and later edits. Existing labels outside the managed set
must survive each recomputation. The repository did not have a `maintenance`
label, so the session created it with the description:

> Repository upkeep, tooling, CI, dependencies, or refactoring

The workflow manages `bug`, `enhancement`, `documentation`, `accessibility`,
`question`, and `maintenance`. It can apply multiple labels where evidence
supports each classification.

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

## Outcomes and validation

Both workflows keep their main agent jobs read-only and route their only GitHub
writes through constrained safe outputs. Strict Agentic Workflows compilation
passed for both workflows. Astro check, unit tests, static build,
production-output tests, and all browser tests passed in this session.

The pull request for the work is [#7](https://github.com/sinannar/ghuniverse26/pull/7).
It is open at the time of this record. No claim is made that either workflow
has completed a production run.

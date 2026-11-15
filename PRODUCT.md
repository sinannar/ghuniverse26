# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A presenter explaining GitHub Universe 2026 announcements, and the audience
following the presentation or browsing the site afterward.

## Product Purpose

The website is the presentation itself. A presenter chooses a category and a
topic, explains the announcement, then switches to real tools to demonstrate it.
The presentation opens with Octoverse data, including developer trends.

## Operating Context

The presenter switches between the website, GitHub, Copilot, Git, and Copilot CLI,
including demonstrations of building parts of this same site.

## Capabilities and Constraints

Astro, static GitHub Pages hosting, three curated chapters, individual topic
selection, and returnable slide deep links. No backend or simulated GitHub features.
Exact live-demo repositories and commands are not supplied and must not be invented.

## Brand Commitments

Use chapter color as a wayfinding cue, not a reconstruction of the recap.
The website replaces PowerPoint; the browser is the presentation.

## Evidence on Hand

Official Universe recap, GitHub Changelog, and the Octoverse 2026 report linked
in `docs/iteration01/plan.md`. The discovery answers are preserved alongside it.
No presenter video, demo recording, or private presenter notes were supplied.

## Product Principles

- Let the presenter choose the story rather than enforce a slide sequence.
- Keep announcement explanations concise and report stories substantial.
- Use real sources and retain the boundaries of what their numbers measure.
- Make the site's content and components useful live-coding material.

## Presentation Format

The user explicitly rejected a recap-site rebuild. The recap supplies the
information, not the page structure. Use a single visible slide, presentation
controls, and optional demo pauses instead of scrolling announcement articles.
Coverage was decided in planning, not through an audience-facing questionnaire:
Octoverse (seven stories, including developer trends) first, Platform (all four
recap topics), and Copilot (Fusion, Projects, Automations). No Security or
Connectors. Fusion's initial creation of this site is narrative context; stacked
PRs and CLI attachments are optional demo candidates, not promised demonstrations.

## Creation Story and Iterations

"How this was built" is a public companion to the slides, accessible from the
footer and Fusion's creation story. It explains the initial work with Copilot
Fusion in the GitHub Copilot app, the review and corrections, and the Astro
implementation. A single-page timeline distinguishes the app, side CLI review,
cloud review, app corrections and Agent Merge, failed Pages build, and cloud
repair. Expandable explanations render the preserved plan, discovery Q&A, and
session record from `docs/iteration01/`, plus the supporting
`docs/iteration01-review/session.md`. It is a curated account, not a raw session
export; unavailable evidence is labeled rather than reconstructed.

The active iteration is identified in `docs/README.md`; this work remains
iteration 01 until the user explicitly starts a new one. Repository agent and
Copilot setup point to that shared workflow.

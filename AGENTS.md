# Repository instructions

Build a presentation, not a reconstruction of the Universe recap. Read
`PRODUCT.md` for the agreed scope and `DESIGN.md` before changing the interface.

## Iteration records

Read `docs/README.md` to identify the active iteration, then read its plan,
questions and answers, and session record before substantial work.
Keep ongoing refinements in that iteration; create the next numbered iteration
only when the user explicitly starts one.

During implementation, update the active iteration's records with material user
decisions, scope corrections, implementation outcomes, and validation actually
performed. Preserve earlier decisions as history and label what supersedes them.
Distinguish verbatim user quotations from summaries; do not invent transcripts,
Fusion settings, model identities, or performance claims.

These records are public: the site's "How this was built" page renders the
iteration documents. Keep credentials, private paths, raw session exports, and
unrelated personal or workspace information out of them.

## Implementation and verification

Use the existing Astro components and typed content. Internal URLs go through
`src/lib/navigation.ts`; local development uses `/`, while the Pages workflow
provides deployment-specific origin and base values.

Use `npm ci` to set up missing dependencies. For code changes, run
`npm run check` and `npm test`; for routes, content, or UI changes also run
`npm run build`, `npm run test:production`, and `npm run test:browser`.
The browser suite requires `npx playwright install chromium` once and uses
port 4322. Report any unavailable checks rather than claiming they passed.

For documentation-only changes, check the affected references. If the documents
are imported by Astro, also build and check generated links. Keep report units,
reporting periods, population definitions, and caveats intact.

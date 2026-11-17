# Iteration 02: workflow trigger refinement

## Reducing repeated PR assessments

User quotation:

> for the issues, I am OK with it, but I feel PR one is getting triggerred a lot. what would be better trigger scenario for these workflows, what should we change them to

Decision summary: retain automatic issue labeling on opening and edits. Replace
PR review on every new commit with automatic review when a PR opens non-draft
or transitions from draft to ready, plus explicit `/review` requests in PR
comments. Subsequent commits do not automatically refresh an assessment.

## Explicit issue reclassification

User quotation:

> I think `/review` is really good idea, can we do this for issue labeler as `/label` or `/re-label` as well

Confirmed selection summary: keep issue `opened` and `edited` triggers and
add `/label` in issue comments. Use `/label` for both initial classification
and reclassification; `/re-label` is not a configured alias.

Confirmed PR selection summary: automatic review when opened non-draft or
marked ready, plus `/review`.

## Universe sessions chapter request

**Request (summary):** A co-host for the Auckland, New Zealand, Universe recap
meetup wanted to talk about a few Universe 2026 sessions and asked for proposed
additions to the existing deck. A clarifying question about session choice and
placement received no answer, so the first response was a proposal only.

After the full catalog was retrieved, the presenter chose these sessions
(verbatim):

> How we optimize GitHub Copilot for every new model
>
> Stop waiting on your own pull requests: Stacked PRs in practice
>
> The factory mindset: Agentic workflows in production
>
> Supercharge Copilot code review with custom review instructions
>
> And **What's worth building when AI can build anything**

**Implementation decision:** Add the five sessions as a separate fourth
Sessions chapter, as proposed, linking each to a related existing slide where
one exists. The presenter did not separately confirm the chapter placement.

**Follow-up request (verbatim):**

> open the page and I will sign in for you

**Result:** The presenter signed in personally in the automation browser. The
signed-in pages exposed the speakers' slide PDFs and AI-generated session
summaries, which replaced the abstracts as the content source.

## Universe badge chapter request

User request (verbatim):

> I think badge should be a seperate tab like copilot, platform, octaverse... It should have its own flow and pictures from event. more detailed presentation, instead of being part of platform

Decision summary: move the badge from Platform into its own Badge chapter and
expand it into a four-topic journey through hardware, event apps, and building
for the badge. No badge-specific event photos were available in the repository
or the public sources checked; approved photo files or source links were
requested before adding imagery.

**Follow-up request (verbatim):**

> @copilot for the badge itself, grab some visuals from github.com etc. this is presentation, some visuals would be good

Decision summary: use a verified visual from the badge's public GitHub
repository. The available physical-device image depicts the Tufty 2350
reference platform, so the slide identifies it as the Universe badge's base
platform rather than implying it shows the final event enclosure. Preserve
the upstream MIT license with the copied asset.

## Badge images, specifications, and simulator follow-up

User request (verbatim):

> @copilot use these images

The presenter supplied one badge image and one 3D specification illustration,
provided a detailed specification list, and asked for a more vivid badge
presentation. The two GitHub user-attachment URLs both returned HTTP 404 from
the implementation environment, so their image files could not be copied or
verified. The existing licensed Tufty 2350 reference photo remains in place;
the supplied badge-specific images should replace or supplement it once
accessible image files or URLs are available.

Implementation summary: add a fifth Badge topic for the hardware profile and
include its published processor, memory/storage, display/input, connectivity,
battery/runtime, and expansion details. Update the simulator explanation using
the Field Guide's current information: MonaOS 4.0 and stock apps run in the
browser, HTTP requests may depend on CORS, and socket-based Camera and Copilot
apps require a physical badge.

**Latest image request (verbatim):**

> @copilot you didnt use the picture :) use the picture below for the badge ,that is best presentation of badge

The new attachment URL returned HTTP 404 when fetched from the implementation
environment, including with GitHub's `raw` and `download` URL variants. The
image cannot be included until it is accessible as an uploaded file or working
URL.

## Supplied keynote deployment request

**Request (summary):** Unpack the supplied completed web app, make it ready,
test it locally, and open a pull request so that the supplied app becomes the
GitHub Pages site when the owner merges it.

**Implementation decision:** Use the supplied keynote as the default site and
retain the earlier presentation and creation story as accessible companion
routes. The supplied app's scripted demonstrations are labeled as simulations.

## Security context slides

**Request (summary):** Add two impactful, researched slides before the
Security announcements, using graphs and recent evidence about supply-chain
attacks, CVEs, and delayed or “time bomb” attacks. Test the changes and open
a pull request.

**Implementation decision:** Present CVE publication volume and third-party
breach involvement as separate measures, then use documented package and
workflow compromises to explain different activation triggers.

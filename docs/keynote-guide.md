# GitHub Universe 2026: Interactive Keynote

A keyboard-driven keynote that replaces slides for presenting every GitHub Universe 2026
announcement, plus an Explore mode the audience can browse on their own afterwards.

- 41 announcements in 5 sections, each told as: the problem, what GitHub announced, watch it in
  action, why it matters.
- Headline announcements (Copilot Fusion, Copilot Projects, stacked pull requests, Copilot
  Automations, Copilot connectors, AI Scan) get three scenes: reveal, simulated demo and impact.
- Every demo is a scripted, repeatable simulation you drive with the keyboard. Nothing is
  random and nothing calls a live API.
- Section 5 tells the Octoverse 2026 and infrastructure story with full-screen data scenes:
  developer growth, activity a year apart, agents starting the work, the capacity GitHub added
  and 5,000 agents pushing to one repository.
- The keynote ends on a constellation recap of the five takeaways, one per section.
- The opening screen has two buttons: **Highlights**, a five-moment mini keynote through the most
  impactful announcements, and **Announcements**, which goes straight to the five sections.

The supplied app is integrated into this repository's Astro site. It needs no backend or API
keys: fonts, icons, three.js and presentation content are bundled. The "Learn more" and source
links go online and open in a new tab.

## Run it locally

Requires Node.js 22.12 or later.

```bash
npm ci
npm run dev       # development server with hot reload
npm run check     # type-check the Astro site and keynote
npm run build     # static production build in dist/
npm run preview   # serve the production build locally
```

For browser verification, install Chromium with `npx playwright install chromium`,
then run `npm run test:browser` after a build and `npm run test:dev`.

## Deploy to GitHub Pages

The existing `.github/workflows/deploy.yml` verifies pull requests without deploying them.
After a merge to `main`, it builds and publishes the site through GitHub Actions. The
repository's Pages source must be **GitHub Actions**; environment rules can require approval.

The configured site is https://sinannar.github.io/ghuniverse26/. The workflow obtains the
origin and base path from `actions/configure-pages`; local development defaults to `/`.
Use `ASTRO_BASE=/example` when checking a project-path build locally, or set
`$env:ASTRO_BASE = '/example'` in PowerShell. The presenter window uses the same address
with `?presenter=1`, and pressing **P** opens it.

## Presenting

1. Open the site, ideally in its own browser tab or window rather than embedded in another page.
2. Press **F** for fullscreen. If the browser blocks fullscreen inside an embedded frame, open
   the app in its own tab and press F again (or use the browser's own F11 fullscreen).
3. Click **Announcements** (or press **→** twice) to reach the five sections, then keep pressing
   **→** (or Space, or your clicker's forward button) to move forward. That is all you need on
   stage.

### Sections

Sections run in this order, and the number keys jump straight to each one, which makes handing
over between presenters easy:

1. Copilot & agents
2. Developer workflow
3. Automation & integrations (starts with GitHub Agentic Workflows)
4. Security
5. Enterprise & platform (Copilot in GitHub Enterprise, then the Octoverse and infrastructure
   data scenes)

Security opens with two context slides before its announcements: GitHub's CVE publication
trend, Microsoft's ChainDrop investigation, and recent supply-chain incidents including
delayed triggers. Their source links, reporting windows, and caveats are shown in the
panels and presenter notes.

The keynote ends on the recap: five takeaways that light up one star at a time, then the line
"You set the goal. Agents carry the work." There is no separate closing slide.

### How navigation works

There is one direction to think about: **Next**. Each screen can have a few steps (a reveal, a
demo beat). Next reveals the next step on the current screen, and once the screen is complete it
moves to the next screen. **Back** does the same in reverse. Nothing is ever skipped, so a
clicker that only has forward and back buttons can run the whole keynote.

- The **bottom bar** shows where you are (section, announcement and part), dots for the steps
  left on this screen, and a Next button that says what it will do next. In a window it stays
  docked under the stage. In fullscreen it tucks away into a slim position strip and comes back
  when you move the mouse.
- **Home** (the button, or the Home key) always returns to the opening screen, with its two
  buttons: Highlights and Announcements. To get back to where you were, press the section number
  or open the Map.
- **Map** (G) shows the whole keynote on one screen: Home, Announcements, Highlights and
  Explore at the top, then every section, every announcement and each part of the headline
  announcements, with "You are here" marked. Type to search, or use the arrow keys and Enter.
- From **Explore**, "Present this scene" opens the keynote at that announcement, and the bar
  shows "Back to Explore" so you can return to exactly where you were.
- In **Highlights** the bar shows "Exit Highlights".

### Keys

| Key | Action |
| --- | --- |
| → , Space, Page Down, ↓, Enter | Next: the next step on this screen, then the next screen |
| ← , Shift+Space, Page Up, ↑, Backspace | Back: one step back, then the previous screen |
| Shift+→ / Shift+← | Skip a whole screen forward or back |
| Home or 0 | Home (the opening screen) |
| End | Last screen |
| 1 to 5 | Jump to a section |
| 6 | Recap |
| G or M | Map: see everything and jump anywhere (type to search) |
| R | Reset the current demo |
| S | Skip the current animation to its end state (emergency control) |
| F | Toggle fullscreen |
| H | Hide or show the navigation bar and position strip |
| N | Show or hide presenter notes on this screen |
| P | Open the synced presenter window |
| T | Start or leave Highlights |
| O | Open Explore mode |
| E | Edit your name, role and organisation for the opening screen |
| B or . | Black screen (press again to return) |
| ? | Navigation and keys help |
| Esc | Close what's open, leave blackout or exit fullscreen |

Presentation clickers that send Page Up / Page Down or the arrow keys work out of the box. On a
touch screen, swipe left or right on the stage. Some clickers also have a "start slideshow"
button that sends F5, which browsers treat as reload. Avoid that button; if it happens, press G
and jump straight back.

### Presenter window

Press **P** to open a second window with the current scene, a "When you press Next" card that
says exactly what the next press will do (and a preview of it), the talking points, what to say
during the demo, the developer benefit, technical details, the suggested transition, an
elapsed-time clock and a Map tab listing every scene. Drag it to your laptop screen and keep the
main window on the projector. The keys work the same in both windows, and clicking any scene in
the Map tab sends the keynote there.

The windows sync through browser storage, so both must be in the same browser profile and the
app must be open in its own tab (an embedded frame can isolate storage). If the browser blocks
the popup, allow popups for the app and press P again.

Notes never appear on the audience screen unless you press **N**.

### Your name on the opening screen

Press **E** to enter your name, role and organisation. They appear on the opening screen as
"Presented by" and are saved in this browser only, so enter them on the machine you present
from. Leave them empty when several people share the deck.

## Explore mode

Press **O**, or choose Explore in the Map (G) or the ⋯ menu in the bottom bar. Visitors can search,
filter by section and availability status, and open any announcement to see its summary,
problem, how it works, benefit, status and official sources, then play its scene and demo.
The header always has **Home**, plus "Back to the keynote" when Explore was opened from the
middle of the talk. Esc goes back one level. Explore works at laptop, tablet and phone widths.
The bottom bar's **More controls** menu also links to the original presentation and its
creation story.

## Updating content

All announcement content lives in one typed module, separate from presentation:

- `src/keynote/data/announcements.ts`: name, section, tier, one-line summary, problem, how it works,
  benefit, status and availability, facts, official sources, presenter notes, demo step
  captions and impact stats for each announcement. Order within a section follows the array.
  `TOUR_IDS` lists the five Highlights moments.
- `src/keynote/data/sections.ts`: the five sections, their presenting order and their accent colours.
- `src/keynote/data/takeaways.ts`: the five recap takeaways and the closing line.
- `src/keynote/data/platform-trends.ts`: every figure behind the section 5 data scenes, with its source
  and scope. `src/keynote/deck/data-scenes.ts` sets their beats and presenter notes.
- `src/keynote/deck/scenes.ts`: builds the Announcements and Highlights decks (scene order and beats)
  from the data.

The demos live in `src/keynote/demos/` (one module per section) and the scene templates in
`src/keynote/scenes/` (`platform-data.tsx` holds the section 5 charts, `recap.tsx` the constellation).

## Accuracy

Facts, availability and numbers come from the official recap
(https://github.com/events/universe/recap), the keynote blog post, the `universe26` changelog
entries and the linked GitHub docs. Each announcement lists its sources. Preview, experimental
and rolling-out features are labelled as such. The supplied guide reports that announcements
were re-checked against their sources on November 17, 2026; the integration did not independently
recheck every claim. Updates since the event that matter on stage are in the presenter notes.
Time-sensitive: the 30% Copilot Fusion discount ends on November 30, 2026.

The demos are illustrative simulations of how each feature works. The repositories, issues,
pull requests, packages and people inside them are sample data.

The section 5 charts use only figures GitHub stated (Octoverse 2019 to 2026, GitHub Engineering
posts from October 6, October 21 and November 5, 2026, the CTO's April 28, 2026 availability
post and the keynote). Years without a stated developer total are left out, not estimated. The
"~180x" on the one-repository scene is the keynote's figure for single-repository write
throughput in internal testing (shown on stage, chapter 31:25 of the keynote video); the
written posts give 5,000 concurrent agents and 7,200 pushes a second instead. It is not a
platform-wide scaling figure. The live counters are illustrations at the Octoverse averages.

## Accessibility and safety

- Full keyboard control with visible focus states; every demo control is a real button.
- Honours the operating system's reduce-motion setting: movement is replaced by fades and demos
  jump to each beat's end state.
- No auto-advance or unsolicited popups; the presenter window opens on request.
- If an animation misbehaves, press S to finish it or R to reset the demo. Navigation keeps
  working either way.

## Project structure

```
astro.config.mjs      Astro, React, Tailwind, and Pages base configuration
src/pages/index.astro keynote page shell
src/keynote/
  main.tsx, App.tsx   entry point and app shell (no router: deep links use #scene=...)
  data/               announcements, sections, takeaways and the section 5 figures (the content)
  deck/               deck builder, navigation store and labels, presenter sync, presenter details
  stage/              1920x1080 scaled stage, backdrop, galaxy, navigation bar, map, help, notes,
                      presenter window
  scenes/             framing scenes, announcement templates, Highlights, recap constellation,
                      section 5 data scenes, section motifs
  demos/              interactive demos per section
  explore/            Explore grid and announcement detail
  kit/                motion helpers, UI bits, mock window frames
  components/         shared UI primitives (buttons, dialogs, menus, keyboard shortcuts)
src/pages/            original Astro presentation and making-of routes
.github/workflows/    GitHub Pages verification and deployment
```

Built with Astro, React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Radix UI, Zustand and three.js.

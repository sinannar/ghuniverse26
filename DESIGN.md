---
name: Universe presentation
description: A data-first browser presentation, not a recap landing page.
colors:
  ink: "#191822"
  paper: "#f7f8f5"
  white: "#fff"
  muted: "#55545f"
  line: "#d7dad4"
  platform: "#88e797"
  platform-strong: "#347d3b"
  copilot: "#f3a5c3"
  copilot-strong: "#b92961"
  octoverse: "#e5d36a"
  octoverse-strong: "#7d6a11"
typography:
  display:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    fontSize: "clamp(2.75rem, 5.5vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    fontSize: "1rem"
    lineHeight: 1.5
components:
  navigation-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    width: "42px"
    height: "38px"
---

# Universe presentation design

## Overview

The website is the presentation itself: evidence first, one topic at a time,
with quiet controls around a large slide canvas. It is not a scrolling recreation
of the official recap. Real demonstrations happen in the presenter's own tools.

## Colors

Paper and ink carry the interface. Mustard identifies Octoverse, green Platform,
and pink Copilot. Each chapter pairs a light accent with a stronger color for
chart bars and headings. Idea and demo slides invert to ink; Fusion's creation
story uses a full pink field. Comparison bars are neutral rather than competing
with the current observation.

## Typography

Use the system sans-serif stack without remote fonts. Large, tightly spaced
headlines carry a single claim; body copy uses generous line height. Controls
stay compact. Chart values are bold and remain visible as text, not tooltips.
Headlines scale down for short projector viewports and mobile screens.

## Layout

The desktop shell has a compact header, topic/source topline, viewport-filling
slide stage, bottom slide controls, and a quiet footer. The opener pairs a claim
with its chart. Discussion and example slides use columns rather than cards.
Topic choosers use numbered, ruled rows.

At 1000px, reduce shell spacing. At 700px, wrap chapter navigation and stack slide
content; oversized mobile slides scroll internally. At heights below 760px,
tighten typography and spacing so projector slides fit. No horizontal scrolling.

## Elevation & Depth

The presentation is flat, divided by thin rules. Only the sources popover uses a
shadow to distinguish temporary context from slide content.

## Shapes

Use square-edged controls, rectangular bars, and straight rules. Chapter dots
are circular; avoid decorative cards, gradients, or unrelated illustrations.

## Components

`Presentation.astro` owns the shared stage and controls. `Chart.astro` renders
accessible HTML/CSS bars with explicit units, values, reporting notes, and sources.
Chapter navigation provides quick jumps without becoming a dominant category rail.
Optional demos are explicitly labeled and skipped by normal progression.

Visible focus rings, source links, hash-based slide destinations, fullscreen,
and ordinary navigation without JavaScript are part of the interface.

The public "How this was built" companion is a reading surface, not another
slide chapter. Use an ink-on-paper column up to 960px wide, chapter-colored
quotation rules, simple tables, and native expandable sections for the longer
conversation and plan. Keep a direct return link to the Fusion slide.

## Do's and Don'ts

- Start with actual report data, not a promotional hero or title screen.
- Keep each slide focused; preserve source caveats and sample boundaries.
- Use chapter color consistently and keep navigation subordinate to the content.
- Do not simulate GitHub tools or imply that an undecided demo is confirmed.
- Do not duplicate developer trends outside Octoverse or restore excluded chapters.

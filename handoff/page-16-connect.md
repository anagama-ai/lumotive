# Page 16 — /connect

Approved content package rev. 2026-10-07, page 16 of 21, "Connect ›
Optical Circuit Switching". First built against v2; **v3 pass applied
2026-10-21**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Open: the reference-designs
graphic decision (C3) and copy confirmation (C4), the Google citation (C6),
icons (C7), and in-page playback of Vimeo 1227505713 (S19).

## v3 pass (2026-10-21)

**Copy.** The v2→v3 text diff of page 16 is empty; every live heading,
card, stat, list item, action and caption matches v3 in the printed order.
Two typographic differences are left as they are: the site sets
apostrophes as ’ where the PDF has ' (site-wide convention), and "50 μs"
uses Greek mu where the PDF has the micro sign (µ). Same text; change only
if you want the code point to match.

**Simon's annotations, all five already in the repo:**

| # | Position | Simon's file | Local copy | Outcome |
| --- | --- | --- | --- | --- |
| A1 | Hero "OCS ports and lasers" | OCS-small-ports-v4-n-lasers (1920×1080 original) | `home-2d-photonic-news.webp`, identical | **Hero**, replaces the server-rack `hero-connect.jpg` |
| A2 | "2D beamforming visual" | Lumotive_OCS (2000×1125) | `ocs-fabric.png`, identical, unused | **Beside the copy of block 7**, as `ocs-fabric.webp` (1600×900, 52 KB) |
| A3 | "Existing graphic: OCS reference designs" | OCS-Reference-Designs (1209×532, a screenshot of two spec cards) | none | Not used: section is KEEP AS IS and already renders both designs as panels with live text. Open as C3. |
| A4 | "Image: AI data center" | Optical-Communications_2 | `connect-optical.jpg`, identical | **AI data centers card**, centre-cropped 16:9 as `connect-use-ai-data-centers.webp` |
| A5 | "Image: satellite and airborne links" | Optical-Communications | `applications-optical-communications.webp`, identical | **Optical communications card**, 16:9 crop `connect-use-optical-communications.webp` |

**Migration** `1787714600_connect_v3.js` (hero media; block 7 media; two
card media). **One shared-component change:** stacked `ctaSplitLinks` takes
an optional `media`, set beside the copy (right from 768px, above it on
phones, as split sections do). Without media the stacked markup is the same
as before. Exposed in the editor as "Image beside the copy".

### v3 QA

- **390 / 430 / 768 / 1024 / 1440:** no horizontal overflow, no broken
  image. Block 7 visual 608×342 at 1440 (16:9), 358×201 at 390; use-case
  photos fill their 16:9 frames (564×317 at 1440, 294×165 at 390).
- **Hero contrast** (text hidden, 99th percentile / brightest pixel): body
  6.25/5.27 (390), 5.59/5.26 (430), 8.06 (768), 8.86 (1024), 9.04 (1440),
  9.88 (1920); headline ≥ 7.98; eyebrow ≥ 7.16; "Learn about LCM" ≥ 15.6.
- **Links:** `/contact?inquiry=ocs`, `/platform` and the announcement post
  answer 200. Block 7 shows no date and no generation label (dev note).
- **Light-section contrast:** 71 elements, 0 failures at 1440 and 390.
- **Video 1227505713:** in-page playback still unverified (the headless
  frame stalled; cause not established). S19.
- **Migration:** revert restored every page record byte-identically;
  re-apply changed only `connect`. `npm run check` 0 errors, 0 warnings;
  `npm run build` passed, dev server stopped.
- **Screenshots:** `%TEMP%\lumotive-review\connect\` — `desktop-1440-01…09`,
  `mobile-390-01…09`, `tablet-1024-`/`tablet-768-`/`mobile-430-`
  `01-hero`, `06-2d-beamforming`, `08-use-cases`; `before\` for the hero,
  block 7 and use cases at 1440 and 390.

### Outstanding (after v3)

1. **C3** — use Simon's combined reference-designs image instead of the live
   panels? The image bakes its spec text into pixels (small on phones, not
   selectable) and adds "Control: Industry-standard SDN" and "Variants:
   O-band & C-band", which the live panels do not list.
2. **C4** — KEEP AS IS vs the printed heading and intro (printed copy live).
3. **C6** — Google publication URL for the 40% / 30% figures.
4. **C7** — icons for the two card sets, or approval of text cards.
5. **S19** — in-page playback of Vimeo 1227505713 in a normal browser.

Resolved by v3: the hero (C1), the 2D beamforming visual (C2) and the two
use-case images (C5).

## What shipped in the v2 build (history)

One reversible migration, `1787711400_connect_page16.js`. **The route and the
record are unchanged** — this is "CHANGE · REBUILT ON THE CURRENT LUMOTIVE.COM
OCS PAGE", not a new page.

| # | id | Type | Marker | Section |
| --- | --- | --- | --- | --- |
| 1 | `ffa907ea` | `heroSplit` | CHANGE | Lumotive Connect / Optical Circuit Switching / "Solid-state and at scale." |
| 2 | `d8c4ff1d` | `splitDefault` | CHANGE | Electronic Switches Are Hitting Their Limits. + the existing video |
| 3 | `d32ef2bd` | `cardsTextCards` | CHANGE | Send Light, Not Signals. — four benefits |
| 4 | `4c81e9a7` | `cardsTextCards` | NEW | Today's Optical Switches Are Mechanical. — four MEMS limits + closing line |
| 5 | `b0f3d514` | `statsLightTraits` | CHANGE | Switching at Semiconductor Scale + 50 μs / 10k × 10k |
| 6 | `df99bb2e` | `cardsTextCards` | CHANGE | …its six traits |
| 7 | `6e2a71c9` | `ctaSplitLinks` | NEW | 2D Beamforming for High-Port-Count Switching |
| 8 | `e856b692` | `cardsSpecPanels` | KEEP AS IS | From Compact to Hyperscale. |
| 9 | `93c4b0fe` | `cardsTextCards` | NEW | Where Lumotive Connect Applies |
| 10 | `9bb14000` | `ctaFabric` | CHANGE | Architecting the Next AI Data Center? |

The hero uses **`hero-connect.jpg`**, verified as the OCS ports-and-lasers
photograph the package names ("current lumotive.com hero") — optical patch
cables and transceiver ports in a data-center aisle.

Actions carry the page-03 inquiry value for this page, **`ocs`**, and the
labels take the package's sentence case: "Talk to our OCS team", "Learn about
LCM". The announcement action points at the real post,
`/posts/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor`;
no date and no generation label appear, per the dev note.

### Removed — not in the approved composition

All four are restored verbatim by the down path.

| id | Section | Why |
| --- | --- | --- |
| `f4b9c1d7` | standalone video | The package sets the video beside block 2's copy, so the two are merged. |
| `2a71fb29` | A programmable optical fabric for the AI era | Its subject — pixels mapped to ports, each programmable in position, size, steering and lensing — **is** approved block 5, in the package's own words. |
| `835c0cd5` | How it works | Same subject, likewise folded into block 5. |
| `2e561f30` | Built for AI infrastructure | The approved page carries "Where Lumotive Connect Applies" in this role, with the package's own two use cases. |

### What this means for commit `67f8f02`

All four repairs remain in the components. Two are **still exercised on this
page**: the outlined CTA action (block 10) and the spec-panel label contrast
(block 8). The other two — the peel swap's dwell, its narrow-viewport and
reduced-motion fallbacks, and the icon quad's title rhythm — belonged to
sections the approved composition does not carry, so they no longer have
anything to act on *here*. **The swap repairs still serve `/platform`**, the
other page using that section, verified unchanged.

### One shared-component change

`cardsSpecPanels` now emits `data-align`, so block 8 can opt into the header
container like every other section. Without it that one section sat at the
viewport edge while the other nine aligned at 80px.

## Discrepancy worth a decision

**"From Compact to Hyperscale." is marked KEEP AS IS, but the package prints a
heading and an introduction that differ from staging.** The page-01 copy rule
is absolute — "Copy in these pages is final. Use it word for word" — so the
printed copy wins and the section's graphics, spec lists and layout are
untouched. If the marker was meant literally, reverting the two strings is a
two-field change.

| | |
| --- | --- |
| Staging | "From compact to hyperscale" / "Lumotive supports reference architectures across the AI infrastructure stack, from compact scale-up systems inside the rack to large scale-out optical fabrics across the cluster." |
| Package | "From Compact to Hyperscale." / "Two reference architectures cover both ends of the AI infrastructure stack: scale-up inside the rack, scale-out across the cluster. Both use the same Lumotive LCM optical engine, tiled, packaged, and scaled differently." |

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px, **every inner column on one
  edge** (16 / 24 / 24 / 80).
- **Reduced motion at 1440:** clean probe, and **no heading or card sits under
  0.9 opacity** — nothing hidden.
- **Copy:** nine headings in the package's order, each matching character for
  character.
- **Links:** `/contact?inquiry=ocs`, `/platform` and the announcement post all
  200. No external links in main.
- **Migration:** applies, reverts to the previous ten sections, re-applies.
- `svelte-check` 589 files, 0 errors; production build clean. `/platform`,
  `/applications`, `/sense` and `/dev-kits` all still report a clean probe.

## Outstanding assets

1. **2D beamforming visual** (shared with Platform) — package page 04 lists it
   as a new asset, so block 7 ships as copy and actions only.
2. **Use-case images** for block 9, "AI data center" and "satellite and
   airborne links". No satellite or airborne asset exists here, and one
   illustrated card beside a bare one reads worse than neither, so both are
   omitted.
3. **Citation link for the Google figures.** The dev note asks for Google's
   public publication to be cited. The copy attributes the 40% and 30% figures
   to Google by name, but no URL has been supplied, so none is invented.
4. **Icons.** The six existing icons no longer match the approved card titles
   on blocks 3 and 6, and none exists for "Compact", so both blocks ship as
   text cards rather than pairing approved titles with mismatched art. The icon
   files remain in the repository.

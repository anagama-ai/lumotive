# Page 09 — /sense

Approved content package rev. 2026-10-07 (v2), page 09 of 21, "Sense ›
Overview". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified**, except the Module and Solution
Providers component, which is blocked on two logos.

## What shipped

One reversible migration, `1787709700_sense_page9.js`, round-tripped down and
up. The revert restores the previous eight sections **byte-identically**.

Final section order, matching the package:

| # | id | Type | Marker | Heading |
| --- | --- | --- | --- | --- |
| 1 | `d9bf96da` | `heroBand` | CHANGE | Programmable 3D Sensing |
| 2 | `9d8fe777` | `cardsIconCards` | KEEP AS IS | The Problem |
| 3 | `bb989678` | `cardsTextCards` | CHANGE · #118 | Lumotive Sense: Programmable Eyes for Intelligent Machines |
| 4 | `a1d7c40e` | `cardsTextCards` | CHANGE · #119 | Better Perception for Robots and Vehicles |
| 5 | `f52b9a16` | `splitDefault` | NEW | See Bright and Dark Targets Together |
| 6 | `2a6b5ed9` | `cardsMediaCards` | CHANGE | Built for a Broad Range of 3D Sensing Applications |
| 7 | `c83f1b77` | `cardsTextCards` | CHANGE | Evaluate LCM at the Level You Need |
| 8 | `3327d913` | `ctaDefault` | KEEP AS IS | Redefine Perception With Software-Defined Light. |

### Hero

Heading drops to "Programmable 3D Sensing" and the body takes the approved
sentence. This satisfies the dev note ("Remove 'Infinite adaptability'") and
clears **global rule 9**: "Physical AI" had been in the `h1`, which the rule
forbids. It now appears **once** on the page, in the body. Actions become "Find
your dev kit" → `/dev-kits` and "See the LCM chips" → `/lcm-chips`, the second
repointed off the retired `/lm10`. The existing hero image is unchanged.

### Webvizio #118 — The Answer

The "Why Lumotive is different" comparison is replaced by the approved
Programmable Eyes section: six benefit cards (Fewer sensors, Cleaner data,
Longer reach, Software-defined ROIs, Lower cost and power, Higher reliability),
the proposition "Your perception system decides where to look. LCM puts the
light there, in microseconds.", and the closing "The result: robots and
vehicles that do more work, with less downtime."

Type changed from `cardsComparisonCards` to `cardsTextCards`, because the
approved content is six titled cards rather than two opposed lists.

### Webvizio #119 — Better Perception for Robots and Vehicles

Two cards, indoor LCM-based iToF and outdoor/surround LCM-based dToF, each with
its approved lead line, four approved bullets and its dev kit link.

**Neither task is closed in Webvizio.** Both should close only after the client
reviews them on staging.

### New HDR section

"See Bright and Dark Targets Together" with the approved paragraph. The HDR
demo visual (main pulse vs low-power pulse, coloured by intensity) is listed as
a new asset on package page 04 and has not been supplied, so the section ships
copy-only. `splitDefault` holds a single reading column when its art column is
absent, so nothing is left empty; adding `media` restores the two-column layout
with no further change.

### Applications

Three approved cards with the approved copy and the Robotics and Automotive
links. Type changed from `cardsApplicationBento` to `cardsMediaCards`, because
the package prints three equal cards and the bento tiles three as one feature
plus two halves. The three images are the robot, vehicle and intersection
photographs this site already ships, which is what the package's grey boxes
describe. The dev note's "forward lidar beyond 200 m" does not appear in the
approved copy and is absent from the page.

### Start Building

The same shared component page 07 carries, with this page's optional closing
line, "Designing at the chip level? Explore LCM chips →".

### Removed

Three sections are not part of the approved page and leave: `c7f4a1e9` "From
platform to sensing system", `28be79eb` the evaluation-paths timeline, and
`e6595d2c` the logo marquee. All three are restored verbatim by the down path.

Removing the marquee also clears two site-wide removals on package page 01: it
carried the **Fortsense logo** and the **"e-Photonics" spelling**, both of which
the package removes everywhere. Verified absent from the rendered page.

### Rendering changes

- `cardsTextCards` gains optional `statement` and `conclusion` lines, set in the
  lead size at medium weight, which is how the package prints them; a guard so a
  card with no title renders no empty `h3`; and bullet styling for a card body
  that carries a list, since the global stylesheet only styles lists inside
  `.prose`.
- `CardsIconCards` now emits `data-align`, which it had been ignoring — the same
  defect already fixed in `StatsCentered`. Without it "The Problem" sat on a
  different edge to every other section on the page.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, no tap target under 44px, **zero contrast failures**, every inner
  column on one edge.
- **Headings** render in the package's order and capitalisation, all eight.
- **Compliance:** "Physical AI" count **1**, and not in a heading. "Infinite
  adaptability" **absent**. "beyond 200 m" **absent**. "e-Photonics" and
  "Fortsense" **absent** from the page.
- **Links:** `/dev-kits`, `/lcm-chips`, `/contact` all 200. Six resolve 404 and
  are approved destinations for pages not yet built — see Blockers.
- **Migration:** applies, reverts and re-applies deterministically; the revert
  is byte-identical to the pre-migration record.
- `svelte-check` and the production build both clean.

### Finalisation audit

Section order asserted against the package at 1440: all eight headings match in
sequence, exactly. Measured top-to-bottom at 1440 and 390:

| # | Section | Height @1440 | Inner padding |
| --- | --- | --- | --- |
| 1 | hero | 612 | band, none |
| 2 | `#problem` | 710 | 80/80 |
| 3 | `#the-answer` | 1057 | 80/80 |
| 4 | `#robots-and-vehicles` | 896 | 80/80 |
| 5 | `#hdr` | 310 | 40/40 |
| 6 | `#applications` | 888 | 80/80 |
| 7 | `#start-building` | 677 | 80/80 |
| 8 | closing CTA | 598 | 112/112 |

**No unexpected blank space.** Every inter-section gap measures **0px** at both
widths — sections meet exactly and all vertical rhythm comes from each
section's own padding. The distance from each section's last element to its
inner edge equals its padding-bottom throughout; the only variance is
`#the-answer` at 97px against an 80px padding, which is the line-box leading
under the closing sentence, not empty layout.

The hero and the closing CTA keep their own established rhythm (a band, and
the CTA's `lg` spacing). The Start Building cards and the closing CTA were not
touched in this pass and need no visual change.

## Blockers

1. **Module and Solution Providers component — not built.** Specified as logos
   only, in order: Leopard Imaging, Namuga, Hokuyo, Electronic Photonics. Two of
   four are unavailable:
   - there is **no Leopard Imaging logo** in this repository;
   - the **Electronic Photonics logo** is an open Lumotive input on package
     page 04. The existing `ephotonics.png` carries the "e-Photonics" spelling
     the package removes site-wide, so it cannot stand in.

   A provider strip missing half its members misstates who builds on LCM, so the
   component waits for both logos.

   **It blocks four package pages, not just this one.** Package page 03 lists
   the component as used on Sense, Dev Kits hub, Partners and Robotics, and the
   component heading appears verbatim on each of those pages:

   | Package page | Surface | State |
   | --- | --- | --- |
   | 09 | `/sense` | implemented except this component |
   | 10 | `/sense/robotics` | not built yet |
   | 12 | `/dev-kits` | not built yet |
   | 19 | `/partners` | not built yet |

   One delivery of the two logos unblocks all four. Build it once as a shared
   component, since the package requires the copy, the order and the "no
   external links" rule to be identical everywhere it appears. Webvizio #121
   and #122 ("Partners: add Leopard Imaging, order") resolve through this same
   component and must stay open until it ships.
2. **HDR demo visual** — pending Lumotive asset; the section ships copy-only.
3. **Section images for #119** — the package calls for "AMR or humanoid in a
   warehouse aisle" and "vehicle or heavy equipment with a 180° coverage arc".
   `market-agv.jpg` is a plausible match for the first, but no asset carries the
   180° coverage arc for the second, and one illustrated card beside one blank
   reads worse than two plain ones. Both omitted; adding `media` per card later
   is data-only.
4. **404 destinations**, all approved and awaiting their own pages:
   `/sense/robotics` and `/sense/automotive` (pages 10, 11);
   `/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof`
   (pages 13–15).

## Open question for Apurva

Package page 08 marks three Applications sections as moving **to Sense**:
"Software-Defined 3D Sensing for Physical AI", "Scalable Across 3D Sensing
Markets" and "The Lumotive Advantage". Page 09's own composition does not show
any of them, and page 09 is the authority for what /sense contains. I have read
those notes as describing where the *topic* belongs rather than a literal
section transplant, and have not added them. **Confirm.** If they are meant to
appear on /sense, the copy is preserved in
`1787709500_applications_page8.js`'s down path and can be reinstated.

A second, smaller point: "The Problem" is marked KEEP AS IS, so its copy is
untouched, but it did take the page-wide `align: "container"` presentation flag
along with every other section. Without it that one section would sit on a
different edge to the rest of the page.

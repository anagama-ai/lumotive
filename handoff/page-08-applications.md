# Page 08 — /applications (review only, not implemented)

Approved content package rev. 2026-10-07 (v2), page 08 of 21,
"Platform › Applications". Branch `feedback-20261007-v2`.

This is the pre-implementation review requested before any edits. **No migration
has been written and nothing on `/applications` has changed.**

## Current state

Seven sections, verified in the browser:

| # | id | Type | Heading |
| --- | --- | --- | --- |
| 0 | `acb2f280` | `heroBand` | Programmable Optics Across Applications |
| 1 | `91a455fe` | `cardsApplicationBento` | One Platform. Many Optical Applications. |
| 2 | `ebb6cf90` | `splitDefault` | Software-Defined 3D Sensing for Physical AI |
| 3 | `b3ce5d47` | `splitDefault` | Automotive Safety Cocoon |
| 4 | `357cf90c` | `cardsMediaCards` | Scalable Across 3D Sensing Markets |
| 5 | `60dd50fb` | `statsDarkTraits` | The Lumotive Advantage |
| 6 | `9a19b24a` | `ctaLightField` | Build With Programmable Optics |

## Required changes

### 1. Hero — CHANGE (`acb2f280`)

- Body replaced with "One semiconductor platform. Many ways to put light to work."
  (currently a longer LCM platform sentence).
- **One** action only, "Talk to our team" → `/contact`. The current single action
  is "Explore Lumotive Sense" → `/sense`, which the package drops.
- Eyebrow "Applications" and the existing hero image are unchanged; the package
  marks the image "Existing hero image".
- Heading unchanged.

### 2. Eight LCM application areas — CHANGE (`91a455fe`)

The five-card bento becomes eight cards in two rows of four. Heading changes from
"One platform. Many optical applications." to **"One Platform, Many
Applications"** (comma, not a full stop), and the intro is replaced.

New intro: "LCM brings software control to light. The same chip technology that
steers lidar beams can route light in data centers, link satellites, and shape
light for displays and instruments."

Row 1:

| Title | Body | Link | Image |
| --- | --- | --- | --- |
| 3D Sensing | Programmable 3D sensing for robots, vehicles, and smart infrastructure. | Explore Sense → `/sense` | quadruped robot |
| Optical Circuit Switching | Solid-state switching for AI data center networks. | Explore Connect → `/connect` | data center |
| Defense | Solid-state beam control for sensing and optical systems. | — | drones and vessel |
| Optical Communications | Beam steering for satellite, airborne, and terrestrial links. | Explore Connect → `/connect` | satellite link and delivery robot |

Row 2:

| Title | Body | Link | Image |
| --- | --- | --- | --- |
| Medical | Programmable illumination for imaging and instrumentation. | — | lab instrument |
| AI Computing | Light-speed optical computing with programmable phase control. | — | optical chip |
| AR & Holographic Displays | Flat, programmable optics for near-eye and holographic displays. | — | AR headset |
| Your Application | Applications yet to be created, built on innovations today. Tell us what you would build with programmable light. | Talk to us → `/contact` | open prompt |

Status labels above each title are **omitted** — see Q19 below.

> The package prints these eight cards as two four-column blocks. The text layer
> extracts them interleaved column-by-column, so the body copy above was
> reconstructed from the fragments; every fragment is accounted for exactly once
> and each reads as a complete sentence. **Confirm the pairing against the
> rendered PDF page before publishing**, since a mis-paired body would be a copy
> error, not a layout one.

### 3. Programmable Optics in Motion — NEW section

"CHANGE · REPLACES SINGLE VIDEO". Eyebrow "SEE IT IN ACTION", heading
"Programmable Optics in Motion". Two videos side by side:

| Slot | Video | Title | Link |
| --- | --- | --- | --- |
| Left | AMR animation (non-sequential ROI pulses, continuous point cloud) | One programmable sensor, three jobs | Explore Sense → `/sense` |
| Right | `vimeo.com/1227505713` | Send light, not signals | Explore Connect → `/connect` |

No existing section type renders a two-video pair with a caption and link under
each. `mediaVideoEmbed` is single-video; `splitDefault` holds one media column
beside copy. A small new design version or component will be needed, in the same
way `cardsSpecComparison` was for page 07.

### 4. Removals — REMOVE · MOVE OFF THIS PAGE

| Section | Destination page |
| --- | --- |
| `ebb6cf90` "Software-Defined 3D Sensing for Physical AI" | Sense (page 09) |
| `b3ce5d47` "Automotive Safety Cocoon" | Automotive (page 11) |
| `357cf90c` "Scalable Across 3D Sensing Markets" | Sense (page 09) |
| `60dd50fb` "The Lumotive Advantage" | Sense (page 09) |

The package also lists the 3D-sensing sub-sections for Mobility, Smart
Infrastructure & Surveillance and Robotics as moving to Sense, Robotics and
Automotive. On this build those three are the `Mobility` and
`Smart infrastructure & surveillance` bento cards in `91a455fe` plus the
`357cf90c` market cards, all of which the rebuild above already removes.

Removing `ebb6cf90` also clears global rule 9: "Physical AI" currently appears in
an `h2` on this page, which the rule forbids.

The down path of the migration must restore all four sections verbatim, since
their copy is the source for pages 09 and 11.

### 5. Closing CTA — CHANGE (`9a19b24a`)

- Heading "Build With Programmable Optics" — already correct.
- Body replaced with "Tell us the problem. We will show you where programmable
  light fits."
- **One** action, "Talk to our team" → `/contact`. The current section has two
  ("Contact Lumotive" → `/contact` and "Explore Lumotive Sense" → `/sense`); the
  secondary one goes and the primary is relabelled.

### 6. Footer

Already follows the new site map (`1787708000_footer_sitemap.js`). No change.

## Missing inputs

Five of the eight card images do not exist in this repository and the media
library is empty, so those cards cannot ship with imagery.

| Card | Image called for | Status |
| --- | --- | --- |
| 3D Sensing | quadruped robot | **Available** — `/lumotive/img/market-robot-dog.jpg`, already used by the current bento |
| Optical Circuit Switching | data center | **Available** — `/lumotive/img/connect-optical.jpg` (`ocs-fabric.png` is an alternative) |
| Defense | drones and vessel | **Missing** |
| Optical Communications | satellite link and delivery robot | **Missing** |
| Medical | lab instrument | **Missing** |
| AI Computing | optical chip | **Available** — `/lumotive/img/lm10-chip-clean.png` or `lcm-platform-chip.jpg` |
| AR & Holographic Displays | AR headset | **Missing** |
| Your Application | open prompt | **Missing**, and ambiguous: "open prompt" may be a graphic treatment rather than a photograph. Needs clarification with the other five. |

Package page 04 lists "Applications | AMR animation video and Connect video side
by side | New", so the AMR animation is itself a new asset request:

- **AMR animation — unconfirmed.** The package dev note says "If the existing
  staging video vimeo.com/1174547871 is the AMR animation, use it in the left
  slot." That video is on this site today, on the section being removed
  (`ebb6cf90`, as `https://vimeo.com/1174547871/6e198e52ae`, with a privacy
  hash). Whether it is the AMR animation cannot be determined here: Vimeo returns
  401 to this sandboxed browser, the same condition still open on page 06.
  **Someone must watch it on a normal network and confirm** before it is reused;
  if it is not the AMR animation, the animation is a pending Lumotive asset.
- **Connect video — available.** `vimeo.com/1227505713` is already published on
  `/connect` (`f4b9c1d7`), so the right slot needs no new input.

## Carried forward

- **Q19 — application status labels. Open, labels omitted.** The package shows a
  small accent label above each card title: "In production", "In development",
  "Active programs", "Exploring", with the dev note "Use these labels only, never
  'In deployment.'" Global rule 1 on package page 01 says "No product
  availability, launch timing, roadmap, or generation dates anywhere on the
  site." "In production" and "In development" read as availability and roadmap
  state, so the two directions conflict.

  Until Apurva clarifies, **the eight cards ship with no status label.** Adding
  them later is a data-only change: one `eyebrow` per card, which the bento card
  already renders. Do not substitute different wording and do not infer a label
  for a card the package does not label — "Your Application" carries none.

- **Vimeo playback check** (page 06, `/platform` `97a0771d`,
  `player.vimeo.com/video/1040582713`) is still open and needs the same normal-
  network pass as the AMR confirmation above. Batch the two.

## Dependencies on other pages

- The four removed sections are the source copy for **pages 09 (Sense) and 11
  (Automotive)**. Remove them here only once that copy is captured, or keep the
  migration's down path as the record of it.
- `/sense`, `/connect` and `/contact` all resolve 200 today, so every link this
  page needs already works.
- Page 06's "See all applications" action points here and is unaffected.

## Status

Reviewed, not implemented. Blocking before build: the five missing card images
and the AMR animation confirmation. Q19 stays open with the status labels
omitted.

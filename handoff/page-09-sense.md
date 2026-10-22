# Page 09 — /sense

Approved content package rev. 2026-10-07, page 09 of 21, "Sense › Overview". First built against v2; **v3 pass applied 2026-10-20**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Remaining items are client inputs (the Leopard Imaging logo, plus confirmations); see "Blockers".

## v3 pass (2026-10-20)

**Copy.** The v2→v3 diff of page 09 has one change: Start Building "Add LCM beam steering…" became "Add LCM beamforming to your own sensor design." It was already live from `1787712600`, so no copy changed in this pass. "Physical AI" still appears once (hero body, not a heading); "beam steering" appears 0 times.

**Media.** Simon's six sticky notes, each mapped to the slot under it. The images were downloaded, visually checked, and saved as local WebP (≤1280 px, q80) under `static/lumotive/img`; none duplicated an existing file (perceptual-hash checked).

| Slot | Simon's source | Local asset |
| --- | --- | --- |
| Better Perception, indoor iToF card (A1) | [Industrial-scaled.jpeg](https://lumotive.com/wp-content/uploads/2024/12/Industrial-scaled.jpeg), 2560×1350 | `sense-perception-indoor.webp`, centre-cropped to 16:9, 1280×720, 50 KB |
| Better Perception, outdoor dToF card (A2) | [3D-Sensing.jpg](https://lumotive.com/wp-content/uploads/2024/03/3D-Sensing.jpg), 892×592 | `sense-perception-outdoor.webp`, centre-cropped to 16:9, 892×502, 52 KB (source is small; not upscaled) |
| HDR section (A6) | [Vimeo 1235957120](https://vimeo.com/1235957120), "Lumotive HDR", 15 s, 2520×1080 | embedded, right column, 21:9 frame |
| Applications · Robotics (A3) | [robot-conveyor 1536×864](https://lumotive.com/wp-content/uploads/2023/04/Lumotive-CES-robot-conveyor-image-ADD-1-1536x864-1.jpg) | `sense-application-robotics.webp`, 1280×720, 108 KB |
| Applications · Automotive (A4) | [Driverless-Car.png](https://lumotive.com/wp-content/uploads/2022/12/Driverless-Car.png), 7680×4320, 27 MB | `sense-application-automotive.webp`, 1280×720, 106 KB |
| Applications · Smart Infrastructure & Surveillance (A5) | [Robotaxi-scaled.jpeg](https://lumotive.com/wp-content/uploads/2024/12/Robotaxi-scaled.jpeg) | `sense-application-smart-infrastructure.webp`, 1280×720, 69 KB |

- **Perception crop.** Text cards frame media at 16:9 with `object-contain`, so the pair is cropped to 16:9 at source; otherwise each would sit in white bars.
- **Applications swap.** The three replace the incumbent `market-robot-dog.jpg`, `market-passenger-adas.jpg` and `market-its.jpg`. Those files stay in the repository.
- **A5 content.** Despite the "Robotaxi" filename, A5 is an aerial view of a multi-lane road with tracked vehicles. That fits the card's printed "Image: intersection" and its "traffic and parking monitoring" copy, so the earlier fit question (SE4) is closed.
- **HDR video.** It shows "HDR OFF" beside "HDR ON" point clouds coloured by intensity, which is the printed description. It sits on the right as the PDF prints it; on mobile it stacks above the copy, per the established split order. It plays on click, with no autoplay.

**Migration** `1787713100_sense_v3_simon_media.js` (reversible, guarded on prior values):
- card `media` on `a1d7c40e`, matched by eyebrow;
- `videoUrl`, `videoAspect: "21 / 9"` and `mediaPosition: "right"` on `f52b9a16`;
- the three image swaps on `2a6b5ed9`, matched by title, and restored on revert;
- `seoDescription` from the hero sentence (global rule 14; S11/SE8 closed for this page).

**Code (shared, additive).**
- `SplitDefault` takes an optional `videoAspect` (validated `N / N`, default 16:9). The 21:9 clip would otherwise be letterboxed inside a 16:9 frame. The field is exposed in `sections.herosplit.ts`. No existing section sets it, so nothing else changes.
- `cardsTextCards` now exposes card `media` in the editor spec. The component already rendered it (`/platform` chip cards), and the editor preserves unknown fields, so this only makes the field editable.

### v3 QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, all 10 images load, no tap target under 44px, every inner column on one edge (16 / 24 / 24 / 80).
  - Perception cards: 1 → 2 columns.
  - Applications: 1 → 2 → 3 → 3 columns. The 2+1 row at 768 and the title-driven body offset at 1024, where "Smart Infrastructure & Surveillance" wraps, are pre-existing `cardsMediaCards` behaviour, unchanged.
  - HDR frame measures exactly 2.333 (21:9) at every width.
- **Contrast:** automated scan of every text node in the three changed sections, zero failures. No text styling changed.
- **Headings and links:** one H1 and seven H2s in package order. All eight internal links answer 200: `/dev-kits`, `/lcm-chips`, the three `/dev-kits/*` pages, `/sense/robotics`, `/sense/automotive` and `/contact`. Meta and OG description both render the hero sentence. The iframe has a title. Card images are decorative (`alt=""`, titled cards).
- **Video:**
  - The direct player loaded and played the full 14.9 s (readyState 4).
  - Embedded on an unrelated external page, it showed the "Lumotive HDR" poster in a 21:9 frame with no letterbox. That confirms the embed URL and the frame ratio only.
  - **In-page playback on `/sense`: PENDING, not verified.** Embedded on `/sense` (local, headless), Vimeo showed "We couldn't verify the security of your connection". The cause is not established. Neither the direct player nor the outside-site embed verifies playback on `/sense`. Re-test on `/sense` in a normal browser (SE10 / S19).
- **Shared-component regression (2026-10-20, 1440):**
  - `videoAspect` is set only on `sense#f52b9a16`. Every other split video keeps an exact 16:9 frame with no inline style: `/platform` dark panel 1040582713, `/connect` 1227505713, `/culture` YouTube AcLAbtIxN64, `/dev-kits/dtof` 1102359216. No overflow on those pages.
  - The ratio guard accepts only `N / N` values ("21 / 9", "16/9", "2.39 / 1") and rejects empty, `auto`, `calc(…)` and injected CSS such as `21/9; color:red`.
  - The field appears in the editor spec for the four split types; all four render through `SplitDefault`, and peel-bleed never shows an iframe.
  - `cardsTextCards` editor card fields are now `media, eyebrow, title, body, linkLabel, linkUrl, badge, accent`. The `/platform` LM10/LS20 card photos and both `/sense` perception photos still load.
  - The editor itself was not exercised in a browser (no editor account in the local database); the check is at spec level.
- **Migration:** revert restored every page record byte-identically to the pre-migration snapshot; reapply changed only `sense`.
- `npm run check` 592 files, 0 errors, 0 warnings; `npm run build` clean, run with the dev server stopped.

### Refinement: "The Problem" icons (requested 2026-10-20)

Migration `1787713200_sense_problem_icon_accents.js` changes section `9d8fe777` only.
- **Size:** icons drop 20%, from 80px to 64px.
- **Colour:** they take the accent sequence blue / green / amber / blue (Fixed Field of View, Multiple Sensors, Blind Spots, Poor Adaptability). The fills are the same tokens as the decorative bars on the other cards: `bg-brand-blue`, `bg-brand-green`, `bg-brand-amber`.

`CardsIconCards` gains two opt-in section fields, `iconTint: "accent"` and `iconSize: "sm"`, both exposed in the editor spec.
- When tinted, the icon renders as a decorative `aria-hidden` span: a token-coloured fill masked by the PNG's alpha. The four PNG files are untouched.
- `/culture`'s icon cards, the only other user, set neither field; verified unchanged at 80px as `<img>`.

Headings, body copy, card layout and grid are unchanged. Card height measures 266px at 1440 (4-up) and 235px at 390 (1-up), with no overflow.

**Icon visibility on the white card** (graphic contrast; WCAG 1.4.11 asks 3:1 for meaningful graphics):
- blue 4.57:1, green 3.19:1;
- **amber 1.82:1**, the same as the amber decorative bars elsewhere.

The icons are decorative (each card's heading carries the meaning), so the amber icon is legible but light. Swapping it to a darker token would break the requested accent sequence; flagged for review.

Verified at 1440 and 390. The migration reverts to the exact prior record and reapplies to `sense` only. `npm run check` reported 0 errors and 0 warnings; `npm run build` passed with the dev server stopped.

### Refinement: compact mobile hero (requested 2026-10-20)

Migration `1787713300_sense_hero_compact_mobile.js` sets `compactMobile: "true"` on hero `d9bf96da` only. Below 768px, `HeroFullHeight` (the shared band hero component) then makes three changes:
- drops the band's 68svh minimum height, so the hero grows with its copy;
- sets copy padding to 4rem top and 3.5rem bottom;
- tightens the vertical gap between the stacked actions from 2rem to 1rem.

Text, font sizes (12 / 44 / 17 / 16px) and buttons (191×49, 164×44) are unchanged. The field is exposed in the hero editor spec.

| Viewport | Before | After |
|---|---|---|
| 390 | 574px (153px above eyebrow, 64px below actions, 32px action gap) | **473px** (76 / 56 / 16) |
| 430 | 634px | 413px (actions fit on one row) |
| 1440 | 612px | 612px, unchanged |

Heights exclude the 73px header. There is no clipping and no overflow. `/applications`' band hero still measures 574px at 390. The migration reverts exactly and reapplies. `npm run check` reported 0 errors; `npm run build` passed.

## What shipped in the v2 build (history)

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

"See Bright and Dark Targets Together" with the approved paragraph. Copy-only in the v2 build; the v3 pass adds the supplied "Lumotive HDR" video (above).

### Applications

Three approved cards with the approved copy and the Robotics and Automotive
links. Type changed from `cardsApplicationBento` to `cardsMediaCards`, because
the package prints three equal cards and the bento tiles three as one feature
plus two halves. The v2 build used the site's incumbent robot, vehicle and
intersection photographs; the v3 pass replaces them with Simon's three
(above). The dev note's "forward lidar beyond 200 m" does not appear in the
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

## Blockers (after v3)

1. **Module and Solution Providers — not built on `/sense`.** Logos only, in order: Leopard Imaging, Namuga, Hokuyo, Electronic Photonics.
   - **Leopard Imaging logo: missing (client asset).**
   - The existing "≡ PHOTONICS" mark was checked on page 19 and carries no "e-Photonics" spelling. It is now a confirmation, not a blocker (outstanding PA4).
   - **Decision needed (SE6):** `/partners` already ships this strip with 3 of 4 logos. Build it here and on `/dev-kits` the same way now, or wait for Leopard?
   - Page 10 does not print this component, so it affects pages 09, 12 and 19 only. Webvizio #121/#122 stay open.
2. **In-page HDR playback on `/sense` — pending.** Not verified; the cause of the Vimeo connection screen is not established. Re-test on `/sense` in a normal browser.
3. **KEEP AS IS copy differs from the printed text** (pre-existing since v2; not a v3 change; decision for Claudia, like `/connect` C4):
   - "The Problem" intro: live "…efficiency required for today's autonomous machines." vs printed "…efficiency today's autonomous machines need."
   - Closing CTA body: live "…designing to — field of view, range, form factor — and we will point you at…" vs printed "…designing to (field of view, range, form factor) and we will point you to…".

   Both keep the staging text because of the KEEP AS IS marker; switching to the printed text is a two-field change.

Resolved by v3: the HDR demo visual (supplied), the #119 section images (supplied), and the five `/sense/*` and `/dev-kits/*` 404s (all pages now built).

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

## v4 review (2026-10-22): no change

The v3→v4 text diff of PDF page 09 is empty, and its six notes are the same as in v3 (no new link, no "Disregard"). The page needs no change. Its open items are unchanged: SE5 (Leopard logo), SE6, SE7, SE9, and SE10 (real-browser check of the HDR video; the Platform videos played in a visible Edge window on 2026-10-22, so the same check applies here).

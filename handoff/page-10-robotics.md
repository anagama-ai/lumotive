# Page 10 — /sense/robotics

Approved content package rev. 2026-10-07, page 10 of 21, "Sense › Robotics". First built against v2; **v3 pass applied 2026-10-20**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Pending inputs: the three-panel AMR video ("Elyar's video") and the LI140/ON140 kit photos.

## v3 pass (2026-10-20)

**Copy.** The v2→v3 text diff of page 10 is empty. Comparing the page word for word with the v3 render found one existing error from the v2 build: the Integrate step read "…compute board **or your body**…". The printed text is "…compute board **or body**, with no separate sensor box." Fixed.

**Simon's four notes on page 10:**

| Note | Slot | Supplied? | Action |
| --- | --- | --- | --- |
| A1 [AGV-AMR-scaled.jpeg](https://lumotive.com/wp-content/uploads/2024/12/AGV-AMR-scaled.jpeg) | Hero ("AMR and humanoid in a warehouse, depth overlay") | Yes. Identical to the existing local `market-agv.jpg` (perceptual match 0.99998). | Hero `4c1a8e02` now uses `/lumotive/img/market-agv.jpg`; no duplicate file. |
| A2 [M30_thumb.jpg](https://lumotive.com/wp-content/uploads/2022/10/M30_thumb.jpg) | M30 kit card | Yes (537×402, not in the repo). | **Not added** (see Kits). |
| A3 [IMG_0032-1-copy.png](https://lumotive.com/wp-content/uploads/2026/04/IMG_0032-1-copy.png) | NM120 kit card | Yes. Visually identical to the existing `nm120-sensor.jpg`, already used on `/dev-kits/dtof`. | **Not added** (see Kits). |
| A4 "Elyar's video" | One Sensor, Three Jobs, the three-panel AMR demo | **No.** A name only, no file or URL. Nothing matching is in the repo, `static/lumotive/video` (only `hero.mp4` and `beam-steering.mp4`) or Downloads. | **Pending.** No substitute: the AGV AMR animation (Vimeo 1174547871) is a different, separately annotated asset. |

**Kits for Robotics: all four cards stay text-only**, on review instruction. Only M30 and NM120 have photos; LI140 and ON140 have none. When those two arrive, add all four as one data change: M30 from A2, NM120 as the existing `nm120-sensor.jpg`. The kit-card spec on PDF p03 prints "Photo on light grey panel", so those product shots will want a contained-on-Cool-Field frame rather than the current full-bleed `object-cover`. That is a small `cardsMediaCards` option to add at that point.

**Two layout corrections against the printed page** (approved on review; both existed since the v2 build):
1. **The four closing benefits** under "One Sensor, Three Jobs" ("Fewer sensors to buy" … "Lower total power") are a bullet list, as printed, not four title-only cards. Section `2e6c48da` changes from `cardsTextCards` to a media-less `splitDefault` whose body is that list (same id, spacing and container alignment).
2. **Design Your Own Sensor** steps show the printed 01–04 numerals in Laser Blue display type, in place of the accent bars. A new opt-in `numbered: "true"` on `cardsTextCards`, set only on `6f24b8c1`, is exposed in the editor spec.

**Migration** `1787713400_robotics_v3.js` (reversible, guarded on prior values) covers the hero media, the bullet list, the numerals and the Integrate copy fix.

### v3 QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, every inner column on one edge (16 / 24 / 24 / 80).
  - Grids: virtual sensors and robot types 1 → 2 → 3; proof, kits and design steps 1 → 2 → 4.
  - Hero heights 593 / 696 / 612 / 612px (default band; the `/sense` compact-mobile option is not applied here).
  - The only tap target under 44px is the 23px "Sense" breadcrumb, the accepted condition recorded below.
- **Hero crop:** at 1440 the warehouse, AMRs and arm sit right of the headline under the established gradient. At 390 the frame shows the racking behind the copy; the text stays on the dark side of the shade.
- **Contrast:** automated scan of the bullet list and design steps, zero failures.
- **Step numerals refinement (requested 2026-10-20):**
  - The 01–04 numerals follow the cards' existing accent sequence: 01 blue, 02 green, 03 amber, 04 blue.
  - They use text-safe variants, because the bright accents fail as text (green 3.19:1, amber 1.82:1). Two new tokens hold the same hue darkened to clear 4.5:1 on white: `--color-brand-green-text` `#008742` and `--color-brand-amber-text` `#9f6a00`.
  - Laser Blue already passes and is reused. The tokens are recorded in DESIGN.md.
  - Measured on the white cards: blue 4.57:1, green 4.62:1, amber 4.63:1, at 24px (desktop) and 20px (mobile), weight 600. That passes AA even under the 4.5:1 body-text bar.
  - Data, copy, typography, spacing and layout are unchanged; desktop card height stays 269px.
  - Only `numbered` sections render numerals, and `6f24b8c1` is the only one, so no other page changes.
  - 1440 and 390 checked, no overflow. `npm run check` reported 0 errors; `npm run build` passed.
  - Screenshots: `%TEMP%\lumotive-review\robotics\*-design-steps-accents*.webp`.
- **Links:** `/sense`, `/contact?inquiry=robotics`, `/dev-kits/itof` and `/dev-kits/dtof` answer 200; `#kits` resolves.
- **Shared-component regression:** no other page renders numerals. `/sense` (11 bars), `/platform` (2) and `/lcm-chips` (11) keep their accent bars; `/lcm-chips`' `steps` list is unaffected; no overflow on any of them.
- **Migration:** revert restored every page record byte-identically to the pre-migration snapshot; reapply changed only `robotics`.
- `npm run check` 592 files, 0 errors, 0 warnings; `npm run build` passed with the dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\robotics\` (`desktop-1440-01…08`, `mobile-390-01…08`, `contact-desktop.png`, `contact-mobile.png`).

### Fix: mobile hero contrast, R6 (2026-10-20)

**Problem.** Found during the Page 11 QA: on phones the warehouse photo sits behind the full-width hero copy, and the body text (white at 75%) dropped under 4.5:1.

**Fix.** Migration `1787713600_robotics_hero_mobile_shade.js` sets `mobileShade: "strong"` on hero `4c1a8e02` only.
- `HeroFullHeight` then swaps in a heavier shade below 768px:
  - standard: 96% at 20% → 76% at 55% → blue 40%;
  - strong: 96% at 25% → 90% at 60% → blue 50%.
- The new option is exposed in the hero editor spec.
- Image, crop, copy, typography and hero height (612px at a 900px-tall viewport, before and after) are unchanged.
- Desktop and tablet keep the standard shade (confirmed at 1440 and 768). `/sense/automotive` and `/sense` mobile heroes are unchanged.

**Method.** The hero copy is hidden, the bare band is captured, and each text colour is tested against the background behind its own glyph boxes. The table gives the 99th-percentile-brightest pixel, with the single brightest pixel in brackets.

| Text (requirement) | 390 before | 390 after | 430 before | 430 after |
|---|---|---|---|---|
| Body, white 75% (4.5) | **4.20** (3.80) | **5.60** (5.00) | **4.36** (3.99) | **5.83** (5.29) |
| Headline, white, large (3.0) | 7.56 (4.28) | 11.17 (7.26) | 4.76 (3.44) | 7.40 (5.20) |
| Eyebrow, amber (4.5) | 6.22 (5.46) | 9.08 (8.75) | 8.68 (8.16) | 9.92 (9.75) |
| "See the kits" link, white (4.5) | 17.55 | 18.40 | 17.75 | 18.40 |

Every hero text now passes at both widths, including against the brightest pixel. The body text measured 4.05 in the Page 11 check because that measurement used whole text boxes; this one uses glyph-line boxes.

**Checks.**
- No horizontal overflow at 390 or 430.
- The migration reverts to the exact prior record and reapplies to `robotics` only.
- `npm run check` reported 0 errors; `npm run build` passed with the dev server stopped.
- Screenshots: `%TEMP%\lumotive-review\robotics\mobile-390-hero-strong-shade.webp` and `mobile-430-hero-strong-shade.webp`.

## What shipped in the v2 build (history)

One reversible migration, `1787709900_sense_robotics_page10.js`. The page is
created as a child of `/sense`, so `computePath` resolves it to
`sense/robotics`, the URL the page-01 site map gives it. The footer and the
header's Applications submenu already linked there and had been answering 404
since the footer was rebuilt; both now resolve.

| # | id | Type | Section |
| --- | --- | --- | --- |
| 1 | `4c1a8e02` | `heroBand` | Adaptive 3D Sensing for Robots and Humanoids |
| 2 | `7d3e52b9` | `splitDefault` | Robots Carry Too Many Sensors |
| 3 | `9a0b7f31` | `cardsTextCards` | One Sensor, Three Jobs — three virtual sensors |
| 4 | `2e6c48da` | `cardsTextCards` | The four closing benefits |
| 5 | `b5f91c67` | `cardsTextCards` | Proven With a Major U.S. Robotics OEM — eight blocks |
| 6 | `18d4a7e5` | `cardsTextCards` | Built for Every Kind of Robot — six cards |
| 7 | `c90e36b4` | `cardsMediaCards` | Kits for Robotics — the kit card component |
| 8 | `6f24b8c1` | `cardsTextCards` | Design Your Own Sensor With Lumotive |
| 9 | `a73d519f` | `ctaDefault` | Put a Programmable Sensor on Your Robot |

Section 5 is built as blocks, which is what the package's "BLOCKS, NOT A TABLE"
marker asks for, and the dev note keeping the customer unnamed is satisfied by
the approved copy itself. Section 4 joins section 3 through spacing rather than
a repeated heading, as the package prints it.

The kit cards follow the page-03 component spec: name, one line, four spec
lines and a link to the category page, four across desktop, two tablet, one
mobile. M30 and LI140 and ON140 link to iToF, NM120 to dToF, assigned by
product type.

Both CTAs carry the page-02 inquiry parameter `?inquiry=robotics`.

### Rendering changes

- `cardsTextCards` gains `columns: "4"` (1 → 2 → 4), for the eight proof blocks
  and the four design steps.
- `CardsMediaCards` card bodies gain bullet styling, since the global
  stylesheet only styles lists inside `.prose` and the kit cards carry four
  spec lines each.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge. Grids step
  as specified: virtual sensors and robot kinds 1 → 2 → 3; proof, kits and
  design steps 1 → 2 → 4.
- **Headings** render in the package's order, all eight.
- **Compliance:** "Physical AI" **0** occurrences; no klux, no 1550 nm or FMCW,
  no operating temperature, no "download" anywhere on the page.
- **Links:** `/sense` 200, `/contact?inquiry=robotics` 200, the `#kits` anchor
  resolves. `/dev-kits/itof` and `/dev-kits/dtof` 404 — approved destinations
  from pages 14 and 15.
- **Migration:** applies, reverts and re-applies. After the revert
  `/sense/robotics` returns 404; after re-apply, 200.
- `svelte-check` and the production build both clean.

### One pre-existing finding, not changed

`Breadcrumbs.svelte` renders its links at 23px. This page is the first child
page on the site, so it is the first to show breadcrumbs at all. The links sit
in a list with a 0.5rem gap, giving 31px centre-to-centre, which clears WCAG
2.5.8's spacing exception, and the component is shared with any future child
page. Left as is rather than restyled from inside a page task; raise it if the
client wants a larger breadcrumb target.

## Blockers (after v3)

1. **Three-panel AMR demo video ("Elyar's video") — pending, client asset.**
   - Not supplied or identified; Simon's note names a person, not a file.
   - The approved caption ("Three-panel AMR demo video: localization, cliff detection, full-field avoidance") stays held with it.
   - **Our follow-on** once it arrives: turn "One Sensor, Three Jobs" into the printed split (cards and bullets left, video right), poster plus click-to-play, and an in-page playback check.
2. **LI140 and ON140 kit photos — pending, client asset.** Until they arrive, all four kit cards stay text-only (review decision). M30 (A2) and NM120 (existing `nm120-sensor.jpg`) are ready to add with them.
3. The **Module and Solution Providers logo strip is not printed on page 10**. Only the approved provider sentence is, and it ships on `6f24b8c1`. This page is no longer counted among the strip's blockers.

Resolved by v3: the hero image (supplied and live) and the `/dev-kits/itof`/`/dev-kits/dtof` 404s (both pages built).

## Copy reconstruction (resolved)

The v3 render shows the three virtual-sensor headings as **"Localization"**, **"Cliff and obstacle"** and **"Object avoidance"**, exactly as built. Kit card order is M30, NM120, LI140, ON140. The photo captions above them in the mock list a different order, so photos must be matched by product name, not position.

## v4 pass (2026-10-22): implemented and verified on the local site

Inputs (PDF page 10): Simon's Vimeo [1237762150](https://vimeo.com/1237762150) ("Lumotive: One Sensor, Three Jobs", 16:9, 1:09) on the three-panel demo slot. `wscgr`'s `LI140.png` and `ON140.png` (2500×1667 transparent cut-outs) on kit cards 3 and 4. Migration `1787716100_robotics_v4_video_kits.js`, guarded and reversible.

**One Sensor, Three Jobs (PDF layout, migration `1787716200`).**
- **Layout:** as PDF page 10 prints it, the heading, intro, three virtual-sensor cards and four benefit bullets form the left column, with the demo video on the right.
- **Migration:** the bullets and the video moved from the separate split `2e6c48da` into the cards section `9a0b7f31` (CardsTextCards gains opt-in `videoUrl` and `body`, unset on every other section), and `2e6c48da` was removed. The section takes back its own `md` bottom spacing.
- **Copy:** unchanged, including the card titles' existing title case.
- **Placeholder caption:** the printed "Three-panel AMR demo video: …" describes the asset, not page copy, so it is not shown.
- **Side by side from 1280px**, with cards at 1.5rem padding. Below 1280 the left column would give each of three cards under 150px, so the section stacks: heading, intro, cards (3 / 2+1 / 1 columns at 1024 / 768 / 390), bullets, then the video full width.
- **Earlier v4 pass:** it had put the video beside the bullets only, under full-width cards (`1787716100`); this supersedes that.

**Kits for Robotics.** All four photos were added together, matched by product name, on the page-03 kit panel (`mediaFrame: "panel"`: Cool Field panel, `object-fit: contain`, one fixed height, so no product is cropped):
- **M30:** `kit-m30.webp` from Simon's `M30_thumb.jpg`. Its plain white studio background was removed by an edge flood fill (light pixels connected to the border only), so it sits on the panel like the other cut-outs; the product pixels are unchanged. This settles v4 conflict 8 in favour of Simon's linked photo.
- **NM120:** the existing `kit-nm120.webp` (Simon's IMG_0032, already on `/dev-kits`).
- **LI140, ON140:** `kit-li140.webp` and `kit-on140.webp`, trimmed to the product plus a small margin, ON140 resized to 900px tall.

**Verification (local site).**
- **Kit row:** at 1440, 1024, 768 and 390 the four panels match within each row (254×224 at 1440), every image loads, and nothing overflows.
- **One Sensor, Three Jobs:**
  - **1440:** cards 3 × 184px and bullets (600px) in the left column, the video 600×338 on the right, vertically centred on the copy (6px off).
  - **1280:** the same split, cards 177px, video 578×325.
  - **1024 / 768 / 390:** stacked, with the video after the bullets at full width (976 / 720 / 358px).
  - No overflow at any width.
- **M30 cut-out:** checked at 2× against the original on the panel grey. Outline, lens, label text, connectors and the white stickers inside the product are intact (only light pixels connected to the image border were removed), with no visible white halo.
- **In-page playback:**
  - **Visible Microsoft Edge 155 window:** one click on the embedded player played it from 0.45 s to 8.45 s over 8 s (readyState 4, stream 1280×720).
  - **Observed limitation:** in headless Chromium the player stays on a loading spinner. On `/platform` the player document answered HTTP 401 with a Cloudflare challenge script in that browser (S19). The cause was not verified further.
- **Screenshots:** `%TEMP%\lumotive-review\robotics-v4\` (the earlier failed captures were deleted and replaced):
  - `one-sensor-three-jobs-{1440,1280,1024,768,390}.png` (complete section);
  - `kits-{1440,1280,1024,768,390}.png` (complete kit row);
  - `m30-cutout-edges-2x.png`;
  - `video-playing-edge.png`.

**Still open:** none on this page from v4. Sitewide items (S1 LinkedIn, S8) are unchanged.

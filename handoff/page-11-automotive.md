# Page 11 — /sense/automotive

Approved content package rev. 2026-10-07, page 11 of 21, "Sense › Automotive". First built against v2; **v3 pass applied 2026-10-20**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** The hero image is live. Three section visuals are pending client inputs (cocoon graphic, 180° point cloud or video, dust/rain images).

## v3 pass (2026-10-20)

**Copy.** The v2→v3 text diff of page 11 is empty. Every live string (headings, bodies, bullets, card titles, links) was matched programmatically against the v3 page text and found verbatim: no copy change was needed. Section order matches the PDF.

**Simon's four notes on page 11:**

| Note | Slot | Status |
| --- | --- | --- |
| A1 [media.jpg](https://lumotive.com/wp-content/uploads/2023/05/media.jpg) | Hero ("vehicle with near-field coverage rings") | **Supplied and live.** A wireframe car in a sensing field, matching the hero's subject. 1280×719 is the original upload; no larger WordPress rendition exists. Saved as `/lumotive/img/hero-automotive.webp` (95 KB, q85). Not a duplicate of any existing file. |
| A2 "Automotive deck" | A Programmable Cocoon Around the Vehicle: top-down graphic, vehicle with 10/20/50 m rings from corner sensors | **Pending.** A lead, not a file. |
| A3 "Stella-180 video from tradeshows? (talk to Calvin & Sam)" | First Solid-State 180° dToF Lidar at 30 FPS: 180° point cloud or video | **Pending.** A question and a lead, not a video. |
| A4 "Aramco rain testing – ask Calvin" | Built for Real-World Conditions: heavy-dust and rain multi-return images (first object, second object, combined) | **Pending.** A lead, not a file. |

Repository, `static/lumotive/video` and Downloads were searched for anything matching (automotive, Stella, Aramco, rain, dust, cocoon, deck). The only hit, `Downloads/automotive.json`, is an Elementor page export from an unrelated 2025 project. Nothing was substituted: the three sections keep their single reading column, and there is no video on this page, so there is no in-page playback to verify.

**Hero framing.** The car sits mid-frame, and at desktop widths it ran under the headline. The hero uses the existing desktop-only framing (`mediaShift: "20%"`, `mediaScale: "1.4"`, applied from 1024px up), the same mechanism `/dev-kits/itof` uses.
- The scale keeps the image covering the band edge to edge, with no uncovered strip, and puts the car right of the copy.
- Tablet and mobile use the default cover crop.
- Trade-off: on desktop the 1280px source is upscaled about 1.6×. It is a soft render behind a dark gradient, but a larger original would be sharper.

**Migration** `1787713500_automotive_v3.js` (reversible, guarded) sets hero `media`, `mediaShift` and `mediaScale` on `d81f4a60` only.

### v3 QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, every inner column on one edge (16 / 24 / 24 / 80).
  - Hero heights 574 / 696 / 612 / 704px.
  - Grids unchanged: five conditions 1 → 2 → 3 → 5, Beyond Passenger 1 → 2 → 3, Evaluate 1 → 2.
  - The only tap target under 44px is the accepted 23px "Sense" breadcrumb.
- **Contrast:**
  - Light sections: automated scan, zero failures.
  - Hero text over the photo: measured by hiding the copy, capturing the bare band and testing the text colour against the 99th-percentile-brightest background pixel under each text box.

    | Width | Headline (white, large) | Body (white 75%) |
    | --- | --- | --- |
    | 1440 | 10.66:1 | 10.00:1 |
    | 1024 | 11.93:1 | 8.26:1 |
    | 390 | 4.67:1 (large text, needs 3:1) | 7.07:1 |

    All pass. At 390 a few pixels of the top-right glow behind the end of the body lines reach 3.42:1 (single brightest pixel, not the 99th percentile).
- **Links:** `/sense`, `/contact?inquiry=automotive`, `/contact?inquiry=md180`, the 180° News post, `/dev-kits/dtof` and `/lcm-chips` all answer 200.
- **Shared components:** no component or token changed; this pass is data only.
- **Migration:** revert restored every page record byte-identically to the pre-migration snapshot; reapply changed only `automotive`.
- `npm run check` 592 files, 0 errors, 0 warnings; `npm run build` passed with the dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\automotive\`
  - `desktop-1440-01…08`, `mobile-390-01…08`;
  - `tablet-1024-01-hero`, `tablet-768-01-hero`;
  - contact sheets for desktop, mobile and tablet.

**Finding on Page 10, since fixed.** The same hero measurement on `/sense/robotics` at 390 showed the body text under 4.5:1 over the warehouse photo. Recorded as R6 and fixed by `1787713600`, a phone-only stronger shade; measurements are in the Page 10 handoff. `/sense` (6.48:1) and `/applications` (9.02:1) passed without changes.

## What shipped in the v2 build (history)

One reversible migration, `1787710100_sense_automotive_page11.js`. The page is
a child of `/sense`, so `computePath` resolves `sense/automotive`, the URL the
page-01 site map gives it. The footer has linked there since the footer rebuild
and had been answering 404; it now resolves.

| # | id | Type | Section |
| --- | --- | --- | --- |
| 1 | `d81f4a60` | `heroBand` | Solid-State Surround Sensing for Vehicles and Heavy Equipment |
| 2 | `b47c9e13` | `splitDefault` | Near-Field Blind Spots Need Too Many Sensors |
| 3 | `3e05d7b2` | `splitDefault` | A Programmable Cocoon Around the Vehicle + four bullets |
| 4 | `9c2a6f85` | `splitDefault` | First Solid-State 180° dToF Lidar at 30 FPS |
| 5 | `6a1b38fc` | `cardsTextCards` | Built for Real-World Conditions — five across |
| 6 | `70e9c54d` | `cardsTextCards` | Beyond Passenger Vehicles — three cards |
| 7 | `f2764b90` | `cardsMediaCards` | Evaluate Solid-State dToF — NM120 and MD180 |
| 8 | `c58e02a7` | `ctaSplitLinks` | Build Your Safety Cocoon With Us |

The industry-first link goes to the News post, per the dev note, and the page
carries no date: the target is the 2026-04-09 press release
"Lumotive's LCM Optical Semiconductor Platform Enables First Solid-State 180°
dTOF LiDAR at 30 FPS", which is the exact announcement the heading names.

The dev note on section 7 removes the roadmap section and keeps software and
compute partners unnamed; the approved copy already satisfies both, and
"roadmap" appears nowhere on the page.

Actions carry the page-02 inquiry parameters `automotive` and `md180`.

### Content moved from Applications

Package page 08 moves "Automotive Safety Cocoon" off `/applications` to this
page. Its destination is section `3e05d7b2`, which carries **page 11's own
approved copy** for that subject rather than the older Applications wording —
page 11 is the authority for what this page says, and its version is longer and
more specific. The superseded Applications copy stays recoverable in the down
path of `1787709500_applications_page8.js`.

### Navigation

Both entries that `1787710000_header_sense_menu.js` deliberately held back are
now live, in the same migration that creates the page so the two can never be
out of step:

- The **Sense** dropdown gains Automotive between Robotics and Dev kits,
  completing the approved group: Overview · Robotics · Automotive · Dev kits.
- The **Applications** group's Automotive entry moves off the `/applications`
  placeholder onto `/sense/automotive`.

The down path removes the Sense entry and returns the Applications entry to
`/applications`, verified by round-tripping.

### Rendering changes

- `ctaSplitLinks` gains an optional `note`, printed before the secondary action,
  which is how the package sets "Designing at the chip level? Explore LCM
  chips →".
- `.cta-text-link` takes the 2.75rem minimum height the other standalone
  actions carry; it had been a 25px tap target. This also fixes the same link
  on the home page's stacked CTA.
- `.split-body` gains bullet styling, since the global stylesheet only styles
  lists inside `.prose` and the safety cocoon section carries four bullets.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge. Grids step
  1 → 2 → 3 → 5 for the five conditions, 1 → 2 → 3 for Beyond Passenger
  Vehicles, 1 → 2 for the two kits.
- **Headings** render in the package's order, all eight. The safety cocoon
  bullets render as four list items.
- **Compliance:** "Physical AI" **0**; no klux, no 1550 nm or FMCW, no
  "roadmap", no "download".
- **Links:** `/sense`, both `/contact?inquiry=` targets, the News post and
  `/lcm-chips` all 200. `/dev-kits/dtof` 404 — approved destination from
  page 15.
- **Navigation:** every header link resolves 200 at both 1440 and 390, with no
  dangling fragment.
- **Migration round-trip:** after revert the route 404s, the Sense group drops
  back to three entries and the Applications entry returns to `/applications`;
  after re-apply, all three are correct again.
- `svelte-check` and the production build both clean.

### Two defects caught during QA and fixed

- The Evaluate section was set to four columns, which put its two kit cards in
  a half-empty row from `lg` upward. The flag is removed, so two cards sit
  two-up.
- The CTA's secondary link was a 25px tap target, below the 44px floor the rest
  of the site meets. Fixed in `CtaDefault`, which also corrects the home page.

## Blockers (after v3)

Pending client visuals. Each omitted visual leaves its section as a single reading column rather than a half-empty split; adding `media` later restores the two-column layout:

1. **Safety cocoon top-down graphic**: vehicle with 10 m / 20 m / 50 m coverage rings from corner sensors. Lead "Automotive deck". Listed as a new asset on package page 04.
2. **180° point cloud or video** beside the industry-first section. Lead "Stella-180 video from tradeshows? (talk to Calvin & Sam)". If it arrives as a video, it is embedded with poster plus click-to-play and in-page playback is then verified.
3. **Heavy dust and rain multi-return images** (first object, second object, combined) for Built for Real-World Conditions. Lead "Aramco rain testing – ask Calvin". New assets on page 04.

Optional: a larger original of the hero render, to sharpen the 1.6× desktop upscale.

Resolved by v3: the hero image (supplied and live) and the `/dev-kits/dtof` 404 (page built). Page 11 does not use the Module and Solution Providers strip.

## v4 pass (2026-10-22): implemented and verified on the local site

v4 has no copy change on page 11. Simon left three notes. Migration `1787716300_automotive_v4_media.js` is guarded and reversible; copy, hero framing, mobile spacing and CTAs are unchanged.

| Section | v4 input | Result | Differs from the printed slot |
| --- | --- | --- | --- |
| A Programmable Cocoon Around the Vehicle (`3e05d7b2`) | `lumotive-fov-regions-scaled.png` (2560×1256) | Self-hosted at full resolution as `automotive-fov-regions.webp` (117 KB; perceptual hash 1 bit from the source). Shown whole on a white panel under the copy, at the container width (new opt-in `mediaLayout: "below"` on SplitDefault). | The slot printed "Top-down graphic: vehicle with 10 m / 20 m / 50 m coverage rings from corner sensors", on the right. The supplied diagram has **no vehicle**: it shows one sensor's side and top views, with near / mid / far fields at 10 / 20 / 50 m and a spec card for each. Nothing was added to it. It is placed full width because its labels are unreadable at half width (checked at 600px). |
| First Solid-State 180° dToF Lidar at 30 FPS (`9c2a6f85`) | `IMG_9388-1-copy-2.png` (MD180 photo) | Reuses the existing `kit-md180.webp` (same photo, trimmed cut-out). It sits on the right on the white product panel (`mediaFrame: "panel"`), capped at 22rem tall and contained, so the whole product shows. | The slot printed "180° point cloud or video". The supplied asset is a product photo; no point cloud was made. |
| Built for Real-World Conditions (`6a1b38fc`) | "Disregard" on the dust/rain image row | No change: copy and five cards kept, no image row. | Only the image request is withdrawn. |

Alt text transcribes each image (the diagram's three fields with range, field of view, frame rate and purpose; "MD180 solid-state 180° dToF lidar").

**Verification (local site, headless Chromium).**
- **Cocoon diagram:** at 1440 / 1024 / 768 it shows whole at 1280 / 976 / 720px wide, at its native 2.038 ratio, with no scroll.
- **Phones (390):** the diagram keeps a readable 720px width and scrolls sideways inside its rounded frame (358px visible). The frame is keyboard-focusable (`role="region"`, labelled with the section heading). Nothing is cropped and the page itself does not overflow.
- **MD180:** at 1440 / 1024 / 768 the panel is 352px tall beside the copy, with the photo contained (not stretched). At 390 the photo sits above the copy at 268×328, its native ratio.
- **Built for Real-World Conditions:** 0 images, 5 cards, at every width.
- **Database and checks:** the migration was applied, reverted (all page records byte-identical) and re-applied; `npm run check` reports 0 errors and 0 warnings.
- **Screenshots:** `%TEMP%\lumotive-review\automotive-v4\` (`safety-cocoon-*.png`, `industry-first-*.png`, `field-tested-*.png` at 1440 / 1024 / 768 / 390).

**For review.** Claudia to confirm:
- the diagram without a vehicle and its full-width placement;
- the MD180 photo in the point-cloud slot;
- sideways scrolling as the phone treatment for the diagram.

AU5 (a larger hero original) is unchanged.

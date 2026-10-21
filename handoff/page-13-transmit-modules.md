# Page 13 — /dev-kits/transmit-modules

Approved content package rev. 2026-10-07, page 13 of 21, "Sense › Dev Kits › Transmit Modules". First built against v2; **v3 pass applied 2026-10-21**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Pending inputs: the two illumination animations (T3), plus a decision on whether the supplied still closes #129 (T2).

## v3 pass (2026-10-21)

**Copy.** The v2→v3 changes ("beam steering" → "beamforming" in the hero body twice, and in the meta description) were already live from `1787712600`. Every live string matches the v3 page text verbatim; the one programmatic mismatch was a soft-hyphen line break in the PDF's "Non-steering", not a copy difference. The section order matches; the three REMOVE sections stay removed. Actions remain contact requests (`tx10-datasheet`, `tx10-integration`); there are no downloads.

**Simon's two notes on page 13:**

| Note | Slot | Status |
| --- | --- | --- |
| A1 [IMG_5619](https://lumotive.com/wp-content/uploads/2026/05/IMG_5619-1-copy-2.png) | Hero (printed "Existing: tx10-hero.jpg (replace static image with animation, #129)") | **Supplied and live.** TX10 held in a hand, 1920×1811 transparent PNG. Flattened on white (the hero is full-bleed), saved as `hero-tx10-in-hand.webp` (1600px, 119 KB). Replaces the old `tx10-hero.jpg` cut-out, which stays in the repo. |
| A2 "Older decks" | Programmable Illumination: flood vs ROI-pulse animations | **Pending.** A lead, not a file; nothing matching in the repo. The section keeps its approved copy and five benefit cards. |

**Hero framing.**
- The old hero carried `mediaShift: "22%"` to move the small cut-out clear of the headline. With the full-frame hand photo, that shift opened a visible straight seam beside the hand at desktop widths, so it is removed. The default cover crop already puts the chip right of the copy, and the hand falls under the dark side of the shade.
- On phones the hand sits behind the body copy. Measured against the 99th-percentile background with the copy hidden, body text was 4.42:1 at 390 and 4.63:1 at 430 on the standard shade. The existing phone-only `mobileShade: "strong"` (built for R6) brings it to **6.00:1 and 6.01:1**.
- Other hero text with the final settings: headline 13.70 / 14.22 / 13.89 / 13.37 / 15.76:1 (1440 / 1024 / 768 / 390 / 430); amber eyebrow ≥ 9.48:1 everywhere; body 9.13 / 8.65 / 5.54:1 at 1440 / 1024 / 768.

**Migration** `1787713800_transmit_modules_v3.js` (reversible, guarded on prior values) touches hero `b41d7c05` only: `media` → `hero-tx10-in-hand.webp`, `mediaShift` removed, `mobileShade: "strong"`. No component or token changed; this pass is data only.

### v3 QA

- **390 / 430 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, every inner column on one edge (16 / 16 / 24 / 24 / 80).
  - The only tap target under 44px is the accepted 23px breadcrumb.
  - Hero heights 612 / 612 / 696 / 612 / 680px.
- **Image framing:** chip and LCM window fully visible right of the copy at 1024 and 1440. Thumb and board sit behind the copy on phones, under the strong shade.
- **Links:** `/dev-kits`, `/dev-kits/itof`, `/contact?inquiry=tx10-datasheet` and `/contact?inquiry=tx10-integration` answer 200. No download link or wording.
- **Migration:** revert restored every page record byte-identically to the pre-migration snapshot; reapply changed only `transmit-modules`.
- `npm run check` 592 files, 0 errors, 0 warnings; `npm run build` passed with the dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\transmit\`
  - `desktop-1440-01…06`, `mobile-390-01…06`;
  - `mobile-430-01-hero`, `tablet-1024-01-hero`, `tablet-768-01-hero`.

## What shipped in the v2 build (history)

Two reversible migrations.

### `1787710400_transmit_modules_page13.js`

A move and a rewrite, not an addition. The existing `/tx10` record is renamed
to `/dev-kits/transmit-modules`, parented to the Dev Kits hub, and its sections
are swapped for the page-13 set, so the page keeps its id and version history.
`/tx10` then has no page, which is what lets the redirect resolve it.

| # | id | Type | Marker | Section |
| --- | --- | --- | --- | --- |
| 1 | `b41d7c05` | `heroBand` | CHANGE · TRANSMIT MODULE TEMPLATE | LCM-Based iToF Transmit Module |
| 2 | `d25f8a16` | `statsLightTraits` (`specTiles`) | CHANGE · KEY NUMBERS | Four spec tiles |
| 3 | `c3e07b94` | `cardsTextCards` | CHANGE · #151, #157 | What TX10 Lets You Do |
| 4 | `a7b91de3` | `cardsTextCards` | CHANGE · #154 + #155 MERGED | Programmable Illumination for a Dynamic World |
| 5 | `e6482fc1` | `cardsTextCards` | NEW | Kits Built on TX10 |
| 6 | `f0d3a5b8` | `ctaSplitLinks` (stacked) | CHANGE · CLOSING CTA | Pair TX10 With Your iToF Sensor |

**REMOVE · THREE SECTIONS** is satisfied by the swap: "What Is TX10?"
(Webvizio #150), "TX10 Reference Design Advantages" and the "TX10-DK" section
are gone. The down path restores all ten previous sections verbatim.

The key numbers row ships with no heading, because the package prints none over
it; "KEY NUMBERS" is the editorial marker, not copy.

Section 4's two illumination animations are omitted (see Blockers), so it ships
as heading, intro and the five approved benefits.

**Navigation.** The Sense dropdown gains "Transmit modules" as a child of Dev
kits, entry 2.4.1 of the approved site map. iToF and dToF Dev Kits are 2.4.2
and 2.4.3 and stay out until pages 14 and 15 supply their routes, so the menu
never points at a 404. Each is a one-entry addition to
`NEXT_DEV_KIT_CHILDREN`.

### `1787710500_tx10_to_transmit_modules_redirect.js`

`/tx10` → `/dev-kits/transmit-modules`, **308**. The second of the five
redirects page 02 lists; the remaining three wait on pages 14, 15 and the
`/products` destination.

### Rendering changes

- `ctaSplitLinks` gains an optional `caveat`, a small trailing line under the
  action row in stacked mode, for the reference design caveat. White at 75% on
  the dark panel, matching the existing `note`.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge. Grids:
  capabilities 1 → 2 → 4; benefits 1 → 2 → 3 → 5; kits 1 → 2.
- **Copy:** headings render "LCM-Based iToF Transmit Module", "What TX10 Lets
  You Do", "Programmable Illumination for a Dynamic World", "Kits Built on
  TX10", "Pair TX10 With Your iToF Sensor". The four spec tiles read "Up to
  35 W", "910 nm", "Up to 105°" with "~0.5° steps", "Python reference".
- **Compliance:** no "TX10-DK", no "What Is TX10?", no "two paths", no
  "download", no klux, no operating temperature, no 1550 nm / FMCW / Tx-Rx, no
  dates, no "Physical AI" on this page, lidar never capitalised, and **zero
  external links** in main.
- **Links:** `/dev-kits`, both `/contact?inquiry=` targets and the `/tx10` 308
  all resolve. `/dev-kits/itof` 404s — the approved destination from page 14.
- **Tap targets:** one 23px item, the breadcrumb "Dev Kits & Reference
  Designs". Same accepted condition as `/sense/robotics`: the 0.5rem gap gives
  31px centre-to-centre, clearing WCAG 2.5.8's spacing exception.
- **Migrations:** apply, revert and re-apply deterministically. The revert
  restores the ten previous sections **byte-identically**, clears the parent,
  and removes the menu child.
- `svelte-check` 589 files, 0 errors; production build clean.
- Pages 05 to 12 all still answer 200.

## Blockers (after v3)

1. **#129 (T2), decision.** The PDF asks for an animation labelling the Tx optics in the hero. Simon supplied a still (TX10 in hand), which is now live. Lumotive to confirm whether the still answers #129 or an animation is still wanted. Webvizio **#129 stays open** until then.
2. **The two illumination animations (T3), client asset.** Flood illumination beside non-sequential ROI pulses with a continuously sharpening point cloud. The only lead is Simon's "Older decks" note. One panel beside an empty one reads worse than both omitted, so the section ships copy and cards only. When they arrive: convert to looping MP4/WebM with posters, pair them as printed, and verify in-page playback.

Not blockers: the Kits Built on TX10 cards are text cards on this page as printed, so no ON140/LI140 photos are needed here. `/dev-kits/itof` now answers 200.

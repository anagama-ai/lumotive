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

### Refinement: section spacing and card titles (2026-10-21)

Migration `1787713900_transmit_modules_spacing.js`. The four light sections between the hero and the closing CTA (`d25f8a16`, `c3e07b94`, `a7b91de3`, `e6482fc1`) move from `md` to a new opt-in `compact` spacing; `a7b91de3` (Programmable Illumination) also gets `titleLines: "2"`. Hero and CTA unchanged. Reverts exactly.

- **`compact` spacing** (`src/app.css`): 2.5rem a side on phones, 3.5rem from 768px. It also zeroes the incidental top margin of the section's leading block (including a grid that follows an element-less header) and the bottom margin of its last block. Accepted by the shared spacing fields and `StatsCentered`'s enum. No other page uses it.
- **`titleLines: "2"`** (`CardsTextCards`): from 768px every card title reserves two lines, so descriptions start at one height. Phones keep the natural title height.

Gap between content groups, in page order: hero -> key numbers -> capabilities -> illumination -> kits -> CTA band.

| Width | Before | After |
| --- | --- | --- |
| 390 | 128 / 188 / 172 / 188 / 220 | **40 / 80 / 80 / 80 / 40** |
| 1440 | 128 / 188 / 232 / 210 / 242 | **56 / 112 / 112 / 112 / 56** |

768 and 1024 measure the same as 1440 after the change. The before numbers for the first and last gap include the hero/CTA band edge; the CTA's own padding is untouched.

Illumination card descriptions now start at the same offset in every card: 126px (768, 1024), 135px (1440); at 390 all five 103px, titles one line. No horizontal overflow at 390/768/1024/1440. `/sense`, `/dev-kits` and `/sense/robotics` render no `compact` section and no reserved titles. Copy, colours, imagery, button styles and the hero are unchanged. `npm run check` 0 errors, 0 warnings; `npm run build` passed, dev server stopped. Screenshots: `%TEMP%\lumotive-review\transmit\spacing\` (`mobile-390-01..07`, `desktop-1440-key-numbers`, `desktop-1440-programmable-illumination`, `tablet-1024-programmable-illumination`).

### Refinement: closing CTA height (2026-10-21)

Migration `1787714000_transmit_modules_cta_height.js` on `f0d3a5b8` ("Pair TX10 With Your iToF Sensor"): spacing `lg` -> `md` (112 -> 80px a side, -29%) and the new opt-in `compactMobile` on `CtaDefault` (phones below 768px: 72px a side, -36%). Heading, body, button (283x49, 16px), both `/contact?inquiry=tx10-*` links and the caveat are unchanged. Reverts exactly.

| Width | Section height | Space above heading | Space below caveat |
| --- | --- | --- | --- |
| 390 | 698 -> **618** | 140 -> **100** | 125 -> **85** |
| 430 | 668 -> **588** | 140 -> **100** | 125 -> **85** |
| 768 | 531 -> **467** | 143 -> **111** | 125 -> **93** |
| 1440 | 594 -> **530** | 162 -> **130** | 125 -> **93** |

No clipping, no horizontal overflow. Other pages' closing CTAs (`/`, `/dev-kits`, `/sense/robotics`, `/sense/automotive`) keep 112px. `npm run check` 0 errors, 0 warnings; `npm run build` passed, dev server stopped. Screenshots: `%TEMP%\lumotive-review\transmit\cta\` (`mobile-390-cta`, `mobile-430-cta`, `tablet-768-cta`, `desktop-1440-cta`).

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

## v4 pass (2026-10-22): implemented and verified on the local site

v4 has no copy change on page 13. Simon's note "#154 + #155 merged" links [RandomScanOrderWarehouse.gif](https://lumotive.com/wp-content/uploads/2026/10/RandomScanOrderWarehouse.gif) (1923×1384, 12 frames at 300 ms, 3.6 s, 708 KB). Its content (LCM steering light into regions of a warehouse scene in a non-sequential order while the point cloud fills in) is the printed "Animation: non-sequential ROI pulses (up, down, center); point cloud sharpens continuously" slot.

**Conversion.**
- **Video:** `static/lumotive/video/tx10-random-scan-order.mp4` is H.264, 1280×922, with the GIF's own frame timing (12 frames, 3.6 s), faststart and no audio: 338 KB, against the GIF's 708 KB.
- **Fidelity:** all 12 frames come out in order, with a PSNR of 33–42 dB against the matching GIF frames.
- **Poster:** `tx10-random-scan-order-poster.webp` (87 KB) is the final frame, so reduced-motion visitors see the completed point cloud.

**Placement** (`a7b91de3`, migration `1787716900_transmit_v4_roi_animation.js`, guarded and reversible):
- **Position:** one visual between the intro and the five capability cards, using the visual layout built for `/lcm-chips` (shared LoopVideo: plays on screen, pauses off screen, reduced motion keeps the poster, labelled Play/Pause control below).
- **Size:** capped at 40rem (new opt-in `mediaMaxWidth`), about the printed half-width slot.
- **Component fix:** CardsTextCards now also renders a card grid under a visual (until now a visual only paired with a step list). `/lcm-chips` is unchanged (still one video, one step list, no card grid).
- **Header spacing:** this section takes the visual layout's tighter header: the heading's default margins are removed, giving 16px between heading and intro and 32px from intro to animation.

**Flood-illumination slot: still missing.** That animation is not supplied, and the ROI animation is **not** repeated in its place; the section shows the one supplied visual. T3 stays open for the flood animation, or for confirmation that the merged GIF covers both slots.

**Unchanged:** approved copy, the five cards, the accepted TX10-in-hand hero and its phone framing, and the closing CTA (72px phone padding, as before).

**Verification (local site, headless Chromium).**
- **Layout:** at 1440 / 1024 / 768 the video is 640×461 on the section's left edge; at 390 / 360 it is 358×258 / 328×236. Control 12px under it, cards 40px under the control, intro to video 32px, no overflow.
- **Playback:**
  - The MP4 decodes (readyState 4, 1280×922) and plays on screen: 1.64 → 3.15 s, looping.
  - "Pause animation" pauses it, and the pause holds through scrolling away and back; "Play animation" resumes it, and scrolling away pauses it again.
  - Reduced motion: it stays at 0 s on the poster, and the control reads "Play animation".
- **Screenshots:** `%TEMP%\lumotive-review\transmit-v4\` (`programmable-illumination-{1440,1024,768,390,360}.png`, `hero-390.png`).

### Wider-layout experiment: reverted (2026-10-22)

After the v4 pass, two wider layouts for the ROI animation were tried and then reverted at the client's request:
1. **Full-width white panel (`ff3641e`):** a panel as wide as the card row, with the animation centred in it (`mediaPanelHeight`, LoopVideo `panelHeight`, migration `1787717000`).
2. **Uncommitted preview:** the GIF recomposed, with the illustration and the scan side by side at equal height (`tx10-random-scan-order-wide.mp4`).

**Current state: as committed in `537e026`.**
- **Video:** the original MP4 (`tx10-random-scan-order.mp4`) and poster, unrecomposed.
- **Layout:** a compact, left-aligned column capped at 40rem (`mediaMaxWidth`).
- **Behaviour:** the shared Play/Pause control and reduced-motion behaviour.

**How it was reverted:**
- Migration `1787717000` was rolled back (`migrate down`), and its file was removed in the revert commit. The page record is byte-identical to its state after `1787716900`.
- The code is identical to `537e026`: LoopVideo has no `panelHeight`, and CardsTextCards uses `mediaMaxWidth` again.
- The preview files were deleted and never committed.

**Unchanged:** the Page 13 copy, cards, hero and CTA, and the Dev Kits fixes.

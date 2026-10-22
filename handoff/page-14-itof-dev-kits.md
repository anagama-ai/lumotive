# Page 14 — /dev-kits/itof

Approved content package rev. 2026-10-07, page 14 of 21, "Sense › Dev Kits
› iToF Dev Kits". First built against v2; **v3 pass applied 2026-10-21**.
Branch `feedback-20261007-v2`, local only.

**Status: v4 implemented and verified on the local site (2026-10-22).**
Hero (I1), "Better Data, Safer Robots" video (I4), LI140 and ON140 photos
(I7), the wide-field depth frame in both slots (I5) and the static
scan-modes graphic (I6) are in. Open: client confirmations listed under
"Open after v4" in the v4 pass below.

## v3 pass (2026-10-21)

**Copy.** The v2→v3 diff of page 14 is two words: "beam steering" →
"beamforming" in the hero body and the LI140 subline. Both were already live
from `1787710900`, as is the meta description. Every heading, card, tile,
caption, action and caveat matches v3 verbatim, in the printed order: hero,
Which iToF Kit Fits?, Better Data, Safer Robots, LI140 (opener, 8 tiles, four
features, wide-field depth, scanning modes, actions), ON140 (opener, 6 tiles,
three features, actions), M30 (opener, 8 tiles, See It on Your Bench, actions),
closing CTA. Standalone "steering" stays ("90° steering" on the M30
field-of-view tile).

**Simon's annotations, mapped by position:**

| # | Position | Content | Outcome |
| --- | --- | --- | --- |
| A1 | "Photo: M30 with kit contents" | IMG_7224 (PNG cut-out) | Already live as `m30-dev-kit-contents.jpg`; re-verified identical (correlation 0.99999). Unchanged. |
| A2 | "Compact M30 AMR demo clip" | Vimeo `1174547871/6e198e52ae` | **Embedded** in "See It on Your Bench", right-hand as printed. oEmbed: "Lumotive - AGV AMR", Lumotive, 57 s, 16:9 (the clip `/applications` already plays). |
| A3 | "Better Data, Safer Robots" | "Vimeo:" with no link | Nothing to embed. The approved comparison link (`vimeo.com/1053591397`) stays. Open as I4. |
| A4 | LI140 features / wide-field depth | "LI deck (ask Calvin)" | A lead, not a file. Warehouse point cloud still missing (I5). |
| A5 | Scan diagram | "LI deck page 2" | A lead, not a file. Diagram and five-tab selector still missing (I6). |

Not annotated: the hero kit family photo (I1), the LI140 sensor-head and
ON140 bench-top photos (I7), the clean point-cloud renders (I3). Nothing was
substituted. The Robotics and Dev Kits hub "text-only" decisions do not apply
here: each kit opener is its own section, so M30 keeps its photo and LI140 and
ON140 stay text-only only because no photo exists.

**Migration** `1787714100_itof_v3.js` sets `videoUrl` and
`mediaPosition: "right"` on `ac72039e`. No component or style changed.
Reverts exactly.

### v3 QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image; the
  player is exactly 16:9 at every width (600×338 at 1440, 358×201 at 390),
  beside the copy from 768 up and above it on phones, as the other split
  videos do.
- **In-page playback:** the embedded player loaded inside the page and played
  from a click (currentTime 3.7 s, readyState 4), full frame.
- **Anchors and redirect:** `#li140`, `#on140`, `#m30`, `#which-kit` and
  `#better-data` resolve. `/m30` answers **308** to `/dev-kits/itof#m30`, and
  in a browser lands with the M30 heading in view below the header.
- **Links:** `/dev-kits`, `/sense/robotics` and all four
  `/contact?inquiry=` targets (`itof-evaluation`, `li140-datasheet`,
  `on140-datasheet`, `m30-datasheet`) answer 200. Datasheets stay contact
  requests: no `download` attribute, no PDF link.
- **Compliance:** none of "beam steering", klux, temperature, Leopard,
  Sirius, 1550, FMCW, Tx-Rx, "A New Era", "Where M30 Fits", "Who M30 Is For",
  "A Mature Platform", availability, download, "Physical AI" in the rendered
  page.
- **Contrast:** automated scan of the light sections, zero failures. Hero text
  measured against the photo behind each text line (text hidden, 99th
  percentile of the background): eyebrow ≥ 9.86:1, headline ≥ 13.2:1, body
  7.29 / 6.87 / 8.49 / 7.28 / 9.80:1 at 390 / 430 / 768 / 1024 / 1440. No
  shade change needed.
- **Tap targets:** the only item under 44px is the 23px breadcrumb, the
  accepted condition on every Sense page.
- **Shared-component regression:** split-section videos elsewhere unchanged:
  `/sense` 21:9, `/connect`, `/dev-kits/dtof` and both `/applications` players
  16:9, no overflow.
- **Migration:** revert restored every page record byte-identically;
  re-apply changed only `itof`. `npm run check` 592 files, 0 errors,
  0 warnings; `npm run build` passed, dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\itof\`
  - `desktop-1440-01-hero` … `08-cta-footer`, `mobile-390-01-hero` … `08-cta-footer`;
  - `tablet-1024-07-bench`, `tablet-768-07-bench`.

### Refinement: transparent M30 photo (2026-10-21)

Problem: on phones the shared split layout shows a product photo at 75%
width, so the M30 JPG's white background read as a square white box on the
grey page field.

Migration `1787714200_itof_m30_cutout.js` on the M30 opener (`6e81d47c`)
only:

- **Image:** Simon's transparent original (IMG_7224, A1) saved as
  `m30-dev-kit-contents.webp`, 1200×805, 128 KB (the JPG was 236 KB). Same
  canvas and framing as the live JPG (aspect 1.491 vs 1.490; flattened on
  white it matches the JPG to a mean 4.8/255 per channel), so nothing moves
  and nothing is cropped. The JPG stays in the repo for the down path.
- **Panel:** new opt-in `mediaFrame: "panel"` on `SplitDefault` paints the
  art frame white (`--color-surface`) from 768px up, with the frame's existing
  16px radius. That is the desktop white panel, now drawn by the container
  instead of the image. Below 768px there is no panel: the product sits on
  the page field. Ignored when the section has a video. Exposed in the CMS
  editor as "Media frame".

| Width | Image box before | After | Panel |
| --- | --- | --- | --- |
| 1440 | 600×403 | 600×403 | white, 16px radius |
| 1024 | 457×307 | 457×307 | white |
| 768 | 337×226 | 337×226 | white |
| 430 | — | 298×200 | none |
| 390 | 268×180 | 268×180 | none |

Whole product visible at every width (`height: auto`, no `object-fit`
crop). No horizontal overflow. "See It on Your Bench" is unchanged (16:9
player, no panel). No other page renders the panel: `/dev-kits/dtof`,
`/platform`, `/sense`, `/culture` art frames stay transparent. Revert
restored every page record byte-identically; re-apply changed only `itof`.
`npm run check` 0 errors, 0 warnings; `npm run build` passed, dev server
stopped. Screenshots: `%TEMP%\lumotive-review\itof\m30-cutout\`
(`desktop-1440-`, `tablet-1024-`, `mobile-390-`, `mobile-430-` ×
`m30-section`, `see-it-on-your-bench`).

### Refinement: phone hero and M30 spacing (2026-10-21)

Migration `1787714300_itof_mobile_refinements.js`. Phones only (<768px);
tablet and desktop unchanged. The approved M30 image treatment (sizes and
desktop white panel) is untouched.

**Hero (`5a1c9f20`).**

- `compactMobile: "true"` (existing option, as on `/sense`): the band drops
  its viewport minimum and grows with the copy.
- New opt-in `mobileMediaScale: "1.2"` on `HeroFullHeight` enlarges the
  photograph about its centre so its white top and bottom margins (rows
  0–75 and 944–1008 of the 1008px source) fall outside the band. They were
  showing as light bands under the shade.
- The shorter band lifted the copy over the lens highlight: body text fell
  to 3.32:1 at 390. The existing strong mobile shade only reached 4.41:1, so
  instead new opt-in `mobileMediaPosition: "25%"` moves the frame left until
  the lens is clear of the copy, keeping the standard shade.

| 390 / 430 | Before | After |
| --- | --- | --- |
| Hero height | 574 / 634 | **441 / 441** |
| Space above eyebrow | 201 / 261 | **76 / 76** |
| Space below action | 64 / 64 | 56 / 56 |
| Top-edge luminance (right half) | 0.273 / 0.270 | **0.023 / 0.032** (median 0.019 / 0.021) |
| Body text, 99th pct / brightest px | 7.29 / 6.87 | **6.66 / 7.24** (brightest 6.14 / 5.92) |
| Headline | 16.66 / 16.43 | 14.31 / 15.38 |
| Eyebrow | 10.04 / 10.13 | 8.35 / 8.46 |

Contrast is measured against the photograph behind each text line with the
text hidden. Desktop 1440 is unchanged: hero 612px, 140px above the eyebrow,
the same framing (`translateX 288px, scale 1.04`), body 9.80:1.

**M30 description to spec tiles (`0f5ab938`).** New opt-in `compactMobile`
on spec tiles takes the grid's lead from 48px to 24px below 768px. The gap
from the last line of the M30 description to the first tile is now **64px**
(40px section padding + 24px) at 390 and 430, down from 88px. Desktop stays
160px. The LI140 and ON140 tile blocks keep 48px.

**Checks.** No horizontal overflow at 390, 430 or 1440. The M30 image is
still 268×180 at 390 and 600×403 on its white panel at 1440. Other phone
heroes are unchanged: `/sense` 473, `/sense/robotics` 593,
`/sense/automotive` 574, `/dev-kits/transmit-modules` 589, `/dev-kits/dtof`
574, none reframed. Revert restored every page record byte-identically;
re-apply changed only `itof`. `npm run check` 0 errors, 0 warnings;
`npm run build` passed, dev server stopped. Screenshots:
`%TEMP%\lumotive-review\itof\mobile-refine\`
(`before-mobile-390/430-hero`, `after-mobile-390/430-hero`,
`after-desktop-1440-hero`, `after-{mobile-390,mobile-430,desktop-1440}-m30-to-specs`).

### Blockers (after v3)

> Superseded by the v4 pass below: 1, 4, 5 and 6 are in; 2 and 3 are answered by the in-page video (confirmation pending); 7 is still open.

1. **Hero kit family photo** (I1) — not supplied; incumbent M30 photo stays.
2. **Clean point-cloud renders** for "Better Data, Safer Robots" (I3).
3. **Simon's "Vimeo:" note** on "Better Data, Safer Robots" (I4) — no link
   given; which video, if any beyond the approved comparison link?
4. **Warehouse shelving point cloud** (I5) — lead: "LI deck (ask Calvin)".
5. **Scan diagram + five-tab selector** (I6) — lead: "LI deck page 2". The
   selector is ours once the artwork arrives.
6. **LI140 sensor-head and ON140 bench-top photos** (I7).
7. **Secondary inquiry values** (I8 / S5(a)).

Resolved by v3: the compact M30 AMR demo clip (formerly blocker 6 below).

## v4 pass (2026-10-22): implemented and verified on the local site

v4 has no copy change on page 14. Inputs (PDF page 14, annotations by `wscgr` and Simon): `LI140-ON140-M30.png` at the hero, Vimeo [1053591397](https://vimeo.com/1053591397) on the comparison slide, `LI140.png` / `ON140.png` at the two kit openers, `High-Resolution-Depth-Across-a-Wide-Field.png` at the LI140 wide-field slot and the ON140 shared point-cloud slot, `lumotive-scan-modes-scaled.png` at Software-Defined Scanning. The M30 annotations (IMG_7224, Vimeo 1174547871) were already on the page and are unchanged.

**Migration** `1787717100_itof_v4_media.js`: guarded on the prior value of every touched key, reversible. It touches only media, framing and alt keys on seven sections. Copy, section order, anchors, inquiry links, the M30 opener and its panel, the M30 demo video and all earlier spacing refinements are unchanged (verified key by key: only the keys listed below differ).

| Section | Change | Asset |
| --- | --- | --- |
| Hero `5a1c9f20` (I1) | Three-kit cut-out laid whole on the right of a white 2880×1200 banner, composed and placed as the Dev Kits hero (same product box). `mediaAnchor: "100%"`, phones `mobileMediaPosition: "100%"` + `mobileShade: "max"`, tablets `tabletShade: "strong"`. The old photo's framing keys (`mediaScale`, `mediaShift`, `mobileMediaScale`, 25% phone position) are dropped. | `hero-itof-kits.webp`, 51 KB |
| Better Data, Safer Robots `d4e09a21` (I4) | Vimeo 1053591397 ("LCM-based iToF Sensor Performance Outdoors", Lumotive, 1:08, 16:9) plays in the page between the intro and the two cards, where the package prints the comparison slide (`videoLayout: "above"`). The approved "Watch the comparison" link stays. | — |
| LI140 opener `f27b6c40` (I7) | Photo right on the white panel, as the M30 opener. | `itof-li140-opener.webp` (the `/sense/robotics` cut-out on M30's 1200×805 opener canvas, not upscaled), 33 KB |
| High-Resolution Depth Across a Wide Field `31ae7d06` (I5) | Depth map + point cloud under the copy, 28rem (448px) tall from 768px, its own proportions, left-aligned; full width on phones. | `itof-wide-field-depth.webp`, 1480×899, 384 KB |
| Software-Defined Scanning `7f50b3ec` (I6) | Simon's strip (outer white margin trimmed, nothing else changed) across the container above the five mode cards. Below its 75rem readable width it scrolls sideways in its frame, keyboard-focusable, with "Scroll sideways to see all five modes." shown only while it overflows. | `itof-scan-modes.webp`, 2428×806, 75 KB |
| ON140 opener `2b6e85d1` (I7) | Photo right on the white panel. | `itof-on140-opener.webp`, 82 KB |
| ON140 features `5d92c6ba` (I5) | The same depth frame under the three feature cards and before "Plus everything…", as printed (`mediaPlacement: "afterGrid"`), 46rem wide (the same 448px height). | same file |

**Scan modes: what ships versus the printed design.** PDF page 14 prints a five-tab selector (Balanced, High rate, Max range, AMR, Object) with a top-down diagram whose wedge animates on tab change, plus per-mode text beside it (dev note: "Interactive mode selector… Mobile: swipeable tabs"). The supplied file is **one still image of all five modes side by side**, specs baked in. It is shown as that: one static figure, no tabs, no animation, no per-mode crops. The five mode cards under it keep the approved copy (figures, the AMR line, the range note). Differences inside the graphic, for Claudia/Lumotive:
- Mode names: "High frame rate", "AMR mode", "Object interaction" (copy: High rate, AMR, Object).
- Object: "Very short range, Not yet measured", max range "~5 m" (copy: "scenes within 5 m").
- AMR "10 m*" with the footnote "*Preliminary".
- Every mode lists "Max range 30 m", the strip's own footnote: "All modes scan 105° horizontally (±52.5°). Diagrams share one distance scale."

**Components** (opt-in; no other section sets them):
- `CardsTextCards`: `videoLayout: "above"` (player in the visual slot instead of the Robotics split); `mediaPlacement: "afterGrid"`; `mediaMinWidth` + `mediaHint` (full-width image with a readable minimum width; sideways scroll and hint only while it overflows). The plain image visual now keeps its own proportions (`h-auto`; no section used an image visual before).
- `SplitDefault` `mediaLayout: "below"`: a phone hint is now what opts the diagram into sideways scrolling (Automotive keeps it, unchanged); without a hint the image fits the phone width. With `mediaMaxHeight` the image keeps its proportions at that height, left-aligned.

**Verification (local site).**
- **Layout** (headless Chromium), no horizontal overflow and no broken image at any width:

  | Width | Hero | Video | Openers (LI140 = ON140 = M30) | Depth, LI140 / ON140 | Scan strip |
  | --- | --- | --- | --- | --- | --- |
  | 1440 | 612 | 1000×563 | 600×403 panel | 738×448 / 736×447 | 1280×425, no scroll, no hint |
  | 1024 | 612 | 976×549 | 457×307 | 738×448 / 736×447 | 1200 in a 976 frame, scrolls, hint |
  | 768 | 612 | 720×405 | 337×226 | 720×437 / 720×437 | 1200 in 720, scrolls, hint |
  | 390 | 441 | 358×201 | 268×180 (no panel) | 358×217 / 358×217 | 1200 in 358, scrolls, hint |
  | 360 | 441 | 328×185 | 246×165 | 328×199 / 328×199 | 1200 in 328, scrolls, hint |

  The compact phone hero stays 441px. ON140 order checked: cards, 40px, depth frame, 40px, "Plus everything…".
- **Hero readability** (brightest backdrop pixel under each text line, text hidden; a screenshot measure, not an accessibility sign-off). Without the tablet shade the body measured 3.73:1 at 768; with it:

  | Width | Eyebrow | Heading | Body |
  | --- | --- | --- | --- |
  | 1440 | 9.84 | 11.06 | 7.31 |
  | 1024 | 9.84 | 11.93 | 6.87 |
  | 768 | 9.84 | 16.52 | 6.23 |
  | 430 | 9.46 | 13.79 | 6.58 |
  | 390 | 9.36 | 12.46 | 6.92 |
  | 360 | 9.28 | 11.39 | 6.91 |

- **Playback, headed Edge:** clicking the Better Data player played it in the page (0 → 1.39 → 4.65 s, readyState 4, 960×540, 68.5 s), and a second click paused it. At 390 it played the same way (4.99 s). The M30 "See It on Your Bench" clip still plays (5.18 s). Headless Chromium shows only Vimeo's spinner (observed limitation, as on earlier pages).
- **Shared components unchanged:** `/sense/automotive` diagram 1280×628 at 1440, 720px scrolling with its hint at 390; `/sense/robotics` split player 600×338 beside the cards; `/lcm-chips` "How LCM fits" 1000×604 with its step list; `/dev-kits/transmit-modules` animation 640×461, left-aligned (the restored `537e026` layout).
- **Migration:** applied, reverted (every page record byte-identical), re-applied; only `itof` changes.
- **Screenshots:** `%TEMP%\lumotive-review\itof-v4\`: `hero-{1440,1024,768,430,390,360}`, `{better,li140-opener,depth-li140,scan-modes,on140-opener,depth-on140,m30-opener}-{1440,1024,768,390,360}`, `better-data-playing-edge-{1440,390}`.

**Open after v4** (client questions):
1. **I3 / I4:** the video now fills the comparison slot. Does it replace the clean flash/LCM/stereo renders (I3), and should the "Watch the comparison" link stay now that the video plays in the page?
2. **I6 / conflict 4:** confirm the static strip in place of the printed five-tab selector, and the naming and "Preliminary" / "Not yet measured" differences listed above.
3. **I5:** the same depth frame appears in both slots, as annotated; confirm or supply a second frame for ON140.
4. **I8 / S5(a):** secondary inquiry values (unchanged).

## What shipped in the v2 build (history)

Two reversible migrations.

### `1787710700_itof_dev_kits_page14.js`

"NEW · CATEGORY PAGE, REPLACES M30 PAGE". Like page 13 this is a move and a
rewrite: the `/m30` record is renamed to `/dev-kits/itof`, parented to the Dev
Kits hub, and its sections swapped for the page-14 set, so the page keeps its
id and version history. The down path restores all seven previous sections
**byte-identically**.

The page follows the package's category page frame — hero, quick guide, the
three kit sections in the lidar kit template, one category feature, closing
CTA. Each kit is a group of sections sharing one anchor: opener, spec tiles,
signature features, and its own action row.

| Anchor | Kit | Tiles | Actions |
| --- | --- | --- | --- |
| `#li140` | Long-Range, High-Resolution Integrated RGB-D Module | 8 | `li140-datasheet` + talk-to-us |
| `#on140` | Scanning iToF Evaluation Kit for onsemi AF0130 | 6 | `on140-datasheet` + talk-to-us |
| `#m30` | Embedded Long-Range iToF Module | 8 | `m30-datasheet` + talk-to-us |

Every figure is the package's character for character, including the qualifier
lines ("7 m at 10%", "up to 900 Hz in ROIs", "~13 W total with NXP compute").
Eight tiles maximum, no spec tables, per the page-03 component spec.

**Removed with the old M30 page**, as the page-14 dev note requires: the "A New
Era" subtitle, the stereo comparison table, the "Where M30 Fits" grid, "Who M30
Is For", "A Mature Platform", availability rows, operating temperature and the
klux figure.

**Inquiry values.** `li140-datasheet`, `on140-datasheet`, `m30-datasheet` on
the three datasheet actions; `itof-evaluation` on the hero and closing CTA.
That is the page-03 list for this page in full. The three secondary "Talk to us
about …" actions have no value of their own on that list, so they carry
`itof-evaluation`; **if Lumotive wants them tracked separately the list needs
three more values.**

**Navigation.** The Sense dropdown gains "iToF dev kits" under Dev kits, entry
2.4.2, beside the Transmit modules entry page 13 added. dToF Dev Kits is 2.4.3
and stays out until page 15 supplies its route.

### `1787710800_m30_to_itof_redirect.js`

`/m30` → `/dev-kits/itof#m30`, **308**, carrying the fragment the site map
spells out. Third of the five page-02 redirects.

### Rendering changes

- `titleCase` gains a lowercase-preserve list holding **onsemi**, which page 01
  spells lower case everywhere, headings included. Without it the heading set
  as "Onsemi".
- `ctaSplitLinks` gains `tone: "light"` for the stacked variant: the per-kit
  action rows drop the dark panel for the page field, so three kit CTAs plus
  the page CTA do not read as four closing CTAs. Colours are existing tokens —
  Optical Ink heading and pill, Slate Text body, **Deep Laser Blue** link (the
  lighter Laser Blue measured 4.15:1 at 16px, under the floor).
- `statsLightTraits` gains `columns: "4"`, pinning a six-tile block to two rows
  of four, which is how the package sets ON140; the count-derived default would
  put six across and wrap the values.

## QA

- **390 / 768 / 1024 / 1280 / 1440 / 1920:** no horizontal overflow, no broken
  image, **zero contrast failures**, every inner column on one edge.
- **Copy:** ten headings in the package's order; "onsemi" renders lower case;
  lidar never capitalised.
- **Compliance:** no "A New Era", "Where M30 Fits", "Who M30 Is For", "A Mature
  Platform", availability, operating temperature, klux, 1550 nm, FMCW, Tx-Rx,
  downloads, dates, "Physical AI", and **no Leopard or Sirius Max references**
  in the LI140 section, which the page-14 dev note requires.
- **Links:** `#li140`, `#on140`, `#m30` all resolve to real sections; `/m30`
  308s with its fragment; `/dev-kits`, `/sense/robotics` and all four
  `/contact?inquiry=` targets 200. The one external link is the approved
  comparison video, `vimeo.com/1053591397`, confirmed via oEmbed as Lumotive's
  "LCM-based iToF Sensor Performance Outdoors".
- **Tap targets:** one 23px item, the breadcrumb, the same accepted condition
  as `/sense/robotics`.
- **Migrations:** apply, revert, re-apply. The revert restores the seven
  previous sections byte-identically, clears the parent, and drops the menu
  child.
- `svelte-check` 589 files, 0 errors; production build clean. Pages 05 to 13
  all still answer 200 and the three earlier redirects still 308.

## Blockers

1. **Hero three-kit family photograph** (LI140, ON140 and M30 together). The
   page keeps the incumbent M30 kit photograph, a real Lumotive iToF asset
   already on this record. One `media` field when the family shot arrives.
2. **Clean flash / LCM / stereo point-cloud renders** for "Better Data, Safer
   Robots" — package page 04 lists them as a new asset, and the existing
   version carries the slide header, footer and confidentiality line the
   package tells us not to use.
3. **LI140 sensor head photograph** and **ON140 bench-top kit photograph** —
   neither exists in this repository.
4. **Warehouse shelving point cloud at high resolution**, shared by the LI140
   and ON140 sections.
5. **Top-down scan diagram and the interactive five-tab mode selector** for
   "Software-Defined Scanning". The mode data is approved copy, not imagery, so
   the five modes ship as a card each with the package's own figures and its
   range caveat; the diagram and the tab interaction follow when the artwork
   arrives.
6. **Compact M30 AMR demo clip.**
7. **Secondary inquiry values** — see above; an open question for Apurva.

## Review pass — 2026-10-13

`1787710900_itof_review_pass.js`, reversible, scoped to this page.

1. **Hero framing.** `mediaShift: "20%"` + `mediaScale: "1.16"` on the hero.
   The photograph's empty white right margin was sitting under the pale end of
   the gradient as a light blue block; it now falls outside the band and the
   module carries the right of the frame. Desktop only, below 1024px unchanged.
   The photograph itself is untouched and stays until the approved three-kit
   family shot arrives.
2. **ON140 spec tiles** pin `columns: "3"` — two even rows of three instead of
   the count-derived six across, which wrapped "140° × 105°" and "Windows PC".
   LI140 and M30 keep their four-across rows.
3. **Spacing.** "Better Data, Safer Robots" takes "sm" both sides: 160px → 120px
   above, 192px → 152px below. All three kit openers close on "none" above their
   spec tiles: 80px → 40px, so the tiles read as part of the kit block rather
   than a new section.
4. **Terminology.** "beam steering" → "beamforming" in the hero body, the LI140
   subline and the meta description. Standalone "steering" preserved — the M30
   field-of-view tile keeps "90° steering".

Component work: `heroBand` gains `mediaScale` beside `mediaShift` (the
opt-in class is now `framed`); `statsLightTraits` `columns` accepts `3`
as well as `4`.

QA at 390 / 768 / 1024 / 1440: no overflow, no broken image, zero contrast
failures, hero height unchanged at 612px, ON140 tiles step 1 → 2 → 3, hero
framing applies only from 1024 up. Page 13's hero is unaffected. Migration
round-trips. svelte-check 589 files 0 errors, build clean.

### Site-wide "beam steering" audit (resolved)

Done in `1787712600_beamforming_terminology.js` (QA phase 1), and v3 now
prints "beamforming" itself. The table below is the pre-audit record.

Claudia's rename was applied to page 14 only. "beam steering" still appears in
rendered copy on:

| Page | Occurrences |
| --- | --- |
| `/platform` | 3 |
| `/lcm-chips` | 5 |
| `/dev-kits/transmit-modules` | 2 |
| `/applications` | 1 |
| `/sense` | 1 |
| `/dev-kits` | 1 |

Thirteen in total. Each needs the same standalone-"steering" judgement call,
and the approved PDF still prints "beam steering", so the rename should be
confirmed as superseding the package before the site-wide pass.

### Refinement: tinted LI140 benefit cards (2026-10-22)

The four LI140 benefit cards under the spec tiles (`c60d2fb9`) now each carry a light wash of their own accent colour, so the row reads apart from the eight white spec tiles above it. Order: Software-defined modes blue, Built for bright light green, Wide 140° × 105° coverage amber, RGB-D blue.

**How**
- **Option:** new opt-in `cardTint: "accent"` on CardsTextCards. Each card's background is its accent mixed into the white card colour: 10% blue or green, 13% amber.
- **Migration:** `1787717200_itof_li140_benefit_tints.js`, guarded and reversible. Undoing it restored every page record exactly, and it is re-applied.
- **Scope:** only this section sets the option; no other card on the page is tinted.
- **Unchanged:** the spec tiles (white), the grid, spacing, card sizes, typography, accent lines, copy, and the ink headings and slate body text.

**Text contrast**, computed from the rendered colours:

| Card | Background | Heading | Body |
| --- | --- | --- | --- |
| Blue | #E6F2FA | 15.94:1 | 6.59:1 |
| Green | #E6F6EE | 16.29:1 | 6.74:1 |
| Amber | #FFF5E0 | 16.82:1 | 6.95:1 |

On white, the body text measured 7.54:1.

**Layout check:** card boxes match the untinted cards at every width (302×245 at 1440, 226×288 at 1024, 348×213 at 768, 358 wide at 390). No overflow.

**Screenshots:** `%TEMP%\lumotive-review\itof-benefit-tints\li140-specs-benefits-{1440,1024,768,390}.png`.

# Page 14 — /dev-kits/itof

Approved content package rev. 2026-10-07, page 14 of 21, "Sense › Dev Kits
› iToF Dev Kits". First built against v2; **v3 pass applied 2026-10-21**.
Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented and QA-verified.** Pending inputs: the hero kit
family photo, LI140 and ON140 photos, the point-cloud renders, the warehouse
point cloud and the scan diagrams (I1, I3, I5–I7), plus two confirmations
(I4, I8). See "Blockers (after v3)".

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

### Blockers (after v3)

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

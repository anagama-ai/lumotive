# Page 14 — /dev-kits/itof

Approved content package rev. 2026-10-07 (v2), page 14 of 21, "Sense › Dev Kits
› iToF Dev Kits". Branch `feedback-20261007-v2`.

**Status: implemented and QA-verified.**

## What shipped

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

### Owed: site-wide "beam steering" audit

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

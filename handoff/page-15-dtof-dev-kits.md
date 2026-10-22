# Page 15 — /dev-kits/dtof

Approved content package rev. 2026-10-07, page 15 of 21, "Sense › Dev Kits
› dToF Dev Kits". First built against v2; **v3 pass applied 2026-10-21**.
Branch `feedback-20261007-v2`, local only.

**Status: v4 implemented and verified on the local site (2026-10-22).** The
HDR demo (F5) plays in the page. Still held for Lumotive: the NM120 POWER and
INTERFACE tiles and "Modular by Design" (F2–F4), and the outdoor icons (F7).
See "Open after v4" in the v4 pass below.

## v3 pass (2026-10-21)

**Copy.** The v2→v3 text diff of page 15 is empty, and the orange "PENDING
INPUT FROM LUMOTIVE — LEAVE OUT UNTIL SUPPLIED" box is unchanged in v3, as
are both page-04 items (Stella-120 power figure; "sensor head outputs MIPI"
confirmation). So the POWER and INTERFACE tiles and all of "Modular by
Design" stay out; nothing `[X]`, no MIPI claim, no "<17 W". Every live
heading, tile, card, caption, action and the caveat matches v3 verbatim, in
the printed order.

**Simon's annotations, mapped by position:**

| # | Position | Content | Outcome |
| --- | --- | --- | --- |
| A1 | Hero "Banner: NM120 (not MD42, #161)" | IMG_0031, NM120 with heatsink, transparent PNG 1920×1955 | Not in the repo (best match 0.62). **Now the hero.** |
| A2 | "Photo: NM120 enclosed unit" | IMG_0032, transparent PNG 963×1017 | Already in the repo twice: `nm120-sensor.jpg` (live, white-backed) and `nm120-module.png` (transparent, unused, identical alpha). **Approved M30 treatment applied.** |
| A3 | HDR block | "Check with Elyar for new HDR demo" | A question, not an asset. HDR block stays copy-only (F5). |

MD180 has no annotation and the PDF prints no photo slot in its section, so
it stays eyebrow, heading, line, four tiles and one action. Simon's MD180
photo (page 12) is not assigned here and was not added.

**Migration** `1787714400_dtof_v3.js`:

- **Hero (`a7c0d613`).** `hero-nm120-heatsink.webp`, 2880×1200, 39 KB: the
  cut-out composed on white, device at 67% of the height, centred at 81.5% of
  the width. Proportions were solved so the device is whole and right of the
  headline at 1024–1920 and whole at 768. New opt-in `mediaAnchor: "100%"`
  on `HeroFullHeight` (horizontal object-position at every width) keeps the
  right edge in frame. Phones reuse the page-14 options:
  `mobileMediaScale: "1.8"` and `mobileMediaPosition: "94%"` fill the band
  with the device as a backdrop, so no white backdrop shows as a band.
- **NM120 opener (`d903b4f2`).** `nm120-sensor.webp`, the existing
  transparent original at the same 963×1017 canvas (64 KB), with
  `mediaFrame: "panel"`: white panel from 768px, none on phones.
- The old JPGs stay for the down path. Reverts exactly.

### v3 QA

- **Hero device, whole** (band px): 1920 `1312–1818 × 99–635` (headline ends
  1070) · 1440 `975–1362 × 101–511` (940) · 1280 `838–1206` (800) · 1024
  `627–957` (headline 644, body 600) · 768 `239–679 × 115–581`. Phones show
  the device filling the band behind the copy, by design.
- **Hero contrast** (text hidden, 99th percentile of the background /
  brightest pixel): body 7.77/6.83 (390), 7.75/7.12 (430), 8.84 (768), 5.95
  (1024), 7.11 (1280), 7.38 (1440), 8.04 (1920); headline ≥ 4.47 (large text,
  3:1); eyebrow ≥ 9.35. Before, on phones, the old hero's brightest pixel put
  the body at 3.57 and the headline at 3.77; top-edge luminance on phones
  drops from 0.165 to 0.025.
- **NM120 photo, whole, no crop:** 268×284 at 390, 298×315 at 430, 337×356
  at 768, 457×483 at 1024, 600×634 at 1440, 710×750 at 1920, aspect 0.947
  (canvas 0.947). White panel from 768px, transparent on phones. Same sizes
  as before the change.
- **Anchors and redirect:** all eight section anchors exist; `/nm120` →
  **308** `/dev-kits/dtof#nm120`, landing with the NM120 heading in view;
  `#md180` lands with its heading in view.
- **Actions:** `nm120-datasheet`, `nm120-embed`, `md180`, `dtof-evaluation`
  (hero and CTA) — all contact requests, all 200. No `download` attribute,
  no PDF link. `/dev-kits` and `/platform` 200.
- **Caveat:** present once, under the closing CTA "Take Solid-State dToF
  Outdoors", verbatim.
- **Compliance:** none of "beam steering", MD42, klux, temperature, 1550,
  FMCW, Tx-Rx, `[X]`, MIPI, availability, download, "Physical AI", "new era",
  "Modular by Design", Stella-120, "17 W" in the rendered page.
- **Tracking video** (`1102359216`): content matches the copy. The Vimeo
  thumbnail shows the basketball dribble at 90°/10 fps, 40°/22 fps and
  10°/80 fps. **In-page playback is unverified:** embedded, the player
  showed Vimeo's "We couldn't verify the security of your connection", and
  so did the direct player URL in the same session. The cause is not
  established. The page-14 clip played in-page earlier the same day.
- **Layout and contrast:** no horizontal overflow at 390, 430, 768, 1024,
  1280, 1440, 1920; no broken image; light-section contrast scan 64 elements,
  0 failures at 1440 and 390. Only tap target under 44px: the 23px
  breadcrumb (accepted condition). Section spacing unchanged from v2.
- **Regression:** heroes on `/dev-kits/itof` (still framed on desktop, 25%
  and 1.2 on phones), `/dev-kits/transmit-modules`, `/sense`,
  `/sense/robotics`, `/sense/automotive` and `/dev-kits` keep their crop and
  heights; none is anchored. The only other panel frame is the iToF M30.
- **Migration:** revert restored every page record byte-identically;
  re-apply changed only `dtof`. `npm run check` 592 files, 0 errors,
  0 warnings; `npm run build` passed, dev server stopped.
- **Screenshots** (outside the project): `%TEMP%\lumotive-review\dtof\`
  - `desktop-1440-01-hero` … `08-cta-footer`, `mobile-390-01-hero` … `08-cta-footer`;
  - `desktop-1920-01-hero`, `tablet-1024-01-hero`/`03-nm120`,
    `tablet-768-01-hero`/`03-nm120`, `mobile-430-01-hero`/`03-nm120`;
  - `before\` — the previous hero and NM120 photo at 1440 and 390.

### Refinement: spacing (2026-10-21)

Migration `1787714500_dtof_spacing.js`, this page only. Copy, colours,
imagery and video unchanged.

| Change | Setting | 390 before → after | 1440 before → after |
| --- | --- | --- | --- |
| Phone hero | `compactMobile` (existing); phone framing 94% → 100% | hero 574 → **413**, above eyebrow 229 → **76** (430: 634 → 413) | unchanged (612) |
| NM120 photo panel | new split `mediaMaxHeight: "25rem"` (from 768px, `object-fit: contain`) | unchanged (268×284) | panel 600×634 → **600×400**, product 379×400, whole |
| Before the NM120 photo | new split `compactMobile` (phone top padding 2.5rem) | 192 → **120** | unchanged (192) |
| Before MD180 | NM120 action row `md` → `sm` bottom; MD180 opener `lg` → `md` top | 192 → **120** | 192 → **120** |
| MD180 specs → action | specs `sm` → `none` bottom; action row `sm` → `compact` top (`CtaDefault` now accepts `compact`) | 128 → **56** | 128 → **72** |
| Outdoor cards | new `titleLines: "row"` (CSS subgrid from 768px) | unchanged | descriptions start on one line in every row |
| Closing CTA | `lg` → `md` | padding 112 → **80** (−29%), height 638 → 574 | 112 → **80**, 594 → 530 |

- **Outdoor cards:** with `row`, each card spans its own rows of the grid as
  a subgrid, so a title takes the height of the tallest title in its row
  and no more: all five descriptions align at 1920, 1440 and 1280 (five
  across); at 1024 (three, then two) each row aligns separately. Phones keep
  the stacked cards. Shared option, set only here.
- **Hero contrast after resizing** (text hidden, 99th percentile /
  brightest pixel): 390 body 6.83/5.49, eyebrow 9.30, headline 3.65 (large
  text, 3:1); 430 body 6.85/5.86, headline 4.43. Right-edge luminance on
  phones 0.035 (94% framing would have shown 0.164 of white). 768/1024/1440
  unchanged (body 8.84 / 5.95 / 7.38).
- **Caveat** unchanged: 13px, white at 75% on the dark panel, verbatim, under the CTA.
- **Checks:** no overflow at 390, 430, 768, 1024, 1280, 1440, 1920;
  light-section contrast scan 64 elements, 0 failures at 1440 and 390. None
  of the new options renders on `/dev-kits/itof`, `/dev-kits`,
  `/dev-kits/transmit-modules`, `/sense`, `/sense/robotics` or
  `/applications`. Revert restored every page record byte-identically;
  re-apply changed only `dtof`. `npm run check` 0 errors, 0 warnings;
  `npm run build` passed, dev server stopped.
- **Screenshots:** `%TEMP%\lumotive-review\dtof\spacing\`
  (`desktop-1440-01…07`, `mobile-390-01…07`, `tablet-1024-03-nm120`,
  `tablet-1024-04-outdoor-cards`).

### Blockers (after v3)

> Updated by the v4 pass below: 3 (HDR demo) is done; 4 is verified in Edge, with other browsers in S20. 1, 2 and 5 stay open.

1. **Stella-120 power figure (F2) + MIPI confirmation (F3)** — restore the
   POWER and INTERFACE tiles and "Modular by Design" (held copy below).
2. **NM120 internals photo (F4)** for "Modular by Design".
3. **HDR demo (F5)** — Simon: "Check with Elyar for new HDR demo". Whether
   the `/sense` "Lumotive HDR" clip (Vimeo 1235957120) also serves this page
   is Lumotive's call; not embedded here meanwhile.
4. **Tracking video in-page playback (F6 / S19)** — re-test in a normal
   browser on staging.
5. **Outdoor application icons (F7, Webvizio #160).**

Resolved by v3: the hero banner (#161, A1) and the NM120 enclosed-unit photo
treatment (A2). The site-wide "beam steering" audit (old blocker 6) was done
in `1787712600`.

## v4 pass (2026-10-22): implemented and verified on the local site

v4 has no copy change on page 15, and the orange "pending input" box is unchanged. Simon's annotations are:
- IMG_0031: the hero, already in place since v3.
- IMG_0032: the NM120 photo, already in place since v3.
- Vimeo [1235957120](https://vimeo.com/1235957120) on the "HDR demo: main pulse vs low-power pulse, colored by intensity" slot: **new, F5**.

**HDR Without Losing Frame Rate (`91e6c3a8`), F5.**
- **Video:** "Lumotive HDR" (Lumotive, 0:15). oEmbed gives 426×182, i.e. 21:9; the clip plays at 2520×1080. It is the same clip `/sense` plays, in the same shared split player.
- **Fields:** `videoUrl`, `videoAspect: "21 / 9"` (the frame keeps the clip's own proportions, so no letterboxing) and `mediaPosition: "right"`. The player sits right of the copy, as printed, in the same column as the Track Fast-Moving Objects player below it.
- **Migration:** `1787717300_dtof_v4_hdr_video.js`, guarded and reversible. It was applied, reverted (every page record byte-identical) and re-applied; only `dtof` changes.
- **Unchanged:** copy, the hero, the NM120 photo, cards, spacing and the CTAs. No component change.
- **Still withheld:** the NM120 POWER / INTERFACE tiles and "Modular by Design" (F2–F4).

**Layout (headless Chromium).** The player ratio is 2.333 at every width, and nothing overflows. Rendered headings, in the printed order: hero, Three Design Choices, Solid-State dToF Lidar Module, HDR, Track, 180°, closing CTA.

| Width | HDR player | Copy column | Tracking player |
| --- | --- | --- | --- |
| 1440 | 600×257, right (x 760) | 600 wide, left | 600×338, x 760 |
| 1024 | 457×196, right | 457 wide | 457×257 |
| 768 | 337×144, right | 337 wide | 337×190 |
| 390 | 358×153, above the copy | — | 358×201, above its copy |
| 360 | 328×141, above the copy | — | 328×185 |

On phones the player sits above its copy, as every split video on the site does.

**In-page playback (headed Edge).** All three players played inside the page iframe after one click, and a second click paused them:

| Player | Width | Playing | Source | Paused at |
| --- | --- | --- | --- | --- |
| HDR | 1440 | 2.90 → 5.40 s | 2520×1080, 14.9 s | 5.78 s |
| HDR | 390 | 3.28 → 5.79 s | 2520×1080 | 5.87 s |
| Tracking (F6) | 1440 | 1.25 → 3.75 s | 960×540, 30.1 s | 3.96 s |

The first desktop attempt reported no playback. The script had clicked the HDR player while Vimeo was still loading, then clicked stale coordinates. Re-measuring the iframe immediately before the click fixed it. Headless Chromium shows only Vimeo's spinner, as on earlier pages (an observed limitation; the cause is not verified).

**Screenshots:** `%TEMP%\lumotive-review\dtof-v4\`:
- `hdr-and-tracking-{1440,1024,768,390,360}.png`;
- `hdr-playing-edge-{1440,390}.png`.

**Open after v4** (client inputs):
1. **F2 + F3:** the Stella-120 power figure and the MIPI confirmation, which restore the POWER and INTERFACE tiles and "Modular by Design" (held copy below).
2. **F4:** the NM120 internals photo for "Modular by Design".
3. **F7:** the outdoor application icons (Webvizio #160), or approval of the accent-ruled text cards.
4. **Cross-browser checks (S20):** Safari, iOS and Android. F6's in-page playback is now verified in Edge.

## What shipped in the v2 build (history)

Two reversible migrations.

### `1787711200_dtof_dev_kits_page15.js`

"NEW · CATEGORY PAGE, REPLACES NM120 PAGE". Same shape as pages 13 and 14: the
`/nm120` record is renamed to `/dev-kits/dtof`, parented to the Dev Kits hub,
sections swapped for the page-15 set. The page keeps its id and version
history; the down path restores all seven previous sections **byte-identically**.

Thirteen sections in the package's order: hero · "Three Design Choices,
Decoupled" · NM120 at `#nm120` (opener, four spec tiles, four signature
features, HDR block, tracking video, outdoor application row, action pair) ·
MD180 at `#md180` (opener, four tiles, single action) · closing CTA with the
reference design caveat.

**Reused, not re-added.** The tracking video is the existing staging embed
`vimeo.com/1102359216`, which the package marks "Existing video"; it moves from
its own full-width section into the split that carries the approved heading and
copy beside it. The hero banner is the existing NM120 photograph — which is
what **Webvizio #161** asks for, the banner showing NM120 and not MD42 — and
the NM120 section takes the second existing NM120 photograph, so the two are
distinct.

**Inquiry values:** `nm120-datasheet`, `nm120-embed`, `md180`,
`dtof-evaluation` — the page-03 list for this page in full. No datasheet
download anywhere; the datasheet is a contact request, per the dev note.

**Terminology.** Page 15's approved copy uses neither "beam steering" nor
"beamforming", so no wording changed. "Beam width" and "scan angles" are
standalone terms and stay as printed.

**Navigation.** The Sense dropdown gains "dToF dev kits", entry 2.4.3,
completing the three Dev Kits children. Every menu destination now answers 200.

### `1787711300_nm120_to_dtof_redirect.js`

`/nm120` → `/dev-kits/dtof#nm120`, **308**, carrying the fragment the site map
spells out. Fourth of the five page-02 redirects; only `/products` remains, and
it has no page to replace.

### No shared-component changes

Everything reuses what pages 12 to 14 established: `heroBand` with its band
hero, `cardsTextCards` with `columns` and `casing: "exact"`, `splitDefault`
(including its `videoUrl` art column and its no-media single-column variant),
`statsLightTraits` on `specTiles`, and `ctaSplitLinks` stacked in both the
light per-kit tone and the dark page tone.

## Held back — pending input from Lumotive

Package page 15 prints an orange **pending input** box over the NM120 section,
and package page 04 lists both items: the **Stella-120 sensor head power
figure**, and confirmation that **"NM120 sensor head outputs MIPI" can be
stated publicly**. Three things therefore do not ship:

1. **The POWER tile.** Its value is `[X] W`, a bracketed placeholder, which
   page 01 says never to publish.
2. **The INTERFACE tile.** Its value and qualifier, "MIPI / sensor head; GigE
   with compute", are exactly the claim awaiting confirmation.
3. **"Modular by Design", in full.** Its heading, its introduction and its
   "Your compute" card all rest on the same claim, and approved copy cannot be
   reworded around it. Its photograph has not been supplied either.

The NM120 spec block therefore ships **four tiles rather than six**, which sets
as one even row. One confirmation plus one photograph restores everything. The
held copy, recorded here so nothing is lost:

> **Modular by Design** — Use NM120 as a complete lidar, or take it apart. The
> sensor head outputs MIPI, so you can pair it with your own compute and embed
> it directly in your platform or a custom enclosure.
> **Complete lidar** — Sensor head plus compute, GigE out.
> **Your compute** — Sensor head only, MIPI out.
> **Your enclosure** — Embed the internals in your platform.
> Caption: Built on Namuga's Stella-120, the same sensor head customers build
> into products.
> Image: NM120 internals without enclosure, sensor head and compute board shown
> separately (supplied by Lumotive).
>
> Spec tiles: **INTERFACE** MIPI — sensor head; GigE with compute ·
> **POWER** [X] W — sensor head; <17 W total with compute.

## QA (v2)

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, every inner column on one edge.
- **Copy:** seven headings in the package's order; the four NM120 tiles read
  "72 m / 32 m at 10%", "120° × 90°", "256 × 192", "30 Hz full frame / 900 Hz
  in ROIs"; the four MD180 tiles read "185° × 110°", "50 m", "30 Hz", "GigE /
  integrated compute".
- **Compliance:** no "beam steering", no MD42, no downloads, no klux, no
  operating temperature, no 1550 nm / FMCW / Tx-Rx, no dates, **no availability
  wording** (the MD180 dev note), no `[X]` placeholder, **no MIPI claim**, no
  "Physical AI", no "new era".
- **Links:** `#nm120` and `#md180` resolve to real sections; `/nm120` 308s with
  its fragment; `/dev-kits`, `/platform` and all four `/contact?inquiry=`
  targets 200. No external links in main.
- **Tap targets:** one 23px item, the breadcrumb — the accepted condition from
  `/sense/robotics`.
- **Migrations:** apply, revert, re-apply. The revert restores the seven
  previous sections byte-identically, clears the parent, drops the menu child
  and removes the redirect.
- `svelte-check` 589 files, 0 errors; production build clean. Pages 05 to 14
  all still answer 200 and the three earlier redirects still 308.

## Blockers (v2, superseded by "Blockers (after v3)" above)

1. **MIPI confirmation + Stella-120 power figure** — see above. Unblocks two
   spec tiles and the whole "Modular by Design" section.
2. **HDR demo visual** (main pulse against low-power pulse, coloured by
   intensity). Package page 04 lists it as a new asset shared with `/sense`, so
   the HDR block ships as its approved heading and copy only.
3. **NM120 internals photograph** (enclosure removed, head and compute board
   separate).
4. **Outdoor application icons**, Webvizio **#160**. The application row uses
   the same accent-ruled cards pages 13 and 14 use. **#160 stays open.**
5. **Vimeo playback** for `1102359216` needs a check in a normal browser; the
   headless session got Vimeo's security screen. Cause not established.
6. **Site-wide "beam steering" audit** — done in `1787712600`.

# Final QA handoff: Lumotive site, pages 05–21

Updated 2026-10-26. For **Josh** (repository, staging, deployment) and **Claudia** (content and client sign-off).

This page is the current short handoff. The full content/input list is `v3-outstanding-items.md`. The 2026-10-22 review in `v4-final-review.md` is historical; the release verification below supersedes its branch, PR and migration counts.

## State

- **Branch:** `feedback-20261007-v2`, prepared for a single PR targeting `main`. This preparation does not merge or deploy; use the PR for the final pushed SHA and review state.
- **Baseline:** fetched `origin/main` at `784b88501f617edd785f0f8ee03e8dcee9a00b75`. Home PR #1 merged on 2026-10-25. Integrated that main commit into this feature branch, retaining the reviewed v4 Home components and `1787707500` rollback fix. Duplicate CSS/schema additions from the automatic merge were removed.
- **Included:** Pages 05–21 follow-ups, approved Privacy Policy, Platform/LCM Chips/Partners/Culture mobile refinements, and the remaining About portrait component plus migration `1787717800`.
- **Excluded:** the existing `vite.config.ts` Windows watcher change remains uncommitted and byte-for-byte preserved. No database, environment/credential file, screenshot, log, temporary file or local review artifact is included.
- **Final local checks:** `npm run check`: **595 files, 0 errors, 0 warnings**; `npm run build`: **exit 0**, adapter-node.

### Release smoke and migration inventory — 2026-10-26

- Tested the production build against the existing local PocketBase, without running migrations or resetting data. **130 published routes** (17 CMS pages, News, 112 posts) plus `/lcm-explorer/index.html`, each at **1440 and 390px**: 262 browser views, successful 200/304 responses.
- Three legacy News bodies contained unbroken URL text that overflowed at 390px by 308, 75 and 193px. Added only `overflow-wrap: break-word` to the existing shared prose rule. All three now measure **0px overflow at both widths**; Privacy Policy, LCM Chips and About also rechecked at both widths. About's 13 mobile portraits measure 320px high; desktop keeps its existing aspect-ratio frames.
- `/privacy-policy` and `/lcm-chips`: uncached **200** at both widths. Clicked the Contact footer Privacy Policy link at both widths: same-tab navigation to `/privacy-policy`. `/lm10`: **308 → `/lcm-chips`**.
- Checked **215 unique internal-link/media/support endpoints**: 214 return 200; the only missing local media is the already documented client-held Explorer fallback, `/lcm-explorer/media/lcm-animation.mp4` (404). WebGL Explorer remains available; the no-WebGL fallback is not complete. No new broken internal navigation links found. Do not describe this as an all-media pass.
- All **234 literal local asset references in migrations** exist and are tracked. All 159 supplied rendered local assets are tracked; the separate unsupplied Explorer fallback is the exception above. Outgoing path/secret scan found no accidental files or credential signatures.
- **204 total migration files; 105 on current main; 99 new pending filenames**, from `1787707400` through `1787717800`. No duplicate numeric prefixes. The gap at `1787717000` is harmless. `1787707400_platform_page6.js` predates main's latest Home filename (`1787707900`) but PocketBase 0.39.11 checks each filename in its applied ledger, not a maximum timestamp; do not omit or renumber it. The featured-post schema migration is already on main. Actual staging pending count depends on its ledger.
- Existing migration rehearsal evidence is retained, **not rerun or claimed current**. The latest migration fields were checked against local content read-only. A fresh staging-backup rehearsal of this exact release is still required.
- **CI configuration:** only `publish.yml`, triggered by pushes to `main` or explicit dispatch; no feature-branch/PR check workflow. Zero PR checks is **not** a CI pass. Do not dispatch the publish workflow for this review.
- Existing PDF/content, contrast and video QA was reused, not repeated. Chromium viewport smoke is not Safari/iOS/Android certification. Screenshots remained outside the repository.

### Exact post-deployment verification routes

At desktop and mobile widths, visit `/`, `/platform`, `/lcm-chips`, `/applications`,
`/sense`, `/sense/robotics`, `/sense/automotive`, `/dev-kits`,
`/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof`, `/connect`,
`/about`, `/culture`, `/partners`, `/news`, `/contact`, `/privacy-policy`,
and `/lcm-explorer/index.html`. Check `/lm10` → `/lcm-chips`,
`/products` → `/dev-kits`, `/tx10` → `/dev-kits/transmit-modules`,
`/m30` → `/dev-kits/itof`, `/nm120` → `/dev-kits/dtof`; verify
`/sitemap.xml`, `/robots.txt`, `/rss.xml` and the published `/posts/<slug>`
destinations listed in the sitemap.

Recheck the repaired mobile articles:
- `/posts/multicoreware-and-lumotive-announce-collaboration-designed-to-advance-3d-sensing-and-lidar-technology`
- `/posts/lumotive-closes-strategic-funding-round-led-by-samsung-ventures`
- `/posts/lumotive-yole-developpement-and-lidar-news-to-host-lidar-one-size-does-not-fit-all-webinar-january-21-2021`

Click the footer policy link, open/close mobile navigation, inspect portraits/logos,
play the existing embeds, and check local media and page-width overflow.
Do not submit the contact form until its one agreed staging test is authorized.

## Mobile spacing follow-up: Sense gaps and Platform in normal flow (2026-10-27)

Branch `fix/mobile-spacing-followup`, cut from `main` at `cb03234` (PR #4
merged). Migration `1787718300_mobile_spacing_followup.js` changes only the
fields listed below, each guarded on its prior value; down restores them.

**/sense, phones only.** Two `md` paddings (80 + 80) stacked at three
transitions. The two edges that meet there take `md-compact-phone` (2.5rem a
side below 768px, outer margins dropped; `md` from 768px up):

| Transition | Edges changed | 360–430 before → after | 768 / 1440 |
|---|---|---:|---:|
| Poor Adaptability card → "The Answer" | `9d8fe777` bottom, `bb989678` top | 172 → 80 | 172, unchanged |
| "The result: …less downtime." → "Sensing for Robots and Vehicles" | `bb989678` bottom, `a1d7c40e` top | 189 → 80 | 189, unchanged |
| Smart Infrastructure & Surveillance card (traffic and parking) → "Start Building" | `2a6b5ed9` bottom, `c83f1b77` top | 172 → 80 | 172, unchanged |

Gaps are from the last painted card or line to the next eyebrow. The other
Sense transitions are unchanged (108 / 156 / 148 / 90 at 390).

**/platform, PeelScene removed** from "Groundbreaking Physics Meets Mature
Manufacturing" (`ace8d391`, `CardsPeelSwap`) and "Light Control
Metasurface™ Optical Beamforming Technology" (`fbe8b045`, `SplitPeelBleed`).
- **Cause:** from 768px up the scenes pinned a `100dvh` sticky panel, lifted
  the band over the swap by a negative margin equal to the measured panel
  height, and tweened the swap's content down by that same height. Those px
  values are measured once; on touch devices ScrollTrigger ignores
  height-only resizes, so when the browser bars collapse the `dvh` panel
  grows while the margin and tween keep the old height. Reproduced on
  staging with iPad emulation (768 wide, 954 → 1024 tall): margin stayed
  −954px against a 1024px panel, and the swap's headings sat at y = 4–47px,
  under the header. Below 768px the scenes were not sticky, but each
  pinned scene also left ~0.9 viewport of empty runway at 768px.
- **Change:** both render in normal flow with the shared `Reveal`. The
  heading reveals first, then the cards and the media staggered. The two
  swap cards no longer share one cell, so both stay readable, beside the
  video from 768px up. The band keeps its image, shade, copy, and `80svh`
  (desktop) / `100svh` (phone) height; it now sets `position: relative`
  itself, which the panel used to supply. `Sections.svelte` keeps only
  `statsPeelScene` as a peel type. `PeelScene` itself is unchanged.
- **Spacing:** both records go from `none`/`none` to `md-compact-phone` on
  each side, which is the panel's 5rem from 768px up.
  - Hero → heading: 130px at 1440, 111px at 768, 40px on phones (was 48).
  - Media → band: 40px on phones (was 32), 80px from 768px up.
  - The band's heading is now 40px from its top edge at 360 and 375 (was
    flush, 0px).
  - Card, media, heading and band sizes are identical at all six widths.

**Home, phones only: "All news" → "When Light Becomes Programmable".**
The 117px gap (123px to the heading's visible top) at 360–430 was the News
section's 80px bottom padding plus the heading's own 36.5px top margin; the
bento's top padding is already `none`, and the reveals add only their
temporary 28px rise. Migration `1787718400` sets News (`e7b40d12`)
`spacingBottom` `md` → `md-compact-phone`. It is guarded on News `md` and
the bento's top `none`, and rollback goes back to `md`. The gap is now 77px
(83px visible), and 768 and 1440 are identical to before (120 / 153px).
`PostsFeatured.svelte` had whitelisted its spacing values and was silently
turning `md-compact-phone` back into `md`; the token is now on its list.
Second pass, migration `1787718500`: 77px still read as ~90px, because "All
news" is a 44px touch target whose text sits 10px above its box. Both sides
now take the existing phone-only `xs` override (1.5rem, outer margins
dropped): News `phoneSpacingBottom` and bento `phoneSpacingTop`, each added
only while absent and removed only while `xs`. The phone gap is 48px
(54–55px to the heading's visible top). 768 and 1440 are identical to the
original. `PostsFeatured.svelte` and `CardsPeelBento.svelte` now emit
`data-phone-bottom` / `data-phone-top`, as the card sections already do.

**Verified** on a copy of the local database at 360×800, 375×812, 390×844,
430×932, 768×1024 and 1440×900:
- **Migrations:** up, down and re-up all work. Down restores both pages
  exactly, and only the ten listed fields change.
- **Layout:** no sticky element or peel scene on either page, no horizontal
  overflow, and section seams stay at 0px.
- **Scrolling:** slow, fast and reverse wheel scrolling keep every heading
  at a fixed offset apart from Reveal's 28px rise, and all headings end
  revealed.
- **Toolbar resize:** simulated on touch at 768, 390 and 430, it leaves the
  seams at 0px and the bleed image fitted to its band.
- **Reduced motion:** everything shows at full opacity with no transforms.
- **Builds:** `git diff --check`, `npm run check` (0/0) and `npm run build`
  pass.

Screenshots are in `%TEMP%\lumotive-review\mobile-spacing-followup\`.

## Home hotfix: News spacing and One Chip in normal flow (2026-10-27)

Branch `fix/home-flow-spacing-hotfix`, cut from `main` at `8a4b1eb` (PR #3).

**Gap after "Latest From Lumotive".** The News section's 5rem bottom padding
and the bento's 5rem top padding (from `1787717900`, already run on staging)
stacked: "All news" → "When Light Becomes Programmable" heading measured
233px at 1440. New migration `1787718100` sets the bento's `spacingTop`
`md` → `none` only when the record is `md`/`md`; rollback sets `md` again only
from `none`/`md`. The bottom stays `md`; `1787717900` is untouched.

| Width | Before | After |
|---|---:|---:|
| 1920, 1907, 1440 | 233 | 153 |
| 1366 | 230 | 150 |
| 1024 | 213 | 133 |
| 768 | 200 | 120 |
| 430, 390 | 197 | 117 |

The remaining gap above the heading's own top margin is the News padding
alone, in line with the 160px from "See all applications" to the
investor-band label (unchanged at every width).

**"One Chip. Boundless Applications."** (`a20efeab`, `CardsPeelScene.svelte`)
no longer uses `PeelScene`, so there is no sticky panel, negative margin,
cover lift or scroll runway.
- **Clipping:** the staging clipping did not reproduce in local Chromium.
  Slow, fast and reverse wheel scrolling kept the heading a constant 130px
  below the hero's edge at 1440. The fix removes the mechanism (the panel
  riding under the z-50 hero) rather than tuning it.
- **Reveal:** the section uses the shared `Reveal` like "Latest From
  Lumotive": the heading first, then the two cards staggered. Each card sits
  in a wrapper, so its 4px hover lift survives the reveal.
- **Spacing:** migration `1787718200` sets `spacingTop` `none` →
  `md-compact-phone` (guarded both ways). That is the 5rem the old panel
  supplied from 768px up, and 2.5rem on phones. The bottom stays `none`.
  - Hero edge → heading: 130px from 1366 up (same as before), 111 at 768
    (was 110), 121 at 1024 (was 95 in the peel's settled frame), 40 on phones
    (was 28).
  - Card sizes, heading → cards (68px) and cards → News (92px) are unchanged
    at all eight widths.
- **Shared code:** `Sections.svelte` drops `cardsPeelScene` from the peel
  types. `PeelScene` itself is unchanged; its `revealFollow` and `stage`
  options now have no users. The two Platform scenes are untouched.

**Verified** on a copy of the local database (PocketBase 8091, dev server
5174) at 1920×1080, 1907×985, 1440×900, 1366×768, 1024×768, 768×1024, 430×932
and 390×844:
- **Migrations:** apply, roll back and re-apply all work. The rollback
  restores the Home record exactly, and no other page changes.
- **Layout:** no sticky element or peel scene left on Home, and no horizontal
  overflow.
- **Scrolling:** forward and reverse wheel scrolling keep the heading at a
  fixed distance below the hero, apart from the reveal's own 28px rise.
- **Interaction:** News, One Chip and bento reveals play. Tab reaches the
  One Chip cards with a visible 3px ring.
- **Reduced motion:** everything shows immediately.
- **Builds:** `git diff --check`, `npm run check` (0/0) and `npm run build`
  pass.

Screenshots are in `%TEMP%\lumotive-review\home-flow-spacing-hotfix\`.

## Footer LinkedIn and Privacy Policy heading gap (2026-10-27)

**LinkedIn (S1, footer resolved).** The supplied URL is
`https://www.linkedin.com/company/lumotive/home/`. Migration
`1787718000_footer_linkedin` appends
`{ platform: 'LinkedIn', url, label: 'Lumotive on LinkedIn' }` to
`globals.footer.socialLinks`. That is the row editors see under Admin → Site
settings → Footer → Social links.
- **Migration safety:** forward skips if a LinkedIn row already exists.
  Rollback removes only this row, and drops the key if the list empties.
  Applied, rolled back and re-applied locally: the record returns to its
  original shape.
- **Footer component (revised to match the v4 PDF):** the icon now sits in
  the bottom legal row, immediately before the copyright line, not under the
  logo. It is a 16px mark inside a 44×44px target, labelled "Lumotive on
  LinkedIn" (`aria-label`), with `target="_blank" rel="noopener noreferrer"`.
  - **Row height:** negative margins let the target overlap the row's
    padding, so the legal row keeps its height (64px on desktop, 122px when
    stacked at 640px and below).
  - **Alignment:** the glyph lines up with the container edge, 8px before the
    copyright text.
  - **Focus ring:** amber, drawn just inside the target, so it is never
    clipped at a phone's edge.
  - **Layout:** icon, copyright and Privacy Policy share one row from 641px
    up. Below that the row stacks as before. Logo, columns, colours and type
    are unchanged.
  - **Verified at 1440, 1024, 768, 430 and 390:** no horizontal overflow.
- **Other social data:** `globals.seo.socialChannels` and the site-meta
  "Social accounts" exist but no public component reads them (S30), so they
  were left empty.
- **Follow lines:** the "Follow Lumotive on LinkedIn" lines (About AB4,
  Culture CU2, Contact CT3, News N6) are not in any page record, so nothing
  else switched on.
- **Verified:**
  - the icon on all 19 routes, including a post: correct URL, `_blank`,
    `rel="noreferrer noopener"`, 44×44 target, amber 3px ring;
  - the icon glyph aligns with the logo, at 80px from the left at 1440 and
    16px at 390;
  - no horizontal overflow.

  With the icon out of the brand column, the footer is back to its
  pre-LinkedIn height at every width. Screenshots for the move are in
  `%TEMP%\lumotive-review\footer-linkedin-legal-row\`.

**Privacy Policy numbered headings.** The ten `h2`s carried "N." plus five
no-break spaces (one for "10.") from the source document. That left a 58px
gap at 1440 (41px on phones), and only 14–19px for 10.
- **Change:** for `layout: legal` only, `Prose.svelte` now puts the number
  (and any empty anchor targets) in a `.legal-num` span and the title in a
  `.legal-title` span. The whitespace run becomes one space, so the text reads
  "1. Introduction." The heading is a two-column grid:
  - a 2.25ch number column, sized for "10." and right-aligned so every gap is
    equal;
  - a 1rem gap below 768px and 1.25rem from 768px up (spacing tokens 4 and 5).
- **Kept:** the stored legal text is unchanged, as are the anchors
  (`_toc*`, `Contact`, `_Non-US_Privacy_Notice`), the heading margins, the
  gaps from heading to body (16px, or 32px before an `h3`), the font size and
  the line height.
- **Verified at 1920, 1440, 1024, 768, 430 and 390:** every gap measures
  20/20/20/20/16/16px. Every title starts at the same x, with wrapped lines
  aligned, and "10." fits. No horizontal overflow.
- **Wrapping:** heading 2 wraps one line fewer at 1024 and one line more at
  390, because the title column is narrower than the old inline run there.

**Builds:** `npm run check` and `npm run build` pass.

Screenshots are in `%TEMP%\lumotive-review\linkedin-policy-gap\`:
- `before-|after-footer-{1440,390}`, plus `after-footer-*-focus`;
- `before-|after-policy-h2-{1,2,10}-{1440,768,390}`.

## PeelScene removal, remaining pages (2026-10-27)

**Inventory.** Live `PeelScene` consumers, read from local PocketBase across
all 17 pages:

| Route | Section (id) | Type | Status |
|---|---|---|---|
| `/culture` | "In Their Words" (`b4a91c73`) | `testimonialsPeelScene` | **Converted** to flow |
| `/platform` | "Groundbreaking Physics Meets Mature Manufacturing" (`ace8d391`) | `cardsPeelSwap` | Held: ambiguous |
| `/platform` | "Light Control Metasurface™ Optical Beamforming Technology" (`fbe8b045`) | `splitPeelBleed` | Held: ambiguous |
| `/` | "One Chip. Boundless Applications." (`a20efeab`) | `cardsPeelScene` | Held: ambiguous; Home is protected |

`statsPeelScene` exists in code but no page uses it.

**Culture "In Their Words".** The section is now in normal document flow.
- **Removed:** the sticky panel, the JS-sized 90dvh runway, the scrubbed
  word-by-word tint of the quote and the scrubbed avatar/caption rise.
- **Reveals:** two one-time shared `Reveal`s, as on "Latest From Lumotive":
  the heading, then the carousel. There is no intro or action, and slides sit
  side by side, so there is no stagger.
- **Unchanged:** the arrows (outside the reveal), the phone height fit and the
  48dvh centring stage, which is part of the approved composition.
- **Spacing:** the record's own `md`/`md` already supplies the section
  spacing, so no migration is needed. Inside the section everything measures
  the same at all seven viewports: section top to heading 108–130px,
  heading to quote and caption to "Open Roles" ±1px, and section height
  identical. The earlier 2026-10-26 `stage={false}` correction is kept by
  construction, since there is no panel any more.
- **Page height:** the page is 700–1050px shorter at 768px and up, because the
  runway is gone. Phones are unchanged.

`Sections.svelte` now gives a following scene band only to the types still
inside `PeelScene` (an explicit list), rather than to any type ending in
`PeelScene`.

**Held, needs a decision.**
- **Platform swap:** its four cards share one grid cell and crossfade as the
  panel scrolls. There is no single approved static frame. The options are:
  - the reduced-motion stack (all cards in one column, then the media);
  - the last card beside the media;
  - a new layout.
- **Platform bleed:** it is uncovered from beneath the swap, which is its
  cover. Its compact 80svh band is still listed above under "Needs visual
  approval". In flow it would show at 80svh, not the full viewport.
- **Home "One Chip":** it rides the hero's moving edge, the hero being its
  peel cover. It was excluded from the earlier Home work, and this brief lists
  it as a regression check.

**Verified.**
- **Culture, at 1920×1080, 1907×985, 1440×900, 1366×768, 1024×768, 768×1024
  and 390×844:** no `[data-peel-scene]`, pin spacer or sticky element, and no
  horizontal overflow. Reload restores the position. The arrows keep a
  visible 3px focus ring and the carousel still slides. The logo link and
  back work. Under reduced motion everything shows at once.
- **Home and Platform:** Home sections measure identical to `84ca1ad`
  ("One Chip" wrapper unchanged). Platform's two scenes are untouched.
- **Builds and detector:** `npm run check` and `npm run build` pass. The
  Impeccable detector's only finding is an advisory on the existing,
  unchanged quote `font-size` clamp.

Screenshots are in `%TEMP%\lumotive-review\peel-removal\`.

## Home "When Light Becomes Programmable": flow section like the News (2026-10-27)

The Home bento (`cardsPeelBento`, id `677cf547`, the only record of that type)
is now an ordinary flow section. It reveals the same way "Latest From
Lumotive" (`PostsFeatured`, id `e7b40d12`) does. An earlier same-day revision
used a dedicated GSAP ScrollTrigger pin. It still read too much like the peel
progression it replaced, and has been removed in full: no pin, no scrub, no
715px runway, no sticky panel or pin spacer, and no scroll-restoration hold.

**Behaviour.** The section uses the shared `Reveal` component with the
News section's values. Each element plays a one-time reveal at `top 85%`:
28px rise, 0 → 1 opacity, 0.9s `power3.out`.
- The heading block (heading and intro) reveals on its own.
- The card grid reveals as one staggered list, 0.09s apart, so all four cards
  arrive together in the four-column row on desktop.
- "See all applications" follows with the 0.12s delay.

Reduced motion renders everything at once (`Reveal` sets the rest state).

**Spacing.** Migration `1787717900_home_applications_flow_spacing` moves the
section's spacing from `none`/`none` to the News section's `md`/`md`. That is
the shared 5rem `.lumo-inner` padding, top and bottom, at every width. The
none/none setting only made sense inside the peel panel, which supplied the
5rem above the heading from 768px up. The migration is guarded both ways:
forward only from none/none, back only from md/md.

**Seams.** The news link to the heading is 80 + 80px, then the h2's own
margin. "See all applications" to the investor band's label is likewise
80 + 80px. No `min-height` is involved anywhere, so `a8fcd60`'s
content-height correction holds.

**Investor band.** `Sections.svelte` no longer treats `PeelBento` as a peel
type. The investor logo band (`logosSceneBand`) after it therefore renders as
its own section, through the same `LogosSceneBand` component. Its heading now
reveals with its own `Reveal`, like any flow band.

**Unchanged.** Card markup, images, overlays, copy, link and grid are
unchanged. The heading-to-grid gap (166px at 1920), card sizes and positions
match the approved frame. Each card sits in a wrapper div that is the grid
item and takes `Reveal`'s inline GSAP styles. The card inside fills it and
keeps its 4px hover lift and shadow, which the reveal used to cancel (the
News cards still have that limitation). Verified at 1440, 1024, 768 and 390:
identical card geometry, 4px lift on hover, no inline styles on the card.

**Untouched.** `PeelScene`, "One Chip" (z-index 40, −1080px lift, 1825px
wrapper at 1920×1080) and the News section are untouched.

**Verified** on the dev server, local PocketBase (migration applied) and
Chromium:
- **Viewports:** 1920×1080, 1907×985, 1440×900, 1366×768, 1024×768, 768×1024
  and 390×844.
- **Grid:** four cards in one row from 1024px, 2×2 at 768, stacked at 390.
- **Layout:** padding 80/80. No pin spacer, and no sticky element other than
  One Chip's own panel from 768px. Horizontal overflow is 0, and the band
  follows with no gap.
- **News section:** pixel-identical before and after at all seven widths
  (element screenshots, header hidden, all reveals settled). Its position on
  the page is identical.
- **Reload:** returns to the same position.
- **Navigation:** the action link → `/applications` → back, and the logo
  link, both work. Back lands about 110px from the saved position; this is
  the existing SvelteKit/Lenis behaviour noted in earlier QA.
- **Reduced motion:** opacity 1, identity transforms.
- **Builds:** `npm run check` and `npm run build` passed.

Screenshots are in `%TEMP%\lumotive-review\home-bento-news-flow\`:
- `before-|after-{1920x1080,1440x900,390x844}-{approach,settled}`;
- `before-|after-news-*` for the News comparison.

## Home "One Chip. Boundless Applications." spacing (2026-10-26)

Staging showed a large empty area under the two cards at about 1907×985.

**Cause.** `PeelScene`'s sticky panel had `min-height: 100dvh` from 768px up.
This scene rides the hero's lower edge (`revealFollow`), so it has no
pinned beat runway of its own. The extra height therefore became empty space
under the 665px content. Its `min-h-full justify-center` classes had no effect,
so all the spare height went below the cards. There are no ScrollTrigger pin
spacers (`.pin-spacer` count 0); the scene's JS-sized wrapper already reserved
no runway (`0dvh`). The hero's lift only matched the panel height.

**Fix.** `PeelScene` adds `.fit` only when a `revealFollow` scene actually has
a cover above it. The class drops the full-viewport minimum and clips only
horizontally, so content rising from below the panel is not cut off during
the reveal. The Home bento uses `revealFollow` but has no cover. It keeps its
full-viewport panel and 90dvh beat runway; its metrics are unchanged at every
width. Copy, images, links, card sizes, mobile layout and surrounding sections
are unchanged.

Settled frame after the hero clears (header bottom 73px; heading top 127–128px in both builds):

| Viewport | Panel before → after | Empty panel under cards | Cards → next content, one wheel notch later |
|---|---:|---:|---:|
| 1920×1080 | 1080 → 745 | 335 → 0 | 437 → 92 |
| 1907×985 | 985 → 745 | 240 → 0 | 342 → 92 |
| 1440×900 | 900 → 718 | 182 → 0 | 284 → 92 |
| 1366×768 | 768 → 717 | 51 → 0 | 153 → 153* |

The 92px is the next section's standard 80px top padding plus 12px of eyebrow
line box. In the exact settled frame, "Latest from Lumotive" can still be
hidden: its existing `Reveal` starts at `top 85%`. *At 1366×768, that threshold
needs one more wheel notch.

Mid-reveal geometry is identical before and after: the heading stays 130px
under the hero's moving edge, and content below the shorter panel is not
clipped. Reduced motion uses a 718px static panel with no empty space under the
cards. Horizontal overflow is 0 at 390, 768, 1024, 1366, 1440, 1907 and 1920.
Phones (below 768px) are unchanged. `npm run check`: 595 files, 0 errors,
0 warnings; `npm run build`: passed. Screenshots:
`%TEMP%\lumotive-review\home-one-chip-spacing\`.

**GSAP ScrollTrigger pin candidate (not converted).** `PeelScene` implements pinning by hand:
a CSS `position: sticky` panel plus a JS-sized wrapper
(`height = panel + cover lift + runway`). Scrubbed ScrollTrigger timelines run
the beats. Scenes with a beat runway map cleanly to
`pin: panel, pinSpacing: true, end: '+=90%'`, which would replace the sticky
rule and height arithmetic. Examples are `CardsPeelSwap` and `StatsPeelScene`.
The Home bento and Culture testimonials have since left `PeelScene` for plain
document flow (2026-10-27 sections above).

Not converted: the four remaining section types share this component. The cover-follow
choreography also couples three moving parts: the hero `coverTween`, the
wrapper's negative margin and the panel `followTween`. It has no single
unambiguous pin target. Convert only with a per-scene visual review.

## Large-viewport spacing audit, Pages 05–21 (2026-10-26)

Baseline `a8fcd60`: production build, existing local PocketBase, Chromium.
Pages: `/`, `/platform`, `/lcm-chips`, `/applications`, `/sense`,
`/sense/robotics`, `/sense/automotive`, `/dev-kits`,
`/dev-kits/transmit-modules`, `/dev-kits/itof`, `/dev-kits/dtof`,
`/connect`, `/about`, `/culture`, `/partners`, `/news`, `/contact` and
`/privacy-policy`.

Viewports: 1920×1080, 1907×985, 1440×900, 1366×768, 1024×768,
768×1024 and 390×844. 2560×1440 was added as a tall-screen check for pinned
scenes.

For every top-level section and peel scene, the audit recorded:
- the frame;
- the content box (text, media and visual containers, excluding full-bleed
  backdrops);
- space above, heading-to-content and space below;
- the content-to-content transition;
- binding `min-height` elements;
- sticky elements and peel runway;
- horizontal overflow, overlap and clipped text.

It also compared 1907×985 with 1920×1080. Their widths are almost equal, so
any section that grows with the 95px height difference is sized by the
viewport.

**Viewport-height rules on the public site:**
- `HeroFullHeight` (100svh, Home), `.hero-shell.band` (68svh, capped at 47rem)
  and both heroes' phone override to `0`;
- the `PeelScene` panel (100dvh from 768px);
- `.peel-bleed` (100svh, or 80svh when compact);
- `StatsPeelScene` (75dvh; not used on these pages);
- the testimonials quote stage (48dvh);
- `main` (70vh; no audited page binds it).

All other section spacing uses fixed rem tokens, or `--space`, which scales
with width and is capped. It does not grow on taller screens.

### Pages checked

Results after the correction. "Above / below" are flow sections at 1907×985,
excluding the hero band.

| Page | Sections | Above / below (px) | Heading → content | Viewport-driven sections | Result |
|---|---:|---|---|---|---|
| Home | 5 | 92–160 / 0–85 | 60–75 | Full-height hero; bento panel* | Bento corrected (tall screens) |
| Platform | 9 | 80–235 / 52–281 | 22–68 | Hero band; swap stage; paradigm bleed | Unchanged; bleed needs approval |
| LCM Chips | 8 | 65–124 / 0–90 | 18–70 | Hero band | OK |
| Applications | 4 | 92–152 / 52–102 | 50–56 | Hero band | OK |
| Sense | 8 | 42–168 / 38–96 | 29–72 | Hero band | OK |
| Robotics | 8 | 39–162 / 42–84 | 18–73 | Hero band | OK |
| Automotive | 8 | 39–149 / 42–84 | 22–72 | Hero band | OK |
| Dev Kits | 6 | 52–154 / 0–98 | 49–72 | Hero band | OK |
| Transmit Modules | 6 | 44–120 / 28–77 | 18–73 | Hero band | OK |
| iToF | 18 | 30–177 / 0–98 | 18–68 | Hero band | OK |
| dToF | 13 | 41–126 / 0–89 | 25–59 | Hero band | OK |
| Connect | 10 | 52–172 / 0–84 | 22–69 | Hero band | OK |
| About | 7 | 80–173 / 80–105 | 24–83 | Hero band | OK |
| Culture | 6 | 80–197 / 52–99 | 23–78 | Hero band; testimonials panel | Testimonials corrected |
| Partners | 5 | 67–151 / 80–105 | 14–55 | Hero band | OK |
| News | 2 | 75–96 / 93–107 | 33 | None | OK |
| Contact | 4 | 91–151 / 80–87 | 50–105 | Hero band | OK |
| Privacy Policy | 1 | 107 / 123 | 27 | None | OK |

*Below 1097px of viewport height, the bento panel is sized by its content.

Horizontal overflow: 0 on every page at every width, before and after.
There is no overlap between consecutive sections.

**Measurement notes:**
- Sections reporting negative space below are Reveal transforms still
  settling (25–28px), not layout. A slower recheck of Connect showed no
  clipping.
- Clipped-text candidates are:
  - the intentional three-line excerpt clamps on Home and News cards;
  - hero and swap content held by the cover-wipe animation at the measured
    scroll position.
- Content inside pinned panels starts 103px or more below the panel top,
  clear of the 73px sticky header.

### Findings and corrections

| Page | Section | Viewport | Measured issue | Root cause | Correction |
|---|---|---|---|---|---|
| Culture | "In Their Words" (`testimonialsPeelScene`) | 768×1024; any viewport taller than the section | The white section ends at 867px in a 1024px panel. This leaves a 157px empty band before "Open Roles", both during the pin and after it. At 2560×1440 the band is 321px (panel 1440 vs section 1119). | `PeelScene`'s panel has `min-height: 100dvh` from 768px. The scene is not uncovered and does not centre in the panel: the quote centres in its own 48dvh stage. | `stage={false}` sizes the panel to the section. Panel 1024 → 867; next section 666 → 509px at the same scroll; document 157px shorter. 1907×985 and 1440×900 unchanged (the section was already taller than the viewport). |
| Home | "When Light Becomes Programmable" bento (`cardsPeelBento`) | Viewports taller than ~1097px (e.g. 2560×1440) | The panel grows to the viewport (1440) above 1097px of content. This leaves 375px of empty field after the investor logos and before the CTA (32px at normal heights). | Same 100dvh panel minimum. The cards run top-down; their `min-h-full justify-center` centring never resolves. | `stage={false}`. At 2560×1440, panel 1440 → 1097 and CTA 936 → 593px. Identical at all seven requested viewports, where the content is already taller than the viewport. |

`PeelScene` gained a `stage` prop (default `true`). With `stage={false}`, the
scene uses the content-height `.fit` panel introduced in `a8fcd60`. The
cover-follow rule from that commit is unchanged, so the Home "One Chip" result
is unchanged at every width. No other consumer changes.

**PeelScene regression check:** every consumer on the audited pages (Home
"One Chip" and bento; Platform swap and paradigm bleed; Culture testimonials)
was re-measured through its pin at:
- 1907×985 and 768×1024 for the bento;
- 2560×1440 for both corrected scenes;
- 1907×985, 1440×900 and 768×1024 for testimonials;
- the full seven-viewport audit for the rest.

Content positions through the pin are identical, panels stay sticky at the
top, and runways are unchanged.

Reduced motion: panels are static, there is no gap after a scene, and
overflow is 0 at 1907×985, 768×1024 and 390×844. Phones (below 768px) do not
use the panel minimum and are unchanged.

A full re-audit of all 18 pages × 7 viewports against the baseline found:
- one geometry change, the Culture testimonials section at 768×1024;
- otherwise only ±3–8px Reveal-timing noise on pages that do not use
  `PeelScene`.

`npm run check`: 595 files, 0 errors, 0 warnings. `npm run build`: passed.
No migration or content change: the page content fingerprint and the
204-file migration list are identical before and after.

Screenshots are in `%TEMP%\lumotive-review\spacing-audit\`:
- `before-|after-culture-testimonials-{1907x985,768x1024,2560x1440}-{pinEnd,after}.png`
- `before-|after-home-bento-{1907x985,768x1024,2560x1440}-{pinEnd,after}.png`

### Left unchanged: intentionally full-screen or animation-driven

- **Home hero** (`heroFullHeight`, 100svh): the full-screen opening and the
  cover that "One Chip" rides.
- **Hero bands on 15 pages** (68svh, capped at 47rem, image-filled,
  bottom-aligned copy): extra height is image, not empty field. Height stops
  growing at 752px, and phones use content height.
  About, Culture, Partners and Contact carry an extra 80px (`spacingBottom: md`)
  under the copy at every width. This is a content setting, not driven by the
  viewport.
- **Platform "Groundbreaking Physics Meets Mature Manufacturing"**
  (`cardsPeelSwap`): a centred pinned stage (`my-auto`) for the card
  crossfade, and the cover the paradigm bleed is uncovered from.
  Space is symmetric: about 164 / 170px around the content at 1907×985.
- **Platform paradigm bleed** (`splitPeelBleed`): a full-bleed image stage
  uncovered from beneath the swap. See the approval note below.
- **Culture quote stage** (48dvh): centres the quote, as tuned earlier. It is
  kept inside the corrected panel.
- **Phone peel bleed** (100svh below 768px, by the compact-bleed migration's
  design).

### Needs visual approval (not changed automatically)

1. **Platform paradigm bleed.** `1787708500` opted this section into the
   compact 80svh band. Its bleed image is positioned against the pinned
   100dvh panel, not the section, so the visible band is still the full
   viewport: 985px at 1907×985, 1080 at 1920×1080, 1440 at 2560×1440.
   The copy is centred in the 80svh box, so it sits slightly above the band's
   centre:
   - 235 / 281px above / below the copy at 1907×985;
   - 273 / 338 at 1920×1080;
   - 417 / 554 at 2560×1440.
   Showing the compact band would change the uncover choreography: the stage
   would no longer fill the viewport while the swap panel wipes away. That
   needs a design decision.
2. **Platform swap stage on very tall displays.** The centred stage grows
   with the viewport (391px above and 397px below the content at 2560×1440).
   It reads as intentional at the requested viewports. Confirm it on a
   1440p-or-taller display before changing anything.

## Historical QA baseline — 2026-10-22

| Area | Result | ID |
|---|---|---|
| Content | Every v4 input built and checked against the PDF | group 1 |
| Video embeds | Every Vimeo and YouTube embed plays in the page and pauses, in a visible Edge window | S19 |
| Text over images and video | Hero text on 15 pages at 390/768/1024/1440 and Home video text over 24 frames at 390/768/1440: 496 measurements, none under 4.5:1 (body) or 3:1 (headings). Lowest 4.66:1 (Dev Kits body, 768). **Approved 2026-10-22** | S26 |
| Platform card swap | The stretch where both cards faded out is gone (was 96px, now 0px) | P6 |
| Navigation | Phone menu closes on Escape and returns focus; desktop menus unchanged | S16 |
| Server load | Site-wide settings cached for 60 s for signed-out visitors (one request a minute instead of four per page); editors always see live data; settings saves show immediately | S27 |
| Migrations | All 102 new migrations apply to a copy of an `origin/main` database and roll back to the exact starting state | S23 |
| Admin Site settings | Footer and Header forms now load and save what the site shows (copyright, link columns, legal and social links; menu, dropdowns with descriptions, third-level links, buttons). Saving unchanged kept the content and the public HTML identical; edits appeared for signed-out visitors on the next page load. The LinkedIn URL (S1) is now set by migration `1787718000` and editable under Footer → Social links | S29 |
| Press links | 21 checked: 12 work, 1 paywalled, 5 block automated checks, **3 dead** | N7 |

These checks ran in Chromium and Edge on Windows only. The contrast figures are screenshot measurements, not an accessibility audit.

## Josh: needed before staging

1. **Independent approval (S21).** Home PR #1 is already merged. This consolidated feature PR includes its corrected rollback implementation. Main requires one approving review and approval of the latest push by someone other than the pusher; do not merge as part of release preparation.
2. **Staging database backup plus a CMS edit freeze (S23).** Obtain a fresh real staging backup, retain it as the rollback point, and rehearse this exact release on a scratch copy with PocketBase 0.39.11 before merge. No staging migrations were run during preparation. Inspect the dry-run report's forward content differences explicitly: a zero script exit checks rollback, not absence of guard-skipped content. Resolve differences with Claudia.
3. **Automatic migration warning.** Merging `main` triggers staging deployment; PocketBase startup applies pending migrations automatically. There is no later manual migration gate. Backup, freeze and rehearsal must precede merge.
4. **Deployment settings (S24):** confirm `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `DOKPLOY_PB_APP_ID`, `DOKPLOY_WEB_APP_ID` and `ORIGIN`. The deploy job skips silently if the app IDs are empty.
5. **Network layout (S27):** whether PocketBase is reachable only through the web container. That decides the rest of the rate-limit fix (exempt the web container, or forward visitor IPs).
6. **Pipedrive (S3):** admin access, or a hand-off to Lumotive's admin, for the three hidden form fields; then one agreed test submission on staging (S28).
7. **More than one web container?** The settings cache is per container; a save clears only the container that handled it, the others within 60 s. Tell us if staging or production runs more than one.

## Before production launch (ours)

- **Site meta settings (S30):** business address, phone, social accounts and the light logo are saved but shown nowhere on the public site. Waiting for Claudia's decision (see her list); not needed for the walkthrough. The footer's LinkedIn icon is set under Footer → Social links.
- **New-tab links:** existing link settings are kept, but the Footer and Header forms cannot switch a link to open in a new tab. None do today.
- **Safari, iOS Safari and Android Chrome (S20):** never tested. This covers the videos, the self-hosted looping animations (iOS autoplay and Low Power Mode), the LCM Explorer (including the no-WebGL-2 path), the menus, the sideways-scrolling figures, and a look at text over images on real screens.
- **Press links (N7):** a person opens the 5 blocked links (Forbes ×2, bizjournals ×3).
- **`vite.config.ts` (S25):** commit it on its own or drop it.

## Claudia: client decisions and supplies

Nothing below blocks a staging deploy: missing items ship left out, not as placeholders. They do block sign-off of the affected sections. Full list: `v3-outstanding-items.md`, group 2.

- **New from this QA, News (N7):** three "Read the original article" links are dead (Morningstar e-Photonics release, Yahoo Finance MD41 story, 2cm.com.tw AGV/AMR story). Replacement URLs, or approval to remove those links. The Invest Vancouver PDF works again.
- **Privacy Policy (S2): resolved locally 2026-10-23.** Reuse of the published policy was explicitly approved. `/privacy-policy` now returns 200; legal text is verbatim. Not pushed or deployed; verification below.
- **Site meta settings (S30), decision:** wire address, phone, social accounts and the light logo into the site, or remove them from the admin form.
- **Blocking supplies:** NM120 power figure, MIPI wording and internals photo (F2–F4), Leopard Imaging and onsemi logos (SE5, PA3), the final investor list (AB3), News post copy and press contact (N1, N2, N3). The LinkedIn URL (S1) is resolved for the footer; the follow lines (AB4, CU2, CT3, N6) still need adding as approved content.
- **Decisions:** status labels (S8), provider strip with 3 of 4 logos (SE6), the v4 readings (LCM Chips GIF labels, Automotive diagram, iToF scan modes; L2, AU2/AU3, I6), Explorer intro copy (S6 c), Google citation (C6), and the smaller confirmations listed in group 2.
- **Reviews:** heading letter spacing (S18, Webvizio #138), hero framing (AB6, PA1, CU1). Do not close any Webvizio task until it is verified on staging.

## Privacy Policy: resolved locally (2026-10-23)

Supersedes the 2026-10-22 audit, when the footer destination returned 404.
The user explicitly approved reuse of
[Lumotive's published policy](https://lumotive.com/privacy-policy/) as the
authoritative source. **“Last modified: March 26, 2026” is unchanged.**

| Check | Result |
|---|---|
| Architecture | `1787717700_privacy_policy.js` creates a published `pages` record at `privacy-policy`, using one existing `prose` section with opt-in `layout: "legal"`. Standard SvelteKit catch-all route, header and footer; no WordPress plugin or external runtime |
| Footer | Clicked the existing `/contact` footer Privacy Policy link: navigates to `/privacy-policy`, HTTP **200**, same tab. Footer data unchanged |
| Legal copy | Rendered text matches the authoritative source character-for-character after trimming surrounding whitespace at all five widths. All list items and seven link texts/destinations also match. No rewriting or legal additions |
| Hierarchy | One h1, ten numbered h2 sections, eight subordinate h3 headings. “Information You Provide to Us” and Non-US subheadings receive subordinate semantic levels without changing their text |
| Navigation | Non-US Privacy Notice → `#_Non-US_Privacy_Notice`; Contact Information → `#Contact`. Both clicked at every requested width; targets land about 96px from the viewport top, clear of the 73px sticky header. Original `_toc*` named anchors retained as IDs |
| Links | Original public-site URL, Cookie Policy URL and `mailto:info@lumotive.com` links preserved. Cookie Policy resolves to the published external cookie policy; no local cookie-policy page was requested or created |
| Readability | Existing Poppins/Oswald fonts, body/heading tokens, page field and containers. Reading width 328 / 358 / 398 / 720 / 760px at 360 / 390 / 430 / 768 / 1440. List spacing and long-word wrapping are legal-only; news prose unchanged |
| Viewports | **360, 390, 430, 768, 1440px:** zero horizontal overflow, complete content, readable heading/list spacing; all five screenshots saved |
| Metadata | Title “Privacy Policy \| Lumotive”; description covers Lumotive's collection, use, protection, storage, disclosure, Non-US notice and contact information, without adding claims |
| Checks | `npm run check`: 595 files, 0 errors, 0 warnings. `npm run build`: passed. Svelte autofixer only flags the existing trusted rich-text `{@html}` rendering path |
| Status | S2 **resolved locally**. No push, merge or deploy; staging remains unchanged. `vite.config.ts` untouched |

Evidence: `%TEMP%\lumotive-review\privacy-policy\` — five full-page screenshots,
mobile reading comparison, authoritative content snapshot, source text,
rendered text/heading/link measurements and clicked-anchor results.

Also seen: in the dev server, `/lcm-explorer/` (without `index.html`) 404s. This is expected: every site link uses `/lcm-explorer/index.html`, which loads (200), and the production server resolves the folder.

## Mobile QA: `/partners` logo refinement (2026-10-23)

Verified locally in Chromium at **360, 390, 430, 440, 768 and 1440px**.
Hero markup and geometry are identical to the baseline at every width.
No copy, logo assets, names, order, links or alt text changed.

### Measured spacing

CSS pixels, measured from the hero's bottom edge to the first heading, then
from each logo panel's bottom edge to the next section heading:

| Viewport | Hero → Module heading | Module panel → Technology heading | Technology panel → Distribution heading | Horizontal overflow |
|---|---:|---:|---:|---:|
| 360 | 64 | 64 | 64 | 0 |
| 390 | 64 | 64 | 64 | 0 |
| 430 | 64 | 64 | 64 | 0 |
| 440 | 64 | 64 | 64 | 0 |
| 768 | 80 (unchanged) | 160 (unchanged) | 160 (unchanged) | 0 |
| 1440 | 80 (unchanged) | 160 (unchanged) | 160 (unchanged) | 0 |

The mobile baseline was **80 / 160 / 160px**. All three heading/copy blocks
now have **32px** before their panels (was 48px). Distribution retains its
introductory copy: the literal h2-to-panel distance is 128.14px at 360/390
and 100.09px at 430/440, including that copy and its existing 12px top margin.
The blank space after the copy is 32px, not an extra section gap.

### Decisions and checks

- `1787717600_partners_mobile_logo_refine.js` enables `compactMobile` only on
  `/partners` sections `c5fe1eab`, `3138ddf9`, `7c333883`. `LogosLabelled`
  applies the treatment only below 768px; no global spacing rule changed.
- Major gaps use existing `--space` (64px below 768). Each following logo
  section owns its gap; the final panel's existing 80px bottom padding before
  the closing CTA is preserved.
- Panel vertical padding **32 → 24px**, row gap **24 → 16px**, column gap
  **40 → 24px**, cell minimum height **64 → 48px**. Horizontal padding stays
  20px. Radius uses the existing 16px card token instead of the 24px panel token.
- Panel heights at all four mobile widths: **216 → 160px** (Module),
  **392 → 288px** (Technology), **216 → 160px** (Distribution).
- Logos use proportional `width/height: auto`, `object-fit: contain`, and caps
  of **128px wide / 40px high**, also bounded by their cells. No identical-size
  stretching or artwork edits. Gpixel renders at approximately **107.73 × 40px**,
  ADAPS **101.98 × 40px**, MulticoreWare **105.95 × 40px**.
- Headings retain the approved **33.6px** mobile statement scale; reducing
  logo/panel weight restored hierarchy without enlarging headings. Two columns
  remain at every mobile width; Electronic Photonics and MulticoreWare finish
  their odd rows centred. Embedded taglines remain visible and readable in
  the reviewed screenshots.
- All **14 logos** loaded and remained inside both cell and panel bounds,
  with preserved aspect ratios and zero overlaps or horizontal overflow.
  Screenshots visually checked at all six widths.
- At **768 and 1440**, section, heading, panel and individual-logo measurements
  match the baseline exactly. `/about`'s shared logo panel at 390px retains its
  previous logo dimensions and does not receive the opt-in.
- Content snapshot comparison: only the three opt-in fields changed, on
  `/partners` only. Migration replay against the original section snapshot
  matches the live result, is idempotent, and rolls back to the original values.
- `npm run check`: **595 files, 0 errors, 0 warnings**. Layout detector: no
  findings. Svelte autofixer: new selectors clear; its pre-existing dynamic
  CMS `href` advisory is left unchanged to preserve links.

**Evidence:** `%TEMP%\lumotive-review\partners-mobile-refine\` contains
`before-{width}.png` and `after-{width}.png` for all six widths, the mobile
logo contact sheet, before/after measurement JSON, geometry verification and
content/migration verification. Screenshots stay outside the repository.
`vite.config.ts` is untouched; local commit only, no push/merge/deploy.
This is Chromium viewport QA, not a replacement for S20's real-device checks.

## Evidence

Screenshots and measurements are in `%TEMP%\lumotive-review\qa-final\` (playback, links, P6, menus, hero and video contrast with `contrast-results.json`). The migration rehearsal report is in `%TEMP%\lumotive-staging-rehearsal\run-B\dry-run\`. These are temporary folders on this machine; copy them somewhere permanent if they are needed for sign-off.

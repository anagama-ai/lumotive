# Page 06 — /platform

Approved content package rev. 2026-10-07 (v2), page 06 of 21.
Branch `feedback-20261007-v2`. Not committed, not pushed, not deployed.

## Completed

| Item | Where | Evidence |
| --- | --- | --- |
| Manufacturing line copy (CMOS nodes, LCoS packaging) | `cardsPeelSwap` `ace8d391` | `1787708100_platform_manufacturing_intro.js`, `1787707400_platform_page6.js` |
| 2D beamforming section, Smith quote, "Read the announcement" → 2026-03-19 release | `splitDefault` `b2d10f47` | `1787707400_platform_page6.js`; link resolves 200 |
| Chip cards LM10 / LS20, three approved lines each, no generation labels | `cardsTextCards` `c0a71d35` | `1787707400_platform_page6.js`, `1787708300_platform_chip_cards_two_columns.js` |
| Chip-card section off the white field | `c0a71d35` | `1787708200_platform_chip_cards_background.js` (`subtle` → `none`) |
| Generic contact CTA removed from page foot | — | `1787708600_platform_remove_generic_contact_cta.js` |
| Section columns aligned to the header container | all 8 sections | `1787708400_platform_container_alignment.js`; measured `innerLeft 80 / width 1280` desktop, `16 / 358` mobile |
| Paradigm peel band trimmed to the compact bleed | `splitPeelBleed` `fbe8b045` | `1787708500_platform_paradigm_compact_bleed.js` |
| Applications cards: page-06 copy, eyebrows dropped, per-card links removed | `cardsMediaCards` `d38e36da` | `1787708700_platform_applications_cards_pdf_copy.js`; cards render as `<article>`, `article a` count 0 |
| Shared "See all applications" → `/applications` | `d38e36da` | same migration; `/applications` returns 200 |
| Compact card density | `d38e36da` | `1787708800_platform_applications_cards_compact.js` |
| Balanced card text block | `CardsMediaCards.svelte` | heading top margin is now explicit per state (`mt-3` with an eyebrow, `mt-0` without); measured 32 / 16 / 32px at 1440, 768 and 390 |
| Applications cards off the white field | `d38e36da` | `1787708900_platform_applications_cards_background.js` (`subtle` → `none`) |
| "Explore LCM chips" meets the 44px target floor | `CardsTextCards.svelte` | `.section-link` takes `.split-link`'s `min-height: 2.75rem`; 25px → 44px, zero sub-44px targets on mobile |

Verification: `npm run check` 587 files / 0 errors / 0 warnings. Impeccable detector reports
nothing in either touched component. Desktop 1440, tablet 768, mobile 390 and
`prefers-reduced-motion: reduce` all checked in a live browser; no horizontal overflow;
CTA contrast 4.57:1, body 7.54:1, headings 18.22:1.

## Pending assets

All four are Lumotive inputs. Each slot is wired and takes the asset as a data-only
change — none ships a placeholder.

1. **#125 traditional-optics graphic.** `cardsFlowPanels` `cac52f89`, first card.
   Still showing the incumbent `/lumotive/img/flow-traditional-optics.png`, a lens
   barrel and lens stack. The correction asks for new artwork showing mirrors,
   prisms and lenses. **Outstanding** — the slot loads, but it loads the
   pre-correction image, so a green image request is not evidence of delivery.
2. **1D-to-2D animation.** `splitDefault` `b2d10f47` has `media: null` and ships
   one-column by design. Nothing matching exists under `static/lumotive/video`
   (`beam-steering.mp4` and `hero.mp4` only). Setting `media` restores the
   two-column layout with no further change. **Outstanding.**
3. **Interactive LCM Explorer bundle and poster frame.** No explorer section exists
   on the page; no bundle or poster under `static/lumotive/`. **Outstanding, and
   unlike the other three this one is not a drop-in.** The other slots are already
   wired and take their asset as a data-only change; the Explorer has to be built
   and tested once its two inputs arrive:
   - host the supplied HTML file unchanged at `/lcm-explorer/index.html` (about
     1 MB, self-contained, WebGL), outside the CMS;
   - add the "See LCM in Action" section: full-width 16:9 poster with a "Launch
     interactive explorer" button, which on click replaces the poster with an
     iframe to `/lcm-explorer/index.html` (width 100%, 16:9, no border, title
     "Interactive LCM explorer"), plus an "Open full screen →" link to
     `/lcm-explorer/` in a new tab;
   - mobile keeps the same behavior, with a poster-plus-short-video fallback if
     iOS Safari performance is poor;
   - test in Chrome, Safari, Edge and on iOS Safari before launch.
   Budget integration and cross-browser testing for it, not an asset swap.
   Specification: package page 03, "Interactive LCM Explorer (Platform page)".
4. **LM10 photo.** `cardsTextCards` `c0a71d35`, both cards carry no media. The
   existing `lm10-*.png/.webp` files are incumbent site imagery for other pages, not
   the package's chip-card photo. **Outstanding.**

Also outstanding and global, not page-06 specific: the LinkedIn company URL.
`globals.seo.socialChannels` is empty; `Footer.svelte` already holds the icon path in
`MARKS` and renders it as soon as one entry is supplied. Rationale recorded in
`1787708000_footer_sitemap.js:19-25`.

## Pending checks

- **Vimeo playback.** `splitDarkPanel` `97a0771d` embeds
  `player.vimeo.com/video/1040582713`. The sandboxed review browser returned 401 for
  the iframe and for the Cloudflare challenge requests. That is not a diagnosis.
  Playback must be confirmed manually on a normal network before page 06 closes.

## Dependencies on other pages

- **`/lcm-chips` replaces `/lm10`. Resolved.** Page 07 is implemented
  (`1787709000_lcm_chips_page.js`), so `cardsTextCards` `c0a71d35`'s "Explore LCM
  chips" and the footer's Platform group entry both resolve 200. The required
  `/lm10` → `/lcm-chips` redirect is live
  (`1787709100_lm10_to_lcm_chips_redirect.js`); `/lm10` answers 308.
- **Footer.** Global component shared by all 21 pages; rebuilt to the page-01 site
  map in `1787708000_footer_sitemap.js`. Its `/privacy-policy` legal link still has
  no page, and `/sense/robotics` and `/sense/automotive` in the header Applications
  submenu resolve 404 — all three belong to their own pages in the package.

## Final QA (this pass)

Re-verified at 390, 768, 1024 and 1440 in a live browser after the page-07 work:

- Section order matches the package: hero · manufacturing · LCM beamforming
  technology with the flow graphic · 2D beamforming · dynamic scanning · chip
  cards · applications. The Interactive LCM Explorer slot is absent by design,
  pending its bundle and poster.
- **No generic contact CTA**: the page carries no `cta*` section of any kind,
  which is what global rule 8 requires.
- Sense and Connect cards: `<article>`, not links, zero in-card anchors, bodies
  "Programmable 3D sensing." and "Optical circuit switching for AI
  infrastructure.", shared action "See all applications" → `/applications`
  (200).
- Every section's inner column aligns on one edge at every width
  (16 / 24 / 80px); no horizontal overflow; no broken image; no tap target
  under 44px.
- All links resolve: `/contact`, `#paradigm`, the 2026-03-19 news post,
  `/lcm-chips` (200, now that page 07 exists) and `/applications`.
- **Contrast corrected to AA.** Four failures were found and fixed with
  existing tokens: split body copy and the pull-quote attribution were Muted
  Slate at 3.34:1 → Slate Text; the split eyebrow and card eyebrows were Laser
  Blue at 4.15:1 at 12px → Deep Laser Blue; the split link was Laser Blue at
  4.15:1 → Deep Laser Blue. Zero failures remain at any width.
- **Alignment defect fixed.** `StatsCentered` ignored the `align` field, so any
  stats section rendered full-shell while its neighbours were container-aligned.
  It now emits `data-align` like every other section component.

## Status

Page 06 is implemented and QA-verified. It is complete except for its documented
dependencies: the four pending Lumotive assets above — of which the Interactive
LCM Explorer also needs integration and cross-browser testing once its bundle
and poster arrive — and the manual Vimeo playback check. The `/lcm-chips`
page-07 dependency is closed.

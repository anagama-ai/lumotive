# Page 06 — /platform

Approved content package rev. 2026-10-07 (v3), PDF page 06 of 21.
Branch `feedback-20261007-v2`. Local changes only; not pushed, merged or deployed. Existing Home v3 work and the unrelated `vite.config.ts` change remain untouched.

## Completed

## v3 delta and annotated placements

Visible v2→v3 copy changes only “Beam steering module” to “Beamforming module” on LM10. Migration `1787712600_beamforming_terminology.js` had already applied that exact phrase. Standalone “160° native steering” remains approved. The global v3 naming rule also supersedes the pre-existing dark-panel clause “Digital beam steering, enabled by optical beamforming…”; `1787712800_platform_v3_simon_media.js` removes only the redundant opening phrase, leaving “Optical beamforming with Lumotive LCMs lights the way…” and the rest of the paragraph intact. This is a minimal editorial cutover, not a new specification.

Simon placed [Vimeo 1040214357](https://vimeo.com/1040214357) beside the hero image. The PDF prints **KEEP AS IS · Existing hero image**, and the current `hero-platform.jpg` depicts the LCM surface, so the hero was **not** replaced by a one-minute video. The Vimeo title is “Beam Steering with Lumotive's Light Control Metasurface”; its title is external metadata, not site copy. The “Two Chips, One Platform” LM10 photo comment supplies [LM10-thumb2.jpg](https://lumotive.com/wp-content/uploads/2023/08/LM10-thumb2.jpg), visually inspected as an exposed yellow LCM assembly, exactly at the LM10 slot. The LS20 source is [LS20-web.jpg](https://lumotive.com/wp-content/uploads/2026/10/LS20-web.jpg), annotated on PDF page 07 and visually inspected as a hand-held chip; it is reused for the LS20 photo slot on page 06, not misidentified from an existing generic chip asset. Both were fetched, converted to local WebP and recorded under `static/lumotive/img/platform-lm10.webp` and `platform-ls20.webp`, respectively.

The comment “Ducky video” sits at the **From 1D to 2D Beamforming** animation, but supplies no URL/file. No comment supplies #125's mirrors-and-prisms replacement or the Explorer bundle/poster. A scan of the repository and Downloads found no Explorer HTML matching Lumotive; the generic Downloads `index.html` belongs to another project. Do not interpret the existing lens-only graphic's successful load as the requested correction.

`CardsTextCards.svelte` now renders optional card media above card copy with the same card, accent, grid and reveal behavior; sections without media are unchanged. The reversible migration adds the two photo references only to Platform's two chip cards and updates that one held phrase. No Home record or Home component was changed.

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

## Outstanding source assets and integration

**Client dependencies:** (1) A corrected #125 traditional-optics graphic that visibly includes mirrors and prisms as well as lenses. The current `flow-traditional-optics.png` loads, but is lens-only and remains knowingly wrong. (2) The actual “Ducky video” or another approved 1D-line/2D-spot animation for the `b2d10f47` split; the absence of media currently retains its approved one-column fallback. (3) The approved self-contained Explorer HTML/WebGL bundle and 16:9 poster frame. None is supplied by v3 comments or in the searched local files.

**Implementation after delivery, not additional client content:** host the HTML unchanged at `/lcm-explorer/index.html`, add the specified click-to-load 16:9 poster/iframe and full-screen link between 2D Beamforming and Dynamic Scanning, then test Chrome/Safari/Edge/iOS Safari. Test iOS performance before deciding whether its poster-plus-short-video fallback is needed. The graphic and animation slots need CMS media updates once real files arrive; the Explorer needs a new interactive component and browser testing. No placeholder section or fabricated graphic was added.

**Resolved locally:** LM10 photograph is no longer a pending input. The LS20 source is also available via page 07's annotation. The embedded existing Dynamic Scanning Vimeo (`1040582713`) was checked in-page: its iframe displayed the real player, play advanced to 3.9 seconds with readyState 4. A separate direct player check advanced to 9.8 seconds. Its title is “Introduction to the LCM Demonstration Kit,” consistent with the PDF's existing-video instruction. The prior sandbox 401 report is superseded for this browser/network check, not a guarantee for every visitor network.

The shared footer LinkedIn company URL and `/privacy-policy` route remain outside this page's media change; the former is client input, the latter implementation work.

## Dependencies on other pages

- **`/lcm-chips` replaces `/lm10`. Resolved.** Page 07 is implemented
  (`1787709000_lcm_chips_page.js`), so `cardsTextCards` `c0a71d35`'s "Explore LCM
  chips" and the footer's Platform group entry both resolve 200. The required
  `/lm10` → `/lcm-chips` redirect is live
  (`1787709100_lm10_to_lcm_chips_redirect.js`); `/lm10` answers 308.
- **Footer.** The site map was rebuilt in `1787708000_footer_sitemap.js`. The `/privacy-policy` legal link still has no page; this is separate implementation work.

## Prior v2 QA (retained)

The previous pass checked 390, 768, 1024 and 1440 in a live browser:

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

Page 06 v3 was checked on desktop 1440 and mobile 390. Both chip images loaded at their intended slots; all Platform images loaded after scrolling (including the **incorrect-but-retained** #125 graphic), no horizontal overflow, and `/contact`, the 2D-chip announcement, `/lcm-chips`, and `/applications` returned 200. The embedded Vimeo player played in-page. The migration was reverted and reapplied; a database comparison proved Platform restored exactly to its pre-migration sections on rollback and Home remained unchanged both on rollback and reapply. `npm run check`: 592 files, 0 errors, 0 warnings. `npm run build`: passed after stopping the dev watcher. No Safari/Edge/iOS claim is made. No push, merge or deploy.

# Page 06 — /platform

Approved content package rev. 2026-10-07, PDF page 06 of 21: v3 pass, then the v4 pass below (2026-10-22).
Branch `feedback-20261007-v2`. Local changes only; not pushed, merged or deployed. The uncommitted `vite.config.ts` change remains untouched.

## v4 pass (2026-10-22): implemented and verified on the local site

Inputs: Simon's v4 notes on PDF page 06 and the page 03 "Interactive LCM Explorer" directions. Changes: migration `1787715500_platform_v4_media.js`; `MediaVideoEmbed.svelte` (new `interactive` mode); its CMS fields in `sections.statscta.ts`; the files in `static/lcm-explorer/`.

| Section | v4 input | Result |
| --- | --- | --- |
| From 1D to 2D Beamforming (`b2d10f47`) | Vimeo 1237753837 "Ducky_v6" (16:9, 1:41) | `videoUrl` added. The section now has two columns with the player on the right, as printed. Below 768px it stacks above the copy, like the other split videos. Copy, quote and link unchanged. |
| See LCM in Action (new `302ae187`, anchor `#explorer`, between 2D and Dynamic Scanning) | Explorer embed snippet | Printed eyebrow, heading and intro. A 16:9 poster with "Launch interactive explorer"; the click swaps in an iframe of `/lcm-explorer/index.html` titled "Interactive LCM explorer" (fullscreen allowed) and moves focus into it. "Open full screen →" opens the file in a new tab. |
| Light Control Metasurface™ Optical Beamforming Technology, #125 graphic | "Disregard" | **No change.** Simon's v4 note "Disregard" on the #125 redraw request withdraws it (project decision 2026-10-22), so the current flow graphic stays. Webvizio #125 stays open until Claudia confirms. |

### Explorer integration

- **Hosting.** `static/lcm-explorer/index.html` is the supplied `lumotive.com/wp-content/uploads/2026/10/LCM_animation.html` (972,789 bytes, SHA-256 `ab07c690…7fc97e`). It is self-hosted, not iframed from lumotive.com as in Simon's snippet, because that WordPress site is replaced at launch (p03 step 01).
- **One documented deviation from "unchanged".** The `<title>` "Lumotive LCM animation (Copy)" now reads "Lumotive LCM animation", page 03's name for the source. It shows in the browser tab of the full-screen view. Nothing else in the file changed (SHA-256 after: `79e82072…1dd15c20`, 7 bytes shorter); restoring that one line reverts it.
- **Dependencies.** The file is self-contained: three.js, WebGL 2, its fonts, its logo and its poster are inline. Its only outside reference is `media/lcm-animation.mp4` (open item 1).
- **Poster.** Page 03 asks for a 16:9 poster frame, and none was supplied as its own file. `poster.jpg` is the explorer's own inline poster (1280×720 JPEG, 107,770 bytes), extracted byte for byte from the file's fallback `<video poster>`. It was not made by us; Lumotive confirms it or supplies a dedicated frame (open item 2).
- **Launch button** at the poster's lower edge: the poster has its own centred logo and "A new era: programmable optics" title, which a centred button covered.
- **Loading.** Before the click the page requests only the poster (107 KB). The explorer (300 KB brotli on the production server) loads on launch.
- **Full-screen URL** `/lcm-explorer/index.html`, the iframe's own URL. Pages 01 and 03 name `/lcm-explorer/`. A local production build (adapter-node) answers 200 for `/lcm-explorer/`, `/lcm-explorer` and `/lcm-explorer/index.html`, but the Vite dev server serves only the explicit file, so the file path is the one that works everywhere. CT4 on Contact can use either.

### Verification (local site; headless Chromium unless stated)

- **Layout 1440 / 768 / 390:** section order hero, manufacturing, technology, flow graphic, 2D, explorer, dynamic scanning, chips, applications. No horizontal overflow; every section's inner column on one left edge (80 / 24 / 16). 2D: copy 600 + player 600×338 at 1440; 337 + 337 at 768; player 358×201 above the copy at 390. Explorer frame 1280×720 / 720×405 / 358×201; button 282×49; link 44px tall.
- **Poster** loads (1280×720, complete).
- **Launch**, by mouse and by keyboard (Enter): poster and button give way to the iframe; focus moves into it without scrolling the page. The explorer draws its WebGL canvas, captions and timeline advance, and the page logs no errors. On a real GPU (Microsoft Edge 155, AMD Radeon, Direct3D 11) it runs at 60 fps in-page.
- **Reduced motion:** the explorer starts paused (its own behaviour) with its Play button showing.
- **Full screen:** the link opens a new tab (`target=_blank`, `rel=noreferrer`, no opener) at `/lcm-explorer/index.html`, title "Lumotive LCM animation", canvas running; at 390×844 portrait it adapts with no overflow.
- **Vimeo 1237753837 in-page playback.** Headless and managed Chromium get Vimeo's Cloudflare challenge (HTTP 401) and never show the player, as in S19. In a visible Microsoft Edge 155 window, one click on the in-page player started playback: 1.38 → 8.89 s over 7.5 s, readyState 4, stream up to 3840×2160; a second click paused it at 9.33 s. A second run in a fresh profile gave 1.97 → 6.98 s. On the same page the existing Dynamic Scanning player (1040582713) started playing once its first click had passed Vimeo's check in that fresh profile.
- **Contrast** (token pairs): button white on Laser Blue 4.57:1 (hover 6.20:1); "Open full screen" Deep Laser Blue on the page field 5.64:1.
- **Migration** applied, reverted (all 16 page records byte-identical to before) and re-applied (identical to the first apply).
- **Builds:** `npm run check` 0 errors, 0 warnings; `npm run build` passes, and the local production server serves the explorer files.
- **No regression:** Applications' `videos` section uses the same component and renders the same classes as before.

### Open (needs Lumotive; nothing invented)

1. **Fallback video** `media/lcm-animation.mp4`: 404 on lumotive.com, not supplied. Only browsers without WebGL 2 show it; they get the poster plus "Open the interactive version", which reloads the same page. The hidden `<video>` still requests the file on every launch, so each launch logs one 404 (a console error, and a site 404 render of about 5–6 PocketBase calls; see S27). When the file arrives, put it at `static/lcm-explorer/media/lcm-animation.mp4`; no code change. It could also be the "poster + short video" for phones that page 03 step 05 allows.
2. **Poster:** confirm the explorer's own title frame, or supply a dedicated 16:9 frame.
3. **Intro copy vs the tool.** "Change the phase pattern across the metasurface and watch the beam steer, split, and focus." The supplied explorer is a guided animation (play/pause, a scrubbable chapter timeline, camera orbit) with no control for changing the phase pattern. Copy kept as approved; Claudia confirms or rewords.
4. **Phones in-page.** In the 358×201 frame at 390 the explorer's own captions overlap its timeline (its layout, not ours); full screen in portrait reads well. Page 03 step 05 allows poster + short video on phones "if performance is poor"; here the issue is legibility. Decide: keep, or send phones straight to full screen. Real-device test under S20.
5. Safari, iOS Safari and Android are not tested (S20).
6. **Webvizio #125:** open until Claudia confirms the withdrawal.

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

## Source assets (v3 list, status after v4)

All three v3 client dependencies are settled: (1) the #125 redraw is withdrawn ("Disregard" in v4; the current lens-only `flow-traditional-optics.png` stays, Webvizio #125 open for Claudia); (2) the 1D/2D animation is Vimeo 1237753837, now in the `b2d10f47` split; (3) the Explorer is self-hosted at `/lcm-explorer/` behind its own poster. Remaining Explorer items are in the v4 pass's "Open" list above.

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

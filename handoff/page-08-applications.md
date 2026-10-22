# Page 08 — /applications

Approved content package rev. 2026-10-07, PDF page 08 of 21, "Platform › Applications": v3 pass, then the v4 pass below. Branch `feedback-20261007-v2`; committed locally only. Not pushed, merged or deployed; staging not updated.

## v4 pass (2026-10-22): implemented and verified on the local site

- **Input.** v4 has no copy change on page 08. Its one new note (by `wscgr`) sits on the "Image: open prompt" slot, the 4th card of row 2 in One Platform, Many Applications. It links [Wireless.jpg](https://lumotive.com/wp-content/uploads/2024/03/Wireless.jpg): 892×592 JPEG, HTTP 200, decodes; a night scene of people and light paths.
- **Change.** The image is self-hosted as `static/lumotive/img/applications-your-application.webp` (892×592, 90 KB, perceptual hash identical to the source) and set as the "Your application" card's media (`91a455fe`) by `1787715900_applications_your_application_image.js`. It is guarded on the card having no media; down removes exactly that value. Title, body and "Talk to us" are unchanged, as are the other seven cards and their order, the hero, the video pair and the closing CTA. No component change.
- **Verification (local site, headless Chromium).**
  - **Image size:** at 1440 / 1024 / 768 / 390 all eight card images load (the new one at its full 892px). The new image renders at the same size as its row neighbour: 302×170 / 226×127 / 348×196 / 358×201.
  - **Title alignment:** the card title now starts at the same height as its neighbour's (194 / 151 / 220 / 225px from the card top). This closes the misalignment noted in v3, where the text-only card's title sat higher.
  - **No overflow** at any width.
  - **Database:** the migration was applied, reverted (all page records byte-identical) and re-applied.
  - **Screenshots:** `%TEMP%\lumotive-review\applications-v4\` (`applications-{1440,1024,768,390}.png`, `your-application-card-390.png`).
- **Still open (unchanged by v4):** status labels (A2/S8), Simon's 3D Sensing and Defense photos versus the printed descriptions (A3), in-page playback of 1227505713 in a real browser (A4/S19).

## v3 versus v2 and the existing page

- **Copy:** the v2→v3 text diff of page 08 has exactly one change: Optical Communications "Beam steering for satellite…" → **"Beamforming for satellite, airborne, and terrestrial links."** It was already live via `1787712600_beamforming_terminology.js`. Every other string on the page already matched v3, so no copy changed in this pass.
- **Media:** v3 adds Simon's sticky notes — seven card photos and the AMR video. Mapped by note position to the slot under it:

| Card / slot | Printed description | Simon's linked source | Local asset |
| --- | --- | --- | --- |
| 3D Sensing | quadruped robot and delivery robot | [AGV-AMR-scaled.jpeg](https://lumotive.com/wp-content/uploads/2024/12/AGV-AMR-scaled.jpeg) (warehouse AMRs) | `applications-3d-sensing.webp` |
| Optical Circuit Switching | data center | [Optical-Communications_2.jpg](https://lumotive.com/wp-content/uploads/2024/12/Optical-Communications_2.jpg) (fiber patch panel) | `applications-optical-circuit-switching.webp` |
| Defense | drones and vessel | [Defense-Technologies.jpg](https://lumotive.com/wp-content/uploads/2024/12/Defense-Technologies.jpg) (quadruped robot with soldiers) | `applications-defense.webp` |
| Optical Communications | satellite link | [Optical-Communications.jpg](https://lumotive.com/wp-content/uploads/2024/03/Optical-Communications.jpg) (satellite network over Earth) | `applications-optical-communications.webp` |
| Medical | lab instrument | [3D-Inspection-scaled.jpeg](https://lumotive.com/wp-content/uploads/2024/12/3D-Inspection-scaled.jpeg) (robot-arm 3D inspection) | `applications-medical.webp` |
| AI Computing | optical chip | [LM10-chip.png](https://lumotive.com/wp-content/uploads/2024/10/LM10-chip.png) (transparent PNG, flattened on white, top-aligned 16:9 crop so the chip is not clipped) | `applications-ai-computing.webp` |
| AR & Holographic Displays | AR headset | [AR.jpg](https://lumotive.com/wp-content/uploads/2024/03/AR.jpg) | `applications-ar-displays.webp` |
| Your Application | open prompt | **none** | — |
| Motion, left | AMR animation | [vimeo.com/1174547871/6e198e52ae](https://vimeo.com/1174547871/6e198e52ae) | Vimeo embed |
| Motion, right | Connect (vimeo.com/1227505713) | printed in the PDF | Vimeo embed |

All seven photos returned HTTP 200, were visually inspected, and were saved as local WebP (≤1280px wide, 39–114 KB) under `static/lumotive/img`, so they ship with the code rather than hotlinking. Where Simon's photo differs from the grey-box description (3D Sensing, Defense), the supplied asset wins; this is noted, not changed.

## What changed

Migration `1787713000_applications_v3_simon_media.js` (reversible, guarded):

1. Sets `media` on seven of the eight `91a455fe` cards. Rollback removes only those exact values.
2. Adds **"Programmable Optics in Motion"** (`e4c27b19`, eyebrow "See it in action") between the application grid and the closing CTA, as the PDF places it: two players, "One programmable sensor, three jobs" → Explore Sense (`/sense`) and "Send light, not signals" → Explore Connect (`/connect`). Titles print in the package's sentence case.

**AMR conditional resolved.** The dev note said to use 1174547871 only if it is the AMR animation. Simon's note now links it at that slot, and frames sampled at 3/12/22/32/42/52 s show an animated AMR with segmented ROI point clouds and LCM ROI pulses — it matches the description. It opens with burned-in narrative captions ("ROBOTS are becoming a COMMON feature…"); that is the supplied video, unedited.

Code: `MediaVideoEmbed` gains `mode: "videos"` — a 1→2 column grid of white cards, each an iframe (16:9, titled, lazy, poster + click to play, no autoplay) with its title and a 44px-tall Laser Blue action. It also emits `data-align` and an optional `eyebrow`. The other modes are unchanged; no other page uses this section type. The editor spec (`sections.statscta.ts`) exposes the new item fields.

Unchanged and still deliberate: hero, copy, `columns: "4"`, `density: "tight"`, closing CTA, no status labels.

## QA

- 1440 and 390 in Chromium: grid 4-up / 1-up, all seven card images load, video pair 2-up / stacked, no horizontal overflow, no broken image, no tap target under 44px.
- Headings: one H1; H2 "One Platform, Many Applications", "Programmable Optics in Motion", "Build With Programmable Optics"; card and video titles as H3. Both iframes carry titles. Card photos are decorative (`alt=""`) — the card title names the area.
- Links `/contact`, `/sense`, `/connect`: 200. "Physical AI" 0, "beam steering" 0, status labels 0.
- Video playback: 1174547871 loads and plays in-page. **1227505713 in-page playback is unverified**: it played on the direct player, but embedded on this page (and on `/connect`) the headless session got Vimeo's "We couldn't verify the security of your connection" screen. The cause is not established; re-test in a normal browser (outstanding S19).
- Migration rollback restored every page record exactly; reapply changed only `applications`. Pages 05–07 untouched.
- `npm run check` 592 files, 0 errors, 0 warnings. `npm run build` passed.

## Outstanding

- **"Your Application" image.** The PDF prints "Image: open prompt" with no linked asset. The card ships without media, so on desktop its title sits higher than the three photographed cards beside it. Lumotive to supply the visual, or approve the text-only card. No substitute was made.
- **Q19 — status labels** ("In production / In development / Active programs / Exploring") still conflict with global rule 1 (no availability/roadmap). v3 reprints them unchanged. Labels stay omitted; adding them later is one `eyebrow` per card.
- **Connect video in-page playback** — confirm in a normal browser (above).

## Dependencies on other pages

- The four sections removed in v2 (`ebb6cf90`, `b3ce5d47`, `357cf90c`, `60dd50fb`) live on in the down path of `1787709500_applications_page8.js` as source copy for pages 09 and 11. Do not drop that migration.
- Page 06's "See all applications" points here and is unaffected.

## Closing CTA left-aligned (2026-10-22, client request)

"Build With Programmable Optics" (`9a19b24a`) now sits on the container's left edge, as PDF page 08 prints it. It uses the new opt-in `textAlign: "left"` in `CtaDefault`, set by `1787716000_applications_cta_left.js` on this section only; every other centred CTA is unchanged. The heading, paragraph and "Talk to our team" button (`/contact`) start at the same x as the section above at every width tested: 80 / 24 / 16px at 1440 / 768 / 390. No overflow. Background, type, button style, copy and link are unchanged. The migration was applied, reverted (byte-identical) and re-applied. Screenshots: `%TEMP%\lumotive-review\applications-v4\cta-{1440,768,390}.png`.

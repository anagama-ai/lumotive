# v4 review — page checklist and page records (05, 06)

Source: `Lumotive Website  Final Content Feedback from Apurva 20261007 v4.pdf` (21 pages, modified 2026-10-20), compared with v3, this branch (`feedback-20261007-v2`, local PocketBase) and `handoff/v3-outstanding-items.md`. Reviewed 2026-10-22.

**Status words used here**
- **Supplied**: linked in v4, fetched (HTTP 200), decoded and mapped to its slot. Not on the site yet.
- **Implemented and verified**: on the local site (dev server and local PocketBase) and checked there. Staging has not been updated. So far: Page 06 (`page-06-platform.md`), Page 07's animation (`page-07-lcm-chips.md`), Contact's explorer link (CT4), Page 08's "Your Application" image (`page-08-applications.md`), Page 10's video and kit photos (`page-10-robotics.md`), Page 11's diagram and MD180 photo (`page-11-automotive.md`), Page 12's hero and iToF photos (`page-12-dev-kits.md`), Page 13's ROI animation (`page-13-transmit-modules.md`).
- **Held**: supplied, but it cannot be used yet; the reason is given.
- **Closed by "Disregard"**: the client withdrew the request.
- **Awaiting**: client input still needed.

## What v4 changes

- **Copy:** none. The text of all 21 pages is identical to v3. Pages 01–04 (directions, navigation, components, asset inventory) and 16–21 have no change.
- **Annotations:** 24 new notes on pages 05–15, from Simon and one other reviewer (`wscgr`). They contain 22 links to 17 distinct files and videos (one of them inside an embed snippet, one inside the clarification "This is one visual") and two "Disregard" notes. Every v3 note that was only a lead ("Ducky video", "Elyar's video", "Automotive deck", "LI deck", "Older decks", "Robotics deck", "Check with Elyar…") has been replaced by a real link or by "Disregard".
- **Validation:** every linked file answers 200 and decodes; the videos are public (Vimeo oEmbed). Each image was compared by perceptual hash with the 224 images in `static/`. Only one new link matches a file we already have: IMG_9388 is the existing `kit-md180.webp`. Details are in "Validated v4 files" below.
- **Self-hosting:** the files sit on lumotive.com's WordPress, which this site replaces at launch. As in v3, every file must be copied into the repo. Simon's Explorer snippet hotlinks lumotive.com and would break at cutover.

## Page by page

### 05 Home `/`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| Latest From Lumotive, card 2 "Kit photo" (LI140/ON140 dev kits) | `LI140-ON140-iToF.png` | New asset | H1 = N1 | **Held.** The LI140/ON140 post does not exist and no copy was supplied. Not added to the repo. **Decision 2026-10-22:** keep the approved fallback posts; ask Lumotive for the LI140/ON140 post copy and for approval to import the Leopard release; import or rewrite nothing yet. |
| Hero, cards, Latest cards 1 and 3, application tiles, investor strip, closing CTA, footer | unchanged from v3 | — | H2, H3, H5, S8 | v3 work stands. **Decision 2026-10-22:** the duplicate tile photo stays as Simon supplied it. |

### 06 Platform `/platform`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| Light Control Metasurface™ Optical Beamforming Technology: the "update the traditional optics side (#125)" graphic | **"Disregard"** | Disregard | P1 | **Closed, no change.** Decision 2026-10-22: "Disregard" withdraws the #125 redraw; the current flow graphic stays. Webvizio #125 stays open until Claudia confirms. |
| From 1D to 2D Beamforming | Vimeo 1237753837 "Ducky_v6" (16:9, 1:41) | Now supplied | P2 | **Implemented and verified (local site).** Player on the right as printed. In-page click-to-play confirmed in Microsoft Edge (1.4 → 8.9 s); automated Chromium hits Vimeo's bot challenge. |
| See LCM in Action | Embed snippet: iframe of `…/2026/10/LCM_animation.html` | Now supplied | S6 = P3 (+ CT4) | **Implemented and verified (local site).** Self-hosted at `/lcm-explorer/`. Poster, launch button, iframe and full-screen link follow p03. Runs in-page (60 fps in Edge) and full screen. The title "(Copy)" was dropped, a documented one-line change. **Open:** the fallback video `lcm-animation.mp4` (404, not supplied); poster confirmation; intro copy vs the tool; phone in-page legibility. CT4 is now unblocked (Contact pass). |
| Hero; Two Chips LM10 photo | unchanged | — | P4 | Unchanged |

### 07 LCM Chips `/lcm-chips`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| From Fixed Sensors to Programmable Eyes | `lcm-programmable-eyes.gif` (1000×605, 148 frames, 12.3 s) + **"This is one visual"** | Now supplied + clarification | L1, L2 | **Implemented and verified (local site).** Converted to a looping MP4 plus poster and shown as one visual above the approved steps; plays on screen, pauses off screen, reduced motion keeps the poster, pause control. No SVG timeline is authored. The GIF's built-in labels and captions remain conflict 2. |
| Hero; LM10/LS20 column photos | unchanged | — | — | The client-requested full-width band hero stays (conflict 1) |

### 08 Applications `/applications`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| One Platform, Many Applications: "Your Application" (open prompt) | `Wireless.jpg` (892×592, same size as the other 2024/03 card photos) | Now supplied (`wscgr`) | A1 | **Implemented and verified (local site).** Self-hosted WebP on the card; its title now aligns with the other cards at every width. |
| Other cards, videos | unchanged | — | A3, S8, A4 | Unchanged |

### 09 Sense `/sense`
No v4 change (empty text diff; the six notes are identical to v3). Recorded in `page-09-sense.md`. SE5, SE6, SE7, SE9 and SE10 remain open.

### 10 Robotics `/sense/robotics`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| One Sensor, Three Jobs | Vimeo 1237762150 "Lumotive: One Sensor, Three Jobs" (16:9, 1:09) | Now supplied | R2 | **Implemented and verified (local site).** PDF layout: cards and bullets left, video right (from 1280px; stacked below). In-page playback confirmed in Edge. |
| Kits for Robotics: LI140 (card 3), ON140 (card 4) | `LI140.png`, `ON140.png` (2500×1667 transparent cut-outs) | Now supplied (`wscgr`) | R4 → R3 | **Implemented and verified (local site).** All four photos on the kit panel, contained and uncropped; Simon's M30 photo with its white background removed (conflict 8). |

### 11 Automotive `/sense/automotive`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| A Programmable Cocoon Around the Vehicle | `lumotive-fov-regions-scaled.png` (2560×1256) | Now supplied | AU2 | **Implemented and verified (local site).** Full-resolution diagram, whole, under the copy at the container width; sideways scroll on phones. It differs from the slot: no vehicle, and not half-width (conflict 5). |
| First Solid-State 180° dToF Lidar at 30 FPS | `IMG_9388-1-copy-2.png` (MD180 product photo) | Now supplied | AU3 | **Implemented and verified (local site).** Existing `kit-md180.webp` on the right, on the white panel, contained. It is a product photo, not a point cloud (conflict 5). |
| Built for Real-World Conditions: heavy dust and rain image row | **"Disregard"** (on the image row, where v3 said "Aramco rain testing – ask Calvin") | Disregard | AU4 | **Closed.** The section keeps its copy and five cards with no image row, which is how it ships today (verified: no images in the section). |

### 12 Dev Kits `/dev-kits`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| Hero (hub page) | `Lineup.png` (2500×1667 cut-out; five kits) | Now supplied (`wscgr`) | D1 | **Implemented and verified (local site).** Whole lineup on the right of a white banner; phones use the `max` shade for readability. |
| Find Your Dev Kit, iToF row: ON140 (card 1), LI140 (card 2) | `ON140.png`, `LI140.png` | Now supplied (`wscgr`) | D3 → D6 | **Implemented and verified (local site).** ON140, LI140 and M30 (`m30-dev-kit-contents.webp` = Simon's IMG_7224) together on the grey panel, contained. |
| TX10, NM120, MD180 photos | unchanged | — | — | On the local site |

### 13 Transmit Modules `/dev-kits/transmit-modules`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| Programmable Illumination for a Dynamic World ("#154 + #155 merged") | `RandomScanOrderWarehouse.gif` (1923×1384, 12 frames, 3.6 s), placed between the two animation slots | Partly supplied | T3 | **ROI animation implemented and verified (local site):** looping MP4 plus poster, the section's one visual, in a white panel as wide as the card row (animation centred, 28rem tall at most), with the shared play/pause and reduced-motion behaviour. **Awaiting:** the flood-illumination animation (not duplicated from the ROI one), or confirmation that this GIF covers both slots (conflict 3). |
| Hero | unchanged | — | T2 | Unchanged |

### 14 iToF Dev Kits `/dev-kits/itof`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| Hero | `LI140-ON140-M30.png` (2500×1667 cut-out) | Now supplied (`wscgr`) | I1 | Supplied |
| Better Data, Safer Robots | Vimeo 1053591397 "LCM-based iToF Sensor Performance Outdoors" (1:08), noted on the point-cloud slide | Clarification | I4, I3 | I4 is answered (this is the video meant). It is only a text link on the page today. Open: does the video replace the slide image, or do clean renders (I3) still come? |
| LI140 opener; ON140 opener | `LI140.png`, `ON140.png` | Now supplied (`wscgr`) | I7 | Supplied |
| High-Resolution Depth Across a Wide Field; ON140 shared point cloud | `High-Resolution-Depth-Across-a-Wide-Field.png` (1620×984; depth map and point cloud side by side, labels baked in) | Now supplied | I5 | Supplied for both slots |
| Software-Defined Scanning | `lumotive-scan-modes-scaled.png` (2560×909) | Now supplied | I6 | Supplied as **one static strip** of all five modes with their specs baked in, not per-mode artwork (conflict 4) |
| M30 section | unchanged | — | — | On the local site |

### 15 dToF Dev Kits `/dev-kits/dtof`
| Section | v4 | Type | v3 ID | State |
|---|---|---|---|---|
| NM120: HDR Without Losing Frame Rate | Vimeo 1235957120 "Lumotive HDR" (the same video as `/sense`) | Now supplied / decision answered | F5 | Supplied. It serves both pages. |
| Spec tiles, Modular by Design, outdoor row | unchanged | — | F2, F3, F4, F7 | Awaiting |

### 16–21 Connect, About, Culture, Partners, News, Contact
No v4 change. The open items in `v3-outstanding-items.md` (C3, C4, C6, C7, AB2, AB3, AB5, AB6, CU1, CU3, PA1, PA3, PA4, N1–N5, N7, CT1) are unchanged. The contact-form spacing (`fe6a678`) is untouched.

## Conflicts with approved work, or open readings (flagged, not changed)

1. **LCM Chips hero.** v4 still prints the split hero with the hand-held LS20 photo. The full-width band was a later client request (`1787715100`) and v4 adds no note there, so the band stays.
2. **"This is one visual" (p07). Applied as proposed:** the HTML copy (steps 1–4, note, outro) is kept and the animation shows above it as one visual. Still for Claudia: the GIF's built-in labels and three captions repeat parts of that copy. It also overrides the p03 "SVG scan timeline synced to the animation" spec.
3. **"#154 + #155 merged" (p13).** There is one GIF for two printed slots. It now fills the ROI slot alone, and the flood slot is not filled with a copy. Confirm whether it covers both slots, or supply the flood animation.
4. **Scan modes (p14).** The printed design is a five-tab selector with an animated wedge per mode. The supplied art is one static image of all modes. Proposal: show the static image and drop the animated selector, or split it into per-mode crops behind the existing tabs. Confirm.
5. **Automotive (p11). Applied as supplied, pending confirmation:** the MD180 product photo fills the "point cloud or video" slot, and the FOV diagram (no vehicle) sits full width under the copy, scrolling sideways on phones, so its labels stay readable. Nothing was added to either image.
6. **Explorer (p06). Resolved in the Page 06 pass:** self-hosted rather than hotlinked; the "(Copy)" title dropped as a documented one-line change; phones open it in a new tab. Still pending: the missing fallback video, the poster and the intro copy (`page-06-platform.md`, "Open").
7. **Home application tiles. Decided 2026-10-22:** keep Simon's selection (the same `connect-optical.jpg` on Optical Circuit Switching and Optical Communications). No change.
8. **Robotics M30 photo. Decided in the Page 10 pass:** Simon's linked `M30_thumb.jpg` is used, with its white studio background removed so it matches the three cut-outs on the kit panel. The product pixels are unchanged.

## Still awaiting client input (not answered by v4)

- **Sitewide:** LinkedIn URL (S1), privacy policy (S2), Pipedrive hidden fields (S3, then S28), preselect (S4), inquiry values (S5), analytics tool (S7), status labels (S8), contractions (S9), Webvizio mapping (S10), social image approval (S12), heading tracking review (S18).
- **News content:** the Leopard, LI140/ON140 and VISION 2026 posts (H1 = N1). Decision 2026-10-22: the approved fallback posts stay; nothing is imported or rewritten. **Ask Lumotive:** (a) the LI140/ON140 post copy (its card image is supplied); (b) approval to import the Leopard–Lumotive "Sirius Max" release (PR Newswire, around 24 September 2026; its wording says "beam-steering", against rule 1). Also N2–N5 and N7.
- **Logos and badges:** Leopard logo (SE5 = D4 = PA2), onsemi (PA3), award badges (AB2), investor list (AB3), Electronic Photonics confirmation (PA4).
- **Per page:** H2, H3, H5, P4, P5, A3, SE6, SE7, SE9, AU5, T2, T3 flood animation, I3/I8, F2, F3, F4, F7, C3, C4, C6, C7, AB5, AB6, CU1, CU3, PA1, CT1.
- **New in v4:** the readings in conflicts 2–5. **For Claudia:** confirm that the p06 "Disregard" withdraws the #125 redraw, so Webvizio #125 can close (it stays open until then). **Explorer:** the fallback video `lcm-animation.mp4`, the poster frame, and the intro copy ("Change the phase pattern…": the tool has no phase-pattern control).

## Validated v4 files

Fetched 2026-10-22 and cached outside the repo (`%TEMP%\lumotive-v4\assets`). All answer 200 and decode. "Cut-out" means a transparent PNG background (65–80% of pixels transparent), ready for the grey kit panel.

| File / video | Slot(s) | Format | Pixels / length | Existing local match |
|---|---|---|---|---|
| LI140-ON140-iToF.png | p05 news card 2 | PNG cut-out | 2500×1667 | none |
| Vimeo 1237753837 "Ducky_v6" | p06 1D→2D | public, 16:9 | 1:41 | — |
| LCM_animation.html | p06 Explorer | HTML 973 KB | — | none |
| lcm-programmable-eyes.gif | p07 How LCM fits | GIF | 1000×605, 148 frames, 12.3 s | none |
| Wireless.jpg | p08 Your Application | JPEG | 892×592 | none |
| Vimeo 1237762150 | p10 One Sensor, Three Jobs | public, 16:9 | 1:09 | — |
| LI140.png | p10, p12, p14 | PNG cut-out | 2500×1667 | none |
| ON140.png | p10, p12, p14 | PNG cut-out | 2500×1667 | none |
| lumotive-fov-regions-scaled.png | p11 Cocoon | PNG | 2560×1256 | none |
| IMG_9388-1-copy-2.png | p11 180° dToF | PNG cut-out | 1080×720 | `kit-md180.webp` (same photo, trimmed) |
| Lineup.png | p12 hero | PNG cut-out | 2500×1667 | none |
| RandomScanOrderWarehouse.gif | p13 illumination | GIF | 1923×1384, 12 frames, 3.6 s | none |
| LI140-ON140-M30.png | p14 hero | PNG cut-out | 2500×1667 | none |
| Vimeo 1053591397 | p14 Better Data | public, 16:9 | 1:08 | linked as text today |
| High-Resolution-Depth-Across-a-Wide-Field.png | p14 LI140 + ON140 | PNG, opaque | 1620×984 | none |
| lumotive-scan-modes-scaled.png | p14 scanning | PNG | 2560×909 | none |
| Vimeo 1235957120 "Lumotive HDR" | p15 HDR | public, 21:9 | 0:15 | embedded on `/sense` |

The 33 image links carried over from v3 were re-fetched: all answer 200 and decode. Vimeo 1040214357 and 1174547871 are public; YouTube AcLAbtIxN64 ("The Lumotive Way") answers in oEmbed.

## Page 05 — Home: v4 pass (2026-10-22)

**Result: no site change. Nothing implementable is new on Home.**

- The only v4 delta on page 05 is `LI140-ON140-iToF.png` for the example card "New LI140 and ON140 iToF dev kits". The card is fed by a News post marked Featured, and that post does not exist (no post mentions LI140, ON140 or Leopard). Per the brief, no placeholder post was made from the image, and the image was not added to the repo, where it would sit unused. It is validated (200, PNG 2500×1667 cut-out, decodes) and ready for the day the post copy arrives (H1 = N1).
- Everything else on page 05 is identical to v3 and already on the local site. Simon's v3 media all reuse existing local files (perceptual-hash matches: `sense-agv.jpg` 0, `connect-optical.jpg` 0, `home-defense.webp` 3, `home-2d-photonic-news.webp` 8 bits of 256).
- Local-site Home copy compared with the v4 text. All printed copy is present except the known decisions: the serial comma in the investor heading (H5), the LinkedIn icon (S1) and the status labels (S8). The Latest cards show the real featured 2D-photonic post plus the two newest press releases, as before.
- Checks: the 24 internal links and 18 media files on Home answer 200, except `/privacy-policy` (404, S2). With no visual change there was nothing to screenshot. No migration, no code change. Approved work (compact mobile hero, framing, spacing, colours, CTAs) is untouched.

**Review decisions (2026-10-22):** keep the approved fallback posts; add the LI140/ON140 copy and the Leopard import approval to the client questions, and import nothing yet. Keep Simon's duplicate tile photo. No Home change follows from either.

## Page 06 — Platform: v4 pass (2026-10-22)

Implemented and verified on the local site; staging not updated. The 1D/2D video is in its split section, and the Explorer is self-hosted at `/lcm-explorer/` with poster, launch, iframe and full-screen link. #125 is unchanged ("Disregard"). Full record, verification and the open Explorer items are in `page-06-platform.md` ("v4 pass").

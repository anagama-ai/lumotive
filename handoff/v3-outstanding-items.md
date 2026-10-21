# Lumotive website — outstanding items, pages 05–21 (v3 audit)

Audit date 2026-10-20. Branch `feedback-20261007-v2` at `3704933` (local only; `vite.config.ts` uncommitted by design). Audit only: no content, migration or code changed.

**This file is the single authoritative outstanding list.** It supersedes the client-question list in `handoff/v3-page-checklist-and-home.md` and the "Blockers" sections of the per-page handoffs where they disagree.

## How this was checked

- v3 PDF (`…20261007_v3_Simon_images.pdf`): every page's text, v2→v3 text diff, and all 58 of Simon's sticky notes (pages 05–19), each mapped to its slot from a page render.
- Every annotated URL was fetched: all 34 image links and 3 Vimeo links are live; YouTube rate-limited the check (429), the embed already works on `/culture`.
- Each annotated image was compared by perceptual hash against all 202 images in `static/lumotive/` and against the CMS record that uses it, so "supplied but not yet used" is separated from "missing".
- Vimeo titles were read from oEmbed. CMS state is the local PocketBase (`pages`, `globals`, `redirects`, `posts`).
- v3 copy deltas on pages 09–21 (five "beam steering" → "beamforming" strings on 09, 12, 13, 14) are **all live**. "beam steering" appears in no page record.

## Legend

- **Category** — Asset = missing client asset · Decision = client decision/confirmation · Tech = technical dependency · Ours = our remaining work.
- **Status** — **Missing** = confirmed not supplied (annotations, repo and CMS checked) · **Verify** = needs a human confirmation or check · **Do** = we can complete now.
- **Owner** — Lumotive (route via Claudia; named person where the PDF names one) · Josh (repository, deployment, accounts) · Us.
- **Blocks** — **Yes** = the page cannot be signed off as matching v3 without it (it may still ship with the item omitted under the package's "leave it out rather than publish a placeholder" rule). **No** = optional, polish, or already acceptable.

---

## Sitewide

| ID | Section / rule | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| S1 | Footer LinkedIn icon + "Follow Lumotive on LinkedIn…" line (About, Culture, News, Contact) | Tech | Verify | Confirm the company URL. Candidate `https://www.linkedin.com/company/lumotive` answers 200 but is not confirmed. One URL unblocks five places. | Lumotive | Yes | `globals.footer.socialLinks` empty; `Footer.svelte` icon ready; PDF p01, p17, p18, p20, p21 |
| S2 | `/privacy-policy` (footer legal link on every page) | Asset | Missing | Policy text, or approval to port `https://lumotive.com/privacy-policy/` (live, 200). The package does not specify it. | Lumotive | Yes | Route absent; staging also 404s |
| S3 | Contact-form hidden fields (inquiry, source page, campaign) | Tech | Missing | Create the three hidden fields in Pipedrive and send their API keys. Capture and forwarding are built and proven; until the keys exist no submission carries the values. | Lumotive Pipedrive admin (via Josh) | Yes | `FormPipedrive.svelte`; `page-21-contact.md` §Hidden fields |
| S4 | Preselect "I am interested in" from `?inquiry=` | Tech | Verify | Optional per PDF p03. Wanted or not? It is Pipedrive-side configuration. | Lumotive | No | PDF p03 |
| S5 | Inquiry value list | Decision | Verify | (a) Three iToF "Talk to us about…" actions currently send `itof-evaluation`; add separate values? (b) Approved values `media` and `careers` have no CTA using them (News has no media CTA; Culture links straight to Lever). Keep, wire or drop? | Lumotive (Apurva) | No | `page-14-itof-dev-kits.md` l.40–45; QA M3 |
| S6 | Interactive LCM Explorer (`/lcm-explorer/`, Platform section, Contact card) | Asset | Missing | Self-contained HTML/WebGL bundle (Gleb Akselrod's "Lumotive LCM animation", rev 1) plus a 16:9 poster frame. | Lumotive (Gleb Akselrod) | Yes | PDF p01, p03; no bundle in repo or Downloads |
| S7 | Virtual sensor analytics tool (hidden page) | Asset | Missing | The tool or its content, plus its final name. Built noindex and unlinked. | Lumotive | No (hidden) | PDF p01, p04 |
| S8 | Application status labels "In production / In development / Active programs / Exploring" (Home, Applications) | Decision | Verify | They conflict with global rule 1 (no availability or roadmap). v3 reprints them unchanged. Publish as printed, or drop? Currently omitted. | Lumotive (Apurva) | Yes | PDF p05, p08; `1787709500` header |
| S9 | No-contractions rule vs approved copy | Decision | Verify | Two approved strings contain contractions: Home eyebrow "What's new" (printed on PDF p05) and About mission "redefining what's possible" (KEEP AS IS). Keep, or reword? | Lumotive (Claudia) | No | CMS `home#e7b40d12`, `about#4e30aac9` |
| S10 | Webvizio image tasks #123/#124, #126, #128, #130/#131, #152/#153 (PDF p04 "All/Various") | Decision | Verify | No handoff maps these to current pages, and the Webvizio screenshots are needed to judge them. List which are still open after the page rebuild. Do not close any task until the client verifies it on staging. | Us + Claudia | No | PDF p04 Image and Media table |
| S11 | Meta description + social preview text (global rule 14) | Ours | Do | Add `seoDescription` (one sentence from the hero) and `seoTitle` to Home, Platform and Applications. Sense (`1787713100`) and Dev Kits (`1787713700`) are done; the other 11 records already have them. | Us | Yes | CMS `seoDescription` empty on those 3 |
| S12 | Social preview image | Decision | Verify | `ogImage` is null on all 16 pages and no `defaultOgImage` is set. Propose one default (or per-page hero) for approval. | Us → Claudia | No | `+layout.server.ts` l.41–46 |
| S13 | `globals.seo` boilerplate | Ours | Do | Replace "Next.js and Payload starter" defaults and tagline with approved Home copy. `contactEmail: hello@example.com` needs a real address (reuse N2 if appropriate). Not rendered today, but editor-visible. | Us (+ Lumotive for email) | No | `globals.seo` |
| S14 | `globals.code_injection` debug | Ours | Do | Remove `console.log('code injection: bodyEnd')` and the head comment before any deploy. | Us | No | `globals.code_injection`; `+layout.svelte` l.61 |
| S15 | `sitemap.xml` | Ours | Do | Add `/news` (a route, not a page record, so it is never listed). | Us | No | `sitemap.xml/+server.ts` |
| S16 | Top-level menu labels navigate on click (PDF p02) | Ours | Do | Header renders each label as `<details><summary>` with no link; desktop and mobile must open the URL on click while the arrow/hover opens the dropdown. | Us | Yes | `Header.svelte` l.53, l.119 |
| S17 | Third-level nav rows 34px tall | Ours | Do | Raise to the 44px target. | Us | No | QA phase-1 notes |
| S18 | Heading character spacing (#138, rule 15) | Ours | Verify | Re-audit every heading for glyph overlap at 390–1920 (heroes use −0.045em); close #138 only after client review. | Us | No | PDF p01 rule 15 |
| S19 | Real-browser playback of all embeds | Ours | Verify | In-page playback is **unverified** for Vimeo 1227505713 (`/applications`, `/connect`) and 1235957120 (`/sense`). Embedded on the local headless site both showed Vimeo's "couldn't verify the security of your connection" screen; the cause is not established. Direct-player and outside-site checks do not count. Also untested in-page: 1102359216, 1053591397, YouTube AcLAbtIxN64. 1040582713 and 1174547871 played in-page. | Us | No | Page 08 and 09 QA |
| S20 | Cross-browser and device QA | Ours | Do | Safari, Edge and iOS Safari were never tested; only Chromium. Required before launch, and for the Explorer's iOS fallback decision. | Us | Yes | All handoffs |
| S21 | PR #1 (Home to staging) | Tech | Verify | `main` ruleset needs an approving review from someone other than the pusher. Only `josh-scalestorm` can approve and merge. Current PR state cannot be read anonymously. | Josh | Yes | `page-05-home-staging-deploy.md` |
| S22 | Ship pages 05–21 to staging | Ours | Do (after S21) | After PR #1, rebase the local branch's work onto `origin/main` as reviewable PRs. The PR #2 plan in `pr2-platform-lcm-chips-footer.md` is out of date (covers 06–07 + footer only). Exclude `vite.config.ts` unless committed on its own. | Us | Yes | `git log`; 50+ local commits |
| S23 | Staging database vs migrations | Tech | Verify | Most migrations are guarded on prior values and silently no-op if staging content was edited. Need a recent staging `pb_data` backup to dry-run all migrations before deploy. | Josh + Us | Yes | Migration guard pattern |
| S24 | Dokploy/GHCR secrets and variables | Tech | Verify | Confirm `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `DOKPLOY_PB_APP_ID`, `DOKPLOY_WEB_APP_ID` and `ORIGIN` are set for staging and production. | Josh | Yes | `.github/workflows/publish.yml`, README |
| S25 | Uncommitted Windows watcher fix | Ours | Do | Commit `vite.config.ts` on its own, or drop it. Never sweep it into a page commit. | Us | No | `git status` |

## Page 05 — Home `/`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| H1 | Latest From Lumotive | Asset | Missing | Same as N1: the Leopard Imaging and LI140/ON140 posts in the mock do not exist. The section correctly shows the real featured post plus the latest press releases. | Lumotive | No (Home) | `posts.server.ts`; PDF p05 |
| H2 | Latest From Lumotive — 2D photonic chip post image | Decision | Verify | Simon linked the OCS-ports-and-lasers photo; it is applied. Confirm it is intended for a 2D-beamforming-chip story. | Lumotive (Simon) | No | p05 A7 |
| H3 | Hero | Decision | Verify | Simon linked Vimeo 1040214357 at the hero, but the printed note says keep the existing video. Kept. Confirm. | Lumotive (Simon) | No | p05 A1 |
| H4 | Application tiles | Decision | Verify | Status labels; see S8. | Lumotive | Yes | PDF p05 |
| H5 | Investor strip heading | Decision | Verify | PDF prints "Gates Frontier, Amazon, and Samsung Ventures"; live (KEEP AS IS) has no serial comma. | Claudia | No | `home#7fa60e69` |
| H6 | Accessibility carry-over (QA C4) | Ours | Do | `.posts-link` "All news →" has no minimum height (about 25px); `LogosMarquee` lacks `data-align`; re-measure the 6 contrast failures recorded earlier. | Us | No | `PostsFeatured.svelte` l.113; `LogosMarquee.svelte` |
| H7 | Meta | Ours | Do | See S11. | Us | Yes | — |

## Page 06 — Platform `/platform`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| P1 | Traditional optics flow graphic (#125) | Asset | Missing | Corrected artwork showing mirrors and prisms as well as lenses. The current lens-only graphic is knowingly wrong. | Lumotive | Yes | PDF p04 |
| P2 | From 1D to 2D Beamforming | Asset | Missing | 1D-line / 2D-spot animation. Simon's note "Ducky video" is a lead, not a file. Section ships one-column. | Lumotive | Yes | p06 A3 |
| P3 | See LCM in Action (Explorer) | Asset | Missing | See S6. Then ours: host at `/lcm-explorer/`, click-to-load poster/iframe, full-screen link, iOS check. | Lumotive → Us | Yes | PDF p03 |
| P4 | Hero | Decision | Verify | Simon linked Vimeo 1040214357; printed "KEEP AS IS · Existing hero image" was kept. Confirm. | Lumotive (Simon) | No | p06 A2 |
| P5 | Dynamic Scanning body | Decision | Verify | Held clause cut to "Optical beamforming with Lumotive LCMs lights the way…" under the v3 naming rule. Confirm wording. | Claudia | No | `1787712800` |
| P6 | Swap-card band (QA M1) | Ours | Verify | Re-check the ~100px band where both swap cards sat under 0.5 opacity; fix if still present. | Us | No | QA phase-1 M1 |
| P7 | Meta | Ours | Do | See S11. | Us | Yes | — |

## Page 07 — LCM Chips `/lcm-chips`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| L1 | From Fixed Sensors to Programmable Eyes | Asset | Missing | Looping system animation (deck GIF) and its real scan sequence/timing. Simon: "Robotics deck" (lead only). | Lumotive | Yes | p07 A3 |
| L2 | Same section | Ours | Do (after L1) | GIF → MP4/WebM + poster; author the SVG angle-vs-time timeline synced to it (dwell, beam width, frame rate, sequence); two-panel layout; reduced-motion. | Us | Yes | PDF p03 Other Behaviors |

## Page 08 — Applications `/applications`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| A1 | One Platform, Many Applications — "Your Application" card | Asset | Missing | "Image: open prompt" has no link. Supply it, or approve the text-only card (its title sits higher than its photographed neighbours on desktop). | Lumotive | No | PDF p08 |
| A2 | Same grid | Decision | Verify | Status labels; see S8. | Lumotive | Yes | — |
| A3 | Same grid — 3D Sensing, Defense photos | Decision | Verify | Simon's photos (warehouse AMRs; quadruped robot with soldiers) differ from the printed descriptions (quadruped + delivery robot; drones and vessel). Applied as linked. Confirm. | Lumotive (Simon) | No | p08 A1, A3 |
| A4 | Programmable Optics in Motion | Ours | Verify | Confirm in-page playback of Connect video 1227505713; see S19. | Us | No | — |
| A5 | Meta | Ours | Do | See S11. | Us | Yes | — |

## Page 09 — Sense `/sense` (v3 pass done 2026-10-20, commit below)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| SE5 | Module and Solution Providers | Asset | Missing | Leopard Imaging logo (not in the repo). | Lumotive | Yes | PDF p09 |
| SE6 | Same | Decision | Verify | `/partners` already ships this strip with 3 of 4 logos. Build it on `/sense` and `/dev-kits` the same way now, or wait for Leopard? | Claudia | Yes | `partners#c5fe1eab` |
| SE7 | Page placement | Decision | Verify | PDF p08 says three Applications sections move "to Sense"; PDF p09 shows none of them. Not added; copy preserved in `1787709500` down path. Confirm. | Lumotive (Apurva) | No | `page-09-sense.md` "Open question" |
| SE9 | The Problem intro; closing CTA body | Decision | Verify | Both are KEEP AS IS, but the PDF prints different wording ("…efficiency today's autonomous machines need."; "(field of view, range, form factor) … point you to"). Staging text kept. Switch to printed text? | Claudia | No | `page-09-sense.md` Blockers 3 |
| SE10 | HDR video in-page | Ours | Verify | **Pending.** Confirm 1235957120 plays inside `/sense` in a normal browser. Unverified; the cause of the local Vimeo connection screen is not established. Part of S19. | Us | No | page-09 v3 QA |

Resolved on this page by `1787713100`: SE1 perception photos, SE2 HDR video placed in a 21:9 frame (in-page playback still pending, SE10), SE3 application photos, SE4 (the "Robotaxi" file is an aerial traffic scene that fits "intersection"), SE8 meta description.

## Page 10 — Robotics `/sense/robotics` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| R2 | One Sensor, Three Jobs | Asset | Missing | Three-panel AMR demo video (localization / cliff / full field). Simon: "Elyar's video", a name only: no file or URL, and nothing matching in the repo or Downloads (checked 2026-10-20). Its approved caption is held with it. Then ours: printed split layout, poster plus click-to-play, in-page playback check. | Lumotive (Elyar) → Us | Yes | p10 A4 |
| R4 | Kits for Robotics | Asset | Missing | LI140 sensor-head and ON140 photos ("from Q4 flyer"); none annotated or in the repo. | Lumotive | Yes | PDF p10 |
| R3 | Kits for Robotics | Ours | Do (after R4) | Add all four photos together: M30 from [M30_thumb](https://lumotive.com/wp-content/uploads/2022/10/M30_thumb.jpg) (not in the repo), NM120 as the existing `nm120-sensor.jpg` (identical to A3). Add a contained "photo on light grey panel" frame option to `cardsMediaCards` per the p03 kit-card spec. | Us | No | p10 A2, A3 |

Resolved on this page by `1787713400` (and `1787713600` for R6):
- R1 hero: now the existing `market-agv.jpg`, identical to A1.
- R6 mobile hero contrast, fixed by `1787713600` (phone-only stronger shade). Body text measured 4.20 → 5.60:1 at 390 and 4.36 → 5.83:1 at 430; all hero text passes.
- R5: review decision on 2026-10-20 to keep all four kit cards text-only until LI140 and ON140 arrive. This decides Robotics only; page 12's iToF row has its own open decision (D6).
- The Integrate copy fix ("or body").
- The printed bullet list for the four benefits.
- The 01–04 step numerals.
- Virtual-sensor headings confirmed against the v3 render.

## Page 11 — Automotive `/sense/automotive` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| AU2 | A Programmable Cocoon Around the Vehicle | Asset | Missing | Top-down graphic, vehicle with 10/20/50 m rings from corner sensors. Simon: "Automotive deck", a lead only; nothing matching in the repo or Downloads (checked 2026-10-20). | Lumotive | Yes | p11 A2 |
| AU3 | First Solid-State 180° dToF Lidar at 30 FPS | Asset | Missing | 180° point cloud or video. Simon: "Stella-180 video from tradeshows? (talk to Calvin & Sam)", a question and lead, not a file. If it arrives as video: poster plus click-to-play, then verify in-page playback. | Lumotive (Calvin, Sam) | Yes | p11 A3 |
| AU4 | Built for Real-World Conditions | Asset | Missing | Heavy-dust and rain multi-return images (first, second, combined). Simon: "Aramco rain testing – ask Calvin", a lead only. | Lumotive (Calvin) | Yes | p11 A4 |
| AU5 | Hero | Asset | Verify (optional) | The supplied render is 1280×719 (the original upload) and is upscaled about 1.6× by the desktop framing. A larger original would sharpen it. | Lumotive | No | `page-11-automotive.md` |

Resolved on this page by `1787713500`: AU1 hero, live as `hero-automotive.webp` with desktop framing (`mediaShift 20%`, `mediaScale 1.4`) so the car clears the headline. Copy verified verbatim against v3.

## Page 12 — Dev Kits `/dev-kits` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| D1 | Hero | Asset | Missing | Kit family photo; not annotated. The incumbent bench photo stays meanwhile. | Lumotive | No | PDF p12 |
| D3 | Find Your Dev Kit · iToF | Asset | Missing | ON140 and LI140 photos (same delivery as R4/I7). | Lumotive | Yes | PDF p12 |
| D6 | Find Your Dev Kit · iToF | Decision | Verify | Image treatment for the iToF row. Only M30 is supplied (A2), so the row stays text-only for now. Ship M30's photo alone on the grey panel now, or wait for ON140/LI140? (Robotics' R5 decision was to wait; page 12 prints a photo on every kit card.) | Claudia | No | `page-12-dev-kits.md` |
| D4 | Module and Solution Providers | Asset/Decision | Missing | Not built here. See SE5 (Leopard logo) and SE6 (ship 3 of 4 now?). | Lumotive / Claudia | Yes | PDF p12 |

Resolved on this page by `1787713700`:
- D2: TX10, NM120 and MD180 photos on the p03 "photo on light grey panel" treatment (new opt-in `mediaFrame: "panel"`), as transparent WebPs.
- D5: meta description from the hero.
- Copy verified verbatim against v3.

## Page 13 — Transmit Modules `/dev-kits/transmit-modules`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| T1 | Hero | Ours | Do | Simon linked [IMG_5619](https://lumotive.com/wp-content/uploads/2026/05/IMG_5619-1-copy-2.png) (TX10 held in hand) at the hero; replaces `tx10-hero.jpg`. | Us | Yes | p13 A1 |
| T2 | Hero — #129 | Decision | Verify | #129 asks for an *animation* with Tx optics labelled; Simon supplied a still. Is the still the answer (close #129), or is the animation still wanted? | Lumotive (Simon) | Yes | PDF p13, p04 |
| T3 | Programmable Illumination for a Dynamic World | Asset | Missing | Two animations: flood illumination; non-sequential ROI pulses with a sharpening point cloud. Simon: "Older decks" (lead). | Lumotive | Yes | p13 A2 |

## Page 14 — iToF Dev Kits `/dev-kits/itof`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| I1 | Hero | Asset | Missing | "Kit photos: LI140, ON140, M30" family shot; not annotated. Incumbent M30 photo stays. | Lumotive | No | PDF p14 |
| I2 | M30 — See It on Your Bench | Ours | Do | Embed Simon's "Compact M30 AMR demo clip" = Vimeo 1174547871/6e198e52ae (same AMR animation as Applications). | Us | Yes | p14 A2 |
| I3 | Better Data, Safer Robots | Asset | Missing | Clean flash / LCM / stereo point-cloud renders without the slide header, footer and confidentiality line. | Lumotive | Yes | PDF p04, p14 |
| I4 | Same | Decision | Verify | Simon's note reads only "Vimeo:" with no link. Which video was meant? 1053591397 is already linked. | Lumotive (Simon) | No | p14 A3 |
| I5 | High-Resolution Depth Across a Wide Field | Asset | Missing | Warehouse shelving point cloud, full 140° × 105°, high resolution. Simon: "LI deck (ask Calvin)". | Lumotive (Calvin) | Yes | p14 A4 |
| I6 | Software-Defined Scanning | Asset | Missing | Top-down scan diagram artwork per mode. Simon: "LI deck page 2". Then ours: five-tab selector with animated wedge. | Lumotive (Calvin) → Us | Yes | p14 A5 |
| I7 | LI140 and ON140 sections | Asset | Missing | LI140 sensor-head and ON140 bench-top photos (see R4). | Lumotive | Yes | PDF p14 |
| I8 | Secondary actions | Decision | Verify | See S5(a). | Apurva | No | — |

## Page 15 — dToF Dev Kits `/dev-kits/dtof`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| F1 | Hero banner (NM120, #161) | Ours | Do | Swap to Simon's [IMG_0031](https://lumotive.com/wp-content/uploads/2026/04/IMG_0031-1-copy.png) (NM120 with heatsink; not in repo). | Us | Yes | p15 A1 |
| F2 | NM120 spec tiles — POWER | Asset | Missing | Stella-120 sensor-head power figure (the `[X] W` placeholder is unpublishable). | Lumotive | Yes | PDF p04, p15 |
| F3 | NM120 spec tile INTERFACE + "Modular by Design" | Decision | Missing | Confirm "NM120 sensor head outputs MIPI" may be stated publicly; the tile and whole section rest on it. | Lumotive | Yes | PDF p04, p15 |
| F4 | Modular by Design | Asset | Missing | NM120 internals photo, enclosure removed, head and compute board separate. | Lumotive | Yes | PDF p15 |
| F5 | HDR Without Losing Frame Rate | Decision | Verify | Simon: "Check with Elyar for new HDR demo". The new "Lumotive HDR" Vimeo 1235957120 (2026-10-14) annotated on page 09 matches the printed description. Confirm it serves both pages. | Lumotive (Elyar) | Yes | p15 A3; p09 A6 |
| F6 | Track Fast-Moving Objects | Ours | Verify | PDF names Vimeo 1102359216, whose title is "Lumotive LCM Viewing Angle Demonstration" while the copy describes an 80 fps basketball dribble. Watch it and confirm the match; check in-page playback. | Us → Lumotive | No | oEmbed |
| F7 | Outdoor application row (#160) | Asset | Verify | Icons for five use cases: supply, or approve the accent-ruled text cards. | Lumotive | No | `page-15` handoff |

## Page 16 — Connect `/connect`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| C1 | Hero | Ours | Do | Swap to Simon's OCS ports-and-lasers image (the current lumotive.com hero; 1920 px version already local as the 2D-photonic news visual). Live `hero-connect.jpg` is a different server-rack photo. | Us | Yes | p16 A1; hash |
| C2 | 2D Beamforming for High-Port-Count Switching | Ours | Do | Simon linked Lumotive_OCS (= local `ocs-fabric.png`, unused) for the "2D beamforming visual". The earlier "missing visual" is resolved for this page. | Us | Yes | p16 A2; hash 1.00 |
| C3 | From Compact to Hyperscale | Ours | Verify | Simon linked the existing combined graphic [OCS-Reference-Designs](https://lumotive.com/wp-content/uploads/2026/05/OCS-Reference-Designs-1024x451.png); live uses two separate panels. Swap if legible at 1024 px, or ask for a larger file. | Us (+ Lumotive) | No | p16 A3 |
| C4 | From Compact to Hyperscale — copy | Decision | Verify | Marked KEEP AS IS, yet the PDF prints a different heading and intro; printed copy is live. Confirm. | Claudia | No | `page-16-connect.md` l.65 |
| C5 | Where Lumotive Connect Applies | Ours | Do | Integrate Simon's two: Optical-Communications_2 (= local `connect-optical.jpg`) → AI data centers; Optical-Communications (= local `applications-optical-communications.webp`) → Optical communications. | Us | Yes | p16 A4, A5 |
| C6 | Optical Matters Now — Google 40% / 30% figures | Decision | Verify | Dev note asks to cite Google's publication. Candidate: Google "Jupiter Evolving" (SIGCOMM 2022) / Google Cloud Jupiter blog; Lumotive must confirm source and that the figures match. | Lumotive | Yes | PDF p16 dev note |
| C7 | Send Light / Switching at Semiconductor Scale icons | Asset | Verify | Existing icons no longer match approved titles (none for "Compact"). Supply icons, or approve text cards. | Lumotive | No | `page-16-connect.md` l.105 |

## Page 17 — About `/about`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| AB1 | Hero | Decision | Verify | Simon linked [IV2.26.18](https://lumotive.com/wp-content/uploads/2023/04/IV2.26.18-196-scaled.jpg) (engineer at optical bench) at a slot marked "KEEP AS IS · Existing: hero-about.jpg"; the live hero is a different dark-lab photo. Swap? (Recommended: yes, it is the slot's linked source.) | Claudia | No | p17 A1; hash 0.45 |
| AB2 | Recognized for Pioneering… (awards) | Asset | Missing | Official badge artwork for the five awards (names and links already live). | Lumotive | No | PDF p03, p04 |
| AB3 | Investors | Decision | Verify | Final investor logo list (pending box: leave out until supplied). PDF lists Gates Frontier, Amazon, Samsung Ventures, Swisscom Ventures, **Hokuyo**, MetaVC + "[Full list from staging]"; live shows the 9-logo staging list without Hokuyo. Confirm the list and whether Hokuyo belongs. | Lumotive | Yes | PDF p17 |
| AB4 | Work With Us | Tech | Verify | LinkedIn follow line; see S1. | Lumotive | Yes | — |
| AB5 | Leadership — Sajid Husain bio | Decision | Verify | "beam steering" → "beamforming" was applied inside a personal bio. OK? | Claudia | No | QA phase-1 |

## Page 18 — Culture & Careers `/culture`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| CU1 | Hero | Decision | Verify | Simon linked [IMG_4516](https://lumotive.com/wp-content/uploads/2025/04/IMG_4516-1-copy-scaled.jpg) (team in the lab) at "KEEP AS IS · Existing: hero-culture.jpg"; live differs. Swap? (Recommended: yes.) | Claudia | No | p18 A1 |
| CU2 | Help Us Make Light Programmable | Tech | Verify | LinkedIn follow line; see S1. | Lumotive | Yes | — |
| CU3 | Open Roles | Decision | Verify | Live Lever feed shows the six newest postings. OK, or filter by team/featured? | Lumotive | No | `page-18-culture.md` l.87 |

## Page 19 — Partners `/partners`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| PA1 | Hero | Decision | Verify | Simon linked [Partners-Hero](https://lumotive.com/wp-content/uploads/2024/08/Partners-Hero-scaled.jpg) (LCM module with circuit art) at "KEEP AS IS · Existing: hero-partners.jpg"; live differs. Swap? (Recommended: yes.) | Claudia | No | p19 A1 |
| PA2 | Module and Solution Providers | Asset | Missing | Leopard Imaging logo (#121). | Lumotive | Yes | PDF p19 |
| PA3 | Technology Partners | Asset | Missing | onsemi logo (first in order). | Lumotive | Yes | PDF p19 |
| PA4 | Module and Solution Providers | Decision | Verify | The existing "≡ PHOTONICS" mark is shown as Electronic Photonics; page 04 still lists the logo as pending. Confirm it is current, or supply a new one. | Lumotive | No | `page-19-partners.md` l.77 |

## Page 20 — News & Events `/news`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| N1 | Posts | Asset | Missing | Leopard Imaging announcement, LI140 and ON140 kits, VISION 2026: copy, date, category, image. Simon's Leopard photo is supplied, the copy is not. | Lumotive | Yes | PDF p04; p05 A2 |
| N2 | Stay Up to Date | Asset | Missing | Press contact email, or approval to drop the line. | Lumotive | Yes | PDF p20 pending box |
| N3 | Stay Up to Date | Decision | Missing | Social channels beyond LinkedIn, or confirm LinkedIn only. | Lumotive | Yes | PDF p20 pending box |
| N4 | Card images (72 of 112 posts have none) | Decision + Asset | Verify | (a) Sign off reuse of announcement visuals on 35 coverage posts; (b) article images or nominated product shots for 24 pieces; (c) visuals for 13 press releases from 2019–21, or approval to run them without. | Lumotive | Yes | `page-20-news.md` l.117–198 |
| N5 | Events tab | Asset | Missing | First Events post (tab is live and empty). | Lumotive | No | — |
| N6 | Stay Up to Date | Ours | Do (after S1, N2, N3) | Publish the follow block. | Us | Yes | — |

## Page 21 — Contact `/contact`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| CT1 | Lumotive Offices | Asset | Missing | Which address is wrong and the correct one (#137). | Lumotive | Yes | PDF p04, p21 |
| CT2 | Form | Tech | Missing | Pipedrive keys; see S3. | Lumotive | Yes | — |
| CT3 | Follow line | Tech | Verify | See S1. | Lumotive | Yes | — |
| CT4 | Not Ready to Reach Out — "See LCM in action" | Ours | Do (after S6) | Point to `/lcm-explorer/` once hosted (now `/platform`). | Us | No | `page-21-contact.md` l.62 |

---

## By status

**Confirmed missing — client must supply:** S2 privacy policy · S3 Pipedrive keys · S6 Explorer bundle + poster · S7 analytics tool + name · P1 #125 graphic · P2 1D/2D animation · L1 "How LCM fits" animation + timing · A1 "open prompt" visual · SE5 Leopard logo · R2 three-panel AMR video · R4 LI140 + ON140 photos · AU2 cocoon graphic · AU3 180° point cloud/video · AU4 dust/rain images · D1 kit family photo · T3 two illumination animations · I1 iToF family photo · I3 clean point-cloud renders · I5 warehouse point cloud · I6 scan diagrams · F2 Stella-120 power · F3 MIPI permission · F4 NM120 internals photo · AB2 award badges · PA3 onsemi logo · N1 four News posts · N2 press email · N3 social channels · N5 first Events post · CT1 office address.
(Several share one delivery: R4 = D3 = I7; SE5 = D4 = PA2; S1 is one URL.)

**Needs verification — client confirmation or human check:** S1 LinkedIn URL · S4 · S5 · S8 status labels · S9 contractions · S10 Webvizio image tasks · S12 OG image · S18 · S19 · S21 PR #1 · S23 staging DB · S24 deploy secrets · H2 · H3 · H5 · P4 · P5 · P6 · A3 · SE6 · SE7 · SE9 · SE10 · T2 · I4 · F5 · F6 · F7 · C3 · C4 · C6 Google citation · C7 · AB1 · AB3 investors · AB5 · CU1 · CU3 · PA1 · PA4 · N4.

**We can complete now (supplied assets and our own fixes):** S11 meta · S13 · S14 · S15 · S16 menu labels · S17 · S20 cross-browser · S22 PR plan · S25 · H6 · T1 · I2 · F1 · C1 · C2 · C5. Follow-on once inputs land: P3, L2, I6, N6, CT4, R2 layout, R3 (with R4), AU2–AU4 media, D3/D6 iToF photos. (Pages 09–12 are done.)

## One request for Claudia and Josh

**Josh (repository and deployment)**
1. Approve and merge PR #1, which needs a reviewer other than the pusher (S21).
2. Send a recent staging `pb_data` backup so all migrations can be dry-run before deploy (S23).
3. Confirm the Dokploy/GHCR secrets, app IDs and `ORIGIN` for staging and production (S24).
4. Get the Pipedrive hidden fields created and send the three API keys (S3).

**Claudia — supply (route to the named people)**
1. LinkedIn company URL (S1); press email or drop the line (N2); other social channels, or LinkedIn only (N3).
2. Privacy policy text, or approval to port lumotive.com's (S2).
3. Correct office address (#137, CT1).
4. Stella-120 sensor-head power figure and permission to state "NM120 sensor head outputs MIPI" (F2, F3); NM120 internals photo (F4).
5. Logos: Leopard Imaging (SE5/PA2) and onsemi (PA3). Award badges (AB2). Final investor list, and whether Hokuyo belongs (AB3).
6. Photos: LI140 and ON140 kits (R4); kit family shots for Dev Kits and iToF (D1, I1); "Your Application" open-prompt visual or approval to go text-only (A1).
7. Media, with the leads from Simon's notes:
   - Explorer bundle and poster (Gleb, S6).
   - #125 optics graphic (P1).
   - 1D/2D animation ("Ducky", P2).
   - "How LCM fits" GIF and timing ("Robotics deck", L1).
   - Three-panel AMR video (Elyar, R2).
   - Cocoon graphic ("Automotive deck", AU2).
   - 180° point cloud (Calvin & Sam, AU3).
   - Dust/rain images (Calvin, AU4).
   - Two illumination animations ("Older decks", T3).
   - Clean point-cloud renders (I3).
   - Warehouse point cloud and scan diagrams (Calvin, "LI deck", I5, I6).
8. News: the Leopard, LI140/ON140 and VISION 2026 posts (N1); card-image decisions (N4); first Events post (N5).
9. Analytics tool, its content and final name (S7).

**Claudia — decide or confirm**
- Status labels: publish or drop (S8).
- Ship the provider strip partially now, or wait for Leopard (SE6, D4). For Robotics kit rows the review decided to wait for LI140/ON140 (R5). On Dev Kits the TX10 and dToF rows now have photos; decide whether the iToF row shows M30 alone or waits (D6).
- Hero swaps for About, Culture and Partners to Simon's photos (AB1, CU1, PA1).
- The TX10 still versus the #129 animation (T2).
- The new HDR video also on dToF (F5).
- Google citation source (C6).
- Smaller confirmations: H2, H3, H5, P4, P5, A3, SE7, SE9, I4, C4, C7, F7, AB5, CU3, PA4, S4, S5, S9, S10, S12.

## Resolved — removed from earlier lists

| Item (earlier list) | Resolution | Evidence |
|---|---|---|
| Platform LM10 photo; LCM Chips hero, LM10/LS20 column photos | Supplied by Simon and integrated | `1787712800`, `1787712900` |
| Applications card images (5 of 8 "missing"); AMR video confirmation | 7 photos integrated; AMR animation confirmed by frames | `1787713000` |
| Platform Vimeo 1040582713 playback | Played in-page in a real Chromium session | page-06 handoff |
| Sense HDR demo visual | Vimeo 1235957120 "Lumotive HDR" supplied and embedded (21:9) | p09 A6; `1787713100` |
| Sense #119 section images; application photos; meta description | Supplied and integrated as local WebP; SE4 fit confirmed visually | p09 A1–A5; `1787713100` |
| Robotics hero; M30 and NM120 kit photos | Hero live via existing `market-agv.jpg` (`1787713400`); M30/NM120 photos supplied, held for a uniform row until LI140/ON140 arrive (R3/R4) | p10 A1–A3 |
| Automotive hero | Live as `hero-automotive.webp` with desktop framing (`1787713500`) | p11 A1 |
| Dev Kits TX10, NM120, MD180 photos | Live on the p03 grey kit panel (`1787713700`); M30 supplied but held pending D6; ON140/LI140 still missing | p12 A1–A4 |
| Transmit hero still image | Supplied (T1); only the #129 animation question remains | p13 A1 |
| iToF "Photo: M30 with kit contents" | Already live: `m30-dev-kit-contents.jpg` is identical to Simon's IMG_7224 | `itof#6e81d47c`; hash 1.00 |
| iToF compact M30 AMR demo clip | Supplied: Vimeo 1174547871 (I2) | p14 A2 |
| dToF "NM120 enclosed unit" photo | Already live: `nm120-sensor.jpg` is identical to Simon's IMG_0032 | `dtof#d903b4f2`; hash 1.00 |
| Connect 2D beamforming visual; use-case images | Supplied (C2, C5) | p16 A2, A4, A5 |
| Culture "The Lumotive Way" video | Already embedded; oEmbed title confirmed | `culture#979b8fc6` |
| Robotics virtual-sensor headings reconstruction | The v3 render reads "Localization", "Cliff and obstacle", "Object avoidance", as built | p10 render |
| Robotics "Module and Solution Providers" logo strip | Not on page 10's composition (only the approved sentence, which ships); not a page-10 blocker | PDF p10 text |
| Electronic Photonics logo as a blocker | Existing mark reads "≡ PHOTONICS"; downgraded to confirmation (PA4) | `page-19-partners.md` |
| Site-wide "beam steering" audit (13 strings) | Done by `1787712600` + Platform cut; 0 occurrences in page records | CMS scan |
| `/dev-kits/*`, `/sense/robotics`, `/sense/automotive` 404s | All pages built; all redirects 308 | `redirects` table |
| v3 copy deltas pages 09–21 | All five strings live | CMS scan |
| Pages 13–21 "not implemented" (in `current-progress.md`) | Stale: all implemented with handoffs | `page-13`…`page-21` handoffs |

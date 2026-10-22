# Lumotive website: outstanding items, pages 05–21 (final v4 review)

First audited on 2026-10-20. **Final v4 review on 2026-10-22.** The v4 PDF changed annotations only, not copy. Branch `feedback-20261007-v2`, local only. Staging has **not** been updated. `vite.config.ts` stays uncommitted by design.

**QA follow-up, 2026-10-22 (after the final review):** Edge playback finished for every embed (S19); P6 swap band fixed; mobile menu closes on Escape (S16); public-globals cache built and tested (S27, option 1); migration rehearsal against an `origin/main` baseline passes up and down after a rollback fix in `1787707500` that **PR #1 must also carry** (S21, S23); press links re-checked (N7); hero and Home video contrast rechecked, no failures (S26); admin Footer and Header settings fixed so they change the public site (S29); site meta settings logged as S30. Evidence: `%TEMP%\lumotive-review\qa-final\` and `%TEMP%\lumotive-staging-rehearsal\run-B\`. The handoff for Josh and Claudia is `final-qa-handoff.md`.

**This is the single authoritative outstanding list.** It supersedes:
- the client-question lists in `v3-page-checklist-and-home.md` and `v4-checklist.md`;
- the "Blockers" sections of the per-page handoffs, where they disagree with this list.

The page-by-page completion summary and the staging-review handoff for Josh are in `v4-final-review.md`. The four groups below are the working list. The tables after them keep the detail and evidence for each ID.

## 1. Completed locally (local site only; not on staging)

Every v4 input is implemented and checked on the local site (dev server and local PocketBase). None of it is on staging.

| Page | Done | IDs |
|---|---|---|
| 05 Home | No v4 site change. Kept the fallback posts and the duplicate tile photo (decided 2026-10-22). Accessibility, meta and contrast fixes from the v3 release cleanup. | H6, H7, S26 |
| 06 Platform | 1D/2D video in place. Self-hosted LCM Explorer with poster, launch button, iframe and full-screen link; phones open it in a new tab. #125 redraw withdrawn by "Disregard". | P2, P3, S6 (see the open parts in group 2), P1 |
| 07 LCM Chips | "How LCM fits" animation as one looping visual, with a Play/Pause control and reduced-motion support. Section centred. | L1, L2 |
| 08 Applications | "Your Application" image added; closing CTA left-aligned. | A1 |
| 09 Sense | No v4 change. | — |
| 10 Robotics | "One Sensor, Three Jobs" video in the PDF's split layout. All four kit photos on the kit panel. | R2, R3, R4 |
| 11 Automotive | Coverage diagram full width (scrolls sideways on phones). MD180 photo in the 180° section. Dust/rain row withdrawn by "Disregard". | AU2, AU3, AU4 |
| 12 Dev Kits | Five-kit lineup hero. iToF row photos. TX10 card full width. Closing CTA left-aligned. | D1, D3, D6 |
| 13 Transmit | ROI animation as a compact, left-aligned looping video (40rem). The full-width panel and side-by-side experiments were **reverted** (`5046533`); `537e026` is the current layout. | T3 (ROI slot only) |
| 14 iToF | Three-kit hero. In-page comparison video. LI140/ON140 photos. Depth frame in both annotated slots. Static scan-modes figure. Tinted LI140 benefit cards (approved). | I1, I4, I5, I6, I7 |
| 15 dToF | HDR demo video in the HDR section (21:9, right of the copy). | F5 |
| 16–21 | No v4 change. The Contact Explorer link and the form panel width are done. | CT4 |

The sitewide release cleanup is done: S11, S13–S17, plus S18 and S26 (both still open for a client or real-browser look, see groups 2 and 3).

## 2. Client assets, copy and decisions still needed (Lumotive, via Claudia)

Each question appears once here. The package's "leave it out rather than publish a placeholder" rule applies: anything below may ship omitted.

**Supply (assets and copy)**
1. **LinkedIn company URL** (S1). One URL turns on the footer icon and the follow lines on About, Culture, News and Contact (AB4, CU2, CT3; N6 also needs N2 and N3).
2. **Privacy policy** text, or approval to port lumotive.com's (S2). Until then the footer link 404s on every page.
3. **Pipedrive web-form setup** (S3, done by Lumotive's Pipedrive admin and coordinated with Josh): three hidden fields reading `inquiry`, `source_page` and `campaign`.
4. **Office address correction** (CT1, #137).
5. **NM120:** the Stella-120 sensor-head power figure (F2), permission to state "sensor head outputs MIPI" (F3) and the internals photo (F4). Until then the POWER and INTERFACE tiles and "Modular by Design" stay withheld.
6. **Logos and badges:**
   - Leopard Imaging logo (SE5 = D4 = PA2);
   - onsemi logo (PA3);
   - award badges (AB2);
   - the final investor list, including whether Hokuyo belongs (AB3);
   - confirmation of the Electronic Photonics mark (PA4).
7. **News:**
   - LI140/ON140 post copy (H1 = N1; its card image is supplied);
   - approval to import the Leopard "Sirius Max" release (N1);
   - VISION 2026 post (N1);
   - press contact email (N2);
   - social channels beyond LinkedIn (N3);
   - card-image approach (N4);
   - first Events post (N5);
   - three dead source links (N7).
8. **Media still missing:**
   - Explorer: fallback video `lcm-animation.mp4`, and a poster frame or confirmation of the tool's own title frame (S6 a, b);
   - Transmit: flood-illumination animation, or confirmation that the one ROI GIF covers both printed slots (T3, v4 conflict 3);
   - Dev Kits iToF: clean flash/LCM/stereo renders, or confirmation that the in-page video replaces them (I3);
   - analytics tool, its content and its name (S7);
   - outdoor application icons, or approval of the text cards (F7, #160);
   - Connect icons, or approval of text cards (C7);
   - optional larger Automotive hero original (AU5).

**Decide or confirm (v4 readings)**
- LCM Chips: the GIF's built-in labels repeat parts of the approved copy (L2, conflict 2).
- Automotive: the diagram has no vehicle and runs full width; the MD180 photo fills the "point cloud or video" slot (AU2, AU3, conflict 5).
- iToF scan modes: a static figure ships in place of the printed animated five-tab selector, and its wording differs from the cards (I6, conflict 4).
- iToF: whether ON140 reuses the shared depth frame (I5), and whether "Watch the comparison" should stay beside the in-page video (I3).
- #125: confirm that "Disregard" withdraws the redraw so Webvizio #125 can close (P1).
- Explorer intro copy: "Change the phase pattern…" describes a control the tool does not have (S6 c).

**Decide or confirm (carried from v3)**
- Status labels: publish or drop (S8 = H4 = A2).
- Provider strip: ship 3 of 4 logos now, or wait for Leopard (SE6, D4).
- TX10 still versus the #129 animation (T2).
- Google citation source (C6).
- Contractions in approved copy (S9).
- Preselecting the contact form's "I am interested in" field (S4).
- Inquiry values (S5 = I8).
- Social preview image approval (S12).
- Heading tracking, Webvizio #138 (S18).
- Webvizio image-task mapping (S10).
- Hero framing: AB6, PA1, CU1.
- Smaller confirmations: H2, H3, H5, P4, P5, A3, SE7, SE9, C3, C4, AB5, CU3.

## 3. Our remaining implementation and QA

1. **Cross-browser and device QA (S20).** Safari (macOS), iOS Safari and Android Chrome have **never been tested**. This includes every video below.

   **In-page playback.** Automated Chromium hits Vimeo's bot check, so playback was confirmed in a visible Microsoft Edge window. That is Edge only, not verification in every browser. "Played" means one click started playback inside the page iframe.

   | Page | Video | Visible Edge | Safari / iOS / Android |
   |---|---|---|---|
   | `/platform` | 1237753837 (1D/2D, P2) | Played 2026-10-22 | Not tested |
   | `/platform` | 1040582713 | Played 2026-10-22 | Not tested |
   | `/sense` | 1235957120 HDR (SE10) | Played 2026-10-22 (1.56 → 4.06 s), pause holds | Not tested |
   | `/sense/robotics` | 1237762150 (R2) | Played 2026-10-22 (0.45 → 8.45 s) | Not tested |
   | `/applications` | 1227505713 (A4); 1174547871 | Both played 2026-10-22 (4.22 → 6.73 s; 4.58 → 7.08 s), pause holds | Not tested |
   | `/connect` | 1227505713 | Played 2026-10-22 (4.24 → 6.75 s), pause holds | Not tested |
   | `/dev-kits/itof` | 1053591397 (I4) | Played at 1440 and 390, pause holds | Not tested |
   | `/dev-kits/itof` | 1174547871 (M30 clip) | Played at 1440 | Not tested |
   | `/dev-kits/dtof` | 1235957120 HDR (F5) | Played at 1440 (2.90 → 5.40 s) and 390 (3.28 → 5.79 s), pause holds | Not tested |
   | `/dev-kits/dtof` | 1102359216 tracking (F6) | Played at 1440 (1.25 → 3.75 s), pause holds | Not tested |
   | `/culture` | YouTube AcLAbtIxN64 | Played 2026-10-22 (4.06 → 6.56 s), pause holds | Not tested |
   | `/lcm-chips`, `/dev-kits/transmit-modules` | Self-hosted looping MP4s | Headless Chromium only (play, pause, reduced motion) | Not tested; iOS autoplay and Low Power Mode need a check |

   **The rest of S20, in real browsers:**
   - the Explorer, in-page and full screen, including the no-WebGL-2 path (S6 e);
   - header behaviour (S16);
   - sideways-scroll figures on touch devices (Automotive diagram; iToF scan modes);
   - a manual or tool-based contrast review of image-backed text (S26). Our figures are a screenshot measure, not an accessibility sign-off. The automated recheck of heroes and Home video frames was redone on 2026-10-22 and passes (see S26); a person still needs to look on real devices.
2. ~~Platform swap-card band re-check (P6).~~ **Done 2026-10-22**, see P6.
3. **Proposals for Claudia:** a default social preview image (S12) and the Webvizio image-task mapping (S10).
4. **`vite.config.ts`:** commit it on its own, or drop it (S25).
5. **Wire inputs when they arrive:**
   - the LinkedIn URL (S1) and the News follow block (N6, after S1, N2 and N3);
   - the held NM120 tiles and "Modular by Design" (F2–F4);
   - the provider strips (SE5/SE6/D4/PA2).
6. **PocketBase rate limit (S27):** option (1), the public-globals cache, is built and tested locally (see S27). Options (2)/(3) still wait for Josh's network layout.
7. **Contact form end to end** on staging, after S3 (S28).
8. **Staging PRs (S22):** prepare the reviewable branch for pages 06–21 after PR #1, following `v4-final-review.md`.
9. **Press links (N7):** three dead links wait for Lumotive; five sites block automated visits and still need a click-through by a person (N7).
10. ~~Admin Footer and Header settings mismatch (S29).~~ **Fixed and verified locally 2026-10-22**, see S29.
11. **Site meta settings (S30):** most fields render nowhere public. Decide whether to wire or remove them; not a launch blocker for content, but misleading to editors.

## 4. Staging preparation requiring Josh

None of this has started. Nothing is marked done without evidence.

| # | Item | Status and evidence (2026-10-22) |
|---|---|---|
| J1 | **Approve and merge PR #1** (Home, branch `staging-home-page05` at `0b2ff9f`) (S21) | Not merged. After `git fetch`, `origin/main` is still `f203fc1` (2026-09-24). The PR's review state cannot be read from here: there is no `gh` CLI and anonymous API access is not available. **Before it merges, PR #1 must also carry the `1787707500` rollback fix** (see S21), unless Josh approves a different sequence. PR #1's branch has deliberately not been changed. |
| J2 | **Choose the PR shape** for pages 06–21 (S22) | Open. Options and the conflict evidence are in `v4-final-review.md`. |
| J3 | **Staging `pb_data` backup** for the migration dry-run, plus a CMS edit freeze until the deploy (S23) | Not started on staging data. The rehearsal script and a passing run against a clean `origin/main` baseline are ready (S23). |
| J4 | **Dokploy/GHCR secrets, app IDs and `ORIGIN`** for staging and production (S24) | Unverified. |
| J5 | **Network layout** for the PocketBase rate-limit decision (S27) | Unverified. |
| J6 | **Pipedrive admin access**, or a hand-off to Lumotive's admin (S3) | Not started. |

## How this was checked

- v3 PDF (`…20261007_v3_Simon_images.pdf`): every page's text, v2→v3 text diff, and all 58 of Simon's sticky notes (pages 05–19), each mapped to its slot from a page render.
- Every annotated URL was fetched: all 34 image links and 3 Vimeo links are live; YouTube rate-limited the check (429), the embed already works on `/culture`.
- Each annotated image was compared by perceptual hash against all 202 images in `static/lumotive/` and against the CMS record that uses it, so "supplied but not yet used" is separated from "missing".
- Vimeo titles were read from oEmbed. CMS state is the local PocketBase (`pages`, `globals`, `redirects`, `posts`).
- v3 copy deltas on pages 09–21 (five "beam steering" → "beamforming" strings on 09, 12, 13, 14) are **all live**. "beam steering" appears in no page record.
- v4 PDF (`…20261007 v4.pdf`, 2026-10-22): the v3→v4 text diff is empty on all 21 pages. All 24 new notes (Simon and `wscgr`) were mapped from page renders; 17 linked files and videos were fetched, decoded and hashed against the 224 images in `static/`. See `v4-checklist.md`.

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
| S2 | `/privacy-policy` (footer legal link on every page) | Asset | Missing (**audited 2026-10-22**) | Policy text, or approval to port `https://lumotive.com/privacy-policy/` (live, 200, "Last modified: March 26, 2026"). The package does not specify it. **Audit:** the footer "Privacy Policy" link is present on every page and points at `/privacy-policy`; desktop (1440) and phone (390, 44px tap target) both show it. The destination has no page record, route or redirect, so it returns the site's 404 page ("The page you were looking for could not be found." + "Back home"), which itself renders without overflow at both widths. Staging also 404s. No legal copy was written or ported. | Lumotive (via Claudia) | Yes | `final-qa-handoff.md` "Privacy Policy audit" |
| S3 | Contact-form hidden fields (inquiry, source page, campaign) | Tech | Missing | Pipedrive admin adds three Text custom fields and three **Hidden fields** on the web form, value source "JavaScript variable", names exactly `inquiry`, `source_page`, `campaign`, then publishes; also adds them to the notification email. No API keys needed. The site side is rebuilt (2026-10-21) and proven through Pipedrive's loader; until the form is configured, no submission carries the values. Then one consented staging test submission (S28). | Lumotive Pipedrive admin (via Josh) | Yes | `FormPipedrive.svelte`; `page-21-contact.md` v3 pass |
| S4 | Preselect "I am interested in" from `?inquiry=` | Decision | Verify | Optional per page 02. Not possible from the page: JavaScript variables only fill hidden fields, and Pipedrive does not prefill visible fields from the URL. Drop it, or ask Pipedrive / use separate forms per inquiry? | Lumotive | No | `page-21-contact.md` v3 pass |
| S5 | Inquiry value list | Decision | Verify | (a) Three iToF "Talk to us about…" actions currently send `itof-evaluation`; add separate values? (b) Approved values `media` and `careers` have no CTA using them (News has no media CTA; Culture links straight to Lever). Keep, wire or drop? | Lumotive (Apurva) | No | `page-14-itof-dev-kits.md` l.40–45; QA M3 |
| S6 | Interactive LCM Explorer (`/lcm-explorer/`, Platform section, Contact card) | Asset | **Done on the local site 2026-10-22** (open items below) | Self-hosted at `static/lcm-explorer/` from the v4 link (lumotive.com is replaced at launch). Its title had " (Copy)" removed, a documented one-line change; nothing else differs. Poster, launch, iframe and full-screen link follow p03; it runs in-page (60 fps in Edge) and full screen. Phones (<768px) open it in a new tab from the poster; the standalone page showed no overlaps at seven phone viewports. The Contact card links to it (CT4). **Pending:** (a) fallback video `media/lcm-animation.mp4` for browsers without WebGL 2: 404 on lumotive.com and not supplied; each launch logs one 404 until it arrives; (b) poster: the explorer's own title frame is used, so confirm it or supply a frame; (c) intro copy vs the tool; (e) Safari/iOS in S20. | Lumotive (a, b), Claudia (c), Us (e) | Yes (a, b) | `page-06-platform.md` v4 pass |
| S7 | Virtual sensor analytics tool (hidden page) | Asset | Missing | The tool or its content, plus its final name. Built noindex and unlinked. | Lumotive | No (hidden) | PDF p01, p04 |
| S8 | Application status labels "In production / In development / Active programs / Exploring" (Home, Applications) | Decision | Verify | They conflict with global rule 1 (no availability or roadmap). v3 reprints them unchanged. Publish as printed, or drop? Currently omitted. | Lumotive (Apurva) | Yes | PDF p05, p08; `1787709500` header |
| S9 | No-contractions rule vs approved copy | Decision | Verify | Two approved strings contain contractions: Home eyebrow "What's new" (printed on PDF p05) and About mission "redefining what's possible" (KEEP AS IS). Keep, or reword? | Lumotive (Claudia) | No | CMS `home#e7b40d12`, `about#4e30aac9` |
| S10 | Webvizio image tasks #123/#124, #126, #128, #130/#131, #152/#153 (PDF p04 "All/Various") | Decision | Verify | No handoff maps these to current pages, and the Webvizio screenshots are needed to judge them. List which are still open after the page rebuild. Do not close any task until the client verifies it on staging. | Us + Claudia | No | PDF p04 Image and Media table |
| S11 | Meta description + social preview text (global rule 14) | Ours | **Done 2026-10-21** | Home, Platform and Applications now carry their hero line as `seoDescription`; titles "Lumotive \| Programmable Optics", "LCM Technology", "Applications" (were "Home", "Platform", "Applications"). All 16 page records have a description. | Us | — | `1787715200` |
| S12 | Social preview image | Decision | Verify | `ogImage` is null on all 16 pages and no `defaultOgImage` is set. Propose one default (or per-page hero) for approval. | Us → Claudia | No | `+layout.server.ts` l.41–46 |
| S13 | `globals.seo` boilerplate | Ours | **Done 2026-10-21** | Starter description, default meta description and tagline replaced with the approved Home hero line and heading; the `hello@example.com` placeholder cleared (real press contact is N2). Not rendered on pages. | Us | — | `1787715200` |
| S14 | `globals.code_injection` debug | Ours | **Done 2026-10-21** | The `console.log` and the head comment are emptied; no page carries them. | Us | — | `1787715200` |
| S15 | `sitemap.xml` | Ours | **Done 2026-10-21** | `/news` listed, lastmod = newest post update; 129 entries. | Us | — | `sitemap.xml/+server.ts` |
| S16 | Top-level menu labels navigate on click (PDF p02) | Ours | **Done 2026-10-21** | Platform → /platform, Sense → /sense, Company → /about. Each group is a label link plus an arrow button (`aria-expanded`/`aria-controls`); desktop opens on hover or arrow, closes on leave, focus-out and Escape (focus returns to the arrow); mobile accordion arrow 44×44, label opens the page and closes the panel. 2026-10-22: Escape also closes the phone panel and returns focus to the menu button; reopening by click still works (`qa-final\nav-mobile-escape*.json`). Real-browser check under S20. | Us | — | `Header.svelte`, `app.css`, `1787715300` |
| S17 | Third-level nav rows | Ours | **Done 2026-10-21** | Transmit modules / iToF / dToF rows 34 → 44px (desktop); mobile rows 54px. | Us | — | `Header.svelte` |
| S18 | Heading character spacing (#138, rule 15) | Ours | Done; client review | Audit renders each adjacent glyph pair of every Oswald heading on all 17 pages at 390/768/1440/1920 and checks real ink overlap. Band hero headlines at −0.055em touched ("ra", "gn", "ta", "rt" on 10 pages); now −0.03em, which clears all but a 2px² "vy" sliver in "Heavy" (Automotive, ≥768). Remaining touches are "ff" at normal tracking, which is the typeface's own design. Some band headlines now wrap one line more (Sense from 768 up; Contact at 390). Close #138 only after Claudia reviews. | Us → Claudia | No | `HeroFullHeight.svelte` |
| S19 | Real-browser playback of all embeds | Ours | **Edge done 2026-10-22**; Safari/iOS/Android in S20 | Automated Chromium gets Vimeo's Cloudflare challenge (HTTP 401): Vimeo's bot check, not a site defect. In a visible Microsoft Edge window, in-page playback with pause holding was confirmed on 2026-10-22 for every embed: 1237753837 and 1040582713 (`/platform`), 1235957120 (`/sense`), 1237762150 (`/sense/robotics`), 1227505713 and 1174547871 (`/applications`), 1227505713 (`/connect`), 1053591397 and 1174547871 (`/dev-kits/itof`), 1235957120 and 1102359216 (`/dev-kits/dtof`), YouTube AcLAbtIxN64 (`/culture`). The per-page table is in group 3. Edge is not verification in other browsers. | Us | No | Page handoffs 06, 10, 14, 15; `qa-final\edge-playback.json` |
| S20 | Cross-browser and device QA | Ours | Do | Safari (macOS), iOS Safari and Android Chrome have never been tested, including every video and animation in the group 3 table. Edge has been used for embed playback (every Vimeo and YouTube embed, see S19) and the Explorer. All other checks ran in Chromium only. Required before launch, and for the Explorer's phone and no-WebGL-2 decisions. | Us | Yes | Group 3; all handoffs |
| S21 | PR #1 (Home to staging) | Tech | Verify | `main` ruleset needs an approving review from someone other than the pusher. Only `josh-scalestorm` can approve and merge. Current PR state cannot be read anonymously. **Rollback fix to carry:** PR #1 includes `1787707500_home_solution_cards_page5.js`, whose `down` wrote back the seed links `/technology` and `/optical-circuit-switching-communications`. `origin/main` already serves `/sense` and `/connect` (`1787703900`), so a rollback would have put two 404 links on Home. Fixed on this branch (rollback restores `/sense` and `/connect`); PR #1's branch is unchanged and needs the same fix before merging, unless Josh approves a different sequence. | Josh | Yes | `page-05-home-staging-deploy.md`; S23 |
| S22 | Ship pages 06–21 to staging | Ours | Do (after S21 and the PR-shape decision) | This branch is 104 commits ahead of `origin/main` and 0 behind (fetched 2026-10-22, before the final-review commit). It carries 101 new migrations. PR #1's six Home commits are patch-equivalent to commits already here (`git cherry`). A dry-run merge of PR #1 into this branch conflicts in four Home components, which later commits here extend. The resolution and the options are in `v4-final-review.md`. Exclude `vite.config.ts` unless it is committed on its own. | Us (Josh decides the PR shape) | Yes | `v4-final-review.md` |
| S23 | Staging database vs migrations | Tech | Rehearsed locally; staging data not started | Most migrations are guarded on prior values and silently no-op if staging content was edited, so a recent staging `pb_data` backup still has to be dry-run. **Done 2026-10-22:** `scripts/staging-migration-dry-run.mjs` (copies the backup, applies, compares with the local reference, rolls back, compares with the start). Against a fresh baseline built from `origin/main`'s 99 migrations (`f203fc1`, PocketBase 0.39.11): 100 applied; 0 page, globals, redirect or posts differences from the local reference; `migrate down 100` restored the start exactly. Re-run with `1787717400` added: 101 applied, no differences, rollback exact. A full-database comparison (23 tables, 261 rows, SQLite schema of `data.db` and `auxiliary.db`) differs only in 16 `updated` timestamps. The first run had failed on Home (see S21). | Josh + Us | Yes | `%TEMP%\lumotive-staging-rehearsal\run-B\dry-run\report.md` |
| S24 | Dokploy/GHCR secrets and variables | Tech | Verify | Confirm `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `DOKPLOY_PB_APP_ID`, `DOKPLOY_WEB_APP_ID` and `ORIGIN` are set for staging and production. | Josh | Yes | `.github/workflows/publish.yml`, README |
| S25 | Uncommitted Windows watcher fix | Ours | Do | Commit `vite.config.ts` on its own, or drop it. Never sweep it into a page commit. | Us | No | `git status` |
| S26 | Hero and image-backed text contrast | Ours | Fixed; **recheck passed and approved 2026-10-22**; manual look in S20 | All known low spots fixed with shade options only: new phone `mobileShade: max` (Home video, Transmit, LCM Chips, Applications, Automotive), About back to phone `strong`, new `tabletShade: strong` (768–1023: Home, Transmit, Culture, Contact). Sweep on real data: 15 photo heroes × 7 widths (360–1920) plus 29 Home video frames; every line ≥ 4.5:1 at the **brightest** backdrop pixel (body lowest 4.62), headings ≥ 3:1. Home bento photo cards were at 2.8:1 (title over the bright warehouse photo); overlay strengthened, now ≥ 5.65:1. All other image-backed text (closing CTAs, 34 blocks at 390/1440) ≥ 5.65:1. **Recheck 2026-10-22** (local site, captured after the v4 pass; no later commit touches hero or video styling): backdrops captured with the hero text hidden (15 heroes at 390/768/1024/1440; Home video at 24 frames spread over its 62 s, at 390/768/1440). For each text line box, the text colour (including the 75 % body opacity) was blended over every backdrop pixel in the box and the lowest ratio kept: 496 measurements, **0 below threshold** (4.5:1 for body, eyebrow and links; 3:1 for headings ≥ 24px). Lowest: Dev Kits body at 768, 4.66:1; Robotics body at 768, 5.19:1; lowest heading dToF at 390, 5.17:1; Home video body 7.03:1 (768, 32 s). Not re-captured: closing CTAs and Home bento cards (unchanged since the 2026-10-21 sweep), and 360/1920. Screenshot measure, not an accessibility sign-off. | Us | Yes | `1787715400`; `HeroFullHeight.svelte`; `CardsPeelBento.svelte`; `qa-final\contrast-results.json` |
| S27 | PocketBase rate limit vs server-side rendering | Tech | Option (1) done locally; (2)/(3) need Josh | **Cause:** `1700000250_platform_limits.js` enables PocketBase's rate limiter, which activates its default `/api/` rule: 300 requests per 10 s per client IP. Every page render made 5–6 PocketBase calls (four globals plus the page or post lookups), all from the SvelteKit server's IP, so every visitor shares one budget of about 50–60 renders per 10 s. The local 500s were a crawl at ~36 pages/s (3,312 × 429 in the PB log). The guest rules (`editors:authWithPassword`, `form_submissions:create`) are likewise keyed on the server IP, so they are site-wide, not per visitor. **Option (1) built 2026-10-22** (`src/lib/server/public-globals.ts`): the four globals are read in one request through an anonymous client and cached per server process for 60 s; concurrent refreshes share one request; a failed refresh serves the last copy for up to 10 min; signed-in editors read live; every settings save (`putGlobal`) clears the cache. **Tested** on the production build against a scratch PocketBase copy: 10 anonymous renders → 1 globals request; 20 concurrent renders on an expired cache → 1; a direct database edit is visible to editors at once and to anonymous visitors only after the 60 s; an admin's code-injection save and an editor's footer save show to anonymous visitors on the next render; editor renders do not refresh the shared cache; a bad cookie is treated as anonymous and cleared. Edits made in the PocketBase admin UI bypass `putGlobal`, so they can take up to 60 s; with several web instances, a save clears only its own instance. **Still open:** (2) exempt or raise the limit for the web container's address (`rateLimits.excludedIPs` or a dedicated rule) if PocketBase is reachable only through the web app; (3) forward the visitor IP (`X-Forwarded-For` from SvelteKit + `trustedProxy.headers` in PocketBase) so limits are per visitor again; only safe if PocketBase cannot be reached directly. Josh to confirm the network layout and the staging settings. | Josh + Us | Yes | PB logs; `public-globals.ts`; `+layout.server.ts` |
| S28 | Contact form end-to-end | Ours | Do (after S3) | One real submission on staging, agreed with Lumotive and deleted afterwards, confirming the three values reach the CRM record and the notification email. Not run locally by design (no real notifications or CRM records). | Us + Lumotive | Yes | `page-21-contact.md` |
| S29 | Admin → Site settings → Footer and Header | Ours | **Fixed and verified locally 2026-10-22** | Both forms now edit the fields the site renders; saves show to signed-out visitors on the next page load. Details, reproduction and verification below. | Us | Yes (production) | `admin/settings/footer/*`, `admin/settings/header/*`, `settings.server.ts` |
| S30 | Admin → Site settings → Site meta | Ours | Open (decision) | Business address, phone, "Social accounts" and "Logo for light backgrounds" (labelled "Used on the public site") are saved to `globals.site_meta` but no public page reads that record; only the admin sidebar uses its dark logo. The footer's LinkedIn icon is set under Footer → Social links (S29), not here. Wire the fields into the site, or remove them from the form so editors are not misled. | Us → Claudia | No | `admin/settings/site-meta/*`; `grep site_meta src` |

### S29: admin Footer and Header settings did not drive the public site

Found 2026-10-22 while testing the S27 cache. **Fixed the same day** (forms and server only; `Footer.svelte`, `Header.svelte` and the stored content are unchanged). The description of the original fault is kept below for the record.

**Affected fields** (`globals` record `key = "footer"`):

| Public footer reads (`Footer.svelte`) | Stored today (local DB) | Admin form edits and saves |
|---|---|---|
| `copyright` (string, after "© {year}") | yes | — |
| `navItems[]`: `{ title, subNavItems[]: { link: { label, url, newTab } } }` (four column groups) | yes, 4 groups | — |
| `legalLinks[]`: `{ link: { label, url, newTab } }` (plus flat `linkLabel`/`linkUrl`/`linkNewTab` copies in the stored rows) | yes, 1 (Privacy Policy) | — |
| `socialLinks[]`: `{ platform, url, label }` (LinkedIn icon, S1) | not set | — |
| — | no | `text` ("Footer text") |
| — | no | `nav[]`: `{ label, href }` ("Footer links") |

**Expected:** the Footer settings page loads the current copyright, column groups, legal links and social links; a save changes what visitors see in the footer (immediately, given the S27 cache invalidation).

**Actual:** the page opens with an empty "Footer text" and "No footer links yet.", although the site shows a full footer. Saving writes `text` and `nav` next to the real fields (the merge in `putGlobal` keeps them, so nothing is lost) and shows "Saved. Your changes are live.", but the public footer does not change. The copyright, column links, legal links and LinkedIn icon can only be changed through migrations or the raw PocketBase admin. The same form will also be the obvious place to add the LinkedIn URL for S1, and that would not work either.

**Reproduce** (local or staging, any editor account):
1. Open `/admin/settings/footer`. Footer text is empty and no links are listed.
2. Enter "Test copyright" as Footer text, add a link `Test` → `/test`, save. The page reports "Saved. Your changes are live."
3. Open `/` signed out (and signed in). The footer still reads "© {year} Lumotive, Inc. All rights reserved." with the same columns; no `Test` link.
4. In PocketBase, `globals` → `footer` now holds `text` and `nav` beside the unchanged `copyright`, `navItems` and `legalLinks`.

Seen on a scratch copy during the S27 test (an editor save added `text`/`nav`, the footer did not change).

**Fix (2026-10-22).** The forms now edit the shapes the components render, rather than the components changing:
- **Footer:** copyright line; link columns (title plus links, add/remove/reorder); legal links; social links (platform plus URL; only LinkedIn has an icon).
- **Header:** menu items as a single link or a dropdown (label plus address); dropdown links with an optional description and an optional third level of links; buttons. The unused "Site name" field is gone (the logo is fixed in `Header.svelte`).
- Every stored object is carried through the form, so fields the form does not show (new-tab flag, the button's `appearance`, the social `label`) survive a save. Links are written as `{ link: { label, url, newTab } }` with the flat `linkLabel`/`linkUrl`/`linkNewTab` copies kept in step. Blank rows are dropped.
- A save also removes the old forms' leftovers (`text`/`nav` on the footer, `siteName`/`nav` on the header), so no migration is needed for records an editor already saved with the old form.
- Shared helpers in `settings.server.ts` (`toLinkRows`, `fromLinkRow`, `parseLinkRows`, `cleanLinkRows`); `NavRows.svelte` gained optional field names. `putGlobal` (merge plus cache invalidation) is unchanged.

**Verified** with the production build against a scratch copy of the local database (old-form leftovers added to both records first), driven through the admin UI in a browser as a non-admin editor:
- both forms open with the live content (footer: copyright, 4 columns, 13 links, Privacy Policy; header: 4 menu items, 11 dropdown links with descriptions, 3 third-level links, the Contact button);
- saving both forms unchanged: the header record is identical to the original; the footer record is identical except for an added empty `socialLinks: []`; the leftovers are gone; the signed-out header and footer HTML is byte-identical;
- edits seen by a signed-out visitor on the next page load: copyright, a renamed column link, a reordered column, an added legal link, an added LinkedIn icon, a changed dropdown description, a renamed third-level link, a renamed button (its `appearance` kept), an added single menu link, and that link's removal;
- `npm run check` 0 errors and 0 warnings; `npm run build` exits 0; the Svelte autofixer reports no issues on either form. Looked at the header form at 1280 wide and the footer form at 390 wide.

Not covered: new-tab links are kept but cannot be switched on or off in the form (none exist today).

### Phone heroes (2026-10-21)

Below 768px every image hero (band and Home's full-height video) now takes the compact form Sense introduced: no viewport minimum, 4rem above the eyebrow, 3.5rem below the last action, the section's own spacing dropped, wrapped actions 1rem apart. Heights follow the copy (328–581px at 360–430; Sense 413–473). `compactMobile` on heroes is gone (it is now the default); Sense, iToF and dToF render exactly as before. Tablet (768) and desktop (1024, 1440) geometry is identical before and after on every page. News (compact header) and LCM Chips (split hero) are untouched.

Framing and shade per photo, migration `1787714900`, chosen so the subject stays in frame; the shades were tightened again by `1787715400` (S26) so every line holds 4.5:1 at the brightest backdrop pixel at 360–1920. A screenshot measure, not an accessibility sign-off.

| Page | Phone framing | Shade |
|---|---|---|
| Home (video) | unchanged | max on phones, strong on tablets (`1787715400`) |
| Culture | 100% on phones, 0% on tablets (page 18) | strong on phones (as before); strong on tablets (`1787715400`) |
| iToF, dToF | unchanged | unchanged |
| Platform, Dev Kits | centre | strong (new) |
| Applications, Automotive | centre | max (`1787715400`; was strong) |
| Sense | 100% (robot at the right) | strong (new) |
| Robotics | 0% (AGV fleet) | strong (as before) |
| Transmit | 65% (TX10 module) | max on phones, strong on tablets (`1787715400`) |
| Connect | 0% (left beam fan) | standard |
| About | 75% (optics and engineer) | strong (`1787715400`; standard after the phone pass) |
| Partners | centre (LCM module; was 100% for the old light-burst image, changed by `1787715000`) | standard |
| Contact | 25% (building at the right edge) | strong; strong on tablets (`1787715400`) |
| LCM Chips (client-requested band hero) | 15% | max (`1787715400`; was strong) |

The low spots previously listed here (Transmit, LCM Chips, and the 768 lows on Home, Transmit, Culture, Contact) are fixed; see S26.

## Page 05 — Home `/`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| H1 | Latest From Lumotive | Asset | Missing (image supplied v4) | Same as N1. v4 supplies `LI140-ON140-iToF.png` for the LI140/ON140 card; it is held, because the post and its copy do not exist and no placeholder post is made. Decision 2026-10-22: the approved fallback posts stay (the real featured post plus the two newest press releases); ask for the LI140/ON140 copy and the Leopard import approval (group 2, item 7). | Lumotive | No (Home) | `posts.server.ts`; PDF p05; `v4-checklist.md` |
| H2 | Latest From Lumotive — 2D photonic chip post image | Decision | Verify | Simon linked the OCS-ports-and-lasers photo; it is applied. Confirm it is intended for a 2D-beamforming-chip story. | Lumotive (Simon) | No | p05 A7 |
| H3 | Hero | Decision | Verify | Simon linked Vimeo 1040214357 at the hero, but the printed note says keep the existing video. Kept. Confirm. | Lumotive (Simon) | No | p05 A1 |
| H4 | Application tiles | Decision | Verify | Status labels; see S8. | Lumotive | Yes | PDF p05 |
| H5 | Investor strip heading | Decision | Verify | PDF prints "Gates Frontier, Amazon, and Samsung Ventures"; live (KEEP AS IS) has no serial comma. | Claudia | No | `home#7fa60e69` |
| H6 | Accessibility carry-over (QA C4) | Ours | **Done 2026-10-21** | "All news →" and "See all applications →" are 44px tall; the six contrast failures re-measured and fixed with the existing text-safe tokens: eyebrows and section links Deep Laser Blue, accent eyebrows/links Signal Green Text / Optical Amber Text (were 4.15, 3.19, 1.82:1). Bento photo-card titles fixed under S26. `LogosMarquee` now honours `data-align`; Home's marquee is full-bleed with a centred heading, so its data is left unaligned on purpose. | Us | — | `PostsFeatured`, `CardsPeelBento`, `CardsPeelScene`, `LogosMarquee` |
| H7 | Meta | Ours | **Done** | See S11. | Us | — | `1787715200` |

## Page 06 — Platform `/platform`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| P1 | Traditional optics flow graphic (#125) | Asset | **Withdrawn v4** | Decision 2026-10-22: Simon's "Disregard" on the #125 redraw withdraws it, so the current flow graphic stays (no change made). Webvizio #125 stays open until Claudia confirms. | Claudia | No | v4 p06; `page-06-platform.md` |
| P2 | From 1D to 2D Beamforming | Asset | **Done on the local site 2026-10-22** | Vimeo 1237753837 "Ducky_v6" in the split's media column, on the right as printed (`1787715500`). In-page click-to-play confirmed in Microsoft Edge. | Us | — | `page-06-platform.md` v4 pass |
| P3 | See LCM in Action (Explorer) | Asset | **Done on the local site 2026-10-22** | New section `302ae187` (`#explorer`), between 2D and Dynamic Scanning: poster, "Launch interactive explorer", iframe, "Open full screen →". Open items are under S6. | Us | — | `page-06-platform.md` v4 pass |
| P4 | Hero | Decision | Verify | Simon linked Vimeo 1040214357; printed "KEEP AS IS · Existing hero image" was kept. Confirm. | Lumotive (Simon) | No | p06 A2 |
| P5 | Dynamic Scanning body | Decision | Verify | Held clause cut to "Optical beamforming with Lumotive LCMs lights the way…" under the v3 naming rule. Confirm wording. | Claudia | No | `1787712800` |
| P6 | Swap-card band (QA M1) | Ours | **Done 2026-10-22** | The band was still present: at 1024 and 1440 a 96px stretch had both swap cards under 0.5 opacity (strongest only 0.13). The rising card now starts with the falling one on the same duration and ease, so the two always sum to 1: low band 0px, the visible card never under 0.52. Reduced motion unchanged. | Us | — | `PeelScene.svelte`; `qa-final\p6-swap-before.json`, `p6-swap.json` |
| P7 | Meta | Ours | **Done** | See S11. | Us | — | `1787715200` |

## Page 07 — LCM Chips `/lcm-chips`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| L1 | From Fixed Sensors to Programmable Eyes | Asset | **Done on the local site 2026-10-22** | Simon's `lcm-programmable-eyes.gif` ("This is one visual") converted to a looping MP4 (1000×604, 297 KB) plus a poster, shown as one visual between the introduction and the steps (`1787715700`). | Us | — | `page-07-lcm-chips.md` v4 pass |
| L2 | Same section | Ours | **Done on the local site 2026-10-22**; confirmation open | Plays on screen and pauses off screen; reduced motion keeps the poster; a play/pause control is always available. No SVG timeline is authored (the GIF contains it). **Open (Claudia):** the GIF's built-in labels and three captions repeat parts of the approved copy, which is kept (v4 conflict 2). | Claudia | No | `v4-checklist.md` |

Client-requested change (2026-10-21, not in v3): the hero is now a full-width band with the same chip photo, copy and inquiry links (`1787715100`); details and measurements in `page-07-lcm-chips.md`. Phone body low of 4.02:1 at 360 (brightest pixel) added to S26.

## Page 08 — Applications `/applications`

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| A1 | One Platform, Many Applications — "Your Application" card | Asset | **Done on the local site 2026-10-22** | `wscgr`'s `Wireless.jpg` self-hosted as `applications-your-application.webp` and set on the card (`1787715900`). The title now lines up with its neighbours. | Us | — | `page-08-applications.md` v4 pass |
| A2 | Same grid | Decision | Verify | Status labels; see S8. | Lumotive | Yes | — |
| A3 | Same grid — 3D Sensing, Defense photos | Decision | Verify | Simon's photos (warehouse AMRs; quadruped robot with soldiers) differ from the printed descriptions (quadruped + delivery robot; drones and vessel). Applied as linked. Confirm. | Lumotive (Simon) | No | p08 A1, A3 |
| A4 | Programmable Optics in Motion | Ours | Edge done 2026-10-22; other browsers in S20 | In-page playback of 1227505713 confirmed in Edge; see S19. | Us | No | `qa-final\edge-playback.json` |
| A5 | Meta | Ours | **Done** | See S11. | Us | — | `1787715200` |

## Page 09 — Sense `/sense` (v3 pass done 2026-10-20, commit below)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| SE5 | Module and Solution Providers | Asset | Missing | Leopard Imaging logo (not in the repo). | Lumotive | Yes | PDF p09 |
| SE6 | Same | Decision | Verify | `/partners` already ships this strip with 3 of 4 logos. Build it on `/sense` and `/dev-kits` the same way now, or wait for Leopard? | Claudia | Yes | `partners#c5fe1eab` |
| SE7 | Page placement | Decision | Verify | PDF p08 says three Applications sections move "to Sense"; PDF p09 shows none of them. Not added; copy preserved in `1787709500` down path. Confirm. | Lumotive (Apurva) | No | `page-09-sense.md` "Open question" |
| SE9 | The Problem intro; closing CTA body | Decision | Verify | Both are KEEP AS IS, but the PDF prints different wording ("…efficiency today's autonomous machines need."; "(field of view, range, form factor) … point you to"). Staging text kept. Switch to printed text? | Claudia | No | `page-09-sense.md` Blockers 3 |
| SE10 | HDR video in-page | Ours | Edge done 2026-10-22; other browsers in S20 | 1235957120 played in-page on `/sense` in Edge (pause holds); see S19. | Us | No | `qa-final\edge-sense-hdr-playing.png` |

Resolved on this page by `1787713100`: SE1 perception photos, SE2 HDR video placed in a 21:9 frame (in-page playback confirmed in Edge 2026-10-22, SE10), SE3 application photos, SE4 (the "Robotaxi" file is an aerial traffic scene that fits "intersection"), SE8 meta description.

## Page 10 — Robotics `/sense/robotics` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| R2 | One Sensor, Three Jobs | Asset | **Done on the local site 2026-10-22** | As printed: heading, intro, three cards and bullets on the left, Vimeo 1237762150 on the right from 1280px, stacked below (`1787716200`, superseding the bullets-only split of `1787716100`). In-page playback confirmed in Edge (0.45 → 8.45 s). The printed placeholder caption describes the asset and is not shown. | Us | — | `page-10-robotics.md` v4 pass |
| R4 | Kits for Robotics | Asset | **Done on the local site 2026-10-22** | LI140 and ON140 cut-outs added (see R3). | — | — | v4 p10 |
| R3 | Kits for Robotics | Ours | **Done on the local site 2026-10-22** | All four photos together on the page-03 kit panel (contained, uncropped, same frame): M30 from Simon's `M30_thumb.jpg` with its white background removed, NM120 `kit-nm120.webp`, LI140, ON140. | Us | — | `page-10-robotics.md` v4 pass |

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
| AU2 | A Programmable Cocoon Around the Vehicle | Asset | **Done on the local site 2026-10-22**; confirmation open | Simon's coverage diagram, self-hosted at full resolution (`automotive-fov-regions.webp`), shown whole under the copy at the container width; sideways scroll inside its frame on phones (`1787716300`). It differs from the printed slot: no vehicle (one sensor's side and top views with near / mid / far specs), and full width instead of the right-hand half. | Claudia | No | `page-11-automotive.md` v4 pass |
| AU3 | First Solid-State 180° dToF Lidar at 30 FPS | Asset | **Done on the local site 2026-10-22**; confirmation open | The existing `kit-md180.webp` (Simon's IMG_9388) on the right, on the white product panel, contained. It is a product photo, not the printed "point cloud or video". | Claudia | No | `page-11-automotive.md` v4 pass |
| AU4 | Built for Real-World Conditions | Asset | **Withdrawn v4** | "Disregard" withdraws only the dust/rain image row; the copy and five cards stay (re-checked 2026-10-22: 0 images, 5 cards). | — | — | v4 p11 |
| AU5 | Hero | Asset | Verify (optional) | The supplied render is 1280×719 (the original upload) and is upscaled about 1.6× by the desktop framing. A larger original would sharpen it. | Lumotive | No | `page-11-automotive.md` |

Resolved on this page by `1787713500`: AU1 hero, live as `hero-automotive.webp` with desktop framing (`mediaShift 20%`, `mediaScale 1.4`) so the car clears the headline. Copy verified verbatim against v3.

## Page 12 — Dev Kits `/dev-kits` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| D1 | Hero | Asset | **Done on the local site 2026-10-22** | `wscgr`'s five-kit lineup laid whole on the right of a white banner (`hero-devkits-lineup.webp`), as the dToF hero composes its NM120. Phones take the existing `max` shade so the copy holds ≥ 6.73:1 at the brightest backdrop pixel (`1787716500`). | Us | — | `page-12-dev-kits.md` v4 pass |
| D3 | Find Your Dev Kit · iToF | Asset | **Done on the local site 2026-10-22** | ON140 and LI140 cut-outs on the kit panel (reused from `/sense/robotics`). | Us | — | `page-12-dev-kits.md` v4 pass |
| D6 | Find Your Dev Kit · iToF | Ours | **Done on the local site 2026-10-22** | All three iToF photos together on the grey panel; M30 as the existing `m30-dev-kit-contents.webp` (Simon's IMG_7224). The temporary text-only row is closed. | Us | — | `page-12-dev-kits.md` v4 pass |
| D4 | Module and Solution Providers | Asset/Decision | Missing | Not built here. See SE5 (Leopard logo) and SE6 (ship 3 of 4 now?). | Lumotive / Claudia | Yes | PDF p12 |

Resolved on this page by `1787713700`:
- D2: TX10, NM120 and MD180 photos on the p03 "photo on light grey panel" treatment (new opt-in `mediaFrame: "panel"`), as transparent WebPs.
- D5: meta description from the hero.
- Copy verified verbatim against v3.

## Page 13 — Transmit Modules `/dev-kits/transmit-modules` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| T2 | Hero — #129 | Decision | Verify | #129 asks for an *animation* labelling the Tx optics. Simon supplied a still (TX10 in hand), now live. Does the still close #129, or is the animation still wanted? #129 stays open until decided. | Lumotive (Simon) | Yes | PDF p13, p04 |
| T3 | Programmable Illumination for a Dynamic World | Asset | **ROI animation done on the local site 2026-10-22; flood animation missing** | Simon's `RandomScanOrderWarehouse.gif` is converted to a looping MP4 plus poster and shown as the section's one visual (`1787716900`). It sits in a compact, left-aligned 40rem column (`537e026`). The full-width panel and side-by-side experiments were reverted (`5046533`). The flood-illumination animation is not supplied and the ROI animation is not repeated in its slot. Still needed: the flood animation, or confirmation that this one GIF replaces both slots (v4 conflict 3). | Lumotive (Simon) | Yes | `page-13-transmit-modules.md` v4 pass |

Resolved on this page by `1787713800`: T1 hero, live as `hero-tx10-in-hand.webp` (A1) with the phone-only strong shade, which raised the measured body contrast over 4.5:1 at the 99th percentile (screenshot measure; brightest pixel still lower, see S26). Copy verified verbatim against v3.

## Page 14 — iToF Dev Kits `/dev-kits/itof` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| I1 | Hero | Asset | **Done on the local site 2026-10-22** | `LI140-ON140-M30.png` on a white banner (`hero-itof-kits.webp`, `1787717100`), composed as the Dev Kits hero. | — | No | `page-14-itof-dev-kits.md` v4 pass |
| I3 | Better Data, Safer Robots | Asset | Verify | The v4 video now plays in the slide's slot. Does it replace the clean flash/LCM/stereo renders, and should the "Watch the comparison" link stay beside it? | Lumotive (Simon) | No | v4 p14 |
| I4 | Same | Decision | **Done on the local site 2026-10-22** | Vimeo 1053591397 plays in the page between the intro and the cards (verified in headed Edge). | — | No | `page-14-itof-dev-kits.md` v4 pass |
| I5 | High-Resolution Depth Across a Wide Field | Asset | **Done on the local site 2026-10-22** | The depth map + point cloud frame in both annotated slots (LI140 wide field; ON140 under its features). Confirm the shared frame for ON140 or supply a second one. | Lumotive (Simon) | No | `page-14-itof-dev-kits.md` v4 pass |
| I6 | Software-Defined Scanning | Asset | **Done as a static figure; confirm** | The one supplied still of all five modes, above the five mode cards; no tabs or animation (v4 conflict 4). Confirm, and confirm the graphic's wording ("High frame rate", "AMR mode", "Object interaction", "Not yet measured", "*Preliminary"). | Claudia / Lumotive | No | `page-14-itof-dev-kits.md` v4 pass |
| I7 | LI140 and ON140 sections | Asset | **Done on the local site 2026-10-22** | Both openers carry their photo on the white panel, as M30. | — | No | `page-14-itof-dev-kits.md` v4 pass |
| I8 | Secondary actions | Decision | Verify | See S5(a). | Apurva | No | — |

Resolved on this page by `1787714100`: I2, Simon's compact M30 AMR clip (Vimeo 1174547871/6e198e52ae, "Lumotive - AGV AMR", 16:9) now plays in-page in "See It on Your Bench", right-hand as printed. A1 (M30 with kit contents) was already live as `m30-dev-kit-contents.jpg`, re-verified identical to IMG_7224. Copy verified verbatim against v3.

## Page 15 — dToF Dev Kits `/dev-kits/dtof` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| F2 | NM120 spec tiles — POWER | Asset | Missing | Stella-120 sensor-head power figure (the `[X] W` placeholder is unpublishable). | Lumotive | Yes | PDF p04, p15 |
| F3 | NM120 spec tile INTERFACE + "Modular by Design" | Decision | Missing | Confirm "NM120 sensor head outputs MIPI" may be stated publicly; the tile and whole section rest on it. | Lumotive | Yes | PDF p04, p15 |
| F4 | Modular by Design | Asset | Missing | NM120 internals photo, enclosure removed, head and compute board separate. | Lumotive | Yes | PDF p15 |
| F5 | HDR Without Losing Frame Rate | Decision | **Done on the local site 2026-10-22** | Vimeo 1235957120 "Lumotive HDR" (21:9) plays in the page, right of the copy (`1787717300`); in-page playback verified in headed Edge at 1440 and 390. | — | No | `page-15-dtof-dev-kits.md` v4 pass |
| F6 | Track Fast-Moving Objects | Ours | **Edge verified 2026-10-22**; other browsers in S20 | In-page playback verified in headed Edge (1.25 → 3.75 s, pause holds). Remaining: Safari, iOS and Android in S20. | Us | No | `page-15-dtof-dev-kits.md` v4 pass |
| F7 | Outdoor application row (#160) | Asset | Verify | Icons for five use cases: supply, or approve the accent-ruled text cards. | Lumotive | No | `page-15` handoff |

Resolved on this page by `1787714400`: F1, Simon's IMG_0031 (NM120 with heatsink) is the hero as `hero-nm120-heatsink.webp`, whole and right of the copy from 1024px, whole at 768px, a full-band backdrop on phones (new `mediaAnchor`, plus the page-14 phone options). A2 "NM120 enclosed unit" now uses the transparent original (`nm120-sensor.webp`, from the existing `nm120-module.png`) on the approved panel frame. Copy verified verbatim against v3; pending tiles and "Modular by Design" still held.

## Page 16 — Connect `/connect` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| C3 | From Compact to Hyperscale | Decision | Verify | Simon linked the lumotive.com combined graphic [OCS-Reference-Designs](https://lumotive.com/wp-content/uploads/2026/05/OCS-Reference-Designs.png) (largest is 1209×532). The section is KEEP AS IS and the live panels already show both designs with real text, so it was not swapped. The graphic bakes its spec text into pixels and adds "Control: Industry-standard SDN" and "Variants: O-band & C-band". Keep the panels, or use the graphic? | Lumotive / Claudia | No | p16 A3 |
| C4 | From Compact to Hyperscale — copy | Decision | Verify | Marked KEEP AS IS, yet the PDF prints a different heading and intro; printed copy is live. Confirm. | Claudia | No | `page-16-connect.md` l.65 |
| C6 | Optical Matters Now — Google 40% / 30% figures | Decision | Verify | Dev note asks to cite Google's publication. Candidate: Google "Jupiter Evolving" (SIGCOMM 2022) / Google Cloud Jupiter blog; Lumotive must confirm source and that the figures match. | Lumotive | Yes | PDF p16 dev note |
| C7 | Send Light / Switching at Semiconductor Scale icons | Asset | Verify | Existing icons no longer match approved titles (none for "Compact"). Supply icons, or approve text cards. | Lumotive | No | `page-16-connect.md` l.105 |

Resolved on this page by `1787714600`: C1 hero (Simon's OCS ports-and-lasers, local `home-2d-photonic-news.webp`), C2 2D beamforming visual beside block 7 (`ocs-fabric.webp`; new optional `media` on stacked CTAs), C5 use-case photos as 16:9 crops of the existing local copies. Copy verified verbatim against v3. In-page playback of Vimeo 1227505713 confirmed in Edge on 2026-10-22 (S19); other browsers remain S20. The stacked-CTA `media` change was re-checked on 2026-10-21: the eleven stacked CTAs without media on other pages render byte-identical markup to before it.

## Page 17 — About `/about` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| AB2 | Recognized for Pioneering… (awards) | Asset | Missing | Official badge artwork for the five awards (names and links already live). | Lumotive | No | PDF p03, p04 |
| AB3 | Investors | Decision | Verify | Final investor logo list (pending box: leave out until supplied). PDF lists Gates Frontier, Amazon, Samsung Ventures, Swisscom Ventures, **Hokuyo**, MetaVC + "[Full list from staging]"; live shows the 9-logo staging list without Hokuyo. Confirm the list and whether Hokuyo belongs. | Lumotive | Yes | PDF p17 |
| AB4 | Work With Us | Tech | Verify | LinkedIn follow line; see S1. | Lumotive | Yes | — |
| AB5 | Leadership — Sajid Husain bio | Decision | Verify | "beam steering" → "beamforming" was applied inside a personal bio. OK? | Claudia | No | QA phase-1 |
| AB6 | Hero framing | Decision | Verify | The desktop band (about 1.9:1 at 1440, 2.5:1 at 1920) crops Simon's 3:2 photo top and bottom: hand, optics and shirt show, the face is cut at the chin (as in the original). Acceptable as is, or prefer different framing? No polish planned until Claudia reviews. | Claudia | No | `page-17-about.md` v3 QA |

Resolved on this page by `1787714700`: AB1 hero, live as `hero-about-bench.webp` from Simon's IV2.26.18, which is the hero lumotive.com/about serves today, so it is the "existing" hero the KEEP AS IS slot names. Phone-only strong shade added (body 4.24 → 6.38:1 at 390). Copy verified verbatim against v3 (empty diff).

## Page 18 — Culture & Careers `/culture` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| CU1 | Hero source | Decision | Verify | Simon's IMG_4516 is now the hero, as placed. Note: lumotive.com/culture's current hero is [IMG_4575](https://lumotive.com/wp-content/uploads/2025/04/IMG_4575-1-scaled.jpg) (team holding a Lumotive box); IMG_4516 is that page's closing band. Keep IMG_4516, or use IMG_4575 (one-value change)? | Claudia (Simon) | No | p18 A1; `page-18-culture.md` |
| CU2 | Help Us Make Light Programmable | Tech | Verify | LinkedIn follow line; see S1. | Lumotive | Yes | — |
| CU3 | Open Roles | Decision | Verify | Live Lever feed shows the six newest postings. OK, or filter by team/featured? | Lumotive | No | `page-18-culture.md` l.87 |

Resolved on this page by `1787714800`: hero live as `hero-culture-team.webp` from Simon's IMG_4516, framed with existing options (`mediaAnchor 0%`, `mobileMediaPosition 100%`, phone-only strong shade) so the body line measured at least 4.5:1 at the brightest backdrop pixel at every width tested (was 3.21:1 at 390, 3.96:1 at 768; screenshot measure, see S26 — at 1024px viewport height 768 later measured 4.22). "The Lumotive Way" (YouTube AcLAbtIxN64) confirmed playing in-page. Copy verified verbatim against v3 (empty diff).

## Page 19 — Partners `/partners` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| PA1 | Hero framing | Decision | Verify | Simon's Partners-Hero (lumotive.com's current Partners hero) is now live. From 768px the LCM module sits on the left, behind the headline under the dark side of the shade, so the circuit art carries the right; on phones the module is centred behind the copy. Acceptable, or reframe? No polish planned until Claudia reviews. | Claudia | No | `page-19-partners.md` v3 QA |
| PA2 | Module and Solution Providers | Asset | Missing | Leopard Imaging logo (#121). | Lumotive | Yes | PDF p19 |
| PA3 | Technology Partners | Asset | Missing | onsemi logo (first in order). | Lumotive | Yes | PDF p19 |
| PA4 | Module and Solution Providers | Decision | Verify | The existing "≡ PHOTONICS" mark is shown as Electronic Photonics; page 04 still lists the logo as pending. Confirm it is current, or supply a new one. | Lumotive | No | `page-19-partners.md` l.77 |

Resolved on this page by `1787715000`: hero live as `hero-partners-lcm.webp` from Simon's Partners-Hero, which lumotive.com/partners serves today, so it is the "existing" hero the KEEP AS IS slot names. The old image's phone focal point (100%) is dropped; centred keeps the module in frame. Copy verified verbatim against v3 (empty diff); hero text measured ≥ 7.05:1 at the brightest backdrop pixel at 360–1440 (screenshot measure, see S26).

## Page 20 — News & Events `/news` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| N1 | Posts | Asset | Missing | Leopard Imaging announcement, LI140 and ON140 kits, VISION 2026: copy, date, category, image. Images are supplied (Leopard v3, LI140/ON140 card v4); the copy is not. The Leopard–Lumotive "Sirius Max" release is public (PR Newswire, around 2026-09-24); import it with approval? Its wording says "beam-steering" (rule 1). | Lumotive | Yes | PDF p04; p05 A2; `v4-checklist.md` |
| N2 | Stay Up to Date | Asset | Missing | Press contact email, or approval to drop the line. | Lumotive | Yes | PDF p20 pending box |
| N3 | Stay Up to Date | Decision | Missing | Social channels beyond LinkedIn, or confirm LinkedIn only. | Lumotive | Yes | PDF p20 pending box |
| N4 | Card images (72 of 112 posts have none) | Decision + Asset | Verify | (a) Sign off reuse of announcement visuals on 35 coverage posts; (b) article images or nominated product shots for 24 pieces; (c) visuals for 13 press releases from 2019–21, or approval to run them without. | Lumotive | Yes | `page-20-news.md` l.117–198 |
| N5 | Events tab | Asset | Missing | First Events post (tab is live and empty). | Lumotive | No | — |
| N6 | Stay Up to Date | Ours | Do (after S1, N2, N3) | Publish the follow block. | Us | Yes | — |
| N7 | Post source links | Asset | Verify | Re-checked 2026-10-22 in a browser, 21 links that automated checks could not confirm: **3 dead** (Morningstar e-Photonics release, 404; Yahoo Finance MD41 story, "page can't be found"; 2cm.com.tw AGV/AMR story, 404). Supply replacement URLs or approve removing the link on those posts. The Invest Vancouver case-study PDF, listed dead before, opens again. **5 sites block automated visits** (Forbes ×2, bizjournals ×3) and need a person to click through. WSJ shows headline and standfirst behind its paywall. The other 12 work. | Lumotive (dead links); Us (click-through) | No | `qa-final\links\results.json`; `page-20-news.md` v3 QA |

v3 pass 2026-10-21: empty v2→v3 diff and no Simon annotations, so no content or asset changed and nothing was invented. One layout fix: the newsroom now aligns with the header container at every width (was 28px vs 80px at 1440). Filtering, search and pagination verified; all 112 post links answer 200 at a normal pace (rate limit: S27).

## Page 21 — Contact `/contact` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| CT1 | Lumotive Offices | Asset | Missing | Which address is wrong and the correct one (#137). | Lumotive | Yes | PDF p04, p21 |
| CT2 | Form hidden fields | Tech | Missing | Pipedrive configuration; see S3, then S28. | Lumotive | Yes | — |
| CT3 | Follow line | Tech | Verify | See S1. | Lumotive | Yes | — |
| CT4 | Not Ready to Reach Out — "See LCM in action" | Ours | **Done on the local site 2026-10-22** | "Interactive explorer" now links to `/lcm-explorer/index.html` (was `/platform`), still in the same tab (`1787715600`). | Us | — | `page-21-contact.md` |

v3 pass 2026-10-21: empty v2→v3 diff, no Simon annotations, no content change. The v2 hidden-field plumbing (query parameters on the form URL) would have corrupted Pipedrive's embed URL and lost the source page on internal clicks; rebuilt on Pipedrive's JavaScript-variable mechanism (`window.pd_webform`), proven for direct, UTM, CTA-click, header-click and same-page cases with all outbound writes blocked. Pipedrive validation (required fields, email format) verified without submitting.

---

## Resolved — removed from earlier lists

| Item (earlier list) | Resolution | Evidence |
|---|---|---|
| Platform LM10 photo; LCM Chips hero, LM10/LS20 column photos | Supplied by Simon and integrated | `1787712800`, `1787712900` |
| Release cleanup S11, S13–S18, H6; hero and image-backed contrast S26 (2026-10-21) | Done; see each row. S18 and S26 still get a client or real-browser look before they are closed | `1787715200`–`1787715400`; Header, HeroFullHeight, PostsFeatured, CardsPeelBento, CardsPeelScene, LogosMarquee, sitemap |
| Applications card images (5 of 8 "missing"); AMR video confirmation | 7 photos integrated; AMR animation confirmed by frames | `1787713000` |
| Platform Vimeo 1040582713 playback | Played in-page in a visible Edge window on 2026-10-22 (headless Chromium hits Vimeo's bot check). Other browsers are in S20 | S19; page-06 handoff |
| Sense HDR demo visual | Vimeo 1235957120 "Lumotive HDR" supplied and embedded (21:9) | p09 A6; `1787713100` |
| Sense #119 section images; application photos; meta description | Supplied and integrated as local WebP; SE4 fit confirmed visually | p09 A1–A5; `1787713100` |
| Robotics hero; kit photos | Hero live via the existing `market-agv.jpg` (`1787713400`). All four kit photos are on the panel since the v4 pass (R3/R4, `1787716100`) | p10 A1–A3; `page-10-robotics.md` |
| Automotive hero | Live as `hero-automotive.webp` with desktop framing (`1787713500`) | p11 A1 |
| Dev Kits TX10, NM120, MD180 photos | Live on the p03 grey kit panel (`1787713700`). The iToF row (ON140, LI140, M30) followed in the v4 pass (D3/D6, `1787716500`) | p12 A1–A4; `page-12-dev-kits.md` |
| Transmit hero still image | Live as `hero-tx10-in-hand.webp` (`1787713800`); only the #129 animation question remains (T2) | p13 A1 |
| iToF "Photo: M30 with kit contents" | Live as transparent `m30-dev-kit-contents.webp` on the panel frame (`1787714200`), from Simon's IMG_7224 | p14 A1 |
| iToF compact M30 AMR demo clip | Live: Vimeo 1174547871 in "See It on Your Bench" (`1787714100`); in-page playback confirmed | p14 A2 |
| dToF hero banner (#161) | Live as `hero-nm120-heatsink.webp` from Simon's IMG_0031 (`1787714400`) | p15 A1 |
| dToF "NM120 enclosed unit" photo | Live as transparent `nm120-sensor.webp` on the panel frame (`1787714400`); the existing `nm120-module.png` is identical to Simon's IMG_0032 | p15 A2 |
| Connect hero, 2D beamforming visual, use-case images | Live (`1787714600`): C1, C2, C5 | p16 A1, A2, A4, A5 |
| About hero (AB1) | Live as `hero-about-bench.webp` (`1787714700`); Simon's IV2.26.18 is lumotive.com's current About hero | p17 A1 |
| Partners hero (former PA1 swap) | Live as `hero-partners-lcm.webp` (`1787715000`); Simon's Partners-Hero is lumotive.com's current Partners hero; framing confirmation only (PA1) | p19 A1 |
| Culture hero | Live as `hero-culture-team.webp` (`1787714800`), Simon's IMG_4516; source confirmation only (CU1) | p18 A1 |
| Culture "The Lumotive Way" video | Already embedded; oEmbed title confirmed | `culture#979b8fc6` |
| Robotics virtual-sensor headings reconstruction | The v3 render reads "Localization", "Cliff and obstacle", "Object avoidance", as built | p10 render |
| Robotics "Module and Solution Providers" logo strip | Not on page 10's composition (only the approved sentence, which ships); not a page-10 blocker | PDF p10 text |
| Electronic Photonics logo as a blocker | Existing mark reads "≡ PHOTONICS"; downgraded to confirmation (PA4) | `page-19-partners.md` |
| Site-wide "beam steering" audit (13 strings) | Done by `1787712600` + Platform cut; 0 occurrences in page records | CMS scan |
| `/dev-kits/*`, `/sense/robotics`, `/sense/automotive` 404s | All pages built; all redirects 308 | `redirects` table |
| v3 copy deltas pages 09–21 | All five strings live | CMS scan |
| Pages 13–21 "not implemented" (in `current-progress.md`) | Stale: all implemented with handoffs | `page-13`…`page-21` handoffs |

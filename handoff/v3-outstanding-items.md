# Lumotive website — outstanding items, pages 05–21 (v3, updated for v4)

First audited 2026-10-20; **last updated 2026-10-22** for the v4 PDF (annotations only, no copy change). Branch `feedback-20261007-v2`, local only; `vite.config.ts` uncommitted by design.

**v4 (2026-10-22):** v4 supplies most of the media listed below, and two requests were withdrawn with "Disregard" (P1, AU4). The page-by-page v4 checklist, the asset validation and the open readings are in `handoff/v4-checklist.md`. In the tables, **Supplied v4** means the file is linked, validated and mapped to its slot but **not yet on the site**. A row becomes Done only when it is implemented and verified in its page pass.

**This file is the single authoritative outstanding list.** It supersedes the client-question list in `handoff/v3-page-checklist-and-home.md` and the "Blockers" sections of the per-page handoffs where they disagree. The three groups below are the working list; the tables after them keep the detail and evidence per ID.

## A. Client inputs (Lumotive, routed through Claudia)

Nothing here can be finished on our side without it. Each item may ship omitted under the package's "leave it out rather than publish a placeholder" rule.

**Supply**
1. **LinkedIn company URL** (S1). One URL publishes the footer icon and the follow lines on About, Culture, News and Contact (AB4, CU2, N6, CT3).
2. **Privacy policy** text, or approval to port lumotive.com's (S2). The footer link on every page 404s until then.
3. **Pipedrive form configuration** (S3, via Josh): three Text custom fields and three Hidden fields reading the JavaScript variables `inquiry`, `source_page`, `campaign`, published, and added to the notification email. No API keys needed.
4. **Office address correction** (#137, CT1).
5. **News follow block:** press contact email or drop the line (N2); other social channels, or LinkedIn only (N3).
6. **NM120:** Stella-120 sensor-head power figure (F2); permission to state "NM120 sensor head outputs MIPI" (F3); internals photo (F4).
7. **Logos and badges:** Leopard Imaging (SE5 = D4 = PA2), onsemi (PA3), award badges (AB2), final investor list and whether Hokuyo belongs (AB3).
8. ~~Photos~~ **Supplied in v4:** LI140 and ON140 (R4 = D3 = I7), the Dev Kits and iToF family shots (D1, I1), and the "Your Application" visual (A1).
9. **Media:** mostly **supplied in v4**: Explorer (S6), 1D/2D video (P2), "How LCM fits" visual (L1), three-panel video (R2), cocoon diagram (AU2), 180° slot photo (AU3), ROI animation (T3), warehouse point cloud (I5), scan-modes art (I6). **Withdrawn ("Disregard"):** #125 optics graphic (P1), dust/rain images (AU4). **Still open:** the Explorer's fallback video `lcm-animation.mp4` (404 on lumotive.com) and its poster frame, or confirmation of the explorer's own title frame (S6); the flood-illumination animation, or confirmation that one GIF covers both slots (T3); whether the outdoor video replaces the slide image or clean renders still come (I3); the analytics tool, its content and name (S7).
10. **News content:** the Leopard, LI140/ON140 and VISION 2026 posts (N1 = H1). Decision 2026-10-22: the approved fallback posts stay; nothing is imported or rewritten yet. **Ask:** the LI140/ON140 post copy (its card image is supplied in v4), and approval to import the Leopard release (public on PR Newswire, around 2026-09-24). Also card images or approval to run without (N4), the first Events post (N5), and replacement URLs for four dead source links or approval to remove them (N7).

**Decide or confirm**
- Hero framing: About desktop crop (AB6), Partners module behind the headline (PA1), Culture source IMG_4516 vs lumotive.com's IMG_4575 (CU1).
- Status labels: publish or drop (S8). Provider strip now with 3 of 4 logos, or wait for Leopard (SE6, D4). The LI140/ON140 photos are supplied in v4, so the Robotics kit row (R3) and the Dev Kits iToF row (D6) are now ours.
- TX10 still versus the #129 animation (T2); Google citation source (C6). F5 is answered in v4: the HDR video serves dToF too.
- v4 readings to confirm (conflicts 2–5 in `v4-checklist.md`): one visual on LCM Chips, the merged GIF on Transmit, the static scan-modes art, Automotive's photo and diagram. (Decided: the duplicate Home tile photo stays; Robotics uses Simon's M30 photo with its white background removed.)
- **#125 (P1):** confirm that the v4 "Disregard" withdraws the redraw; Webvizio #125 stays open until Claudia confirms.
- **Explorer (S6):** the intro "Change the phase pattern across the metasurface…" promises a control the supplied tool does not have (it is a guided animation with a timeline); keep or reword. (Phones are decided: they open the explorer in a new tab.)
- Heading tracking for Webvizio #138 (S18): band hero headlines moved from −0.055em to −0.03em to stop touching glyphs; close #138 only after review.
- Contact: preselecting "I am interested in" is not possible from the page (S4); inquiry values (S5).
- Smaller confirmations: H2, H3, H5, P4, P5, A3, SE7, SE9, C3, C4, C7, F7, AB5, CU3, PA4, S9, S10, S12.

## B. Our remaining work

1. **Cross-browser and device QA** (S20): Safari, Edge, iOS Safari, Android Chrome. Include, in a real browser:
   - in-page Vimeo playback of 1227505713 (`/applications`, `/connect`), 1235957120 (`/sense`) and 1102359216 (`/dev-kits/dtof`) (S19, A4, SE10, F6). A visible Microsoft Edge window passes Vimeo's bot check where automated Chromium does not: on `/platform`, 1237753837 and 1040582713 both played there on 2026-10-22;
   - the Explorer on Safari, iOS Safari and Android (S6): in-page, full screen, and the no-WebGL-2 path;
   - a manual or tool-based contrast review of hero and image-backed text (S26); our figures are a screenshot measure, not a sign-off;
   - the new header behaviour (S16): label opens the page, arrow or hover opens the menu, keyboard Escape.
2. **Contact form end-to-end** on staging once S3 is configured (S28).
3. **PocketBase rate limit** (S27): implement the agreed option after Josh confirms the network layout (options and recommendation in the S27 row).
4. **Platform swap-card band** re-check (P6).
5. **Social preview image**: propose a default for approval (S12); map the open Webvizio image tasks with Claudia (S10).
6. **`vite.config.ts`**: commit on its own or drop (S25).
7. **v4 inputs to implement, page by page (11–15):** AU2, AU3, D1, D3/D6, T3 (ROI slot), I1, I4, I5, I6, I7, F5. (Done on the local site: Page 06's P2 and P3, Contact's CT4, Page 07's L1/L2, Page 08's A1, Page 10's R2–R4. Page 09 had no v4 change.) **Still waiting on inputs:** F2–F4 together, the N6 follow block, LinkedIn wiring (S1).

## C. Staging and release blockers (Josh + us)

1. **PR #1** needs an approving review from someone other than the pusher; only `josh-scalestorm` can approve and merge (S21).
2. **Ship pages 05–21**: after PR #1, rebase this branch onto `origin/main` as reviewable PRs, excluding `vite.config.ts` (S22).
3. **Staging database backup** to dry-run every migration before deploy; most are guarded and silently no-op on edited content (S23).
4. **Dokploy/GHCR secrets**, app IDs and `ORIGIN` for staging and production (S24).
5. **PocketBase rate limit decision** before launch (S27).
6. **Pipedrive configuration and one test submission** (S3, S28).
7. **Privacy policy** page (S2) and **cross-browser QA** (S20).

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
| S2 | `/privacy-policy` (footer legal link on every page) | Asset | Missing | Policy text, or approval to port `https://lumotive.com/privacy-policy/` (live, 200). The package does not specify it. | Lumotive | Yes | Route absent; staging also 404s |
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
| S16 | Top-level menu labels navigate on click (PDF p02) | Ours | **Done 2026-10-21** | Platform → /platform, Sense → /sense, Company → /about. Each group is a label link plus an arrow button (`aria-expanded`/`aria-controls`); desktop opens on hover or arrow, closes on leave, focus-out and Escape (focus returns to the arrow); mobile accordion arrow 44×44, label opens the page and closes the panel. Real-browser check under S20. | Us | — | `Header.svelte`, `app.css`, `1787715300` |
| S17 | Third-level nav rows | Ours | **Done 2026-10-21** | Transmit modules / iToF / dToF rows 34 → 44px (desktop); mobile rows 54px. | Us | — | `Header.svelte` |
| S18 | Heading character spacing (#138, rule 15) | Ours | Done; client review | Audit renders each adjacent glyph pair of every Oswald heading on all 17 pages at 390/768/1440/1920 and checks real ink overlap. Band hero headlines at −0.055em touched ("ra", "gn", "ta", "rt" on 10 pages); now −0.03em, which clears all but a 2px² "vy" sliver in "Heavy" (Automotive, ≥768). Remaining touches are "ff" at normal tracking, which is the typeface's own design. Some band headlines now wrap one line more (Sense from 768 up; Contact at 390). Close #138 only after Claudia reviews. | Us → Claudia | No | `HeroFullHeight.svelte` |
| S19 | Real-browser playback of all embeds | Ours | Verify (in S20) | 2026-10-21 headless check: 1174547871 (`/applications`, `/dev-kits/itof`) and YouTube AcLAbtIxN64 (`/culture`) play in-page. 1227505713 (`/applications`, `/connect`), 1235957120 (`/sense`), 1102359216 (`/dev-kits/dtof`) and 1040582713 (`/platform`) load a blank player or Vimeo's "couldn't verify the security of your connection" screen. 2026-10-22: automated Chromium gets Vimeo's Cloudflare challenge (HTTP 401), so this is Vimeo's bot check, not a site defect. In a visible Microsoft Edge 155 window on `/platform`, 1237753837 played in-page on one click (two runs, e.g. 1.97 → 6.98 s, up to 3840×2160) and 1040582713 started playing after its first click had passed the check in the fresh profile. Still to do: 1227505713, 1235957120, 1102359216. 1053591397 is a link, not an embed. | Us | No | QA 2026-10-21, `page-06-platform.md` |
| S20 | Cross-browser and device QA | Ours | Do | Safari, iOS Safari and Android have never been tested. Edge was used only on `/platform` (2026-10-22: Vimeo playback and the Explorer); everything else is Chromium only. Required before launch, and for the Explorer's phone and no-WebGL-2 decisions. | Us | Yes | All handoffs |
| S21 | PR #1 (Home to staging) | Tech | Verify | `main` ruleset needs an approving review from someone other than the pusher. Only `josh-scalestorm` can approve and merge. Current PR state cannot be read anonymously. | Josh | Yes | `page-05-home-staging-deploy.md` |
| S22 | Ship pages 05–21 to staging | Ours | Do (after S21) | After PR #1, rebase the local branch's work onto `origin/main` as reviewable PRs. The PR #2 plan in `pr2-platform-lcm-chips-footer.md` is out of date (covers 06–07 + footer only). Exclude `vite.config.ts` unless committed on its own. | Us | Yes | `git log`; 50+ local commits |
| S23 | Staging database vs migrations | Tech | Verify | Most migrations are guarded on prior values and silently no-op if staging content was edited. Need a recent staging `pb_data` backup to dry-run all migrations before deploy. | Josh + Us | Yes | Migration guard pattern |
| S24 | Dokploy/GHCR secrets and variables | Tech | Verify | Confirm `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `DOKPLOY_PB_APP_ID`, `DOKPLOY_WEB_APP_ID` and `ORIGIN` are set for staging and production. | Josh | Yes | `.github/workflows/publish.yml`, README |
| S25 | Uncommitted Windows watcher fix | Ours | Do | Commit `vite.config.ts` on its own, or drop it. Never sweep it into a page commit. | Us | No | `git status` |
| S26 | Hero and image-backed text contrast | Ours | Fixed; manual recheck in S20 | All known low spots fixed with shade options only: new phone `mobileShade: max` (Home video, Transmit, LCM Chips, Applications, Automotive), About back to phone `strong`, new `tabletShade: strong` (768–1023: Home, Transmit, Culture, Contact). Sweep on real data: 15 photo heroes × 7 widths (360–1920) plus 29 Home video frames; every line ≥ 4.5:1 at the **brightest** backdrop pixel (body lowest 4.62), headings ≥ 3:1. Home bento photo cards were at 2.8:1 (title over the bright warehouse photo); overlay strengthened, now ≥ 5.65:1. All other image-backed text (closing CTAs, 34 blocks at 390/1440) ≥ 5.65:1. Screenshot measure, not an accessibility sign-off. | Us | Yes | `1787715400`; `HeroFullHeight.svelte`; `CardsPeelBento.svelte` |
| S27 | PocketBase rate limit vs server-side rendering | Tech | Verify (decision) | **Cause:** `1700000250_platform_limits.js` enables PocketBase's rate limiter, which activates its default `/api/` rule: 300 requests per 10 s per client IP. Every page render makes 5–6 PocketBase calls (four globals plus the page or post lookups), all from the SvelteKit server's IP, so every visitor shares one budget of about 50–60 renders per 10 s. The local 500s were a crawl at ~36 pages/s (3,312 × 429 in the PB log). The guest rules (`editors:authWithPassword`, `form_submissions:create`) are likewise keyed on the server IP, so they are site-wide, not per visitor. **Options, not applied:** (1) cache the four globals in the SvelteKit server for ~60 s: 1–2 calls per render, editors see global edits within a minute; (2) exempt or raise the limit for the web container's address (`rateLimits.excludedIPs` or a dedicated rule) if PocketBase is reachable only through the web app; (3) forward the visitor IP (`X-Forwarded-For` from SvelteKit + `trustedProxy.headers` in PocketBase) so limits are per visitor again; only safe if PocketBase cannot be reached directly, otherwise the header can be spoofed. **Recommendation:** (1) now; (3) if staging/production PocketBase is internal-only. Josh to confirm the network layout and the staging settings. | Josh + Us | Yes | PB logs; `pb_data` settings; `+layout.server.ts` |
| S28 | Contact form end-to-end | Ours | Do (after S3) | One real submission on staging, agreed with Lumotive and deleted afterwards, confirming the three values reach the CRM record and the notification email. Not run locally by design (no real notifications or CRM records). | Us + Lumotive | Yes | `page-21-contact.md` |

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
| H1 | Latest From Lumotive | Asset | Missing (image supplied v4) | Same as N1. v4 supplies `LI140-ON140-iToF.png` for the LI140/ON140 card; it is held, because the post and its copy do not exist and no placeholder post is made. Decision 2026-10-22: the approved fallback posts stay (the real featured post plus the two newest press releases); ask for the LI140/ON140 copy and the Leopard import approval (A10). | Lumotive | No (Home) | `posts.server.ts`; PDF p05; `v4-checklist.md` |
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
| P6 | Swap-card band (QA M1) | Ours | Verify | Re-check the ~100px band where both swap cards sat under 0.5 opacity; fix if still present. | Us | No | QA phase-1 M1 |
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
| A4 | Programmable Optics in Motion | Ours | Verify (in S20) | In-page playback of 1227505713; see S19. | Us | No | — |
| A5 | Meta | Ours | **Done** | See S11. | Us | — | `1787715200` |

## Page 09 — Sense `/sense` (v3 pass done 2026-10-20, commit below)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| SE5 | Module and Solution Providers | Asset | Missing | Leopard Imaging logo (not in the repo). | Lumotive | Yes | PDF p09 |
| SE6 | Same | Decision | Verify | `/partners` already ships this strip with 3 of 4 logos. Build it on `/sense` and `/dev-kits` the same way now, or wait for Leopard? | Claudia | Yes | `partners#c5fe1eab` |
| SE7 | Page placement | Decision | Verify | PDF p08 says three Applications sections move "to Sense"; PDF p09 shows none of them. Not added; copy preserved in `1787709500` down path. Confirm. | Lumotive (Apurva) | No | `page-09-sense.md` "Open question" |
| SE9 | The Problem intro; closing CTA body | Decision | Verify | Both are KEEP AS IS, but the PDF prints different wording ("…efficiency today's autonomous machines need."; "(field of view, range, form factor) … point you to"). Staging text kept. Switch to printed text? | Claudia | No | `page-09-sense.md` Blockers 3 |
| SE10 | HDR video in-page | Ours | Verify (in S20) | Confirm 1235957120 plays inside `/sense` in a real browser; see S19. | Us | No | page-09 v3 QA |

Resolved on this page by `1787713100`: SE1 perception photos, SE2 HDR video placed in a 21:9 frame (in-page playback still pending, SE10), SE3 application photos, SE4 (the "Robotaxi" file is an aerial traffic scene that fits "intersection"), SE8 meta description.

## Page 10 — Robotics `/sense/robotics` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| R2 | One Sensor, Three Jobs | Asset | **Done on the local site 2026-10-22** | Vimeo 1237762150 in the benefits split, on the right of the bullets (`1787716100`); in-page playback confirmed in Edge (0.45 → 8.45 s). The printed placeholder caption describes the asset and is not shown. | Us | — | `page-10-robotics.md` v4 pass |
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
| AU2 | A Programmable Cocoon Around the Vehicle | Asset | **Supplied v4** | `lumotive-fov-regions-scaled.png` (2560×1256): side and top views of near, mid and far fields (10/20/50 m) with no vehicle drawn. Applied as linked unless Lumotive objects. | Us (page 11) | Yes | v4 p11 |
| AU3 | First Solid-State 180° dToF Lidar at 30 FPS | Asset | **Supplied v4** | `IMG_9388` (the MD180 product photo) in place of a point cloud or video; it is the same photo as the existing `kit-md180.webp`, so it is reused. | Us (page 11) | Yes | v4 p11 |
| AU4 | Built for Real-World Conditions | Asset | **Withdrawn v4** | "Disregard" on the dust/rain image row. The section ships as it does today: copy and five cards with no images. | — | — | v4 p11 |
| AU5 | Hero | Asset | Verify (optional) | The supplied render is 1280×719 (the original upload) and is upscaled about 1.6× by the desktop framing. A larger original would sharpen it. | Lumotive | No | `page-11-automotive.md` |

Resolved on this page by `1787713500`: AU1 hero, live as `hero-automotive.webp` with desktop framing (`mediaShift 20%`, `mediaScale 1.4`) so the car clears the headline. Copy verified verbatim against v3.

## Page 12 — Dev Kits `/dev-kits` (v3 pass done 2026-10-20)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| D1 | Hero | Asset | **Supplied v4** | `Lineup.png` (2500×1667 cut-out, five kits), linked by `wscgr`. Page 12 pass. | Us (page 12) | No | v4 p12 |
| D3 | Find Your Dev Kit · iToF | Asset | **Supplied v4** | `ON140.png` (card 1), `LI140.png` (card 2). | Us (page 12) | Yes | v4 p12 |
| D6 | Find Your Dev Kit · iToF | Ours | Do (page 12) | The decision of 2026-10-21 now applies: add all three photos on the grey panel, M30 as the existing `m30-dev-kit-contents.webp`. | Us | No | `page-12-dev-kits.md` |
| D4 | Module and Solution Providers | Asset/Decision | Missing | Not built here. See SE5 (Leopard logo) and SE6 (ship 3 of 4 now?). | Lumotive / Claudia | Yes | PDF p12 |

Resolved on this page by `1787713700`:
- D2: TX10, NM120 and MD180 photos on the p03 "photo on light grey panel" treatment (new opt-in `mediaFrame: "panel"`), as transparent WebPs.
- D5: meta description from the hero.
- Copy verified verbatim against v3.

## Page 13 — Transmit Modules `/dev-kits/transmit-modules` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| T2 | Hero — #129 | Decision | Verify | #129 asks for an *animation* labelling the Tx optics. Simon supplied a still (TX10 in hand), now live. Does the still close #129, or is the animation still wanted? #129 stays open until decided. | Lumotive (Simon) | Yes | PDF p13, p04 |
| T3 | Programmable Illumination for a Dynamic World | Asset | **Partly supplied v4** | `RandomScanOrderWarehouse.gif` (1923×1384, 12 frames, 3.6 s; "#154 + #155 merged") is the ROI-pulse animation. Still needed: the flood-illumination animation, or confirmation that this one GIF replaces both slots (v4 conflict 3). | Lumotive (Simon) → Us | Yes | v4 p13 |

Resolved on this page by `1787713800`: T1 hero, live as `hero-tx10-in-hand.webp` (A1) with the phone-only strong shade, which raised the measured body contrast over 4.5:1 at the 99th percentile (screenshot measure; brightest pixel still lower, see S26). Copy verified verbatim against v3.

## Page 14 — iToF Dev Kits `/dev-kits/itof` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| I1 | Hero | Asset | **Supplied v4** | `LI140-ON140-M30.png` (2500×1667 cut-out), linked by `wscgr`. | Us (page 14) | No | v4 p14 |
| I3 | Better Data, Safer Robots | Asset | Verify | v4 notes Vimeo 1053591397 on the slide image. Does the video replace the slide, or do clean renders still come? | Lumotive (Simon) | Yes | v4 p14 |
| I4 | Same | Decision | **Answered v4** | The video is 1053591397 "LCM-based iToF Sensor Performance Outdoors" (1:08), today only a text link. Page 14 pass. | Us (page 14) | No | v4 p14 |
| I5 | High-Resolution Depth Across a Wide Field | Asset | **Supplied v4** | `High-Resolution-Depth-Across-a-Wide-Field.png` (1620×984, depth map and point cloud, labels baked in); also the ON140 shared frame. | Us (page 14) | Yes | v4 p14 |
| I6 | Software-Defined Scanning | Asset | **Supplied v4** | `lumotive-scan-modes-scaled.png` (2560×909): one static strip of all five modes with specs baked in, not per-mode art. Decide between a static image and per-mode crops behind the tabs (v4 conflict 4). | Us → Claudia | Yes | v4 p14 |
| I7 | LI140 and ON140 sections | Asset | **Supplied v4** | `LI140.png`, `ON140.png` for the two kit openers. | Us (page 14) | Yes | v4 p14 |
| I8 | Secondary actions | Decision | Verify | See S5(a). | Apurva | No | — |

Resolved on this page by `1787714100`: I2, Simon's compact M30 AMR clip (Vimeo 1174547871/6e198e52ae, "Lumotive - AGV AMR", 16:9) now plays in-page in "See It on Your Bench", right-hand as printed. A1 (M30 with kit contents) was already live as `m30-dev-kit-contents.jpg`, re-verified identical to IMG_7224. Copy verified verbatim against v3.

## Page 15 — dToF Dev Kits `/dev-kits/dtof` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| F2 | NM120 spec tiles — POWER | Asset | Missing | Stella-120 sensor-head power figure (the `[X] W` placeholder is unpublishable). | Lumotive | Yes | PDF p04, p15 |
| F3 | NM120 spec tile INTERFACE + "Modular by Design" | Decision | Missing | Confirm "NM120 sensor head outputs MIPI" may be stated publicly; the tile and whole section rest on it. | Lumotive | Yes | PDF p04, p15 |
| F4 | Modular by Design | Asset | Missing | NM120 internals photo, enclosure removed, head and compute board separate. | Lumotive | Yes | PDF p15 |
| F5 | HDR Without Losing Frame Rate | Decision | **Answered v4** | Simon linked Vimeo 1235957120 "Lumotive HDR" here too: one video serves `/sense` and `/dev-kits/dtof`. Page 15 pass: embed, then the in-page check. | Us (page 15) | Yes | v4 p15 |
| F6 | Track Fast-Moving Objects | Ours | Verify (in S20) | Content confirmed from the Vimeo thumbnail of 1102359216 (basketball at 90°/10 fps, 40°/22 fps, 10°/80 fps). Remaining: in-page playback in a real browser; see S19. | Us | No | p15 v3 QA |
| F7 | Outdoor application row (#160) | Asset | Verify | Icons for five use cases: supply, or approve the accent-ruled text cards. | Lumotive | No | `page-15` handoff |

Resolved on this page by `1787714400`: F1, Simon's IMG_0031 (NM120 with heatsink) is the hero as `hero-nm120-heatsink.webp`, whole and right of the copy from 1024px, whole at 768px, a full-band backdrop on phones (new `mediaAnchor`, plus the page-14 phone options). A2 "NM120 enclosed unit" now uses the transparent original (`nm120-sensor.webp`, from the existing `nm120-module.png`) on the approved panel frame. Copy verified verbatim against v3; pending tiles and "Modular by Design" still held.

## Page 16 — Connect `/connect` (v3 pass done 2026-10-21)

| ID | Section | Cat. | Status | What is needed | Owner | Blocks | Evidence |
|---|---|---|---|---|---|---|---|
| C3 | From Compact to Hyperscale | Decision | Verify | Simon linked the lumotive.com combined graphic [OCS-Reference-Designs](https://lumotive.com/wp-content/uploads/2026/05/OCS-Reference-Designs.png) (largest is 1209×532). The section is KEEP AS IS and the live panels already show both designs with real text, so it was not swapped. The graphic bakes its spec text into pixels and adds "Control: Industry-standard SDN" and "Variants: O-band & C-band". Keep the panels, or use the graphic? | Lumotive / Claudia | No | p16 A3 |
| C4 | From Compact to Hyperscale — copy | Decision | Verify | Marked KEEP AS IS, yet the PDF prints a different heading and intro; printed copy is live. Confirm. | Claudia | No | `page-16-connect.md` l.65 |
| C6 | Optical Matters Now — Google 40% / 30% figures | Decision | Verify | Dev note asks to cite Google's publication. Candidate: Google "Jupiter Evolving" (SIGCOMM 2022) / Google Cloud Jupiter blog; Lumotive must confirm source and that the figures match. | Lumotive | Yes | PDF p16 dev note |
| C7 | Send Light / Switching at Semiconductor Scale icons | Asset | Verify | Existing icons no longer match approved titles (none for "Compact"). Supply icons, or approve text cards. | Lumotive | No | `page-16-connect.md` l.105 |

Resolved on this page by `1787714600`: C1 hero (Simon's OCS ports-and-lasers, local `home-2d-photonic-news.webp`), C2 2D beamforming visual beside block 7 (`ocs-fabric.webp`; new optional `media` on stacked CTAs), C5 use-case photos as 16:9 crops of the existing local copies. Copy verified verbatim against v3. In-page playback of Vimeo 1227505713 remains S19. The stacked-CTA `media` change was re-checked on 2026-10-21: the eleven stacked CTAs without media on other pages render byte-identical markup to before it.

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
| N7 | Post source links | Asset | Verify | Four "Read the original article" links are dead: Invest Vancouver case-study PDF (host gone), Morningstar e-Photonics release (404), Yahoo MD41 story (404), 2cm.com.tw AGV/AMR story (404). Supply replacement URLs or approve removing the link on those posts. 18 more refuse automated checks (paywalls/bot blocks) and need a manual click-through in final QA. | Lumotive | No | `page-20-news.md` v3 QA |

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
| Platform Vimeo 1040582713 playback | Played in-page in a real Chromium session | page-06 handoff |
| Sense HDR demo visual | Vimeo 1235957120 "Lumotive HDR" supplied and embedded (21:9) | p09 A6; `1787713100` |
| Sense #119 section images; application photos; meta description | Supplied and integrated as local WebP; SE4 fit confirmed visually | p09 A1–A5; `1787713100` |
| Robotics hero; M30 and NM120 kit photos | Hero live via existing `market-agv.jpg` (`1787713400`); M30/NM120 photos supplied, held for a uniform row until LI140/ON140 arrive (R3/R4) | p10 A1–A3 |
| Automotive hero | Live as `hero-automotive.webp` with desktop framing (`1787713500`) | p11 A1 |
| Dev Kits TX10, NM120, MD180 photos | Live on the p03 grey kit panel (`1787713700`); M30 held under D6 until ON140/LI140 arrive | p12 A1–A4 |
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

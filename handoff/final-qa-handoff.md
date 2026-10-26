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
rule and height arithmetic. Examples are the Home bento ("When Light Becomes
Programmable"), `CardsPeelSwap`, `StatsPeelScene`, `TestimonialsPeelScene` and
`SplitPeelBleed`.

Not converted: all six section types share this component. The cover-follow
choreography also couples three moving parts: the hero `coverTween`, the
wrapper's negative margin and the panel `followTween`. It has no single
unambiguous pin target. Convert only with a per-scene visual review.

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
| Admin Site settings | Footer and Header forms now load and save what the site shows (copyright, link columns, legal and social links; menu, dropdowns with descriptions, third-level links, buttons). Saving unchanged kept the content and the public HTML identical; edits appeared for signed-out visitors on the next page load. When the LinkedIn URL arrives (S1), an editor can add it under Footer → Social links | S29 |
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
- **Blocking supplies:** LinkedIn company URL (S1), NM120 power figure, MIPI wording and internals photo (F2–F4), Leopard Imaging and onsemi logos (SE5, PA3), the final investor list (AB3), News post copy and press contact (N1, N2, N3).
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

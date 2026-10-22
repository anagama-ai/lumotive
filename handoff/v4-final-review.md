# Final v4 review and staging handoff

2026-10-22. For Josh (staging) and Claudia (content review). Branch `feedback-20261007-v2`, local only. **Nothing here is on staging yet.** Nothing has been pushed, merged or deployed.

**Follow-up the same day, after this review:** a migration rollback fix that **PR #1 must also carry** (PR dependencies, item 6), a passing migration rehearsal against an `origin/main` baseline (Migrations), the public-globals cache for the rate limit (S27), the P6 swap-band fix, Escape on the phone menu, Edge playback on the remaining pages, and a passing hero and video contrast recheck (S26). A new functional issue, S29 (admin Footer settings do not change the public footer), must be fixed before production launch. Committed locally; details in `v3-outstanding-items.md`. **The short handoff for Josh and Claudia is `final-qa-handoff.md`.**

- **Open items:** `v3-outstanding-items.md` is the single list, in four groups.
- **Detail and evidence:** each page has its own `page-NN-*.md` handoff.

## Where things stand

- **Content:** every v4 input from the PDF is built and checked on the local site. The v4 PDF changed annotations only, not copy.
- **Held back:** items still waiting on Lumotive are left out rather than shown as placeholders (outstanding list, group 2).
- **Staging:** preparation has not started. It needs Josh first (group 4 and "Staging review" below).

## Page by page

"Done" means implemented and checked on the local site. The "Open" column lists only client inputs; our QA is in group 3 of the outstanding list.

| Page | v4 work done (local) | Open with the client |
|---|---|---|
| 05 Home | No v4 change. Fallback posts and the duplicate tile photo kept, as decided | LI140/ON140 post copy, Leopard release import (H1/N1); S8; H2, H3, H5 |
| 06 Platform | 1D/2D video. Self-hosted LCM Explorer (phones open it in a new tab). #125 redraw withdrawn | Explorer fallback video, poster, intro copy (S6); confirm #125 (P1); P4, P5 |
| 07 LCM Chips | "How LCM fits" looping animation with Play/Pause; section centred | GIF labels repeat the copy (conflict 2) |
| 08 Applications | "Your Application" image; CTA left-aligned | S8; A3 |
| 09 Sense | No v4 change | SE5–SE7, SE9 |
| 10 Robotics | "One Sensor, Three Jobs" video in the PDF split; all four kit photos | — |
| 11 Automotive | Coverage diagram full width (scrolls sideways on phones); MD180 photo | Confirm both readings (conflict 5); AU5 optional |
| 12 Dev Kits | Lineup hero; iToF photos; TX10 full width; CTA left-aligned | Provider strip (D4/SE6) |
| 13 Transmit | ROI animation, compact and left-aligned. Wider experiments reverted (`5046533`) | Flood animation, or confirm one GIF for both slots (T3); #129 (T2) |
| 14 iToF | Three-kit hero; in-page comparison video; LI140/ON140 photos; depth frames; static scan-modes figure; tinted benefit cards | Scan modes vs the printed five tabs (I6); I3; I5; I8 |
| 15 dToF | HDR video (21:9) in the HDR section | NM120 power, MIPI, internals photo (F2–F4); icons (F7) |
| 16–21 | No v4 change. Contact: Explorer link and form panel width | S1, S2, S3, CT1, N1–N7, AB2, AB3, PA2–PA4 and others |

### Page 15 review screenshots

Captured in a visible Edge window, with the players loaded but not playing: `%TEMP%\lumotive-review\final-v4\p15-hdr-tracking-{1440,390}.png`.
- **Desktop (1440):** the HDR player (600×257, 21:9) and the tracking player (600×338) sit right of their copy.
- **Phones (390):** each player sits above its copy.

### Video playback

In-page playback was confirmed in a **visible Edge window only**, with pause holding, on **every embed** (2026-10-22):
- `/platform`: two videos.
- `/sense`: HDR video.
- `/sense/robotics`: one video.
- `/applications`: two videos. `/connect`: one video.
- `/dev-kits/itof`: two videos.
- `/dev-kits/dtof`: HDR 2.90 → 5.40 s at 1440 and 3.28 → 5.79 s at 390; tracking 1.25 → 3.75 s at 1440. Pause held on all three runs.
- `/culture`: YouTube video.

**Safari, iOS and Android have not been tested anywhere.** That is our next QA task (group 3, table).

## Staging review (for Josh)

### Code

- **Branch:** `feedback-20261007-v2`. The review commit `0bc7fe9` sits on `b2a95d2`; the follow-up commits from the same day sit on top of it (`git log 0bc7fe9..`).
- **Compared with `origin/main`** (`f203fc1`, 2026-09-24, fetched 2026-10-22):
  - 104 commits ahead before the review commit, 0 behind; `origin/main` is fully merged (`b60cf3f`).
  - 240 files changed, about +26,400 / −280 lines (before the follow-up commits).
- **Excluded:** `vite.config.ts` is an uncommitted Windows watcher fix (S25). It is not in any commit.
- **Local checks after the follow-up:** `npm run check` reports 595 files, 0 errors and 0 warnings; `npm run build` (adapter-node) exits 0.
- **v4 commits:** `fe6a678` … `b2a95d2` (24 commits). This includes the reverted Transmit experiment (`ff3641e`, reverted by `5046533`), which nets to no change.

### PR dependencies

1. **PR #1** is Home, branch `staging-home-page05` at `0b2ff9f`: six commits, six Home migrations.
   - **Not merged:** `origin/main` has not moved. Its review state cannot be read from here.
   - **Already in this branch:** all six commits are patch-equivalent to commits here (`git cherry` marks every one `-`).
2. **The rest of the site** (pages 06–21, the footer and the later Home fixes) is this branch. The old PR #2 plan in `pr2-platform-lcm-chips-footer.md` is out of date.
3. **Conflict evidence:** a dry-run merge of PR #1's branch into this branch (`git merge-tree`, no files touched) conflicts in four Home components:
   - `CardsPeelBento.svelte`
   - `CtaDefault.svelte`
   - `HeroFullHeight.svelte`
   - `PostsFeatured.svelte`

   Later commits here extend the same lines (accessibility, contrast and alignment fixes). Because PR #1 holds nothing that is not already here, the resolution is to keep this branch's version of each file.
4. **Options for Josh:**
   - **(a) Merge PR #1 first.** Then we open one PR with this branch merged with the new `main`, resolving the four files as above, and re-run check and build. This keeps the Home review already done. Recommended.
   - **(b) Close PR #1.** Review this branch as a single PR instead; it already contains Home.

   Either way, the footer must ship with LCM Chips, since the footer links `/lcm-chips`. Pages 06–21 link to each other through the navigation, so shipping them together avoids 404s on staging.
5. **Reviews:** the `main` ruleset needs one approving review from someone other than the pusher. Only `josh-scalestorm` can approve and merge (S21).
6. **Rollback fix PR #1 must carry.** PR #1 contains `1787707500_home_solution_cards_page5.js`. Its `down` wrote back the seed links `/technology` and `/optical-circuit-switching-communications`, but `origin/main` already serves `/sense` and `/connect` (`1787703900`). A rollback after the merge would have put two 404 links on the Home solution cards. The rehearsal caught it, and the fix is committed on this branch (only `down` changes: it now restores `/sense` and `/connect`). **PR #1's branch has not been changed.** Before PR #1 merges, the same one-file fix has to go onto `staging-home-page05`, unless Josh approves a different sequence (for example, merging PR #1 as is and shipping the fix with the pages 06–21 PR before anyone rolls back).

### Migrations

- **Count:** 100 new migrations, `1787707300` to `1787717300`. All are numbered above `origin/main`'s newest (`1787707200`).
- **Schema change:** one, the `posts` "Featured" field (`1787707600`).
- **Content changes:** the other 99 rewrite content in `pages` (90 files), `globals` (9), `redirects` (5) and `posts` (2).
- **Static assets:** every asset a migration references exists in `static/` and is tracked by git. There are no references to uploaded media records.
- **PocketBase version:** 0.39.11 locally, and 0.39.11 in `Dockerfile.pocketbase`.
- **They run automatically.** The PocketBase container starts with `pocketbase serve --migrationsDir`, so every pending migration runs when a merge to `main` redeploys staging. There is no manual gate, so the backup and dry-run must happen **before** the merge.
- **Guard risk:** almost every migration checks the previous value before writing. If a page was edited in the staging CMS, its migration silently does nothing for that section. Only a dry-run shows which.
- **Local rehearsal, done 2026-10-22.** `scripts/staging-migration-dry-run.mjs` runs steps 3 to 5 below in one command. Against a fresh baseline built from `origin/main`'s 99 migrations with PocketBase 0.39.11: 100 migrations applied; no page, globals, redirect or posts differences from the local reference; `migrate down 100` restored the starting state exactly. A full comparison of the database (23 tables, 261 rows, SQLite schema of both database files) differs only in 16 `updated` timestamps. The first rehearsal failed on Home, which led to the fix in PR dependencies item 6. Report: `%TEMP%\lumotive-staging-rehearsal\run-B\dry-run\report.md`. This does not replace the run on a real staging backup: only that shows staging CMS edits.

**Backup and dry-run, required before the merge:**
1. **Josh: backup.** Take a staging PocketBase backup (admin UI under Settings → Backups, or a copy of the `/app/pb_data` volume with PocketBase stopped). Send it with its timestamp. Do not use the repo's `pb_data`.
2. **Josh: content freeze.** Freeze staging CMS edits from the backup until the deploy, or the dry-run goes stale.
3. **Us: apply.** Restore the backup into a scratch directory and run `node scripts/staging-migration-dry-run.mjs --backup <backup.zip or pb_data>` from the exact commit to be merged, with PocketBase 0.39.11. It applies the migrations to a copy, never to the backup, and keeps a report of applied migrations.
4. **Us: compare.** The same run compares every touched record (pages by slug, globals, redirects, the posts schema) with the local reference database. Any section that differs is a guard no-op caused by a staging edit. Each one goes to Claudia: keep the staging edit, or apply ours.
5. **Us: rollback test.** The same run then does `migrate down` on the copy and confirms it matches the backup. It exits 2 if anything is not restored.
6. **Rollback point.** Keep the backup as the rollback point for the real deploy.

### Deployment blockers

| Blocker | Owner | Status, with evidence |
|---|---|---|
| PR #1 approval and merge, then the PR for pages 06–21 (S21, S22) | Josh, then us | Not merged (`origin/main` unchanged). PR-shape decision open. **PR #1 must first carry the `1787707500` rollback fix** (PR dependencies, item 6) unless Josh approves another sequence |
| Staging backup, dry-run and content freeze (S23) | Josh + us | Script ready and rehearsed against an `origin/main` baseline (passes). Waiting for the staging backup and freeze |
| Dokploy/GHCR secrets, app IDs and `ORIGIN` (S24). The deploy job skips silently if the app-ID variables are empty | Josh | Unverified |
| PocketBase rate limit: the default 300 requests per 10 s is shared by all visitors through the web server's IP (S27) | Josh decides, we implement | Option (1), the 60 s public-globals cache, is built and tested (one globals request per minute instead of four per render). Options (2)/(3) wait for the network layout |
| Pipedrive hidden fields, then one agreed test submission (S3, S28) | Lumotive admin via Josh, then us | Not started |
| `/privacy-policy` 404 in the footer (S2) | Lumotive | Waiting for text or approval to port |
| Cross-browser QA: Safari, iOS, Android, including video playback (S20) | Us | Not started. Edge only, for every embed |
| `vite.config.ts`: commit on its own or drop (S25) | Us | Open. Not in any commit |

Client-held content (group 2) does not block a staging deploy, because it ships omitted. It does block sign-off of the affected sections.

Three "Read the original article" links on News are dead: Morningstar, Yahoo Finance and 2cm.com.tw (N7). Lumotive supplies replacements or approves removing them. They do not block staging.

## Next concrete action

**Josh:** decide how PR #1 gets the rollback fix (add the one-file fix to `staging-home-page05` first, or approve another sequence). Then approve and merge PR #1 (or choose option (b)), and send a fresh staging `pb_data` backup with a CMS edit freeze.

With the backup, we run the dry-run script against it and prepare the pages 06–21 PR. Safari, iOS and Android QA starts in parallel; it needs no staging access.

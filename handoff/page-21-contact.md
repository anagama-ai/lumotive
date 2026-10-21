# Page 21 — /contact

Approved content package rev. 2026-10-07, page 21 of 21, "Contact". URL
**/contact**, unchanged. First built against v2; **v3 pass applied
2026-10-21**. Branch `feedback-20261007-v2`, local only.

**Status: v3 implemented; hidden-field plumbing rebuilt and tested against
Pipedrive's own loader.** Live capture of the three values waits on
Pipedrive configuration by Lumotive (below).

## v3 pass (2026-10-21)

**Copy.** The v2→v3 text diff of page 21 is empty and there are no Simon
annotations. Live headings, hero line, offices and the three closing cards
match v3. No content changed.

### Hidden fields: the v2 approach would have broken the form

Tested with probe keys (throwaway local migration, reverted and deleted):

1. **Query parameters on the form URL corrupt the embed.** Pipedrive's loader
   builds the iframe as `<data-pd-webforms>?embeded=1&uuid=<id>`, so any
   existing query string produced `…?probe_inquiry=ocs?embeded=1&uuid=…`: the
   inquiry value swallowed the loader's own parameters, including the `uuid`
   it uses for resizing. Pipedrive web forms do not prefill fields from the
   URL anyway.
2. **Source page was empty for every internal click.** Site links are
   client-side navigations, which never update `document.referrer`.
3. **A new `?inquiry=` on /contact itself** kept the old value.

**Rebuilt on Pipedrive's documented-by-code mechanism.** A Pipedrive hidden
field with value source "JavaScript variable" asks the loader for named
variables (`REQUEST_JS_VARIABLES`); the loader answers from
`window.pd_webform` on the page (`JS_VARIABLES_RESPONSE`), at submit time.
`FormPipedrive` now publishes, on every navigation:

| Variable | Value |
| --- | --- |
| `inquiry` | `?inquiry=` value, default `general` |
| `source_page` | the previous in-site URL on a click; `document.referrer` on a first load |
| `campaign` | `utm_source · utm_medium · utm_campaign`, those present |

The form URL is left untouched (clean `?embeded=1&uuid=` iframe). The three
editor fields for Pipedrive API keys are removed: no keys are needed, and
none were ever set in the CMS, so no data changed.

**Proof, through the real loader, no submission sent.** From inside the
Pipedrive iframe we sent the same `REQUEST_JS_VARIABLES` message the form
sends and read the loader's reply:

| Scenario | inquiry | source_page | campaign |
| --- | --- | --- | --- |
| Direct visit `/contact` | general | (empty) | (empty) |
| `?inquiry=tx10-datasheet&utm_source=news&utm_medium=email&utm_campaign=spring` | tx10-datasheet | (empty, see note) | news · email · spring |
| Click "Request the TX10 datasheet" on Transmit | tx10-datasheet | …/dev-kits/transmit-modules | (empty) |
| Header "Contact" from /sense | general | …/sense | (empty) |
| `/contact` → `/contact?inquiry=ocs` | ocs | …/contact | (empty) |

Note: the external referrer was `https://www.google.com/` into local
`http://`; the browser strips cross-origin referrers on an https→http
downgrade, so empty is correct here. On the https site an external
referrer arrives as its origin only (browser default policy).

**Safety.** Every non-GET request leaving the page was intercepted and
aborted during all tests. The only ones attempted were Pipedrive's
analytics beacons (`/viewed`, `/interacted`) and Cloudflare challenge
pings; no form submission was sent, no notification or CRM record created.

### Form checks (Pipedrive-side, unchanged)

Fields: Name*, Job title*, Email* ("work or professional email"), Phone
(optional), Company*, Market Segment*, Region*, interest/needs*, "I am
interested in (General)"*, "I am a potential"*, email-updates consent
Yes/No*, reCAPTCHA. Empty submit and an invalid email both stop in the
browser with inline errors ("Enter a valid email address"). Screenshot
`%TEMP%\lumotive-review\contact\contact-v3-validation.png`.

### Other checks

- **Inquiry values:** the 17 linked values are all in the page-02 list;
  `media` and `careers` are approved but unused (S5); `general` is the default.
- **Layout 360 / 390 / 430 / 768 / 1024 / 1440:** no overflow, no broken
  image, no tap target under 44px, one left edge (16 / 24 / 80), form iframe
  mounts and sizes at every width.
- `npm run check` 0 errors, 0 warnings; `npm run build` passes.

### What Lumotive must configure (credentials / decisions, not our work)

1. **Pipedrive admin:** add three custom fields (inquiry type, source page,
   campaign; Text), then three **Hidden fields** on the web form with value
   source "JavaScript variable" and variable names exactly `inquiry`,
   `source_page`, `campaign`, and publish. No API keys are needed.
2. **Email notification:** page 02 wants the values in the notification
   email as well as the CRM; that is the form's notification settings in
   Pipedrive.
3. **Preselecting "I am interested in"** (page 02, optional) is not possible
   from the page: JavaScript variables only fill hidden fields. It would need
   Pipedrive support or separate forms per inquiry. Decision for Lumotive.
4. Office correction (#137), LinkedIn URL, Explorer bundle: unchanged, below.

### Remaining implementation on our side

- After step 1: one real test submission on staging with Lumotive's consent
  (to a test person they delete), confirming the three values land in the
  CRM and the email. Not done here by design.

## What shipped in the v2 build (history)

One reversible migration, `1787712200_contact_page21.js`, plus component work
on the Pipedrive embed.

| # | id | Type | Marker | What changed |
| --- | --- | --- | --- | --- |
| 1 | `ad9c07fe` | `heroBand` | KEEP AS IS | Subline is the package's sentence; the two staging actions go, since the approved hero prints none |
| 2 | `f1d7c3a2` | `formPipedrive` | KEEP AS IS · FORM + NEW · HIDDEN FIELDS | Embed, URL and heading untouched; tracking plumbing added in the component |
| 3 | `fbfa54dc` | `cardsTextCards` | KEEP AS IS | "Lumotive Offices"; alignment only |
| 4 | `6d2f10ba` | `cardsTextCards` | NEW · CLOSING BLOCK | "Not Ready to Reach Out Yet?" replaces the staging "Looking for your next challenge?" CTA |

## The form — preserved, not replaced

The Pipedrive web form is **untouched**: same `formUrl`, same loader, same
iframe, same heading, same submission path. Nothing about how a visitor fills
it in or how it reaches Pipedrive changed.

### Hidden fields

Page 02 asks every submission to carry three values: the inquiry type a CTA set
through `?inquiry=`, the page the visitor came from, and any UTM campaign.

**The form lives inside Pipedrive's iframe, so the parent page cannot inject
fields into it.** What it can do is prefill them, which Pipedrive does from
query parameters on the form URL keyed by each field's own API key. So
`formPipedrive` now:

- reads `?inquiry=` from the URL, defaulting to `general` exactly as page 02
  specifies;
- reads `document.referrer` as the source page;
- joins `utm_source`, `utm_medium` and `utm_campaign` as the campaign;
- appends each one to the embed URL **for whichever Pipedrive field key is
  configured**, as three new editor fields.

**The three keys are deliberately unset.** They exist only once the hidden
fields are created inside Pipedrive, and they are not ours to guess. With none
set the embed URL is byte-identical to the one shipping today — verified — so
nothing about the live form changes until Lumotive supplies them, at which
point it is a data-only edit to this one section.

Proved end to end with a throwaway migration that set three probe keys: the
embed URL became
`?probe_inquiry=tx10-datasheet&probe_campaign=news+·+email+·+spring` on a
campaign-tagged link and `?probe_inquiry=general` on a bare visit, and the
iframe still mounted. The probe was reverted and deleted; the record carries no
keys.

## Closing block destinations

| Card | Destination | Note |
| --- | --- | --- |
| Find your dev kit | `/dev-kits` | |
| See LCM in action | `/platform` | The site map puts the explorer at `/lcm-explorer/`, but **that bundle is still unsupplied and the route does not exist**. Page 03 places the explorer on the Platform page, so the card goes there rather than at a 404. One field once the bundle is hosted. |
| Join the team | Lever careers board | The destination /about and /culture already use |

## Component changes

- `formPipedrive` gains `inquiryField`, `sourceField` and `campaignField`, and
  forwards the three page-02 values for whichever are set.
- It also gains `data-align`, and its narrow column moves from `.lumo-inner` to
  an inner wrapper. The embed caps its own iframe at 768px, so the column is
  still narrow, but it now starts on the same left edge as every other section
  instead of floating centred in the page.
- Its eyebrow moves to Deep Laser Blue — Laser Blue measured 4.15:1 at 12px,
  which was this page's only contrast failure.

## QA

- **390 / 768 / 1024 / 1440:** no horizontal overflow, no broken image, **zero
  contrast failures**, no tap target under 44px, every inner column on one edge
  (16 / 24 / 24 / 80). The Pipedrive iframe mounts and sizes at all four; the
  closing cards step 1 → 2 → 3.
- **Inquiry parameters:** all **17 values** linked from pages 05 to 19 —
  `automotive`, `chips-flyer`, `dtof-evaluation`, `itof-evaluation`,
  `kit-recommendation`, `lcm-chips`, `li140-datasheet`, `m30-datasheet`,
  `md180`, `nm120-datasheet`, `nm120-embed`, `ocs`, `on140-datasheet`,
  `partnership`, `robotics`, `tx10-datasheet`, `tx10-integration` — plus the
  `general` default, answer 200 and are captured by the form section.
- **Copy:** four headings in the package's order.
- **Migration:** applies, reverts to the previous four sections, re-applies.
- `svelte-check` 592 files, 0 errors; production build clean.
- **Regression:** pages 05 to 20 all answer 200 and report zero contrast
  failures.

## Blockers and unresolved inputs

1. **Three Pipedrive field keys.** Lumotive adds the hidden fields for inquiry
   type, source page and campaign inside Pipedrive and gives us their API
   keys. The capture and forwarding are already built and proved; the keys are
   the only missing piece, and they are a data-only edit. **Until they land, no
   submission carries the three values** — page 02's requirement is plumbed but
   not yet live.
2. **Office address correction (#137).** The package's own pending box asks
   Lumotive which address is wrong. Every address stays exactly as published:
   guessing at a correction would be worse than leaving all four.
3. **LinkedIn follow line.** Held, as on /about, /culture and /news. One URL
   unblocks all four plus the footer icon.
4. **LCM Explorer bundle.** Until it is hosted at `/lcm-explorer/`, the "See
   LCM in action" card points at `/platform`.
5. **Optional: preselect the visible "I am interested in" option.** Page 02
   lists this as optional and it is Pipedrive-side configuration, so it is not
   attempted here.

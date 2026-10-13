# Page 21 — /contact

Approved content package rev. 2026-10-07 (v2), page 21 of 21, "Contact". URL
confirmed from the page header and the page-01 site map: **/contact**,
unchanged.

**Status: implemented and QA-verified.** Awaiting screenshot review.

## What shipped

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

// /dev-kits, client request (2026-10-22).
// Phones only (below 768px), measured at 390 before: hero → "Why Start With a
// Lumotive Kit" 108px (80 padding + the heading's 28px default margin); last
// benefit card → "Find Your Dev Kit" 148px (40 + 80 + 28); last dToF card →
// closing CTA panel 80px; CTA padding 112px. New phone-only overrides
// (app.css `data-phone-top/bottom`) bring the gaps to 48 / 56 / 48px:
//   Why: top md (3rem), bottom xs (1.5rem); Find: top sm (2rem);
//   dToF group: bottom md (3rem). The kit groups' own 52px gaps are unchanged.
// Closing CTA: left-aligned at every width (`textAlign: "left"`, as on
// /applications) and the existing `compactMobile` (72px padding on phones
// instead of 112px). Tablet and desktop spacing unchanged.
// Guarded on absent keys; down removes exactly these values.
const ABSENT = undefined
const CHANGES = [
	['5b7e01d4', 'phoneSpacingTop', 'md'],
	['5b7e01d4', 'phoneSpacingBottom', 'xs'],
	['2c84f7a1', 'phoneSpacingTop', 'sm'],
	['a90f62b3', 'phoneSpacingBottom', 'md'],
	['116c9e28', 'textAlign', 'left'],
	['116c9e28', 'compactMobile', true]
]

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	if (!Array.isArray(sections)) return
	let changed = false
	for (const [id, key, value] of CHANGES) {
		const section = sections.find((entry) => entry && entry.id === id)
		if (!section) continue
		if (forward && section[key] === ABSENT) {
			section[key] = value
			changed = true
		} else if (!forward && section[key] === value) {
			delete section[key]
			changed = true
		}
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

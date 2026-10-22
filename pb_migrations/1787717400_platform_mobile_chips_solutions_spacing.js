// /platform, client request (2026-10-22).
// Phones only (below 768px), measured at 360 and 393 before: "Explore LCM
// chips →" → "Where Software-Defined Light Goes to Work" 188px (80 padding +
// 80 padding + the heading's 28px default margin), on one continuous light
// field, so it read as an empty band. The existing phone-only overrides
// (app.css `data-phone-top/bottom`, as on /dev-kits) bring it to 96px:
//   Two Chips (c0a71d35): bottom md (3rem); Solutions (d38e36da): top md
//   (3rem, which also drops the heading's default margin).
// Every other gap on the page, and tablet and desktop spacing, is unchanged.
// Guarded on absent keys; down removes exactly these values.
const ABSENT = undefined
const CHANGES = [
	['c0a71d35', 'phoneSpacingBottom', 'md'],
	['d38e36da', 'phoneSpacingTop', 'md']
]

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
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

// /lcm-chips, client request (2026-10-22).
// Phones only (below 768px), measured at 360 and 393 before: the last spec
// tile ("LS20 size") to "LM10 and LS20 at a Glance" was 204px (80 + 80
// padding, the heading's 28px default margin, and the tile grid's trailing
// margin). Phone-only overrides (app.css `data-phone-top/bottom`, now also
// read by the spec-tile and spec-comparison sections) set 2rem a side and
// drop those incidental margins, so the content sets the gap: 64px.
//   Product overview tiles (3e9a06f5): bottom sm; At a glance (5d2b71ae): top sm.
// Tablet and desktop spacing unchanged.
// Guarded on absent keys; down removes exactly these values.
const ABSENT = undefined
const CHANGES = [
	['3e9a06f5', 'phoneSpacingBottom', 'sm'],
	['5d2b71ae', 'phoneSpacingTop', 'sm']
]

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lcm-chips' })
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

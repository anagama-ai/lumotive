// /lcm-chips, client request (2026-10-22).
// Phones only (below 768px). Four section boundaries were 172–206px: 80 + 80
// padding (40 + 80 after the tile row) plus the next heading's or eyebrow's
// default margin and the last paragraph's. Phone-only overrides (app.css
// `data-phone-top/bottom`, now also read by the spec-tile and spec-comparison
// sections) set 2rem a side and drop those incidental margins, so the content
// sets each gap at 64px:
//   LS20 Size tile → "LM10 and LS20 at a Glance";
//   "Multiple pulses for HDR" → "Three Design Choices, Decoupled";
//   "…without trading one against another" → "Works With Your Architecture";
//   "Explore how LCM steers light" → "Start Building" (Evaluate LCM…).
// Tablet and desktop spacing unchanged.
// Guarded on absent keys; down removes exactly these values.
const ABSENT = undefined
const CHANGES = [
	['3e9a06f5', 'phoneSpacingBottom', 'sm'],
	['5d2b71ae', 'phoneSpacingTop', 'sm'],
	['2a6e54bc', 'phoneSpacingBottom', 'sm'],
	['84f1b7e2', 'phoneSpacingTop', 'sm'],
	['84f1b7e2', 'phoneSpacingBottom', 'sm'],
	['6c0d39fa', 'phoneSpacingTop', 'sm'],
	['6c0d39fa', 'phoneSpacingBottom', 'sm'],
	['d5b82e14', 'phoneSpacingTop', 'sm']
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

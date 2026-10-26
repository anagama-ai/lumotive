// /sense/automotive, phones only. Measured at 390px before this change:
// 160px of section padding (80 + 80) between consecutive `md` sections, plus
// the next heading's default top margin (28px), so content-to-content gaps of
// 160 / 172 / 188 / 188px before Built for Real-World Conditions, Beyond
// Passenger Vehicles and Evaluate Solid-State dToF.
// - The five `md` content sections take `md-compact-phone`: 2.5rem a side on
//   phones with outermost margins dropped; 768px and up keep `md` exactly.
// - The closing CTA takes the existing `compactMobile` (4.5rem padding on
//   phones instead of `lg` 7rem); desktop unchanged.
// - The coverage diagram gets its phone hint, "Swipe to view the full
//   diagram".
// Guarded on prior values; down restores them exactly.
const ABSENT = undefined
const PAGE = 'automotive'
const SPACED = ['3e05d7b2', '9c2a6f85', '6a1b38fc', '70e9c54d', 'f2764b90']
const CHANGES = [
	...SPACED.flatMap((id) => [
		[id, 'spacingTop', 'md', 'md-compact-phone'],
		[id, 'spacingBottom', 'md', 'md-compact-phone']
	]),
	['c58e02a7', 'compactMobile', ABSENT, true],
	['3e05d7b2', 'mediaHint', ABSENT, 'Swipe to view the full diagram']
]

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
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
	for (const [id, key, before, after] of CHANGES) {
		const section = sections.find((entry) => entry && entry.id === id)
		if (!section) continue
		const [from, to] = forward ? [before, after] : [after, before]
		if (section[key] !== from) continue
		if (to === ABSENT) delete section[key]
		else section[key] = to
		changed = true
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

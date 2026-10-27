// /sense/robotics, phones only (below 768px). Measured at 360–430px:
// - Before "Built for Every Kind of Robot", "Kits for Robotics" and "Design
//   Your Own Sensor With Lumotive": two `md` paddings (80 + 80) stacked, plus
//   the next heading's 28px top margin, so 188px from the last card or line.
//   The edges that meet at those three transitions take `md-compact-phone`:
//   2.5rem a side on phones with the outer margins dropped.
// - "Put a Programmable Sensor on Your Robot" (`a73d519f`): `lg` padding plus
//   the heading's margin put 140px above the content and 112px below it.
//   It takes the existing CTA `compactMobile` (4.5rem a side, heading margin
//   dropped).
// From 768px up none of these values has a rule, so tablet and desktop keep
// `md` and `lg` exactly. Each value changes only from its expected prior
// value; down restores it only from the new one.
const ABSENT = undefined
const PAGE = 'robotics'
const CHANGES = [
	['b5f91c67', 'spacingBottom', 'md', 'md-compact-phone'], // Proof
	['18d4a7e5', 'spacingTop', 'md', 'md-compact-phone'], // Built for every kind of robot
	['18d4a7e5', 'spacingBottom', 'md', 'md-compact-phone'],
	['c90e36b4', 'spacingTop', 'md', 'md-compact-phone'], // Kits for robotics
	['c90e36b4', 'spacingBottom', 'md', 'md-compact-phone'],
	['6f24b8c1', 'spacingTop', 'md', 'md-compact-phone'], // Design your own sensor
	['a73d519f', 'compactMobile', ABSENT, true] // Closing CTA
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

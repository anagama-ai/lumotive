// /about, phones only (below 768px). Measured at 375–430px before this change:
// - "Work With Us" CTA (`efd6f4b0`): `lg` padding (112px a side) plus the
//   heading's 28px top margin, so 140px above the content and 112px below
//   it in a 493–557px band. It takes the existing CTA `compactMobile`:
//   4.5rem a side on phones, with the heading margin dropped (CtaDefault).
// - "GSA Startup to Watch" → "Leadership Team": two `md` paddings stacked,
//   172px to the eyebrow. Recognition (`718e83f2`) bottom and Leadership
//   (`f9d1f9ab`) top take `md-compact-phone`: 2.5rem a side on phones with
//   the outer margins dropped.
// From 768px up neither setting has a rule, so tablet and desktop keep `lg`
// and `md` exactly. Each value changes only from its expected prior value;
// down restores it only from the new one.
const ABSENT = undefined
const PAGE = 'about'
const CHANGES = [
	['efd6f4b0', 'compactMobile', ABSENT, true],
	['718e83f2', 'spacingBottom', 'md', 'md-compact-phone'],
	['f9d1f9ab', 'spacingTop', 'md', 'md-compact-phone']
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

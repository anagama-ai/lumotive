// /connect, phones only (below 768px). Measured at 360–430px before this
// change, from the last card or line to the next heading or visual:
// 148px before "Send Light, Not Signals.", 165 before "Switching at
// Semiconductor Scale", 160 before the "2D Beamforming" image, 197 before
// "From Compact to Hyperscale." and 172 before "Where Lumotive Connect
// Applies". Each stacks an `md` padding (80px) on one or both sides, plus the
// next heading's margin.
// - The `md` edges that meet at those five transitions take
//   `md-compact-phone`: 2.5rem a side on phones with the outer margins
//   dropped. Edges already at `sm` (2.5rem) are unchanged.
// - "Architecting the Next AI Data Center?" (`9bb14000`) takes the existing
//   CTA `compactMobile` (4.5rem a side, heading margin dropped).
// From 768px up none of these values has a rule, so tablet and desktop keep
// `md` and `lg` exactly. Each value changes only from its expected prior
// value; down restores it only from the new one.
const ABSENT = undefined
const PAGE = 'connect'
const CHANGES = [
	['d32ef2bd', 'spacingTop', 'md', 'md-compact-phone'], // Send light, not signals
	['b0f3d514', 'spacingTop', 'md', 'md-compact-phone'], // Switching at semiconductor scale
	['df99bb2e', 'spacingBottom', 'md', 'md-compact-phone'], // Semiconductor traits
	['6e2a71c9', 'spacingTop', 'md', 'md-compact-phone'], // 2D beamforming
	['6e2a71c9', 'spacingBottom', 'md', 'md-compact-phone'],
	['e856b692', 'spacingTop', 'md', 'md-compact-phone'], // From compact to hyperscale
	['e856b692', 'spacingBottom', 'md', 'md-compact-phone'],
	['93c4b0fe', 'spacingTop', 'md', 'md-compact-phone'], // Where Lumotive Connect applies
	['9bb14000', 'compactMobile', ABSENT, true] // Closing CTA
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

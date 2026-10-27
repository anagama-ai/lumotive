// Home, phones only: "All news" → "When Light Becomes Programmable", second
// pass. After 1787718400 the gap was News's 40px phone padding plus the
// heading's own 36.5px top margin (77px), and "All news" is a 44px touch
// target whose text sits 10px above its box, so it still read as ~90px.
//
// Both sides take the existing phone-only override (1.5rem, outer margins
// dropped, below 768px only):
// - News (`e7b40d12`) `phoneSpacingBottom: "xs"`;
// - the bento (`677cf547`) `phoneSpacingTop: "xs"`.
// The box gap becomes 24 + 24 = 48px. From 768px up neither override has a
// rule, so News's `md` bottom and the bento's `none` top apply as before.
//
// Each field is added only while absent (and News's bottom is
// `md-compact-phone`, the bento's top `none`); rollback removes it only
// while it is still "xs".
const PAGE = 'home'
const CHANGES = [
	['e7b40d12', 'phoneSpacingBottom', 'spacingBottom', 'md-compact-phone'],
	['677cf547', 'phoneSpacingTop', 'spacingTop', 'none']
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
	for (const [id, key, baseKey, base] of CHANGES) {
		const section = sections.find((entry) => entry && entry.id === id)
		if (!section || section[baseKey] !== base) continue
		if (forward) {
			if (section[key] !== undefined) continue
			section[key] = 'xs'
		} else {
			if (section[key] !== 'xs') continue
			delete section[key]
		}
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

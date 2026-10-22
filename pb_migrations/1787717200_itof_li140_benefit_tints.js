// /dev-kits/itof review (2026-10-22): the four LI140 benefit cards under the
// spec tiles (`c60d2fb9`) take a light wash of their accent colour (blue,
// green, amber, blue) so they read apart from the white spec tiles. Copy,
// grid, spacing, accent bars and text colours unchanged. Guarded; reversible.
const PAGE = 'itof'
const SECTION_ID = 'c60d2fb9'

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
	const index = sections.findIndex((entry) => entry && entry.id === SECTION_ID)
	if (index < 0) return
	const section = { ...sections[index] }
	if (forward) {
		if (section.cardTint !== undefined) return
		section.cardTint = 'accent'
	} else {
		if (section.cardTint !== 'accent') return
		delete section.cardTint
	}
	sections[index] = Object.fromEntries(Object.keys(section).sort().map((key) => [key, section[key]]))
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

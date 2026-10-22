// Restores the PDF page 12 layout and supersedes `1787716600`'s narrow-card
// request (client correction, 2026-10-22): the single TX10 card under
// "Transmit modules" (`2c84f7a1`) spans the full content width at every
// breakpoint, from ON140's left edge to M30's right edge on desktop.
// `columns: "3"` (one third of a three-up track) becomes `columns: "1"`.
// Guarded on the prior value; down restores it.
const apply = (app, from, to) => {
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
	const section = sections.find((entry) => entry && entry.id === '2c84f7a1')
	if (!section || section.columns !== from) return
	section.columns = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, '3', '1'),
	(app) => apply(app, '1', '3')
)

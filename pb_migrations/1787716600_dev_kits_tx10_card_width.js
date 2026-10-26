// Client-requested layout adjustment (2026-10-22), not in the PDF: the single
// TX10 card under "Transmit modules" (`2c84f7a1`) takes the width of one iToF
// card below it at every breakpoint (`columns: "3"`: half width from 768px,
// a third from 1024px, full width on phones), left-aligned with ON140.
// Guarded on the key being absent; down removes it.
const apply = (app, forward) => {
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
	if (!section) return
	if (forward) {
		if (section.columns !== undefined) return
		section.columns = '3'
	} else {
		if (section.columns !== '3') return
		delete section.columns
	}
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

// Client request (2026-10-22): /applications' closing "Build With
// Programmable Optics" CTA (`9a19b24a`) sits on the container's left edge, as
// PDF page 08 prints it. Same panel, type, button, copy and link.
// Guarded on the key being absent; down removes exactly it.
const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'applications' })
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
	const section = sections.find((entry) => entry && entry.id === '9a19b24a')
	if (!section) return
	if (forward) {
		if (section.textAlign !== undefined) return
		section.textAlign = 'left'
	} else {
		if (section.textAlign !== 'left') return
		delete section.textAlign
	}
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

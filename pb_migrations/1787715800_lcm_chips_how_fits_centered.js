// Client request (2026-10-22): centre the /lcm-chips "From Fixed Sensors to
// Programmable Eyes" section (`9f08c3d6`: header, visual column, Play/Pause
// control, step block and both captions) and its five capability cards
// (`2a6e54bc`: accent bar, title and description). `textAlign: "center"` is
// read only by CardsTextCards; no other section carries it.
// Guarded on the key being absent; down removes exactly these keys.
const PAGE = 'lcm-chips'
const IDS = ['9f08c3d6', '2a6e54bc']

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
	for (const section of sections) {
		if (!section || !IDS.includes(section.id)) continue
		if (forward && section.textAlign === undefined) {
			section.textAlign = 'center'
			changed = true
		} else if (!forward && section.textAlign === 'center') {
			delete section.textAlign
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

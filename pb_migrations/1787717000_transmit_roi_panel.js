// Transmit Modules review (2026-10-22): the ROI animation's white container in
// Programmable Illumination for a Dynamic World (`a7b91de3`) spans the full
// width of the five-card row below it instead of a 40rem column. The animation
// stays centred in that panel at its own ratio, capped at 28rem tall so the
// section does not grow. Replaces `mediaMaxWidth` (set by 1787716900) with
// `mediaPanelHeight`. Guarded on the prior values; down restores them exactly.
const PAGE = 'transmit-modules'
const SECTION_ID = 'a7b91de3'
const BEFORE = { mediaMaxWidth: '40rem' }
const AFTER = { mediaPanelHeight: '28rem' }

const swap = (app, from, to) => {
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
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section) return
	if (!Object.entries(from).every(([key, value]) => section[key] === value)) return
	if (Object.keys(to).some((key) => section[key] !== undefined)) return
	for (const key of Object.keys(from)) delete section[key]
	Object.assign(section, to)
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => swap(app, BEFORE, AFTER),
	(app) => swap(app, AFTER, BEFORE)
)

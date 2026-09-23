// /m30 specifications (statsLightTraits, id "1f5d84ab") render as a two-column
// table instead of the traits grid. Only the design version changes; /lm10's
// six-trait overview keeps "lightTraits".
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '1f5d84ab'

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const setDesign = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'm30' })
	} catch {
		return
	}
	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.designVersion !== from) return

	section.designVersion = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => setDesign(app, 'lightTraits', 'specTable'),
	(app) => setDesign(app, 'specTable', 'lightTraits')
)

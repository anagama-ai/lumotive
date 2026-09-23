// /platform flow panels (cardsFlowPanels, id "cac52f89") had spacingTop
// "none"; it moves to "md" like its neighbours.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'cac52f89'

const setSpacing = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections'))
	} catch {
		return
	}
	const section = Array.isArray(sections) ? sections.find((s) => s && s.id === SECTION_ID) : null
	if (!section || section.spacingTop !== from) return
	section.spacingTop = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => setSpacing(app, 'none', 'md'),
	(app) => setSpacing(app, 'md', 'none')
)

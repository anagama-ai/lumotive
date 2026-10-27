// /dev-kits/itof "Better data, safer robots" (d4e09a21): content centred and
// capped at 900px (`textAlign: "center"`, `contentMaxWidth: "900px"`).
// Guarded on both keys being absent; reverses exactly.
const SECTION_ID = 'd4e09a21'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'itof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsTextCards')
	if (!section) return
	if (forward && section.textAlign == null && section.contentMaxWidth == null) {
		section.textAlign = 'center'
		section.contentMaxWidth = '900px'
	} else if (!forward && section.textAlign === 'center' && section.contentMaxWidth === '900px') {
		delete section.textAlign
		delete section.contentMaxWidth
	} else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

// /sense "Sensing for robots and vehicles" (a1d7c40e): the accent bar above
// each card is removed (`accentBar: "none"`). Guarded on the key being
// absent; reverses exactly.
const SECTION_ID = 'a1d7c40e'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsTextCards')
	if (!section) return
	if (forward && section.accentBar == null) section.accentBar = 'none'
	else if (!forward && section.accentBar === 'none') delete section.accentBar
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

// /sense/automotive "First solid-state 180° dToF lidar" (9c2a6f85): the
// white panel behind the MD180 cut-out is removed (`mediaFrame: "panel"`
// dropped), so the product sits on the page field. Height cap unchanged.
// Guarded on the prior value; reverses exactly.
const SECTION_ID = '9c2a6f85'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'automotive' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'splitDefault')
	if (!section) return
	if (forward && section.mediaFrame === 'panel') delete section.mediaFrame
	else if (!forward && section.mediaFrame == null) section.mediaFrame = 'panel'
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

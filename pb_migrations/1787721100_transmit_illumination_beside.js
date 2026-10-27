// /dev-kits/transmit-modules "Programmable illumination for a dynamic world"
// (a7b91de3): the scan-order animation moves into a column to the right of
// the heading and intro (`visualLayout: "beside"`), cards below. Guarded on
// the key being absent; reverses exactly.
const SECTION_ID = 'a7b91de3'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'transmit-modules' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsTextCards')
	if (!section) return
	if (forward && section.visualLayout == null) section.visualLayout = 'beside'
	else if (!forward && section.visualLayout === 'beside') delete section.visualLayout
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

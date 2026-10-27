// /dev-kits/itof "High-resolution depth across a wide field" (31ae7d06): the
// image moves from below the copy to a column on its right
// (`mediaLayout: "below"` dropped, `mediaPosition: "right"` set). Guarded on
// the prior values; reverses exactly.
const SECTION_ID = '31ae7d06'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'itof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'splitDefault')
	if (!section) return
	if (forward && section.mediaLayout === 'below' && section.mediaPosition == null) {
		delete section.mediaLayout
		section.mediaPosition = 'right'
	} else if (!forward && section.mediaLayout == null && section.mediaPosition === 'right') {
		section.mediaLayout = 'below'
		delete section.mediaPosition
	} else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

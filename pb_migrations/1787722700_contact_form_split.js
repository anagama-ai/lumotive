// /contact "Tell us about your project" (f1d7c3a2): two columns from 1024px,
// heading left and the Pipedrive form right (`layout: "split"`). Guarded on
// the key being absent; reverses exactly.
const SECTION_ID = 'f1d7c3a2'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'contact' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'formPipedrive')
	if (!section) return
	if (forward && section.layout == null) section.layout = 'split'
	else if (!forward && section.layout === 'split') delete section.layout
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

// /sense/automotive CTA "Build your safety cocoon with us" (c58e02a7): heading
// at the statement size, matching the other CTA sections. Guarded on the key
// being absent; reverses exactly.
const SECTION_ID = 'c58e02a7'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'automotive' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'ctaSplitLinks')
	if (!section) return
	if (forward && section.headingSize == null) section.headingSize = 'statement'
	else if (!forward && section.headingSize === 'statement') delete section.headingSize
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

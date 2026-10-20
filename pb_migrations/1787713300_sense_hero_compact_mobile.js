// /sense hero (d9bf96da): opt into the compact phone layout — the band grows
// with its copy below 768px instead of holding a 68svh minimum. Text, sizes
// and desktop are unchanged. Guarded; reverses exactly.
const SECTION_ID = 'd9bf96da'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const hero = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'heroBand')
	if (!hero) return
	if (forward && hero.compactMobile == null) hero.compactMobile = 'true'
	else if (!forward && hero.compactMobile === 'true') delete hero.compactMobile
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

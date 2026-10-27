// /platform "Where software-defined light goes to work" (d38e36da): the
// introduction paragraph under the heading is removed. Heading, cards and
// link are unchanged. Guarded on the exact prior copy; reverses exactly.
const SECTION_ID = 'd38e36da'
const INTRO = 'LCM technology provides a common foundation for software-defined light control across sensing, switching, communications, computing, displays, and other optical systems. Lumotive applies the platform through two solution areas: Lumotive Sense for Physical AI and 3D sensing, and Lumotive Connect for AI infrastructure and optical switching.'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsMediaCards')
	if (!section) return
	if (forward && section.intro === INTRO) delete section.intro
	else if (!forward && section.intro == null) section.intro = INTRO
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

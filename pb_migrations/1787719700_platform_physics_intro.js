// /platform "Groundbreaking physics meets mature manufacturing" (ace8d391):
// adds a subheading (`intro`) under the H2. Guarded on an absent intro;
// reverses exactly.
const SECTION_ID = 'ace8d391'
const INTRO = 'LCM chips use engineered metasurfaces to control light at the surface of a semiconductor. Scalable, mature manufacturing: standard, well-established CMOS nodes and LCoS packaging.'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsPeelSwap')
	if (!section) return
	if (forward && section.intro == null) section.intro = INTRO
	else if (!forward && section.intro === INTRO) delete section.intro
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

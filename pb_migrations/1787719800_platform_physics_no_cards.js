// /platform "Groundbreaking physics meets mature manufacturing" (ace8d391):
// the two cards (and the beam-steering video they carry) are removed; the
// section keeps its heading and subheading. Guarded on the exact prior
// cards; down restores them.
const SECTION_ID = 'ace8d391'
const CARDS = [{"accent": "accent1", "body": "<p>LCM chips use engineered metasurfaces to control light at the surface of a semiconductor.</p>", "media": {"kind": "url", "value": "/lumotive/video/beam-steering.mp4"}, "title": "Light Control Metasurface"}, {"accent": "accent2", "body": "<p>Scalable, mature manufacturing: standard, well-established CMOS nodes and LCoS packaging.</p>", "title": "Semiconductor-based scalability"}]

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsPeelSwap')
	if (!section) return
	if (forward && JSON.stringify(section.cards) === JSON.stringify(CARDS)) delete section.cards
	else if (!forward && section.cards == null) section.cards = JSON.parse(JSON.stringify(CARDS))
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

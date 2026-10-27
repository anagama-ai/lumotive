// /platform "Groundbreaking physics meets mature manufacturing" (ace8d391):
// redesign after the Zipline "Autonomy Stack" pattern. `layout: "numbered"`
// left-aligns the heading and sets the beam-steering video on the left with
// the two points as a numbered, rule-divided list on the right. Copy and
// media are unchanged. Guarded; reverses exactly.
const SECTION_ID = 'ace8d391'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsPeelSwap')
	if (!section) return
	if (forward && section.layout == null) section.layout = 'numbered'
	else if (!forward && section.layout === 'numbered') delete section.layout
	else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

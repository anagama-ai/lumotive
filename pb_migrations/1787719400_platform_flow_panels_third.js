// /platform flow panels (cac52f89, "Traditional optics" / "LCM™ platform"):
// moves up to be the page's third section, right after "Groundbreaking
// physics meets mature manufacturing" (ace8d391), and gains the H2 "Light
// Control Metasurface™ Optical Beamforming Technology". Panels unchanged.
// Guarded on the prior order (after fbe8b045) and an absent heading;
// reverses exactly.
const MOVED = 'cac52f89'
const AFTER_FORWARD = 'ace8d391'
const AFTER_BACK = 'fbe8b045'
const HEADING = 'Light Control Metasurface™ Optical Beamforming Technology'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const from = sections.findIndex((s) => s && s.id === MOVED && s.type === 'cardsFlowPanels')
	if (from < 1) return
	const section = sections[from]
	if (sections[from - 1].id !== (forward ? AFTER_BACK : AFTER_FORWARD)) return
	if (forward ? section.heading != null : section.heading !== HEADING) return
	if (forward) section.heading = HEADING
	else delete section.heading
	sections.splice(from, 1)
	const anchor = sections.findIndex((s) => s && s.id === (forward ? AFTER_FORWARD : AFTER_BACK))
	if (anchor < 0) return
	sections.splice(anchor + 1, 0, section)
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

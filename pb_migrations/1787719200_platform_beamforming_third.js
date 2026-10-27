// /platform: "From 1D to 2D beamforming" (b2d10f47) moves up to be the
// page's third section, right after "Groundbreaking physics meets mature
// manufacturing" (ace8d391). No section content changes. Guarded on the
// prior order; down puts it back after the flow panels (cac52f89).
const MOVED = 'b2d10f47'
const AFTER_FORWARD = 'ace8d391'
const AFTER_BACK = 'cac52f89'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const from = sections.findIndex((s) => s && s.id === MOVED)
	if (from < 1) return
	const expectedBefore = forward ? AFTER_BACK : AFTER_FORWARD
	if (!sections[from - 1] || sections[from - 1].id !== expectedBefore) return
	const [section] = sections.splice(from, 1)
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

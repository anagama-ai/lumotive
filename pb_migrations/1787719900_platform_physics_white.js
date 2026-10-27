// /platform "Groundbreaking physics" (ace8d391): white section background
// (`background: subtle` = --color-surface) instead of the page field.
// Guarded on the prior value; reverses exactly.
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
	const from = forward ? 'none' : 'subtle'
	if ((section.background ?? 'none') !== from) return
	section.background = forward ? 'subtle' : 'none'
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

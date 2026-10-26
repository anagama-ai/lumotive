// /sense "The Problem" (9d8fe777): icons 20% smaller (5rem → 4rem) and painted
// in the accent sequence the other cards use — blue, green, amber, blue — via
// opt-in `iconTint` / `iconSize` on this section only. Copy, links and layout
// unchanged. Guarded on prior values; reverses exactly.
const SECTION_ID = '9d8fe777'
const ACCENTS = ['accent1', 'accent2', 'accent3', 'accent1']

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const section = Array.isArray(sections) && sections.find((s) => s && s.id === SECTION_ID && s.type === 'cardsIconCards')
	if (!section || !Array.isArray(section.cards) || section.cards.length !== ACCENTS.length) return
	let changed = false
	if (forward) {
		if (section.iconTint == null && section.iconSize == null && section.cards.every((c) => c && c.accent == null)) {
			section.iconTint = 'accent'
			section.iconSize = 'sm'
			section.cards.forEach((c, i) => { c.accent = ACCENTS[i] })
			changed = true
		}
	} else if (section.iconTint === 'accent' && section.iconSize === 'sm' && section.cards.every((c, i) => c && c.accent === ACCENTS[i])) {
		delete section.iconTint
		delete section.iconSize
		section.cards.forEach((c) => { delete c.accent })
		changed = true
	}
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

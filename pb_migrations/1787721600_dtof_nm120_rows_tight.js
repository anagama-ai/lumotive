// /dev-kits/dtof NM120: the spec tiles (6b28ce41) and the benefit cards
// under them (2f74a0db) read as two rows of one block, so the section
// padding between them goes (spec tiles `spacingBottom` and cards
// `spacingTop` sm → none). Guarded on the prior values; reverses exactly.
const CHANGES = [['6b28ce41', 'spacingBottom'], ['2f74a0db', 'spacingTop']]

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dtof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const targets = CHANGES.map(([id, key]) => [sections.find((s) => s && s.id === id), key])
	const from = forward ? 'sm' : 'none'
	if (targets.some(([section, key]) => !section || section[key] !== from)) return
	for (const [section, key] of targets) section[key] = forward ? 'none' : 'sm'
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

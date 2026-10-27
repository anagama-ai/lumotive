// Home "One chip. Boundless applications." (cardsPeelScene, id "a20efeab")
// leaves PeelScene and renders in normal document flow. Its none/none spacing
// relied on the sticky peel panel, which added 5rem above the heading from
// 768px up. In flow the section takes that same rhythm from the shared
// spacing system instead: `md-compact-phone` on top is the standard `md`
// (5rem) from 768px up, and 2.5rem on phones with the heading's outer margin
// dropped. The bottom stays `none`, so the gap to "Latest From Lumotive" is
// unchanged.
//
// Only `spacingTop` on this one section changes, and only from the deployed
// none/none state; rollback restores `none` only from md-compact-phone/none.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'a20efeab'

const apply = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	if (!Array.isArray(sections)) return
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsPeelScene') return
	if (section.spacingTop !== from || section.spacingBottom !== 'none') return
	section.spacingTop = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, 'none', 'md-compact-phone'),
	(app) => apply(app, 'md-compact-phone', 'none')
)

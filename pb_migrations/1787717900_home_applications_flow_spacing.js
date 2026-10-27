// Home "When light becomes programmable" (cardsPeelBento, id "677cf547")
// leaves the peel system and becomes an ordinary flow section that reveals
// like "Latest From Lumotive" (postsFeatured, id "e7b40d12"). Its none/none
// spacing only made sense inside the peel panel, which supplied the 5rem
// above the heading from 768px up. The section takes the News section's
// md/md rhythm instead: the shared 5rem `.lumo-inner` padding, top and bottom,
// at every width.
//
// Only `spacingTop` and `spacingBottom` on that one section change, and only
// from their current none/none. Copy, cards, images, width and every other
// section are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '677cf547'

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
	if (!section || section.type !== 'cardsPeelBento') return
	if (section.spacingTop !== from || section.spacingBottom !== from) return
	section.spacingTop = to
	section.spacingBottom = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, 'none', 'md'),
	(app) => apply(app, 'md', 'none')
)

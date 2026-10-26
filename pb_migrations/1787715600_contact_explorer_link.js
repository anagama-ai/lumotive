// CT4: Contact's "See LCM in action" card pointed at /platform while the
// explorer was not hosted. It now is (`1787715500`), so the card links to the
// explorer itself. The file path, as on Platform: the Vite dev server does
// not resolve /lcm-explorer/ to its index.html (production does).
// Guarded on the prior URL; down restores it.
const PAGE = 'contact'
const SECTION_ID = '6d2f10ba'
const TITLE = 'See LCM in action'
const BEFORE = '/platform'
const AFTER = '/lcm-explorer/index.html'

const apply = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
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
	const card = section && Array.isArray(section.cards) ? section.cards.find((entry) => entry && entry.title === TITLE) : null
	if (!card || card.linkUrl !== from || !card.link || card.link.url !== from) return
	card.linkUrl = to
	card.link.url = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, BEFORE, AFTER),
	(app) => apply(app, AFTER, BEFORE)
)

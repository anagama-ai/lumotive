// Applications v4 (PDF page 08): the "Your Application" open-prompt card in
// One Platform, Many Applications (`91a455fe`) takes the photo `wscgr` linked
// in its "Image: open prompt" slot, lumotive.com's Wireless.jpg (892x592,
// the size of the other 2024/03 card photos), self-hosted as a WebP.
// Copy, order and the other seven photos are unchanged.
// Guarded on the card having no media; down removes exactly this value.
const PAGE = 'applications'
const SECTION_ID = '91a455fe'
const TITLE = 'Your application'
const MEDIA = { kind: 'url', value: '/lumotive/img/applications-your-application.webp' }

const apply = (app, forward) => {
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
	if (!card) return
	if (forward) {
		if (card.media !== undefined && card.media !== null && card.media !== '') return
		card.media = MEDIA
	} else {
		if (JSON.stringify(card.media) !== JSON.stringify(MEDIA)) return
		delete card.media
	}
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

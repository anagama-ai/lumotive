// The customer-products section became media cards so Stella-2 could carry a
// product shot, which left the Hokuyo YLM-10LX card as the only text-only card
// in the row. The client supplied the matching Hokuyo product shot, so both
// cards now carry an image.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'e91c47a5'
const CARD_TITLE = 'YLM-10LX'
const MEDIA = { kind: 'url', value: '/lumotive/img/ylm-10lx.webp' }

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findDevKitsPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' })
	} catch {
		return null
	}
}

const withCard = (app, mutate) => {
	const record = findDevKitsPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || !Array.isArray(section.cards)) return

	const card = section.cards.find((entry) => entry && entry.title === CARD_TITLE)
	if (!card || !mutate(card)) return

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		withCard(app, (card) => {
			if (card.media) return false
			card.media = { kind: MEDIA.kind, value: MEDIA.value }
			return true
		})
	},
	(app) => {
		withCard(app, (card) => {
			if (!card.media || card.media.value !== MEDIA.value) return false
			delete card.media
			return true
		})
	}
)

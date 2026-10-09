// The "Mobility and heavy equipment" card on /applications (cardsMediaCards,
// anchor "markets") gets a client-supplied truck render instead of the stock
// passenger ADAS photo.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '357cf90c'
const CARD_TITLE = 'Mobility and heavy equipment'

const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/market-passenger-adas.jpg' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/market-mobility-truck.webp' }

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

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'applications' })
	} catch {
		return null
	}
}

const applyMedia = (app, expected, media) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsMediaCards' || !Array.isArray(section.cards)) return

	const card = section.cards.find((entry) => entry && entry.title === CARD_TITLE)
	if (!card) return
	if (!card.media || card.media.value !== expected.value) return

	card.media = { kind: media.kind, value: media.value }

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyMedia(app, OLD_MEDIA, NEW_MEDIA)
	},
	(app) => {
		applyMedia(app, NEW_MEDIA, OLD_MEDIA)
	}
)

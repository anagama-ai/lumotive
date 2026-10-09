// The TX10 Development Kit card on /dev-kits reused /lumotive/img/tx10-module.png,
// the same render the LM10 page already shows. The client supplied a dedicated
// product shot of the kit, so the card now points at it. Only this card's media
// changes; the LM10 page keeps the original image.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '4bf76360'
const CARD_TITLE = 'TX10 Development Kit'

const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/tx10-module.png' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/tx10-dev-kit.webp' }

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

const applyMedia = (app, expected, media) => {
	const record = findDevKitsPage(app)
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

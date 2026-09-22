// The client asked for a product photo on the Stella-2 card in the dev-kits
// customer products section. cardsTextCards deliberately cannot carry card
// media, so this switches only that section to cardsMediaCards and adds the
// supplied Stella-2 image. The Hokuyo card and every other section field are
// untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'e91c47a5'
const CARD_TITLE = 'Stella-2'

const TEXT_TYPE = 'cardsTextCards'
const TEXT_DESIGN = 'textCards'
const MEDIA_TYPE = 'cardsMediaCards'
const MEDIA_DESIGN = 'mediaCards'
const MEDIA = { kind: 'url', value: '/lumotive/img/stella-2.webp' }

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

const applyVariant = (app, fromType, fromDesign, toType, toDesign, addMedia) => {
	const record = findDevKitsPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (
		!section ||
		section.type !== fromType ||
		section.designVersion !== fromDesign ||
		!Array.isArray(section.cards)
	)
		return

	const card = section.cards.find((entry) => entry && entry.title === CARD_TITLE)
	if (!card) return

	if (addMedia) {
		if (Object.prototype.hasOwnProperty.call(card, 'media')) return
		card.media = MEDIA
	} else {
		if (!card.media || card.media.kind !== MEDIA.kind || card.media.value !== MEDIA.value) return
		delete card.media
	}

	section.type = toType
	section.designVersion = toDesign
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyVariant(app, TEXT_TYPE, TEXT_DESIGN, MEDIA_TYPE, MEDIA_DESIGN, true)
	},
	(app) => {
		applyVariant(app, MEDIA_TYPE, MEDIA_DESIGN, TEXT_TYPE, TEXT_DESIGN, false)
	}
)

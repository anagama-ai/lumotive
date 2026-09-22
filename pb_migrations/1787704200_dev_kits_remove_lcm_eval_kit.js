// Webvizio follow-up: the "LCM Evaluation and Development Kit" product card is
// removed from the /dev-kits offerings section (cardsMediaCards, id
// "4bf76360") together with its image, body and CTA. The TX10, M30 and NM120
// cards keep their order, content and existing accents; the page heading,
// section intro and every other section stay unchanged.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '4bf76360'
const CARD_TITLE = 'LCM Evaluation and Development Kit'
const CARD_INDEX = 0

const LCM_EVALUATION_KIT_CARD = {
	accent: 'accent1',
	body: '<p>Test Lumotive’s optical beamforming technology at the component level. The kit provides the hardware and software needed to explore beam steering, optical configurations and LCM control. Best for: optical engineers and module developers.</p>',
	eyebrow: 'Evaluate the beamforming technology',
	link: {
		label: 'Request LCM kit information',
		newTab: false,
		type: 'custom',
		url: '/contact'
	},
	linkLabel: 'Request LCM kit information',
	linkNewTab: false,
	linkUrl: '/contact',
	media: {
		kind: 'url',
		value: '/lumotive/img/lek-hero.png'
	},
	title: CARD_TITLE
}

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

const findOfferings = (sections) => {
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsMediaCards' || !Array.isArray(section.cards)) return null
	return section
}

migrate(
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findOfferings(sections)
		if (!section) return

		const index = section.cards.findIndex((card) => card && card.title === CARD_TITLE)
		if (index === -1) return

		section.cards.splice(index, 1)
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findDevKitsPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findOfferings(sections)
		if (!section) return

		if (section.cards.some((card) => card && card.title === CARD_TITLE)) return

		const index = Math.min(CARD_INDEX, section.cards.length)
		section.cards.splice(index, 0, LCM_EVALUATION_KIT_CARD)
		record.set('sections', sections)
		app.save(record)
	}
)

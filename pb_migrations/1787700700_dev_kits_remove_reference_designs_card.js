// Webvizio #81: the "Reference Designs" product card (eyebrow "Build a custom
// lidar system") is dropped from the /dev-kits offerings section
// (cardsMediaCards, id "4bf76360") together with its image, body and CTA. The
// other four products, the page heading, the section intro and the Contact Us
// CTA stay; reference-design mentions elsewhere on the page and the shared
// /lumotive/img/odp-exploded.jpg media are left alone. Removing the fifth card
// leaves four, which fills the two-column grid exactly, so no spacing change is
// needed.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '4bf76360'
const CARD_TITLE = 'Reference Designs'
const CARD_EYEBROW = 'Build a custom lidar system'
const CARD_INDEX = 4

const REFERENCE_DESIGNS_CARD = {
	accent: 'accent2',
	body: '<p>A reference design is documentation rather than hardware — a validated starting point for teams developing their own transmit modules or complete lidar products; available materials may include system architecture, PCB design, optomechanical models, software, bills of materials and manufacturing guidance. Current reference designs are the TX10 Transmit Reference Design and the M30 Lidar Module Reference Design; not every reference design has a matching development kit. Best for: teams building custom lidar products.</p>',
	eyebrow: CARD_EYEBROW,
	link: {
		label: 'Discuss a reference design',
		newTab: false,
		type: 'custom',
		url: '/contact'
	},
	linkLabel: 'Discuss a reference design',
	linkNewTab: false,
	linkUrl: '/contact',
	media: {
		kind: 'url',
		value: '/lumotive/img/odp-exploded.jpg'
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

		const index = section.cards.findIndex(
			(card) => card && card.title === CARD_TITLE && card.eyebrow === CARD_EYEBROW
		)
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
		section.cards.splice(index, 0, REFERENCE_DESIGNS_CARD)
		record.set('sections', sections)
		app.save(record)
	}
)

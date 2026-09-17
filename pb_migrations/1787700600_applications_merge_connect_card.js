// Webvizio #85: on /applications, the "One platform. Many optical applications."
// bento (section id "91a455fe") carried separate "AI data centers" and
// "Optical communications" cards. Merge them into a single Connect card that
// links to /connect and keeps the optical-communications image. The other four
// cards and every other page keep their content; the six-card bentos elsewhere
// (e.g. /sense) are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '91a455fe'
const CONNECT_URL = '/connect'

const DATA_CENTERS_CARD = {
	accent: 'accent2',
	body: '<p>Optical circuit switching for AI infrastructure</p>',
	eyebrow: 'Connect',
	title: 'AI data centers'
}

const OPTICAL_CARD = {
	accent: 'accent2',
	body: '<p>Beam control for satellite, airborne, terrestrial, and other optical links</p>',
	eyebrow: 'Connect',
	media: {
		kind: 'url',
		value: '/lumotive/img/connect-optical.jpg'
	},
	title: 'Optical communications'
}

const MERGED_CARD = {
	accent: 'accent2',
	body: '<p>Optical circuit switching for AI infrastructure and beam control for satellite, airborne, terrestrial, and other optical links</p>',
	eyebrow: 'Connect',
	link: {
		label: 'Explore Lumotive Connect',
		newTab: false,
		type: 'custom',
		url: CONNECT_URL
	},
	linkLabel: 'Explore Lumotive Connect',
	linkNewTab: false,
	linkUrl: CONNECT_URL,
	media: {
		kind: 'url',
		value: '/lumotive/img/connect-optical.jpg'
	},
	title: 'AI data centers & optical communications'
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

const findApplicationsPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'applications' })
	} catch {
		return null
	}
}

const findBento = (sections) => {
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsApplicationBento' || !Array.isArray(section.cards)) return null
	return section
}

const indexOfTitle = (cards, title) => cards.findIndex((card) => card && card.title === title)

migrate(
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findBento(sections)
		if (!section) return

		const dataCenters = indexOfTitle(section.cards, DATA_CENTERS_CARD.title)
		const optical = indexOfTitle(section.cards, OPTICAL_CARD.title)
		if (dataCenters === -1 || optical === -1) return

		const at = Math.min(dataCenters, optical)
		section.cards.splice(Math.max(dataCenters, optical), 1)
		section.cards.splice(at, 1, MERGED_CARD)

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findApplicationsPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findBento(sections)
		if (!section) return

		const merged = indexOfTitle(section.cards, MERGED_CARD.title)
		if (merged === -1) return

		section.cards.splice(merged, 1, DATA_CENTERS_CARD, OPTICAL_CARD)

		record.set('sections', sections)
		app.save(record)
	}
)

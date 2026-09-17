// Webvizio #73: on /sense the applications bento ("Built for a broad range of
// 3D sensing applications", cardsApplicationBento, id "2a6b5ed9") loses the
// Connect / AI data centers card and the Defense card. The four remaining cards
// keep their copy, imagery, eyebrows and accents; nothing else on the page
// changes and no component is touched, so styling and responsive behaviour are
// unchanged. Four cards tile the 4-column dense grid exactly (2x2 feature, a
// unit card, a tall card and a unit card), so the layout reflows with no gaps.
//
// Cards are matched on eyebrow + title so the two Connect cards cannot be
// confused: only "AI data centers" goes, "Optical communications" stays.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '2a6b5ed9'

const AI_DATA_CENTERS_CARD = {
	accent: 'accent2',
	body: '<p>Optical circuit switching for in-rack and cluster fabrics, with insertion loss independent of port count.</p>',
	eyebrow: 'Connect',
	title: 'AI data centers'
}

const DEFENSE_CARD = {
	accent: 'accent3',
	body: '<p>Ultra-low SWaP lidar from 50 m to over 5,000 m, plus resilient optical comms for personnel, drones and vehicles.</p>',
	eyebrow: 'Defense',
	title: 'Defense'
}

const REMOVED = [
	{ index: 3, card: AI_DATA_CENTERS_CARD },
	{ index: 5, card: DEFENSE_CARD }
]

const matches = (card, target) =>
	Boolean(card) && card.title === target.title && card.eyebrow === target.eyebrow

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

const findSensePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' })
	} catch {
		return null
	}
}

const findBento = (sections) => {
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsApplicationBento' || !Array.isArray(section.cards)) return null
	return section
}

migrate(
	(app) => {
		const record = findSensePage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findBento(sections)
		if (!section) return

		const next = section.cards.filter(
			(card) => !REMOVED.some((entry) => matches(card, entry.card))
		)
		if (next.length === section.cards.length) return

		section.cards = next
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findSensePage(app)
		if (!record) return

		const sections = readSections(record)
		const section = findBento(sections)
		if (!section) return

		for (const entry of REMOVED) {
			if (section.cards.some((card) => matches(card, entry.card))) continue
			section.cards.splice(Math.min(entry.index, section.cards.length), 0, entry.card)
		}

		record.set('sections', sections)
		app.save(record)
	}
)

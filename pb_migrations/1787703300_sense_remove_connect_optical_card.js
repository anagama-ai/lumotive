// Webvizio #73 (second pass): the applications bento on /sense
// ("Built for a broad range of 3D sensing applications",
// cardsApplicationBento, id "2a6b5ed9") loses the remaining Connect card,
// "Optical communications". The first pass (1787701700) removed the Connect /
// AI data centers and Defense cards but kept this one; the ticket lists all
// three, so it goes too.
//
// What remains is the three Sense cards — Industrial & robotics, Auto ADAS &
// autonomy, ITS & surveillance — with their copy, imagery, eyebrows and
// accents untouched. Nothing is added in place of the removed card and no
// other section is read or written.
//
// The card is matched on eyebrow + title, never on position.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '2a6b5ed9'

const OPTICAL_COMMUNICATIONS_CARD = {
 "accent": "accent2",
 "body": "<p>Terrestrial, satellite-to-satellite and aircraft-to-satellite optical links with low-SWaP beam steering.</p>",
 "eyebrow": "Connect",
 "media": {
  "kind": "url",
  "value": "/lumotive/img/connect-optical.jpg"
 },
 "title": "Optical communications"
}

const INDEX = 3

const matches = (card) =>
	Boolean(card) &&
	card.title === OPTICAL_COMMUNICATIONS_CARD.title &&
	card.eyebrow === OPTICAL_COMMUNICATIONS_CARD.eyebrow

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

		const next = section.cards.filter((card) => !matches(card))
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
		if (!section || section.cards.some((card) => matches(card))) return

		section.cards.splice(Math.min(INDEX, section.cards.length), 0, OPTICAL_COMMUNICATIONS_CARD)
		record.set('sections', sections)
		app.save(record)
	}
)

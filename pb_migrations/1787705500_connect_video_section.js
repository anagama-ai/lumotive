// Connect page: add the Vimeo clip directly above the "Send light, not
// signals" cards (cardsIconCards, id "d32ef2bd"). MediaVideoEmbed suppresses
// its heading block when heading and intro are empty, so this is a bare player.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const CARDS_ID = 'd32ef2bd'
const SECTION_ID = 'f4b9c1d7'

const SECTION = {
	id: SECTION_ID,
	type: 'mediaVideoEmbed',
	heading: '',
	intro: '',
	mode: 'video',
	items: [],
	videoUrl: 'https://vimeo.com/1227505713',
	designVersion: 'videoEmbed',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'video'
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

const findConnectPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'connect' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findConnectPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		const cards = sections.findIndex((entry) => entry && entry.id === CARDS_ID)
		if (cards === -1) return
		sections.splice(cards, 0, SECTION)

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findConnectPage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((entry) => !entry || entry.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	}
)

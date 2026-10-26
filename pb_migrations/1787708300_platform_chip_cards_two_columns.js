// Platform page (/platform), approved content package rev. 2026-10-07, page 06.
// NEW · CHIP CARDS — follow-up to 1787707400_platform_page6.js.
//
// The "Two chips, one platform" section (cardsTextCards, id "c0a71d35") holds
// two cards in the component's default three-up desktop grid, so LM10 and LS20
// sat in two thirds of the row with the last column empty. Page 06 shows them
// as two equal columns.
//
// `columns: "2"` opts this one section into the even two-up grid that
// CardsTextCards now supports. Every other cardsTextCards section leaves the
// field unset and keeps the three-up grid, including the two-card section on
// /dev-kits. Tablet stays two-up and mobile stays stacked in both modes.
//
// Copy, card order, accents, shadows, typography and the shared
// "Explore LCM chips" action are untouched. The wider columns also leave more
// room for the pending LM10 photo than the three-up grid did.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'c0a71d35'

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

const findPlatformPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return null
	}
}

const apply = (app, columns) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsTextCards') return

	if (columns) section.columns = columns
	else delete section.columns

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, '2')
	},
	(app) => {
		apply(app, null)
	}
)

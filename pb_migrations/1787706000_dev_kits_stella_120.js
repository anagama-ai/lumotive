// The Namuga card on /dev-kits (section "e91c47a5") is renamed Stella-2 →
// Stella-120 per client.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'e91c47a5'
const OLD_TITLE = 'Stella-2'
const NEW_TITLE = 'Stella-120'

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

const rename = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' })
	} catch {
		return
	}
	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || !Array.isArray(section.cards)) return

	const card = section.cards.find((entry) => entry && entry.title === from)
	if (!card) return
	card.title = to

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => rename(app, OLD_TITLE, NEW_TITLE),
	(app) => rename(app, NEW_TITLE, OLD_TITLE)
)

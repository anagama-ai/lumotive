// Connect page: the "A programmable optical fabric for the AI era" peel-swap
// scene (cardsPeelSwap, id "2a71fb29") ran at width "full", so its .lumo-inner
// had no cap and the heading, intro, cards and image stretched to the viewport
// edges. It moves to "contained", the shared shell every other section uses.
//
// Only the `width` field changes. Copy, cards, media, spacing and the peel
// animation are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '2a71fb29'

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

const applyWidth = (app, width) => {
	let record = null
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'connect' })
	} catch {
		return
	}
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section) return

	section.width = width
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyWidth(app, 'contained')
	},
	(app) => {
		applyWidth(app, 'full')
	}
)

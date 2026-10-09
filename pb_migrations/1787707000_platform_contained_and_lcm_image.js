// /platform: the two width "full" sections — "Groundbreaking physics meets
// mature manufacturing" (cardsPeelSwap, id "ace8d391") and the paradigm split
// (splitPeelBleed, id "fbe8b045") — move to "contained" so every section on
// the page shares the content cap; the bleed background on the split stays
// full-width because it is positioned on the section, not .lumo-inner.
// The "LCM™ platform" flow-panel card (section "cac52f89") gets the client's
// chip photo.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const WIDTH_IDS = ['ace8d391', 'fbe8b045']
const FLOW_ID = 'cac52f89'
const CARD_TITLE = 'LCM™ platform'
const OLD_MEDIA = { kind: 'url', value: '/lumotive/img/lm10-chip-clean.png' }
const NEW_MEDIA = { kind: 'url', value: '/lumotive/img/lcm-platform-chip.jpg' }

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

const apply = (app, width, expected, media) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return
	}
	const sections = readSections(record)
	for (const id of WIDTH_IDS) {
		const section = sections.find((entry) => entry && entry.id === id)
		if (section) section.width = width
	}
	const flow = sections.find((entry) => entry && entry.id === FLOW_ID)
	const card = flow && Array.isArray(flow.cards) ? flow.cards.find((c) => c && c.title === CARD_TITLE) : null
	if (card && card.media && card.media.value === expected.value) card.media = { kind: media.kind, value: media.value }

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, 'contained', OLD_MEDIA, NEW_MEDIA),
	(app) => apply(app, 'full', NEW_MEDIA, OLD_MEDIA)
)

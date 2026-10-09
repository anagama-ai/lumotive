// /platform: the "LCM™ platform" flow-panel card (section "cac52f89") swaps
// its black-background chip photo for a transparent cutout.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const FLOW_ID = 'cac52f89'
const CARD_TITLE = 'LCM™ platform'
const OLD_SRC = '/lumotive/img/lcm-platform-chip.jpg'
const NEW_SRC = '/lumotive/img/lcm-platform-chip.png'

const swap = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	const flow = Array.isArray(sections) ? sections.find((entry) => entry && entry.id === FLOW_ID) : null
	const card = flow && Array.isArray(flow.cards) ? flow.cards.find((c) => c && c.title === CARD_TITLE) : null
	if (!card || !card.media || card.media.value !== from) return
	card.media = { kind: 'url', value: to }
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => swap(app, OLD_SRC, NEW_SRC),
	(app) => swap(app, NEW_SRC, OLD_SRC)
)

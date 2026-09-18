// Homepage width refinement (Vibe pins 1 and 2): the "One chip. Boundless
// applications." scene (cardsPeelScene, id "a20efeab") and the "When light
// becomes programmable" bento (cardsPeelBento, id "677cf547") ran at width
// "full", so their .lumo-inner had no cap and the content stretched to within
// 28px of each edge. Both move to "contained", the shared 82rem shell the rest
// of the site uses — one step on the existing width scale, no new token and no
// component change.
//
// Only the `width` field changes on those two sections. Copy, cards, images,
// grid structure, gaps, typography, none/none spacing and the peel animation
// are untouched, and .lumo-inner keeps centring them with its own
// `margin-inline: auto`. The cap only binds above 1312px, so tablet and mobile
// are unaffected.
//
// The hero, the investor logo band and the closing CTA keep width "full", and
// no other page is touched: both section types render only on the home page.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_IDS = ['a20efeab', '677cf547']

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

const findHomePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return null
	}
}

const applyWidth = (app, width) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	let touched = false
	for (const id of SECTION_IDS) {
		const section = sections.find((entry) => entry && entry.id === id)
		if (!section) continue
		section.width = width
		touched = true
	}
	if (!touched) return

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

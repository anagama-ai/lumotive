// Home page, approved content package rev. 2026-10-07, page 05 of 21.
// CHANGE · CARD COPY — the "One chip. Boundless applications." section
// (cardsPeelScene, id "a20efeab"). Card content only:
//
//  * Each card is headed by its solution name, "Lumotive Sense" and "Lumotive
//    Connect", as the approved page shows. That name currently sits in the
//    eyebrow above a separate title ("3D sensing for Physical AI",
//    "Programmable photonics for AI infrastructure"), neither of which the
//    approved page carries. The name moves into the title and the eyebrow is
//    cleared, so the name is printed once, not twice. Clearing the first title
//    also settles global rule 9 for this section: "Physical AI" is no longer
//    used twice on the home page.
//  * Both bodies take the approved sentences word for word.
//  * Both links were broken. "Explore Sense" pointed at /technology and
//    "Explore Connect" at /optical-circuit-switching-communications; neither
//    path has a page record, so both returned 404. They now follow the approved
//    site map on page 01: Sense → /sense, Connect → /connect. Labels are
//    unchanged; the trailing arrow is drawn by the component.
//
// Heading, layout, media, accents, spacing and the peel choreography are
// untouched, as is every other section on the page.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'a20efeab'

const NEXT = [
	{
		eyebrow: '',
		title: 'Lumotive Sense',
		body: '<p>Programmable 3D sensing for robots, vehicles, and smart infrastructure.</p>',
		linkLabel: 'Explore Sense',
		linkUrl: '/sense'
	},
	{
		eyebrow: '',
		title: 'Lumotive Connect',
		body: '<p>Solid-state optical circuit switching for AI data centers, plus beam control for optical communications.</p>',
		linkLabel: 'Explore Connect',
		linkUrl: '/connect'
	}
]

const PREV = [
	{
		eyebrow: 'Lumotive Sense',
		title: '3D sensing for Physical AI',
		body: '<p>Software-defined beam steering gives autonomous machines the flexibility to see, adapt, and respond across robotics, mobility, smart infrastructure, surveillance, and defense.</p>',
		linkLabel: 'Explore Sense',
		linkUrl: '/technology'
	},
	{
		eyebrow: 'Lumotive Connect',
		title: 'Programmable photonics for AI infrastructure',
		body: '<p>Solid-state, software-defined optical switching routes light directly between endpoints to reduce power, minimize latency, and scale AI networks from rack-level systems to hyperscale fabrics.</p>',
		linkLabel: 'Explore Connect',
		linkUrl: '/optical-circuit-switching-communications'
	}
]

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

const apply = (app, state) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsPeelScene' || !Array.isArray(section.cards)) return

	for (let i = 0; i < state.length && i < section.cards.length; i++) {
		const card = section.cards[i]
		if (!card) continue
		const next = state[i]

		card.eyebrow = next.eyebrow
		card.title = next.title
		card.body = next.body
		card.linkLabel = next.linkLabel
		card.linkUrl = next.linkUrl
		// The nested `link` object is the value the renderer falls back to, so
		// it has to move with the flat fields or the old URL survives.
		if (card.link && typeof card.link === 'object') {
			card.link.label = next.linkLabel
			card.link.url = next.linkUrl
		}
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, NEXT)
	},
	(app) => {
		apply(app, PREV)
	}
)

// Platform page (/platform), "Where Software-Defined Light Goes to Work"
// section (cardsMediaCards, id "d38e36da"): card content and shared CTA from
// page 06 of the approved package (rev. October 7, 2026).
//
// The mockup shows each card as a heading plus one line, with a single
// "See all applications" action under the pair and no per-card links:
//
//   Lumotive Sense       Programmable 3D sensing.
//   Lumotive Connect     Optical circuit switching for AI infrastructure.
//   [See all applications]
//
// So each card's heading becomes the solution name and the eyebrow is
// dropped, because keeping it would print "Lumotive Sense" twice in the same
// card. Dropping the per-card links also clears global rule 9: the old card
// heading "3D sensing for Physical AI" put "Physical AI" in a headline, which
// the rule forbids, and left two uses of the term on one page.
//
// Media, accents, badges, order, spacing, background and the section's
// introduction are unchanged; the introduction stays as it is pending the
// client's answer on the KEEP AS IS marker.
//
// Removing `link`, `linkLabel` and `linkUrl` makes CardsMediaCards render each
// card as an <article> instead of an <a>, so the cards are no longer
// clickable. The section-level `linkLabel`/`linkUrl` pair is the new optional
// field the component reads; sections that leave it empty render as before.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'd38e36da'

const CARDS_AFTER = [
	{
		title: 'Lumotive Sense',
		body: '<p>Programmable 3D sensing.</p>'
	},
	{
		title: 'Lumotive Connect',
		body: '<p>Optical circuit switching for AI infrastructure.</p>'
	}
]

const CARDS_BEFORE = [
	{
		eyebrow: 'Lumotive Sense',
		title: '3D sensing for Physical AI',
		body: '<p>Software-defined beam steering gives autonomous machines the flexibility to see, adapt, and respond across robotics, mobility, smart infrastructure, surveillance, and defense.</p>',
		link: { label: 'Explore Sense', newTab: false, type: 'custom', url: '/sense' },
		linkLabel: 'Explore Sense',
		linkNewTab: false,
		linkUrl: '/sense'
	},
	{
		eyebrow: 'Lumotive Connect',
		title: 'Programmable photonics for AI infrastructure',
		body: '<p>Solid-state, software-defined optical switching routes light directly between endpoints to reduce power, minimize latency, and scale AI networks from rack-level systems to hyperscale fabrics.</p>',
		link: { label: 'Explore Connect', newTab: false, type: 'custom', url: '/connect' },
		linkLabel: 'Explore Connect',
		linkNewTab: false,
		linkUrl: '/connect'
	}
]

const SECTION_LINK = { linkLabel: 'See all applications', linkUrl: '/applications' }

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

// Rewrites the two cards in place and sets or clears the shared action, so
// media, accents and card order survive untouched in both directions.
const apply = (app, { cards, sectionLink, clearEyebrow }) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsMediaCards') return
	if (!Array.isArray(section.cards) || section.cards.length !== cards.length) return

	section.cards.forEach((card, index) => {
		const next = cards[index]
		card.title = next.title
		card.body = next.body

		if (clearEyebrow) delete card.eyebrow
		else card.eyebrow = next.eyebrow

		if (next.link) {
			card.link = JSON.parse(JSON.stringify(next.link))
			card.linkLabel = next.linkLabel
			card.linkNewTab = next.linkNewTab
			card.linkUrl = next.linkUrl
		} else {
			delete card.link
			delete card.linkLabel
			delete card.linkNewTab
			delete card.linkUrl
		}
	})

	if (sectionLink) {
		section.linkLabel = sectionLink.linkLabel
		section.linkUrl = sectionLink.linkUrl
	} else {
		delete section.linkLabel
		delete section.linkUrl
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, { cards: CARDS_AFTER, sectionLink: SECTION_LINK, clearEyebrow: true })
	},
	(app) => {
		apply(app, { cards: CARDS_BEFORE, sectionLink: null, clearEyebrow: false })
	}
)

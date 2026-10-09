// The Lumotive Sense and Lumotive Connect solution cards link to legacy URLs
// that have no page or redirect. Point both copies of those cards at the live
// /sense and /connect pages without changing any other card content.
//
// The component reads the flat linkUrl field; the nested link object is the
// admin form's mirror, so both URLs are updated together.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const TARGETS = [
	{ slug: 'home', sectionId: 'a20efeab', sectionType: 'cardsPeelScene' },
	{ slug: 'platform', sectionId: 'd38e36da', sectionType: 'cardsMediaCards' }
]

const URLS = {
	'/technology': '/sense',
	'/optical-circuit-switching-communications': '/connect'
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

const findPage = (app, slug) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	} catch {
		return null
	}
}

const invertUrls = (urls) => {
	const inverted = {}
	for (const oldUrl in urls) inverted[urls[oldUrl]] = oldUrl
	return inverted
}

const applyUrls = (app, urls) => {
	for (const target of TARGETS) {
		const record = findPage(app, target.slug)
		if (!record) continue

		const sections = readSections(record)
		const section = sections.find((entry) => entry && entry.id === target.sectionId)
		if (!section || section.type !== target.sectionType || !Array.isArray(section.cards)) continue

		let changed = false
		for (const card of section.cards) {
			if (!card || !card.link || typeof card.link !== 'object') continue
			const newUrl = urls[card.linkUrl]
			if (!newUrl || card.link.url !== card.linkUrl) continue

			card.link.url = newUrl
			card.linkUrl = newUrl
			changed = true
		}

		if (!changed) continue
		record.set('sections', sections)
		app.save(record)
	}
}

migrate(
	(app) => {
		applyUrls(app, URLS)
	},
	(app) => {
		applyUrls(app, invertUrls(URLS))
	}
)

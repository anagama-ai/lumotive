// Webvizio #87: /applications gets a header dropdown with Robotics and
// Automotive deep links. Both targets already exist as cards in the
// "Scalable across 3D sensing markets" section (cardsMediaCards, anchor
// "markets"); this migration gives those two cards stable per-card anchors and
// turns the flat "Applications" header link into a `sub` item, keeping the
// Applications page itself reachable through an "Overview" subitem the same way
// Sense does.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const APPLICATIONS_URL = '/applications'

const CARD_ANCHORS = [
	{ title: 'Robotics and humanoids', anchor: 'robotics' },
	{ title: 'Mobility and heavy equipment', anchor: 'automotive' }
]

const SUBITEMS = [
	{
		label: 'Overview',
		url: APPLICATIONS_URL,
		description: 'Programmable optics across applications'
	},
	{
		label: 'Robotics',
		url: APPLICATIONS_URL + '#robotics',
		description: 'Adaptive 3D sensing for robots and humanoids'
	},
	{
		label: 'Automotive',
		url: APPLICATIONS_URL + '#automotive',
		description: 'Surround sensing for vehicles and heavy equipment'
	}
]

const readJson = (record, field, fallback) => {
	try {
		const raw = record.getString(field)
		if (!raw) return fallback
		const parsed = JSON.parse(raw)
		return parsed && typeof parsed === 'object' ? parsed : fallback
	} catch {
		return fallback
	}
}

const findPage = (app, slug) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	} catch {
		return null
	}
}

const findHeader = (app) => {
	try {
		return app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return null
	}
}

const navLink = (label, url) => ({
	label,
	newTab: false,
	type: 'custom',
	url
})

const applicationsLinkItem = () => ({
	blockType: 'link',
	link: navLink('Applications', APPLICATIONS_URL),
	linkLabel: 'Applications',
	linkNewTab: false,
	linkUrl: APPLICATIONS_URL
})

const applicationsSubItem = () => ({
	blockType: 'sub',
	label: 'Applications',
	subitems: SUBITEMS.map((entry) => ({
		Description: entry.description,
		link: navLink(entry.label, entry.url),
		linkLabel: entry.label,
		linkNewTab: false,
		linkUrl: entry.url
	}))
})

// Matches the flat link or the dropdown, whichever the record currently holds.
const isApplicationsItem = (item) => {
	if (!item) return false
	if (item.blockType === 'sub') return item.label === 'Applications'
	const url = item.linkUrl || (item.link && item.link.url)
	return url === APPLICATIONS_URL
}

const setCardAnchors = (app, apply) => {
	const record = findPage(app, 'applications')
	if (!record) return

	const sections = readJson(record, 'sections', [])
	if (!Array.isArray(sections)) return

	let changed = false

	for (const section of sections) {
		if (!section || section.type !== 'cardsMediaCards' || !Array.isArray(section.cards)) continue

		for (const card of section.cards) {
			if (!card) continue
			const match = CARD_ANCHORS.find((entry) => entry.title === card.title)
			if (!match) continue

			if (apply) {
				if (card.anchor === match.anchor) continue
				card.anchor = match.anchor
			} else {
				if (card.anchor !== match.anchor) continue
				delete card.anchor
			}
			changed = true
		}
	}

	if (!changed) return

	record.set('sections', sections)
	app.save(record)
}

const setHeaderItem = (app, build) => {
	const record = findHeader(app)
	if (!record) return

	const data = readJson(record, 'data', {})
	if (!Array.isArray(data.items)) return

	const index = data.items.findIndex(isApplicationsItem)
	if (index === -1) return

	data.items[index] = build()
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		setCardAnchors(app, true)
		setHeaderItem(app, applicationsSubItem)
	},
	(app) => {
		setHeaderItem(app, applicationsLinkItem)
		setCardAnchors(app, false)
	}
)

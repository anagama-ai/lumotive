// Follow-up to Webvizio #50: removing the "From fixed optics to programmable
// light" scene took the "technology" anchor with it, leaving the home hero's
// secondary CTA "Explore the technology" pointing at #technology — a target
// that no longer exists on the page. It now points at /platform, the LCM
// technology page, which is where that CTA led conceptually and where the
// About and Partners pages already send "Explore the platform".
//
// Only the secondary link URL changes. The label, the primary "Talk to our
// team" CTA, the heading, eyebrow, body, hero video and every presentation
// field are untouched, and no other section is read or written.
//
// The component reads the flat secondaryLink* fields; the nested
// secondaryLink object is the admin form's mirror, so both are written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '460c4c1f'

const OLD_URL = '#technology'
const NEW_URL = '/platform'
const LABEL = 'Explore the technology'

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

const applyUrl = (app, url) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'heroFullHeight') return

	section.secondaryLink = { label: LABEL, newTab: false, type: 'custom', url }
	section.secondaryLinkLabel = LABEL
	section.secondaryLinkUrl = url
	section.secondaryLinkNewTab = false

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyUrl(app, NEW_URL)
	},
	(app) => {
		applyUrl(app, OLD_URL)
	}
)

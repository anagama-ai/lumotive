// Webvizio #69: the closing CTA on /sense ("Redefine perception with
// software-defined light.", ctaDefault, id "3327d913") drops its "Request a dev
// kit" button and keeps exactly one: "Talk to our team" -> /contact, moved into
// the primary link slot so the section holds a single link with no empty slot.
// Heading, body, background, spacing and width are untouched; the CTA component
// centres its link row, so the lone button centres itself.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '3327d913'

const DEV_KIT_LINK = { label: 'Request a dev kit', url: '/dev-kits' }
const TEAM_LINK = { label: 'Talk to our team', url: '/contact' }

const linkObject = (link) => ({
	label: link.label,
	newTab: false,
	type: 'custom',
	url: link.url
})

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

const findSensePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'sense' })
	} catch {
		return null
	}
}

const applyLinks = (app, primary, secondary) => {
	const record = findSensePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaDefault') return

	section.primaryLink = linkObject(primary)
	section.primaryLinkLabel = primary.label
	section.primaryLinkUrl = primary.url
	section.primaryLinkNewTab = false

	if (secondary) {
		section.secondaryLink = linkObject(secondary)
		section.secondaryLinkLabel = secondary.label
		section.secondaryLinkUrl = secondary.url
		section.secondaryLinkNewTab = false
	} else {
		delete section.secondaryLink
		delete section.secondaryLinkLabel
		delete section.secondaryLinkUrl
		delete section.secondaryLinkNewTab
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyLinks(app, TEAM_LINK, null)
	},
	(app) => {
		applyLinks(app, DEV_KIT_LINK, TEAM_LINK)
	}
)

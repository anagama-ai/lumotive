// Webvizio #78: the closing CTA on /lm10 ("Design LM10 into your system",
// ctaLattice, id "8a2ba126") loses its "Explore dev kits" button. The heading,
// body, lattice background, spacing and width are untouched, and the remaining
// "Talk to our team" button keeps its label and /contact destination — it just
// moves into the primary link slot so the section holds exactly one link and no
// empty slot. The CTA component centres its link row, so the single button
// centres itself; it renders in the filled style the component gives the first
// link (the same style every other single-button CTA on the site uses).
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '8a2ba126'

const DEV_KITS_LINK = { label: 'Explore dev kits', url: '/dev-kits' }
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

const findLm10Page = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lm10' })
	} catch {
		return null
	}
}

const applyLinks = (app, primary, secondary) => {
	const record = findLm10Page(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaLattice') return

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
		applyLinks(app, DEV_KITS_LINK, TEAM_LINK)
	}
)

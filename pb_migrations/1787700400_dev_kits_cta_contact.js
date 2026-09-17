// Webvizio #83: the closing CTA on /dev-kits still sold Lumotive Connect
// development platforms ("coming soon"). Re-point it at a plain contact ask for
// dev kits and reference designs. Scoped to that one section (id "116c9e28" on
// the dev-kits page); the shared ctaDefault block and every other page are
// untouched, as are the section's background, spacing and width.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '116c9e28'
const CONTACT_URL = '/contact'

const BEFORE = {
	eyebrow: 'Lumotive Connect',
	heading: 'Lumotive Connect development platforms are coming soon',
	body: '<p>Development platforms for Lumotive Connect are in development. Contact Lumotive to discuss future evaluation opportunities for optical switching and AI infrastructure applications.</p>',
	linkLabel: 'Ask about Lumotive Connect'
}

const AFTER = {
	eyebrow: '',
	heading: 'Contact Us',
	body: '<p>Contact Lumotive to discuss development kits and reference designs for your 3D sensing application.</p>',
	linkLabel: 'Contact Us'
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

const findDevKitsPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' })
	} catch {
		return null
	}
}

const applyCopy = (app, copy) => {
	const record = findDevKitsPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaDefault') return

	section.eyebrow = copy.eyebrow
	section.heading = copy.heading
	section.body = copy.body
	section.primaryLinkLabel = copy.linkLabel
	section.primaryLinkUrl = CONTACT_URL
	section.primaryLinkNewTab = false

	if (section.primaryLink && typeof section.primaryLink === 'object') {
		section.primaryLink.label = copy.linkLabel
		section.primaryLink.url = CONTACT_URL
		section.primaryLink.newTab = false
	} else {
		section.primaryLink = {
			label: copy.linkLabel,
			newTab: false,
			type: 'custom',
			url: CONTACT_URL
		}
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyCopy(app, AFTER)
	},
	(app) => {
		applyCopy(app, BEFORE)
	}
)

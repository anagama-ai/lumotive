// Webvizio #75: the closing CTA on /platform ("One platform. Many optical
// applications.") becomes a plain contact ask. Scoped to that one section
// (id "1f667bfa" on the platform page); every other section, the shared
// ctaDefault block and the CTA's own design — designVersion "default",
// background "none", full width, lg/lg spacing and the "applications" anchor
// (nothing links to it) — are left as they are.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '1f667bfa'

const BEFORE = {
	heading: 'One platform. Many optical applications.',
	body: '<p>Beyond Lumotive Sense and Lumotive Connect, programmable optics can support optical communications, adaptive imaging, optical computing, 3D printing, wireless power, infrared countermeasures, holographic displays, and other systems that depend on precise control of light.</p><p>The platform is designed to make optics more flexible, reconfigurable, and software-defined, creating new design possibilities wherever light is used in a system.</p>',
	linkLabel: 'Explore Applications',
	linkUrl: '/applications'
}

const AFTER = {
	heading: 'Contact Us',
	body: '<p>Contact Lumotive to discuss how programmable optics could support your application.</p>',
	linkLabel: 'Contact Us',
	linkUrl: '/contact'
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

const findPlatformPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return null
	}
}

const applyCopy = (app, copy) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaDefault') return

	section.heading = copy.heading
	section.body = copy.body
	section.primaryLinkLabel = copy.linkLabel
	section.primaryLinkUrl = copy.linkUrl
	section.primaryLinkNewTab = false

	if (section.primaryLink && typeof section.primaryLink === 'object') {
		section.primaryLink.label = copy.linkLabel
		section.primaryLink.url = copy.linkUrl
		section.primaryLink.newTab = false
	} else {
		section.primaryLink = {
			label: copy.linkLabel,
			newTab: false,
			type: 'custom',
			url: copy.linkUrl
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

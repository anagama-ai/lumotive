// Platform page (/platform): remove the trailing generic "Contact Us" CTA
// (ctaDefault, id "1f667bfa").
//
// Global content rule 8 of the approved package (rev. October 7, 2026) reads
// "Every page ends with its own specific CTA. No generic 'Contact us'
// sections." The staging section is the literal case the rule names: heading
// "Contact Us", a one-line generic body, and a "Contact Us" button to
// /contact. Page 06 of the package ends with "Where Software-Defined Light
// Goes to Work" and its "See all applications" link, then the footer; no
// closing CTA is specified for this page, and no approved replacement copy
// exists anywhere in the package, so nothing is substituted here.
//
// The section carried anchor "applications", which nothing links to: no
// page, post, or global references /platform#applications, and the redirects
// collection is empty. Removal therefore breaks no inbound link.
//
// The applications card section above it (cardsMediaCards, id "d38e36da") is
// marked KEEP AS IS and is left untouched, including its two cards, their
// links, and the open "Physical AI" and "See all applications" questions.
//
// Down restores the section verbatim at the end of the page.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '1f667bfa'

const SECTION = {
	align: 'container',
	anchor: 'applications',
	background: 'none',
	body: '<p>Contact Lumotive to discuss how programmable optics could support your application.</p>',
	designVersion: 'default',
	heading: 'Contact Us',
	id: SECTION_ID,
	primaryLink: {
		label: 'Contact Us',
		newTab: false,
		type: 'custom',
		url: '/contact'
	},
	primaryLinkLabel: 'Contact Us',
	primaryLinkNewTab: false,
	primaryLinkUrl: '/contact',
	spacingBottom: 'lg',
	spacingTop: 'lg',
	type: 'ctaDefault',
	width: 'contained'
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

migrate(
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((entry) => !(entry && entry.id === SECTION_ID))
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		sections.push(JSON.parse(JSON.stringify(SECTION)))
		record.set('sections', sections)
		app.save(record)
	}
)

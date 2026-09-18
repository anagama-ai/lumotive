// Webvizio #68: "Combine links 1 & 2 into 'Contact Us'." The closing CTA on /
// ("Build with programmable optics.", ctaSplitLinks, id "c5839355") lists its
// primary link first and its secondaryLinks after it, so links 1 and 2 are
// "Talk to our team" -> /contact and "Request an evaluation kit" -> /products.
// They become a single "Contact Us" -> /contact in the primary slot, and the
// evaluation-kit row is dropped from secondaryLinks. "Browse products" ->
// /products stays exactly where it is, now the second and last row.
//
// /contact is the existing Contact page (slug "contact", path "contact"); no
// route is invented. The heading, body, background "none", full width, lg / lg
// spacing, designVersion "splitLinks" and every style, arrow and divider the
// component draws are untouched — only the two link records change, and the
// component reads both the flat primaryLink* fields and the nested primaryLink
// object, so both are written, as in #69.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'c5839355'

const TEAM_LINK = { label: 'Talk to our team', url: '/contact' }
const CONTACT_LINK = { label: 'Contact Us', url: '/contact' }
const KIT_ROW = { label: 'Request an evaluation kit', newTab: false, url: '/products' }
const PRODUCTS_ROW = { label: 'Browse products', newTab: false, url: '/products' }

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

const findHomePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return null
	}
}

const applyLinks = (app, primary, rows) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'ctaSplitLinks') return

	section.primaryLink = linkObject(primary)
	section.primaryLinkLabel = primary.label
	section.primaryLinkUrl = primary.url
	section.primaryLinkNewTab = false
	section.secondaryLinks = rows

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyLinks(app, CONTACT_LINK, [PRODUCTS_ROW])
	},
	(app) => {
		applyLinks(app, TEAM_LINK, [KIT_ROW, PRODUCTS_ROW])
	}
)

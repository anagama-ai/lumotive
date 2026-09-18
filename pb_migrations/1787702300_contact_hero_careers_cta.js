// Webvizio #67: "Replace with careers page." On /contact the hero band
// (heroBand, id "ad9c07fe") swaps its primary CTA "Choose an enquiry" ->
// "#enquiries" for the careers destination. No route is invented: "Careers" is
// an existing link in this project, and every place that already uses it — the
// Company nav group, the footer, the /culture closing CTA and this same contact
// page's own closing CTA (id "9ab67cf3") — points at
// https://jobs.lever.co/lumotive, with newTab false. The hero reuses that exact
// label and URL so all five agree.
//
// Only the primary link changes. The eyebrow, heading, body, image, background,
// width, md/md spacing and the "Find an office" secondary link are untouched,
// so the hero keeps its copy, layout and spacing. The "Choose the right
// starting point" section keeps its "enquiries" anchor; the hero was the only
// thing linking to it, and nothing else in any page, the header or the footer
// references "#enquiries".
//
// The component reads the flat primaryLink* fields; the nested primaryLink
// object is the admin form's mirror, so both are written, as in #69.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'ad9c07fe'

const ENQUIRY_LINK = { label: 'Choose an enquiry', url: '#enquiries' }
const CAREERS_LINK = { label: 'Careers', url: 'https://jobs.lever.co/lumotive' }

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

const findContactPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'contact' })
	} catch {
		return null
	}
}

const applyPrimaryLink = (app, link) => {
	const record = findContactPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'heroBand') return

	section.primaryLink = linkObject(link)
	section.primaryLinkLabel = link.label
	section.primaryLinkUrl = link.url
	section.primaryLinkNewTab = false

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyPrimaryLink(app, CAREERS_LINK)
	},
	(app) => {
		applyPrimaryLink(app, ENQUIRY_LINK)
	}
)

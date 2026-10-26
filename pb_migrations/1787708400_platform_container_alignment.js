// Platform page (/platform) visual refinement.
//
// Every section on the page sat on the wider section shell, so their content
// started about 52px left of the navigation logo at 1440. The shared
// `data-align="container"` rule in app.css already reproduces the header's
// geometry; this opts every /platform section into it, the same way the home
// page sections were aligned.
//
// Alignment is a per-section CMS value, so no other page is affected: a
// section without `align` keeps the shell it has today.
//
// Nothing else changes. Copy, media, spacing steps, backgrounds, card layouts
// and the peel choreography are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
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

const apply = (app, aligned) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	for (const section of sections) {
		if (!section || typeof section !== 'object') continue
		if (aligned) section.align = 'container'
		else delete section.align
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, true)
	},
	(app) => {
		apply(app, false)
	}
)

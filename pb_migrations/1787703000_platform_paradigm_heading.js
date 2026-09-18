// Webvizio #31: "Title should be ...". On /platform the paradigm section
// (splitPeelBleed, id "fbe8b045", anchor "paradigm") is retitled from "From
// fixed optics to programmable optical systems" to "Light Control Metasurface™
// Optical Beamforming Technology", the heading lumotive.com/technology uses
// for the same material.
//
// Only `heading` changes. The body copy, the paradigm-chip bleed image,
// mediaPosition "left", designVersion "peelBleed", background, full width,
// none / none spacing and the "paradigm" anchor are untouched, so the peel
// animation, layout and spacing are unchanged, and no other section on the
// page is read or written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'fbe8b045'

const OLD_HEADING = 'From fixed optics to programmable optical systems'
const NEW_HEADING = 'Light Control Metasurface™ Optical Beamforming Technology'

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

const applyHeading = (app, heading) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'splitPeelBleed') return

	section.heading = heading

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyHeading(app, NEW_HEADING)
	},
	(app) => {
		applyHeading(app, OLD_HEADING)
	}
)

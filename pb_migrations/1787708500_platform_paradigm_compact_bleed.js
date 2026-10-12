// Platform page (/platform), "Light Control Metasurface™ Optical Beamforming
// Technology" section (splitPeelBleed, id "fbe8b045") visual refinement.
//
// The section held a full 100svh band around a copy column of roughly 450px,
// leaving about 216px of slack above it and 232px below, and the standard
// bleed shade faded only to 38% on the open side, which darkened the wafer
// image until the right of the section read as empty space rather than art.
//
// `bleed: "compact"` opts this section into the shorter 80svh band and the
// lighter shade that SplitDefault now supports. The copy side of the gradient
// stays at 96% opacity, so text contrast is unchanged, and mobile keeps the
// taller band and the heavier shade because the copy stacks over the full
// width there.
//
// The peel scene derives its pin window from the section's height, so the
// animation follows the shorter band with no further change.
//
// Copy, bullets, heading, media and the three-panel flow graphic that follows
// are untouched, and image correction #125 stays open.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'fbe8b045'

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

const apply = (app, bleed) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'splitPeelBleed') return

	if (bleed) section.bleed = bleed
	else delete section.bleed

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'compact')
	},
	(app) => {
		apply(app, null)
	}
)

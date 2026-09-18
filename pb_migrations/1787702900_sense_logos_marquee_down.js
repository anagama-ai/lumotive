// Webvizio #58: "Move this section down towards bottom." On /sense the partner
// logo marquee (logosMarquee, id "e6595d2c", heading "Hokuyo and Namuga ship
// LCM-powered lidar today") moves from third position — between "The problem"
// and "Why Lumotive is different" — down to the foot of the page content,
// after the applications bento (id "2a6b5ed9") and immediately before the
// closing CTA (id "3327d913"), matching where the home page carries its logo
// strip.
//
// The section moves as-is: the same record is repositioned, so its eleven
// logos, heading, marquee animation, designVersion "marquee", background, full
// width and md / md spacing are all carried over untouched, and it appears
// exactly once. Every other section keeps its position, copy and spacing.
//
// Positions are resolved from section ids, never fixed indexes.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'e6595d2c'
const PROBLEM_ID = '9d8fe777'
const APPLICATIONS_ID = '2a6b5ed9'

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

// Move the marquee so it follows the section with `afterId`; append when absent.
const moveSectionAfter = (app, afterId) => {
	const record = findSensePage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'logosMarquee') return

	const next = sections.filter((entry) => entry && entry.id !== SECTION_ID)
	const anchor = next.findIndex((entry) => entry && entry.id === afterId)
	next.splice(anchor === -1 ? next.length : anchor + 1, 0, section)

	record.set('sections', next)
	app.save(record)
}

migrate(
	(app) => {
		moveSectionAfter(app, APPLICATIONS_ID)
	},
	(app) => {
		moveSectionAfter(app, PROBLEM_ID)
	}
)

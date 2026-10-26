// Platform › LCM Chips (/lcm-chips), approved content package rev. 2026-10-07,
// page 07. Focused layout pass, after review of the corrected sections.
// No copy changes: this migration sets presentation flags and moves two
// captions. Every string it writes is byte-identical to the package.
//
// 1. CAPABILITIES (2a6e54bc) — `columns: "5"` puts the five software-defined
//    capabilities in one row on wide screens, as the package prints them,
//    instead of the 3 + 2 the default three-up grid produced. The column count
//    steps 1 → 2 → 3 → 5, so no breakpoint leaves a one-card orphan row.
//
//    `casing: "exact"` stops the site-wide AP-style headline pass rewriting
//    the card titles. The record already holds the package's own wording
//    ("Software-defined range"); only the renderer was publishing
//    "Software-Defined Range". The titles themselves are not touched.
//
//    The same flag goes on the numbered steps (9f08c3d6), whose labels carry
//    the same sentence case in the package ("LCM beam steering", "ToF sensor
//    and receive lens") and were being published title-cased for the same
//    reason.
//
// 2. THREE DESIGN CHOICES, DECOUPLED (84f1b7e2) — the LCM-based lidar column
//    takes `emphasis: "true"`: a Laser Blue wash at 6% and medium-weight
//    values, both staging tokens. The section argues for that column and read
//    as two equal lists without it.
//
// 3. HOW LCM FITS (9f08c3d6) — the two captions swap places. The package puts
//    "The field of view is illuminated in discrete regions of interest (ROIs)."
//    with the numbered steps, directly under step 4, and the scan-timeline
//    caption after it. They stay two separate elements, not one paragraph.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'lcm-chips'

const STEPS_ID = '9f08c3d6'
const CAPABILITIES_ID = '2a6e54bc'
const DECOUPLED_ID = '84f1b7e2'

const LCM_COLUMN_TITLE = 'LCM-based lidar'

const STEPS_CAPTION = 'The field of view is illuminated in discrete regions of interest (ROIs).'
const TIMELINE_CAPTION =
	'Every scan is a sequence you program: which angle, for how long, how wide, and in what order.'

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

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return null
	}
}

const apply = (app, { columns, casing, emphasis, note, outro }) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const steps = sections.find((entry) => entry && entry.id === STEPS_ID)
	const capabilities = sections.find((entry) => entry && entry.id === CAPABILITIES_ID)
	const decoupled = sections.find((entry) => entry && entry.id === DECOUPLED_ID)
	if (!steps || !capabilities || !decoupled) return

	if (columns) capabilities.columns = columns
	else delete capabilities.columns

	if (casing) {
		capabilities.casing = casing
		steps.casing = casing
	} else {
		delete capabilities.casing
		delete steps.casing
	}

	if (Array.isArray(decoupled.cards)) {
		for (const card of decoupled.cards) {
			if (!card || card.title !== LCM_COLUMN_TITLE) continue
			if (emphasis) card.emphasis = emphasis
			else delete card.emphasis
		}
	}

	steps.note = note
	steps.outro = outro

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, {
			columns: '5',
			casing: 'exact',
			emphasis: 'true',
			note: STEPS_CAPTION,
			outro: TIMELINE_CAPTION
		})
	},
	(app) => {
		apply(app, {
			columns: null,
			casing: null,
			emphasis: null,
			note: TIMELINE_CAPTION,
			outro: STEPS_CAPTION
		})
	}
)

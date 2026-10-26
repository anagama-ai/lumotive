// Platform page (/platform), approved content package rev. 2026-10-07, page 06.
// CHANGE · MANUFACTURING LINE — follow-up to 1787707400_platform_page6.js.
//
// That migration put the approved two sentences into the section's two cards.
// The section still carried an `intro` from the pre-package site:
//
//   "At the core of Lumotive is the LCM™ platform, a breakthrough in
//    programmable photonics that enables electronic control of light with
//    speed, precision, and reliability."
//
// Page 06 prints only the heading and the approved body under it, so that
// sentence is copy the package does not carry and it reads as a second,
// competing lead paragraph. It is removed, leaving the section as
// heading + approved body.
//
// Nothing else changes: the heading, both card titles, both approved
// sentences, the accents, the beam-steering video and the peel-swap
// choreography are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'ace8d391'

const PREV_INTRO =
	'At the core of Lumotive is the LCM\u2122 platform, a breakthrough in programmable photonics that enables electronic control of light with speed, precision, and reliability.'

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

const apply = (app, intro) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsPeelSwap') return

	if (intro) section.intro = intro
	else delete section.intro

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, null)
	},
	(app) => {
		apply(app, PREV_INTRO)
	}
)

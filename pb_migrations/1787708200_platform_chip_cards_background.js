// Platform page (/platform), approved content package rev. 2026-10-07, page 06.
// NEW · CHIP CARDS — follow-up to 1787707400_platform_page6.js.
//
// That migration gave the "Two chips, one platform" section (cardsTextCards,
// id "c0a71d35") a "subtle" background. `subtle` resolves to
// --color-surface (#ffffff), which is the same colour the cards themselves
// use, so the two LM10 and LS20 panels rendered edgeless on a white field.
//
// `none` is the page background (--color-background, #f3f4f7), against which
// the white cards read as cards. This is the same correction already applied
// to the home "Latest From Lumotive" teasers for the same reason.
//
// Copy, card order, the shared "Explore LCM chips" action, accents and
// spacing are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'c0a71d35'

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

const apply = (app, background) => {
	const record = findPlatformPage(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsTextCards') return

	section.background = background

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'none')
	},
	(app) => {
		apply(app, 'subtle')
	}
)

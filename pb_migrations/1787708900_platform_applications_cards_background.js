// Platform page (/platform), approved content package rev. 2026-10-07, page 06.
// "Where software-defined light goes to work" (cardsMediaCards, id
// "d38e36da"): drop the white section field.
//
// The section still carried the seeded "subtle" background. `subtle` resolves
// to --color-surface (#ffffff), the same colour the media cards use, so the
// two Sense and Connect cards rendered edgeless: only their images marked
// where a card began, and the heading and description below each image sat on
// an unbroken white field.
//
// `none` is the page background (--color-background, #f3f4f7), against which
// the white cards read as cards. This is the same correction already applied
// to the "Two chips, one platform" section directly above it
// (1787708200_platform_chip_cards_background.js) and to the home "Latest From
// Lumotive" teasers, for the same reason.
//
// Copy, cards, media, accents, the shared "See all applications" action, the
// compact density and spacing are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'd38e36da'

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
	if (!section || section.type !== 'cardsMediaCards') return

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

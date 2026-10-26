// Platform › LCM Chips (/lcm-chips), approved content package rev. 2026-10-07,
// page 07. Clear the hero photo.
//
// 1787709200_lcm_chips_layout_corrections.js put
// /lumotive/img/lm10-metasurface-module.webp in the hero's photo column so the
// approved split layout would not ship half empty. That image is a real
// Lumotive product photograph, but it is NOT the asset the package specifies:
// page 07's hero shows a chip held in a hand, which has never been supplied to
// this repository (not in static/lumotive/img, and the media collection is
// empty). It was therefore an unapproved substitute standing in a slot that
// belongs to approved artwork.
//
// The package's rule for an unsupplied item is explicit: "Do not publish this
// item until Lumotive supplies it. Leave it out rather than publish a
// placeholder." A substitute nobody approved is exactly what that rule
// forbids, so the slot is cleared rather than filled.
//
// HeroSplit drops the photo column when `media` is empty and gives the copy the
// full width, so the hero reads as a deliberate copy-led band instead of a
// layout with a hole in it. Nothing else changes: the eyebrow, heading, body
// and both actions are untouched, and the section stays `heroSplit`.
//
// When the approved photograph arrives, set `media` on this section and the
// two-column layout returns with no further change. The down path restores the
// substitute exactly as 1787709200 left it, so that migration stays reversible.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'lcm-chips'
const HERO_ID = 'b7c41d08'

const SUBSTITUTE = { kind: 'url', value: '/lumotive/img/lm10-metasurface-module.webp' }

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

const apply = (app, media) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const hero = sections.find((entry) => entry && entry.id === HERO_ID)
	if (!hero || hero.type !== 'heroSplit') return

	if (media) hero.media = JSON.parse(JSON.stringify(media))
	else delete hero.media

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, null)
	},
	(app) => {
		apply(app, SUBSTITUTE)
	}
)

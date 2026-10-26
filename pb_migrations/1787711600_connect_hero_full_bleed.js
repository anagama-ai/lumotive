// Connect › Optical Circuit Switching (/connect), page 16 hero. Visual review.
//
// 1787711400 built the hero as `heroSplit`, which puts the photograph in its
// own panel beside the copy. The approved page prints the image across the
// hero, so the section returns to `heroBand`: the same full-bleed treatment the
// page carried before the rebuild and the one every other hero on the site
// uses. The band paints the photograph edge to edge, lays the 75° dark gradient
// over it and keeps the copy on the left, which is what the text needs to stay
// legible across the image.
//
// Nothing else changes. The eyebrow, heading, subline and both actions are the
// approved page-16 copy and destinations, untouched, and the image is the same
// hero-connect.jpg the split hero used. Band heroes take their own height, so
// the section's spacing stays at "none" on both sides, as it already was.
//
// Data only: no component change, and no other section or page is read or
// written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'connect'
const HERO_ID = 'ffa907ea'

const AFTER = { type: 'heroBand', designVersion: 'band' }
const BEFORE = { type: 'heroSplit', designVersion: 'split' }

const apply = (app, state) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return
	}
	if (!record) return

	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	if (!Array.isArray(sections)) return

	const hero = sections.find((entry) => entry && entry.id === HERO_ID)
	if (!hero) return

	hero.type = state.type
	hero.designVersion = state.designVersion

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, AFTER)
	},
	(app) => {
		apply(app, BEFORE)
	}
)

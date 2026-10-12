// Platform › Applications (/applications), approved content package
// rev. 2026-10-07, page 08. Tighten the eight application cards after visual
// review.
//
// The eight areas ship without photographs, because five of the package's
// eight images have not been supplied. The default media-card rhythm assumes a
// photograph above the text, so without one the copy floated in a tall box:
// 32px padding, a 40px gap between a title and its description (the heading's
// inherited 24px bottom margin stacked on the `mt-4` utility), and up to 136px
// of dead space trailing under the shortest card in a row.
//
// `density: "tight"` is a new value on cardsMediaCards. It zeroes the heading's
// inherited bottom margin so a title sits 16px above its description, brings
// the card padding in from 2rem to 1.5rem, and pins the card action to the
// foot of the card so a row's slack is absorbed between the copy and the
// action instead of trailing below it. Cards still equalise per row and the
// four-column responsive grid is unchanged.
//
// Nothing else moves: the approved hero and closing CTA are untouched, as are
// the approved card copy, the typography, the card surface and radius, and the
// links. The status labels stay omitted pending Q19 and no image is invented.
//
// Scope is this section only. `tight` is opt-in per section, so the
// media-card grids on /platform (which uses `compact`) and /dev-kits (which
// sets no density) are unaffected.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'applications'
const AREAS_ID = '91a455fe'

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

const apply = (app, density) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const areas = sections.find((entry) => entry && entry.id === AREAS_ID)
	if (!areas || areas.type !== 'cardsMediaCards') return

	if (density) areas.density = density
	else delete areas.density

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'tight')
	},
	(app) => {
		apply(app, null)
	}
)

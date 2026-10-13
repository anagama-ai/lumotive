// Company › About (/about), page 17. Investor panel polish.
//
// The nine investor marks each shipped inside a canvas that was mostly empty:
// content filled between 7% and 33% of the file, so the CSS size caps were
// sizing padding rather than the logo. The PNGs are cropped to their own
// content in the same commit — a lossless crop, no scaling and no stretching —
// which roughly doubles every mark on screen without loosening those caps.
//
// This section then opts into `layout: "centered"`, which wraps the marks in a
// centred row rather than the five-column grid. Nine logos in a five-column
// grid leave a hole at the end of the second row; a centred wrap balances five
// over four instead, and the tighter row rhythm takes the empty band out of the
// dark panel. The field is unset everywhere else, so the two logo strips on
// /partners keep exactly the grid they have.
//
// No copy, no logo entries and no other section change. The investor list is
// the staging list, unchanged: no Hokuyo and nothing unverified added.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'about'
const INVESTORS_ID = 'aadb4f18'

const apply = (app, layout) => {
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

	const investors = sections.find((entry) => entry && entry.id === INVESTORS_ID)
	if (!investors) return

	if (layout) investors.layout = layout
	else delete investors.layout

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, 'centered')
	},
	(app) => {
		apply(app, null)
	}
)

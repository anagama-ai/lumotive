// Company › Partners (/partners), page 19. Logo row balance.
//
// Technology Partners carries seven marks, which the centred wrap set as six
// and a stray on its own line. All three partner strips now set
// `columns: "4"`, so the cell is a quarter of the row:
//
//   Module and Solution Providers  three marks, one centred row
//   Technology Partners            seven marks, four and three
//   Distribution Partners          four marks, one row
//
// When the onsemi logo arrives, Technology Partners becomes eight marks in two
// even rows of four with no further change. The approved order within each
// strip is untouched.
//
// Distribution Partners also takes the centred layout, which it had not had:
// it was the one strip still on the old grid, with a 3.5rem logo cap against
// the 4rem the other two use, so its marks sat visibly smaller. Its content,
// order and descriptor are unchanged — only the row geometry and the size cap,
// which brings the three strips to one rhythm.
//
// No copy, no logo entries, no new assets. The hero and the closing CTA are
// untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'partners'

const PROVIDERS_ID = 'c5fe1eab'
const TECHNOLOGY_ID = '3138ddf9'
const DISTRIBUTION_ID = '7c333883'

const AFTER = { columns: '4', distributionLayout: 'centered' }
const BEFORE = { columns: null, distributionLayout: null }

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

	const byId = (id) => sections.find((entry) => entry && entry.id === id)

	for (const id of [PROVIDERS_ID, TECHNOLOGY_ID, DISTRIBUTION_ID]) {
		const strip = byId(id)
		if (!strip) return
		if (state.columns) strip.columns = state.columns
		else delete strip.columns
	}

	const distribution = byId(DISTRIBUTION_ID)
	if (state.distributionLayout) distribution.layout = state.distributionLayout
	else delete distribution.layout

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

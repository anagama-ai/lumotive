// Contact (/contact), page 21. Office grid balance.
//
// The four offices sat in the default three-up grid, so Redmond, Milpitas and
// Burnaby filled the first row and Muscat sat alone on a second, with two empty
// cells beside it. The section takes `columns: "4"`, which sets all four on one
// even row from the large breakpoint up and keeps the existing 1 and 2 column
// steps below it.
//
// Four across rather than two by two: each card holds an eyebrow, a city and a
// single-line address, which a half-width card leaves mostly empty, and the
// four-up row is the rhythm pages 12 to 16 already use for short cards.
// Package page 21 marks this section KEEP AS IS and draws its office list as
// one grey box, so it prescribes no column count either way; this changes only
// the wrap, never the content.
//
// No copy, no addresses, no order, no anchor change. Webvizio #137 stays open
// and every address stays exactly as published.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'contact'
const OFFICES_ID = 'fbfa54dc'

const apply = (app, columns) => {
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

	const offices = sections.find((entry) => entry && entry.id === OFFICES_ID)
	if (!offices) return

	if (columns) offices.columns = columns
	else delete offices.columns

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, '4')
	},
	(app) => {
		apply(app, null)
	}
)

// Connect › Optical Circuit Switching (/connect), page 16. Spacing polish after
// visual review. Data only: no component, copy, image or action changes.
//
// 1. The video block closed on "md" and "Send Light, Not Signals." opened on
//    "md", so 160px separated the two, the widest gap on the page and more than
//    a short benefit row needs under the block that sets it up. The video block
//    now closes on "sm", bringing the gap to 120px.
//
// 2. "Today's Optical Switches Are Mechanical." sat in 80px of padding above
//    and below. Its content is a two-line heading, one introduction, a compact
//    four-row list capped at 48rem and a single closing line, so on a 1280px
//    column that padding left the block floating. Both sides take "sm", for
//    40px, which puts it at 120px from the section above and the same from the
//    one below. The approved left alignment, the four items and the list's own
//    measure are untouched.
//
// The three boundaries around these two sections now share one 120px rhythm.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'connect'

const VIDEO_ID = 'd8c4ff1d'
const MEMS_ID = '4c81e9a7'

const AFTER = { videoBottom: 'sm', memsTop: 'sm', memsBottom: 'sm' }
const BEFORE = { videoBottom: 'md', memsTop: 'md', memsBottom: 'md' }

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

	const video = sections.find((entry) => entry && entry.id === VIDEO_ID)
	const mems = sections.find((entry) => entry && entry.id === MEMS_ID)
	if (!video || !mems) return

	video.spacingBottom = state.videoBottom
	mems.spacingTop = state.memsTop
	mems.spacingBottom = state.memsBottom

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

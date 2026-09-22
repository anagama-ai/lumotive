// Connect page "How it works" (splitPeelBleed, id "835c0cd5"). The bleed
// image (connect-fabric-bleed.png) has its subject — the port chassis and
// fiber bundle — on the left and empty copy space on the right, but the copy
// column sat on the left under the 96% shade, hiding the chassis and leaving a
// blank dark wall. mediaPosition "right" moves the copy to the empty side and
// flips the shade so the chassis shows. Width moves to "contained" so the copy
// sits inside the shared shell while the image still bleeds.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '835c0cd5'

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

const apply = (app, values) => {
	let record = null
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'connect' })
	} catch {
		return
	}
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section) return

	Object.assign(section, values)
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, { width: 'contained', mediaPosition: 'right' })
	},
	(app) => {
		apply(app, { width: 'full', mediaPosition: 'left' })
	}
)

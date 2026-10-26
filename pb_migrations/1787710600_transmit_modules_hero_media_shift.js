// Sense › Dev Kits › Transmit Modules (/dev-kits/transmit-modules), page 13.
// Hero composition refinement after visual review.
//
// tx10-hero.jpg is a product shot centred in its own frame on a white
// backdrop. The hero scales it to the full width of the band, so the module
// landed just left of centre and ran under the headline, which left the copy
// and the subject fighting for the same part of the composition.
//
// The hero's media layer now carries `mediaShift: "22%"`, which translates the
// photograph to the right on desktop only. The module clears the headline and
// the body measure and sits in the right third of the band, with its right
// edge still well inside the frame.
//
// Nothing else about the hero changes. The image is neither rescaled nor
// recropped, the copy, the eyebrow and the datasheet action are untouched, and
// the band keeps its height: `heroBand` is a fixed clamp on the shell, and the
// shift moves the layer inside it.
//
// Below 1024px the rule does not apply, so the tablet and mobile composition
// is exactly as it shipped. The field is unset on every other hero, so no
// other page is read or written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'dev-kits/transmit-modules'
const HERO_ID = 'b41d7c05'
const SHIFT = '22%'

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

const apply = (app, shift) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return
	}
	if (!record) return

	const sections = readSections(record)
	const hero = sections.find((entry) => entry && entry.id === HERO_ID)
	if (!hero || hero.type !== 'heroBand') return

	if (shift) hero.mediaShift = shift
	else delete hero.mediaShift

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, SHIFT)
	},
	(app) => {
		apply(app, null)
	}
)

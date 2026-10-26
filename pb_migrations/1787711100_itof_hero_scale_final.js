// Sense › Dev Kits › iToF Dev Kits (/dev-kits/itof), page 14 hero. Final
// framing value.
//
// The hero media layer has been through two passes: 1787710900 set a 20% shift
// at 1.16 scale, and 1787711000 dropped the scale to 1.02. The approved final
// value is 1.04, so this nudges the scale up by two hundredths from where the
// previous migration left it.
//
// The shift stays at 20% and needs no adjustment: at 1.04 the image runs from
// 259px to 1757px across a 1440px band, so the camera barrel still sits on the
// right of the band, the photograph's empty white right margin is still
// outside the frame, and the strip uncovered on the left sits under the
// gradient's 96% stop against the layer's own white fill, so no seam appears.
//
// Hero height, typography, copy and action are untouched, the rule is still
// desktop only, and no other section or page is read or written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'dev-kits/itof'
const HERO_ID = '5a1c9f20'

const AFTER = '1.04'
const BEFORE = '1.02'

const apply = (app, scale) => {
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
	if (!hero || hero.type !== 'heroBand') return

	hero.mediaScale = scale
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

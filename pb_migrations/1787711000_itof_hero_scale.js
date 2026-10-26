// Sense › Dev Kits › iToF Dev Kits (/dev-kits/itof), page 14 hero. Second
// visual review of the framing.
//
// 1787710900_itof_review_pass.js set the hero media layer to a 20% shift at
// 1.16 scale, which cleared the photograph's empty white margin out of the
// band but enlarged the module more than the composition needed. The scale
// drops roughly 12%, from 1.16 to 1.02.
//
// The shift is unchanged, so the camera barrel stays on the right of the band
// and the headline keeps the darkest part of the gradient. At 1.02 and a 20%
// shift the image runs from 274px to 1742px across a 1440px band: the white
// margin at the photograph's right edge is still outside the frame, and the
// strip uncovered on the left sits under the gradient's 96% stop against the
// layer's own white fill, so no seam appears.
//
// Hero copy, action and band height are untouched, and the rule is still
// desktop only. The photograph stays in place until the approved three-kit
// family shot arrives.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'dev-kits/itof'
const HERO_ID = '5a1c9f20'

const AFTER = '1.02'
const BEFORE = '1.16'

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

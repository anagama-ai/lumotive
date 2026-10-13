// Sense › Dev Kits › iToF Dev Kits (/dev-kits/itof), page 14. Visual review
// pass. Four changes, all scoped to this page.
//
// 1. HERO FRAMING. m30-dev-hero.jpg is a wide product shot with an empty white
//    margin down its right side. The band is wider than the photograph's
//    aspect ratio, so the image is width-fitted and that margin sat under the
//    pale end of the hero gradient as a light blue block, the largest single
//    area of the composition and the emptiest. The media layer now carries
//    `mediaShift: "20%"` and `mediaScale: "1.16"`, which together carry the
//    module to the right of the band and push the empty margin outside it. The
//    headline keeps the darkest part of the gradient, so it reads as before.
//    Desktop only; below 1024px the rule does not apply. The photograph itself
//    is untouched and stays in place until the approved three-kit family shot
//    arrives.
//
// 2. ON140 SPEC TILES, THREE AND THREE. Six tiles took the count-derived
//    six-across row, which squeezed "140° × 105°" and "Windows PC" onto two
//    lines each while LI140 and M30 set their eight comfortably four across.
//    The section now pins `columns: "3"`, giving two even rows of three. LI140
//    and M30 are untouched and keep their four-across rows.
//
// 3. VERTICAL SPACING. "Better Data, Safer Robots" closed and opened on "md",
//    which put 160px above it and 192px below it, more than the sections
//    around it carry; it now takes "sm" on both sides, for 120px and 152px.
//    Each kit opener closed on "sm" above its spec tiles, which are part of the
//    same block rather than a new one, so an 80px gap read as a section break;
//    the openers now close on "none", for 40px. All three kit openers take the
//    same value, so the three kit blocks keep one rhythm.
//
// 4. TERMINOLOGY. "beam steering" becomes "beamforming" on this page, per
//    Claudia's updated instruction. Two strings carry it, the hero body and
//    the LI140 subline, and the hero body is also the page's meta description,
//    so that is updated with them. Standalone "steer" and "steering" are
//    preserved: the M30 field-of-view tile keeps its "90° steering" qualifier,
//    which describes the steering range rather than naming the technology.
//
//    SITE-WIDE AUDIT STILL OWED. "beam steering" appears on other pages, which
//    this migration deliberately does not touch; the rename needs its own pass
//    once the instruction is confirmed for the whole site.
//
// Nothing else changes: every approved heading, specification, CTA, link and
// anchor is exactly as page 14 shipped, and no other page is read or written.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'dev-kits/itof'

const HERO_ID = '5a1c9f20'
const FEATURE_ID = 'd4e09a21'
const ON140_SPECS_ID = '8c47a0f3'
const OPENER_IDS = ['f27b6c40', '2b6e85d1', '6e81d47c']

const HERO_BODY_AFTER =
	'<p>LCM beamforming extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.</p>'
const HERO_BODY_BEFORE =
	'<p>LCM beam steering extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.</p>'

const LI140_BODY_AFTER =
	'<p>140° × 105° iToF depth with LCM beamforming and a global-shutter color camera, in one sensor head.</p>'
const LI140_BODY_BEFORE =
	'<p>140° × 105° iToF depth with LCM beam steering and a global-shutter color camera, in one sensor head.</p>'

const SEO_AFTER =
	'LCM beamforming extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.'
const SEO_BEFORE =
	'LCM beam steering extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.'

const AFTER = {
	heroShift: '20%',
	heroScale: '1.16',
	heroBody: HERO_BODY_AFTER,
	li140Body: LI140_BODY_AFTER,
	seo: SEO_AFTER,
	on140Columns: '3',
	featureSpacing: 'sm',
	openerSpacingBottom: 'none'
}

const BEFORE = {
	heroShift: null,
	heroScale: null,
	heroBody: HERO_BODY_BEFORE,
	li140Body: LI140_BODY_BEFORE,
	seo: SEO_BEFORE,
	on140Columns: null,
	featureSpacing: 'md',
	openerSpacingBottom: 'sm'
}

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

	const hero = byId(HERO_ID)
	if (!hero) return
	hero.body = state.heroBody
	if (state.heroShift) hero.mediaShift = state.heroShift
	else delete hero.mediaShift
	if (state.heroScale) hero.mediaScale = state.heroScale
	else delete hero.mediaScale

	const feature = byId(FEATURE_ID)
	if (!feature) return
	feature.spacingTop = state.featureSpacing
	feature.spacingBottom = state.featureSpacing

	const on140 = byId(ON140_SPECS_ID)
	if (!on140) return
	if (state.on140Columns) on140.columns = state.on140Columns
	else delete on140.columns

	for (const id of OPENER_IDS) {
		const opener = byId(id)
		if (!opener) return
		opener.spacingBottom = state.openerSpacingBottom
	}

	const li140 = byId(OPENER_IDS[0])
	li140.body = state.li140Body

	record.set('sections', sections)
	record.set('seoDescription', state.seo)
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

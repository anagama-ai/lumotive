// Home page, approved content package rev. 2026-10-07, page 05 of 21.
//
// Two fixes on / , both copy-only:
//
// 1. FIX · HERO CLAIM — heroFullHeight (id "460c4c1f"). The hero paragraph
//    carried "no mirrors, no lenses", which the package removes site-wide in
//    favour of "no moving parts". The approved sentence also drops "silicon"
//    for "a semiconductor" and adds "electronically". The hero video, eyebrow,
//    heading and both links are untouched, as the dev note requires.
//
// 2. FIX · BROKEN LINK — ctaSplitLinks (id "c5839355"). The secondary link
//    pointed at /products, which has no page record and returns 404; the
//    approved link is "Browse dev kits" → /dev-kits. The primary link label
//    becomes "Talk to our team" (the package forbids a generic "Contact us"
//    CTA) and the body loses its two contractions, which the package also
//    forbids. The href stays /contact, and spacing, heading, heading size,
//    layout and backdrop are untouched.
//
// The headings are not edited: `titleCase` already renders the stored
// "Programmable optics" and "Build with programmable optics." as the approved
// "Programmable Optics" and "Build With Programmable Optics." The trailing "→"
// on "Browse dev kits" is drawn by CtaDefault.svelte, so it is not part of the
// stored label.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const HERO_ID = '460c4c1f'
const CTA_ID = 'c5839355'

const HERO_BODY_NEXT =
	'<p>LCM™ chips steer and shape laser light electronically, on the surface of a semiconductor, with no moving parts.</p>'
const HERO_BODY_PREV =
	'<p>LCM™ chips shape and steer laser light on the surface of silicon — no mirrors, no lenses, no moving parts.</p>'

const CTA_BODY_NEXT =
	'<p>Whether you are building the next lidar sensor, scaling an AI data center fabric, or steering light across the sky, let us talk about what one chip can do for you.</p>'
const CTA_BODY_PREV =
	'<p>Whether you\u2019re building the next lidar sensor, scaling an AI data center fabric, or steering light across the sky \u2014 let\u2019s talk about what one chip can do for you.</p>'

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

const findHomePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return null
	}
}

const apply = (app, state) => {
	const record = findHomePage(app)
	if (!record) return

	const sections = readSections(record)

	const hero = sections.find((entry) => entry && entry.id === HERO_ID)
	if (hero && hero.type === 'heroFullHeight') {
		hero.body = state.heroBody
	}

	const cta = sections.find((entry) => entry && entry.id === CTA_ID)
	if (cta && cta.type === 'ctaSplitLinks') {
		cta.body = state.ctaBody

		cta.primaryLinkLabel = state.primaryLabel
		if (cta.primaryLink && typeof cta.primaryLink === 'object') {
			cta.primaryLink.label = state.primaryLabel
		}

		cta.secondaryLinks = [
			{ label: state.secondaryLabel, newTab: false, url: state.secondaryUrl }
		]
	}

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, {
			heroBody: HERO_BODY_NEXT,
			ctaBody: CTA_BODY_NEXT,
			primaryLabel: 'Talk to our team',
			secondaryLabel: 'Browse dev kits',
			secondaryUrl: '/dev-kits'
		})
	},
	(app) => {
		apply(app, {
			heroBody: HERO_BODY_PREV,
			ctaBody: CTA_BODY_PREV,
			primaryLabel: 'Contact Us',
			secondaryLabel: 'Browse products',
			secondaryUrl: '/products'
		})
	}
)

// v3 page 15 (/dev-kits/dtof). The v2->v3 text of page 15 is unchanged, and
// the pending-input box still holds the NM120 POWER and INTERFACE tiles and
// "Modular by Design", so no copy changes here. Simon's annotations:
//
// 1. A1, hero banner "NM120 (not MD42, #161)": IMG_0031 (NM120 with heatsink,
//    transparent cut-out, not in the repo) composed on white as
//    hero-nm120-heatsink.webp, 2880 x 1200, the device at 67% of the height
//    with its centre at 81.5% of the width. `mediaAnchor: "100%"` keeps the
//    right edge in frame, so the whole device sits right of the copy from
//    1024px up and whole behind it at 768px. Phones (<768px) reframe it as a
//    backdrop: `mobileMediaScale: "1.8"` and `mobileMediaPosition: "94%"`
//    fill the band with the device so no white backdrop shows as a band.
// 2. A2, "Photo: NM120 enclosed unit": IMG_0032, already live as
//    nm120-sensor.jpg (white-backed) and in the repo as the transparent
//    nm120-module.png (identical). The approved M30 treatment applies:
//    nm120-sensor.webp (the transparent original, same 963 x 1017 canvas)
//    with `mediaFrame: "panel"`, so phones lose the white square and
//    desktop keeps its white panel.
// 3. A3, "Check with Elyar for new HDR demo": a question, not an asset.
//    The HDR block stays copy-only.
//
// The JPGs stay for the down path. Guarded on the prior values; reverses
// exactly.
const HERO_ID = 'a7c0d613'
const NM120_ID = 'd903b4f2'
const HERO_OLD = '/lumotive/img/nm120-hero.jpg'
const HERO_NEW = '/lumotive/img/hero-nm120-heatsink.webp'
const HERO_FIELDS = { mediaAnchor: '100%', mobileMediaScale: '1.8', mobileMediaPosition: '94%' }
const NM120_OLD = '/lumotive/img/nm120-sensor.jpg'
const NM120_NEW = '/lumotive/img/nm120-sensor.webp'

const swap = (section, from, to, fields, forward) => {
	if (!section || !section.media || section.media.kind !== 'url') return false
	if (forward) {
		if (section.media.value !== from) return false
		if (Object.keys(fields).some((key) => section[key] != null)) return false
		section.media.value = to
		Object.assign(section, fields)
	} else {
		if (section.media.value !== to) return false
		if (Object.entries(fields).some(([key, value]) => section[key] !== value)) return false
		section.media.value = from
		for (const key of Object.keys(fields)) delete section[key]
	}
	return true
}

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: 'dev-kits/dtof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const find = (id) => sections.find((s) => s && s.id === id)
	const heroChanged = swap(find(HERO_ID), HERO_OLD, HERO_NEW, HERO_FIELDS, forward)
	const nm120Changed = swap(find(NM120_ID), NM120_OLD, NM120_NEW, { mediaFrame: 'panel' }, forward)
	if (!heroChanged && !nm120Changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

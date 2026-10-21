// v3 page 19 (/partners). The v2->v3 text diff is empty; every live string
// already matches v3. Simon's one annotation, A1 at the hero slot ("KEEP AS
// IS · Existing: hero-partners.jpg"), links Partners-Hero-scaled.jpg, which
// lumotive.com/partners serves as its hero today (Elementor post-3504). The
// local hero-partners.jpg is a different light-burst image, so Simon's photo
// (LCM module with circuit art) becomes the hero as hero-partners-lcm.webp
// (2400 x 1590) on e95fe8b0. The phone focal point set for the old image
// (`mobileMediaPosition: 100%`, the light burst) is dropped: centred, the
// module stays in frame on phones. Guarded on the prior values; reverses
// exactly.
const ABSENT = undefined
const HERO_ID = 'e95fe8b0'
const CHANGES = [
	['media', '/lumotive/img/hero-partners.jpg', '/lumotive/img/hero-partners-lcm.webp'],
	['mobileMediaPosition', '100%', ABSENT]
]

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'partners' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const hero = sections.find((s) => s && s.id === HERO_ID)
	if (!hero || !hero.media || hero.media.kind !== 'url') return
	const [mediaFrom, mediaTo] = forward ? [CHANGES[0][1], CHANGES[0][2]] : [CHANGES[0][2], CHANGES[0][1]]
	if (hero.media.value !== mediaFrom) return
	hero.media.value = mediaTo
	const [, before, after] = CHANGES[1]
	const [from, to] = forward ? [before, after] : [after, before]
	if (hero.mobileMediaPosition === from) {
		if (to === ABSENT) delete hero.mobileMediaPosition
		else hero.mobileMediaPosition = to
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

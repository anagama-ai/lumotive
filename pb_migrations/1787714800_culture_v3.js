// v3 page 18 (/culture). The v2->v3 text diff is empty; every live string
// already matches v3. Simon's annotations:
// 1. A1 at the hero slot ("KEEP AS IS · Existing: hero-culture.jpg") links
//    IMG_4516-1-copy-scaled.jpg (team around an LCM camera on a tripod).
//    The local hero-culture.jpg is a dark stand-in, not a Lumotive photo, so
//    Simon's file is the hero: re-encoded as hero-culture-team.webp
//    (2400 x 1600) and set on 6c524b47. The photograph is bright: with the
//    standard framing the body line measured 3.21:1 at 390 and 3.96:1 at
//    768 (brightest pixel). The existing hero options fix it: `mediaAnchor
//    0%` keeps the photo's left edge where the band crops it on tablets,
//    which moves the light-blue shirt out from under the body line (min
//    4.55:1 from 768 to 1000; 100% left 834px at 4.42); phones keep the
//    right edge instead (`mobileMediaPosition 100%`, the better of the two
//    there) under the phone-only `mobileShade: strong`. From 1024px the
//    band is wider than the 3:2 photo, so the anchor changes nothing there.
// 2. A2 "The Lumotive Way" video: YouTube AcLAbtIxN64, already embedded on
//    979b8fc6. Unchanged.
// Guarded on the prior values; reverses exactly.
const FRAMING = { mediaAnchor: '0%', mobileMediaPosition: '100%', mobileShade: 'strong' }
const HERO_ID = '6c524b47'
const HERO_OLD = '/lumotive/img/hero-culture.jpg'
const HERO_NEW = '/lumotive/img/hero-culture-team.webp'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'culture' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const hero = sections.find((s) => s && s.id === HERO_ID)
	if (!hero || !hero.media || hero.media.kind !== 'url') return
	const [from, to] = forward ? [HERO_OLD, HERO_NEW] : [HERO_NEW, HERO_OLD]
	if (hero.media.value !== from) return
	hero.media.value = to
	for (const [key, value] of Object.entries(FRAMING)) {
		if (forward && hero[key] == null) hero[key] = value
		else if (!forward && hero[key] === value) delete hero[key]
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

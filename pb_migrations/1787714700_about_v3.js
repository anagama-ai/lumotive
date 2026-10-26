// v3 page 17 (/about). The v2->v3 text diff is empty; every live string
// already matches v3. Simon's one annotation, A1 at the hero slot ("KEEP AS
// IS · Existing: hero-about.jpg"), links IV2.26.18-196-scaled.jpg, which is
// the hero lumotive.com/about serves today (Elementor post-806 background).
// The local hero-about.jpg is a different dark-lab image, so the slot's
// "existing" hero is Simon's photograph: re-encoded as hero-about-bench.webp
// (2400 x 1600) and set on 3998f57f. The photograph is brighter than the
// old one: on phones the body line reached only 4.24:1 at 390px over the
// shirt, so the hero takes the existing phone-only `mobileShade: strong`.
// Copy, actions and layout unchanged. Guarded on the prior values;
// reverses exactly.
const HERO_ID = '3998f57f'
const HERO_OLD = '/lumotive/img/hero-about.jpg'
const HERO_NEW = '/lumotive/img/hero-about-bench.webp'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'about' }) }
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
	if (forward && hero.mobileShade == null) hero.mobileShade = 'strong'
	else if (!forward && hero.mobileShade === 'strong') delete hero.mobileShade
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

// v3 page 11 (/sense/automotive). No v2→v3 text change; the live copy matches
// the v3 page word for word. The one supplied asset is Simon's A1 hero,
// lumotive.com/wp-content/uploads/2023/05/media.jpg (1280 × 719, the original
// upload; no larger rendition exists), saved as /lumotive/img/hero-automotive.webp.
// The car sits mid-frame and ran under the headline at desktop widths, so the
// hero uses the existing desktop-only framing (≥1024px): shifted 20% right and
// scaled 1.4, which keeps the image covering the band edge to edge (no
// uncovered strip) and puts the car right of the copy. Tablet and mobile are
// untouched by those two fields.
// A2 "Automotive deck" (cocoon graphic), A3 "Stella-180 video from tradeshows?
// (talk to Calvin & Sam)" and A4 "Aramco rain testing – ask Calvin" are leads,
// not files: those three sections keep their single reading column and nothing
// is substituted. Guarded on the prior values; reverses exactly.
const HERO_ID = 'd81f4a60'
const HERO_MEDIA = '/lumotive/img/hero-automotive.webp'
const SHIFT = '20%'
const SCALE = '1.4'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'automotive' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const hero = Array.isArray(sections) && sections.find((s) => s && s.id === HERO_ID && s.type === 'heroBand')
	if (!hero) return
	if (forward && hero.media == null && hero.mediaShift == null && hero.mediaScale == null) {
		hero.media = { kind: 'url', value: HERO_MEDIA }
		hero.mediaShift = SHIFT
		hero.mediaScale = SCALE
	} else if (!forward && hero.media && hero.media.kind === 'url' && hero.media.value === HERO_MEDIA && hero.mediaShift === SHIFT && hero.mediaScale === SCALE) {
		delete hero.media
		delete hero.mediaShift
		delete hero.mediaScale
	} else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

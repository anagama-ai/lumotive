// v3 page 13 (/dev-kits/transmit-modules). The v2→v3 copy changes ("beam
// steering" → "beamforming", hero and meta) already shipped in 1787712600; the
// live copy matches v3 verbatim. Simon's A1 links IMG_5619 (TX10 held in a
// hand) at the hero, which the PDF marks "Existing: tx10-hero.jpg (replace
// static image with animation, #129)". The supplied still replaces the old
// cut-out; whether it also answers #129's animation request is open (T2).
//   - media → /lumotive/img/hero-tx10-in-hand.webp (flattened on white, 1600px)
//   - mediaShift removed: the 22% desktop shift opened a visible seam beside
//     the hand; the plain cover crop keeps the chip right of the copy.
//   - mobileShade "strong": on phones the hand sits behind the body copy,
//     which measured 4.42:1 (390) and 4.63:1 (430) at the 99th percentile on
//     the standard shade; the strong shade gives 6.00:1 and 6.01:1.
// A2 "Older decks" (the two illumination animations) is a lead, not a file.
// Guarded on the prior values; reverses exactly.
const HERO_ID = 'b41d7c05'
const OLD_MEDIA = '/lumotive/img/tx10-hero.jpg'
const NEW_MEDIA = '/lumotive/img/hero-tx10-in-hand.webp'
const OLD_SHIFT = '22%'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'transmit-modules' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	const hero = Array.isArray(sections) && sections.find((s) => s && s.id === HERO_ID && s.type === 'heroBand')
	if (!hero || !hero.media || hero.media.kind !== 'url') return
	if (forward && hero.media.value === OLD_MEDIA && hero.mediaShift === OLD_SHIFT && hero.mobileShade == null) {
		hero.media = { kind: 'url', value: NEW_MEDIA }
		delete hero.mediaShift
		hero.mobileShade = 'strong'
	} else if (!forward && hero.media.value === NEW_MEDIA && hero.mediaShift == null && hero.mobileShade === 'strong') {
		hero.media = { kind: 'url', value: OLD_MEDIA }
		hero.mediaShift = OLD_SHIFT
		delete hero.mobileShade
	} else return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

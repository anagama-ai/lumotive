// v3 page 16 (/connect). The v2->v3 text diff is empty; every live string
// already matches v3. Simon's annotations, all files already in the repo:
// 1. A1 hero "OCS ports and lasers (current lumotive.com hero)":
//    OCS-small-ports-v4-n-lasers = local home-2d-photonic-news.webp
//    (1920 x 1080, identical). Replaces hero-connect.jpg on ffa907ea.
// 2. A2 "2D beamforming visual": Lumotive_OCS = local ocs-fabric.png
//    (identical); compressed as ocs-fabric.webp and set beside the copy of
//    the stacked block 6e2a71c9 (new optional `media` on stacked CTAs).
// 3. A3 "Existing graphic: OCS reference designs": KEEP AS IS. The live
//    section already renders those two reference designs as panels; not
//    changed (outstanding C3).
// 4. A4/A5 use-case images on 93c4b0fe: Optical-Communications_2 = local
//    connect-optical.jpg -> AI data centers; Optical-Communications = local
//    applications-optical-communications.webp -> Optical communications.
//    Both centre-cropped to 16:9 so they fill the card frame.
// Guarded on the prior values; reverses exactly.
const HERO_ID = 'ffa907ea'
const HERO_OLD = '/lumotive/img/hero-connect.jpg'
const HERO_NEW = '/lumotive/img/home-2d-photonic-news.webp'
const BEAM_ID = '6e2a71c9'
const BEAM_MEDIA = '/lumotive/img/ocs-fabric.webp'
const USES_ID = '93c4b0fe'
const USE_MEDIA = {
	'AI data centers': '/lumotive/img/connect-use-ai-data-centers.webp',
	'Optical communications': '/lumotive/img/connect-use-optical-communications.webp'
}

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'connect' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const find = (id) => sections.find((s) => s && s.id === id)
	let changed = false

	const hero = find(HERO_ID)
	if (hero && hero.media && hero.media.kind === 'url') {
		const [from, to] = forward ? [HERO_OLD, HERO_NEW] : [HERO_NEW, HERO_OLD]
		if (hero.media.value === from) { hero.media.value = to; changed = true }
	}

	const beam = find(BEAM_ID)
	if (beam) {
		if (forward && beam.media == null) { beam.media = { kind: 'url', value: BEAM_MEDIA }; changed = true }
		else if (!forward && beam.media && beam.media.value === BEAM_MEDIA) { delete beam.media; changed = true }
	}

	const uses = find(USES_ID)
	if (uses && Array.isArray(uses.cards)) {
		for (const card of uses.cards) {
			const value = card && USE_MEDIA[card.title]
			if (!value) continue
			if (forward && card.media == null) { card.media = { kind: 'url', value }; changed = true }
			else if (!forward && card.media && card.media.value === value) { delete card.media; changed = true }
		}
	}

	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)

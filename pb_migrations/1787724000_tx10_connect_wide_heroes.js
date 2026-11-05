// Widened hero images: /dev-kits/transmit-modules keeps the whole TX10 in a
// short band, and /connect sits its switch in the right third. Both anchor to
// the right edge so narrower bands crop from the left.
const HEROES = [
	{ slug: 'transmit-modules', id: 'b41d7c05' },
	{ slug: 'connect', id: 'ffa907ea', from: '/lumotive/img/home-2d-photonic-news.webp', to: '/lumotive/img/connect-hero-wide.webp' }
]

const apply = (app, forward) => {
	for (const { slug, id, from, to } of HEROES) {
		const page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
		const sections = JSON.parse(page.getString('sections') || '[]')
		const hero = sections.find((s) => s.id === id)
		if (!hero) continue
		if (forward) hero.mediaAnchor = '100%'
		else delete hero.mediaAnchor
		if (from && hero.media?.value === (forward ? from : to)) hero.media.value = forward ? to : from
		page.set('sections', sections)
		app.save(page)
	}
}

migrate((app) => apply(app, true), (app) => apply(app, false))

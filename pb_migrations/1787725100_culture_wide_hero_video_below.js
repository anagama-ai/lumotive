// /culture: the widened team photo keeps the group in the right of the hero
// band (anchored right, so narrower bands crop the blurred extension), and the
// environment video runs the full content width under centred copy.
const HERO = { id: '6c524b47', from: '/lumotive/img/hero-culture-team.webp', to: '/lumotive/img/hero-culture-team-wide.webp' }
const VIDEO_SECTION = '979b8fc6'

const apply = (app, forward) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = "culture"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const hero = sections.find((s) => s.id === HERO.id)
	if (hero?.media?.value === (forward ? HERO.from : HERO.to)) {
		hero.media.value = forward ? HERO.to : HERO.from
		hero.mediaAnchor = forward ? '100%' : '0%'
	}
	const video = sections.find((s) => s.id === VIDEO_SECTION)
	if (video) {
		if (forward) Object.assign(video, { mediaLayout: 'below', textAlign: 'center' })
		else {
			delete video.mediaLayout
			delete video.textAlign
		}
	}
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => apply(app, true), (app) => apply(app, false))

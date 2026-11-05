// /platform hero: the background video's opening frame as its poster, and a
// button that plays the full video with sound in a modal.
const POSTER = '/lumotive/img/hero-platform-video-poster.webp'
const OLD_POSTER = '/lumotive/img/hero-platform.jpg'
const LABEL = 'Watch full video'

const editHero = (app, edit) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = "platform"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const hero = sections.find((s) => s.id === 'a85debcc')
	if (!hero) return
	edit(hero)
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) =>
		editHero(app, (hero) => {
			if (hero.media?.value === OLD_POSTER) hero.media.value = POSTER
			hero.videoButtonLabel ||= LABEL
		}),
	(app) =>
		editHero(app, (hero) => {
			if (hero.media?.value === POSTER) hero.media.value = OLD_POSTER
			if (hero.videoButtonLabel === LABEL) delete hero.videoButtonLabel
		})
)

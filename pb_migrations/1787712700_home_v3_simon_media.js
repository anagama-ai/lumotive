// v3 page 05: Simon's annotations identify the four application-card images
// and the 2D-photonic News card's image. Keep the approved hero video as the
// printed page directs; its Vimeo comment is a reference, not an iframe swap.
// News cards are populated from real posts, so no placeholder Leopard/kit posts.
const APPLICATIONS_ID = '677cf547'
const FEATURED_SLUG = 'lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor'
const NEWS_IMAGE = '/lumotive/img/home-2d-photonic-news.webp'
const PREVIOUS_NEWS_IMAGE = '/lumotive/news/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor.jpg'
const CARD_IMAGES = [
	{ title: '3D Sensing', before: '/lumotive/img/market-robot-dog.jpg', after: '/lumotive/img/sense-agv.jpg' },
	{ title: 'Defense', before: null, after: '/lumotive/img/home-defense.webp' },
	{ title: 'Optical Communications', before: null, after: '/lumotive/img/connect-optical.jpg' }
]
// Optical Circuit Switching already uses Simon's exact connect-optical.jpg.

const media = (path) => path ? { kind: 'url', value: path } : null
const matches = (value, path) => path === null
	? value == null
	: value && value.kind === 'url' && value.value === path

const updateApplications = (app, forward) => {
	let record
	try { record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(record.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const section = sections.find((entry) => entry && entry.id === APPLICATIONS_ID)
	if (!section || section.type !== 'cardsPeelBento' || !Array.isArray(section.cards)) return
	let changed = false
	for (const { title, before, after } of CARD_IMAGES) {
		const card = section.cards.find((entry) => entry && entry.title === title)
		if (!card) continue
		const from = forward ? before : after
		const to = forward ? after : before
		if (!matches(card.media, from)) continue
		if (to === null) delete card.media
		else card.media = media(to)
		changed = true
	}
	if (changed) {
		record.set('sections', sections)
		app.save(record)
	}
}

const updateNewsImage = (app, forward) => {
	let post
	try { post = app.findFirstRecordByFilter('posts', 'slug = {:slug}', { slug: FEATURED_SLUG }) }
	catch { return }
	let current
	try { current = JSON.parse(post.getString('coverImage') || 'null') }
	catch { return }
	const from = forward ? PREVIOUS_NEWS_IMAGE : NEWS_IMAGE
	if (!matches(current, from)) return
	post.set('coverImage', media(forward ? NEWS_IMAGE : PREVIOUS_NEWS_IMAGE))
	app.save(post)
}

migrate(
	(app) => {
		updateApplications(app, true)
		updateNewsImage(app, true)
	},
	(app) => {
		updateApplications(app, false)
		updateNewsImage(app, false)
	}
)

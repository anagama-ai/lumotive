// v3 page 08. The only visible copy change ("Beamforming for satellite...")
// already shipped in 1787712600_beamforming_terminology.js. What v3 adds is
// Simon's media: one linked photo per application card, matched to its slot by
// the sticky note's position on the page, and the existing staging AMR video
// for the left slot of "Programmable Optics in Motion", which the package's
// dev note asked to be confirmed before use. The "Your Application" card has
// no linked image and stays without one; status labels stay omitted (Q19).
const PAGE = 'applications'
const CARDS_ID = '91a455fe'
const VIDEOS_ID = 'e4c27b19'
const PHOTOS = {
	'3D sensing': '/lumotive/img/applications-3d-sensing.webp',
	'Optical circuit switching': '/lumotive/img/applications-optical-circuit-switching.webp',
	Defense: '/lumotive/img/applications-defense.webp',
	'Optical communications': '/lumotive/img/applications-optical-communications.webp',
	Medical: '/lumotive/img/applications-medical.webp',
	'AI computing': '/lumotive/img/applications-ai-computing.webp',
	'AR & holographic displays': '/lumotive/img/applications-ar-displays.webp'
}
const VIDEOS = {
	id: VIDEOS_ID,
	type: 'mediaVideoEmbed',
	mode: 'videos',
	eyebrow: 'See it in action',
	heading: 'Programmable optics in motion',
	items: [
		{
			videoUrl: 'https://vimeo.com/1174547871/6e198e52ae',
			title: 'One programmable sensor, three jobs',
			linkLabel: 'Explore Sense',
			linkUrl: '/sense'
		},
		{
			videoUrl: 'https://vimeo.com/1227505713',
			title: 'Send light, not signals',
			linkLabel: 'Explore Connect',
			linkUrl: '/connect'
		}
	],
	align: 'container',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md'
}

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	const cards = sections.find((section) => section && section.id === CARDS_ID)
	if (cards && cards.type === 'cardsMediaCards' && Array.isArray(cards.cards)) {
		for (const card of cards.cards) {
			const path = card && PHOTOS[card.title]
			if (!path) continue
			if (forward && card.media == null) {
				card.media = { kind: 'url', value: path }
				changed = true
			} else if (!forward && card.media?.kind === 'url' && card.media.value === path) {
				delete card.media
				changed = true
			}
		}
	}
	const at = sections.findIndex((section) => section && section.id === VIDEOS_ID)
	if (forward && at === -1) {
		const after = sections.findIndex((section) => section && section.id === CARDS_ID)
		if (after !== -1) {
			sections.splice(after + 1, 0, VIDEOS)
			changed = true
		}
	} else if (!forward && at !== -1) {
		sections.splice(at, 1)
		changed = true
	}
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
